import { CustomHttp } from "../services/custom-http.js";
import { checkUserData } from "../utils/common.js";
export class Choice {
    constructor() {
        this.quizzes = [];
        this.init();

    };

    async init() {
        try {
            const result = await CustomHttp.request('http://localhost:3000/api/tests');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                };
                this.quizzes = result;
                this.processQuizzes();
            };
        } catch (error) {
            console.log(error);
        };
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

                const choiseArrowImgEl = document.createElement('img');
                choiseArrowImgEl.setAttribute('src', './static/images/arrow.svg');
                choiseArrowImgEl.setAttribute('alt', 'Arrow to right');

                choiseArrowEl.appendChild(choiseArrowImgEl);
                choiseEl.appendChild(choiceTextEl);
                choiseEl.appendChild(choiseArrowEl);
                contentEl.appendChild(choiseEl);
            });
        };
    };

    chooseQuiz(element) {
        const datId = element.getAttribute('data-id');
        if (datId) {
            const user = JSON.parse(sessionStorage.getItem('user'));
            user.id = datId;
            sessionStorage.setItem('user', JSON.stringify(user));
            location.href = '#/test';
        };
    };
};
