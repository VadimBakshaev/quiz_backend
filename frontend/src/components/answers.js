import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";

export class Answers {
    constructor() {
        this.quiz = null;
        this.answerBoxEl = document.querySelector('.answers-box');
        // Получаем user из хранилища
        this.user = Auth.getUserInfo();
        this.init();
    };
    async init() {
        // Получаем объект теста с сервера
        try {
            this.quiz = await CustomHttp.request(config.host + '/tests/' + this.user.dataId + '/result/details?userId=' + this.user.userId);
            if (this.quiz) {
                if (this.quiz.error) {
                    throw new Error(this.quiz.error);
                };
                document.querySelector('.answers-bread-crumbs-current').innerText = this.quiz.test.name;
                document.querySelector('.answers-user').innerText = `${this.user.fullName}, ${this.user.email}`;
                this.showAnswers();
            };
        } catch (error) {
            console.log(error);
        };
    };
    showAnswers() {
        // Первый цикл выводит вопросы теста
        for (let i = 0; i < this.quiz.test.questions.length; i++) {
            const questionTitleEl = document.createElement('div');
            questionTitleEl.className = 'answers-answer';
            questionTitleEl.innerHTML = `<span>Вопрос ${i + 1}:</span> ${this.quiz.test.questions[i].question}`;
            this.answerBoxEl.appendChild(questionTitleEl);
            // Второй цикл выводит ответы на каждый вопрос
            for (let j = 0; j < this.quiz.test.questions[i].answers.length; j++) {
                const answerEl = document.createElement('div');
                answerEl.className = 'answers-user-answer';
                if (this.quiz.test.questions[i].answers[j].correct !== undefined) {
                    if (this.quiz.test.questions[i].answers[j].correct) {
                        answerEl.classList.add('correct');
                    } else {
                        answerEl.classList.add('uncorrect');
                    };
                };
                answerEl.innerText = this.quiz.test.questions[i].answers[j].answer;
                this.answerBoxEl.appendChild(answerEl);
            };
        };
    };
};
