import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";
export class Test {
    constructor() {
        this.titleEl = null;
        this.optionsEl = null;
        this.quiz = null;
        this.progressBar = null;
        this.prevBtnEl = null;
        this.nextBtnEl = null;
        this.skipEl = null;
        this.currentQuestionIndex = 1;
        this.userResult = [];
        this.user = Auth.getUserInfo();
        this.init();
    };
    async init() {
        if (this.user) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.user.dataId);
                if (result) {
                    if (result.error) {

                        throw new Error(result.error);
                    };
                    this.quiz = result;
                    this.startQuiz();
                };
            } catch (error) {
                console.log(error);
            };
        };
    };
    startQuiz() {
        document.querySelector('.test-pre-title').innerText = this.quiz.name;
        this.progressBar = document.querySelector('.test-progress-bar');
        this.titleEl = document.querySelector('.test-question');
        this.optionsEl = document.querySelector('.test-question-options');
        this.skipEl = document.querySelector('.test-action-skip');
        this.prevBtnEl = document.querySelector('.test-actions-prev');
        this.prevBtnEl.addEventListener('click', () => {
            this.move('prev');
        });
        this.nextBtnEl = document.querySelector('.test-actions-next');
        this.nextBtnEl.addEventListener('click', () => {
            this.move('next');
        });
        document.querySelector('.test-action-skip').addEventListener('click', () => {
            this.move('skip');
        })
        this.prepareProgressBar();
        this.showQuestion();

        const timer = document.querySelector('.test-actions-time-clock');
        let seconds = 59;
        this.interval = setInterval(function () {
            timer.innerText = seconds;
            seconds--;
            if (seconds === 0) {                
                this.complete();
            };
        }.bind(this), 1000)
    };
    prepareProgressBar() {
        for (let i = 0; i < this.quiz.questions.length; i++) {
            const progressEl = document.createElement('div');
            progressEl.className = 'progress-bar-item' + (i === 0 ? ' active' : '');

            const progressCircleEl = document.createElement('div');
            progressCircleEl.className = 'progress-bar-item-circle';

            const progressTextEl = document.createElement('div');
            progressTextEl.className = 'progress-bar-item-text';
            progressTextEl.innerText = `Вопрос ${i + 1}`;

            progressEl.appendChild(progressCircleEl);
            progressEl.appendChild(progressTextEl);
            this.progressBar.appendChild(progressEl);
        };
    };
    showQuestion() {
        const that = this;
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        const choosenOption = this.userResult.find(el => {
            return el.questionId === activeQuestion.id
        });
        this.titleEl.innerHTML = `<span>Вопрос ${this.currentQuestionIndex}:</span> ${activeQuestion.question}`;
        this.optionsEl.innerHTML = '';
        activeQuestion.answers.forEach(answer => {
            const optionEl = document.createElement('div');
            optionEl.className = 'test-question-option';

            const inputEl = document.createElement('input');
            inputEl.className = 'option-answer';
            inputEl.setAttribute('id', 'answer-' + answer.id);
            inputEl.setAttribute('type', 'radio');
            inputEl.setAttribute('name', 'answer');
            inputEl.setAttribute('value', answer.id);
            if (choosenOption && choosenOption.chosenAnswerId === answer.id) {
                inputEl.setAttribute('checked', 'checked');
                that.skipEl.classList.add('disabled');
            };
            inputEl.addEventListener('change', function () {
                that.chooseAnswer();
            });

            const labelEl = document.createElement('label');
            labelEl.setAttribute('for', 'answer-' + answer.id);
            labelEl.innerText = answer.answer;

            optionEl.appendChild(inputEl);
            optionEl.appendChild(labelEl);
            that.optionsEl.appendChild(optionEl);
        });
        if (choosenOption && choosenOption.chosenAnswerId) {
            this.nextBtnEl.removeAttribute('disabled');
        } else {
            this.nextBtnEl.setAttribute('disabled', 'disabled');
            this.skipEl.classList.remove('disabled');
        };
        if (this.currentQuestionIndex === this.quiz.questions.length) {
            this.nextBtnEl.innerText = 'Завершить';
            this.skipEl.classList.add('disabled');
        } else {
            this.nextBtnEl.innerText = 'Дальше';
        };
        if (this.currentQuestionIndex > 1) {
            this.prevBtnEl.removeAttribute('disabled');
        } else {
            this.prevBtnEl.setAttribute('disabled', 'disabled');
        };
    };
    chooseAnswer() {
        this.nextBtnEl.removeAttribute('disabled');
        this.skipEl.classList.add('disabled');
    };
    move(action) {
        const choosenAnswer = Array.from(document.querySelectorAll('.option-answer')).find(el => {
            return el.checked;
        });
        const activeQuestion = this.quiz.questions[this.currentQuestionIndex - 1];
        let choosenAnswerId = null;
        if (choosenAnswer && choosenAnswer.value) {
            choosenAnswerId = Number(choosenAnswer.value);
        };

        const existingResult = this.userResult.find(el => {
            return el.questionId === activeQuestion.id;
        });
        if (existingResult) {
            existingResult.choosenAnswerId = choosenAnswerId;
        } else {
            this.userResult.push({
                questionId: activeQuestion.id,
                chosenAnswerId: choosenAnswerId
            });
        };

        if (action === 'next' || action === 'skip') {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        };

        if (this.currentQuestionIndex > this.quiz.questions.length) {
            this.complete();
            return;
        };

        Array.from(this.progressBar.children).forEach((item, index) => {
            item.classList.remove('complete');
            item.classList.remove('active');

            if (index + 1 === this.currentQuestionIndex) {
                item.classList.add('active');
            } else if (index + 1 < this.currentQuestionIndex) {
                item.classList.add('complete');
            }
        });

        this.showQuestion();
    };
    async complete() {
        clearInterval(this.interval);
        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.user.dataId + '/pass', 'POST', {
                userId: this.user.userId,
                results: this.userResult
            });
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                };
                this.user.score = result.score;
                this.user.total = result.total;
                Auth.setUserInfo(this.user);
                location.href = '#/result';
            };
        } catch (error) {
            console.log(error);
        };
    };
};