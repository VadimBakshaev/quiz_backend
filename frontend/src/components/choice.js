import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";

export class Choice {
    constructor() {
        this.quizzes = [];
        this.testResults = null;
        this.init();
        this.user = Auth.getUserInfo();
    };

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/tests');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                };
                this.quizzes = result;
            };
        } catch (error) {
            return console.log(error);
        };
        if (this.user) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/results?userId=' + this.user.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    };
                    this.testResults = result;
                };
            } catch (error) {
                return console.log(error);
            };
        };
        this.processQuizzes();
    };

    processQuizzes() {
        if (this.quizzes && this.quizzes.length > 0) {
            const contentEl = document.querySelector('.choice-content');
            const that = this;
            this.quizzes.forEach(quiz => {
                const choiseEl = document.createElement('div');
                choiseEl.className = 'choice-option';
                choiseEl.setAttribute('data-id', quiz.id);
                choiseEl.addEventListener('click', function () {
                    that.chooseQuiz(this);
                });

                const choiceTextEl = document.createElement('div');
                choiceTextEl.className = 'choice-option-text';
                choiceTextEl.innerText = quiz.name;

                const choiseArrowEl = document.createElement('div');
                choiseArrowEl.className = 'choice-option-arrow';

                const result = this.testResults.find(item => item.testId === quiz.id);
                if (result) {
                    const choiceResultEl = document.createElement('div');
                    choiceResultEl.className = 'choice-option-result';
                    choiceResultEl.innerHTML = `<div>Результат</div><div>${result.score}/${result.total}</div>`;
                    choiseEl.appendChild(choiceResultEl);
                };

                const choiseArrowImgEl = document.createElement('img');
                choiseArrowImgEl.setAttribute('src', './images/arrow.svg');
                choiseArrowImgEl.setAttribute('alt', 'Arrow to right');

                choiseArrowEl.appendChild(choiseArrowImgEl);
                choiseEl.appendChild(choiceTextEl);
                choiseEl.appendChild(choiseArrowEl);
                contentEl.appendChild(choiseEl);
            });
        };
    };

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
            const user = Auth.getUserInfo();
            if (user) {
                user.dataId = dataId;
                Auth.setUserInfo(user);
                location.href = '#/test';
            };
        };
    };
};
