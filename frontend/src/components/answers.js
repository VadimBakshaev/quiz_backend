import { getRequest } from "../utils/common.js";
export class Answers {
    constructor() {
        this.user = null;
        this.quiz = null;
        this.answers = null;
        this.answerBoxEl = null;
        this.answerBoxEl = document.querySelector('.answers-box');
        // Получаем user из хранилища
        this.user = JSON.parse(sessionStorage.getItem('user'));
        if (this.user.id) {
            // Получаем тест с сервера
            this.quiz = getRequest('https://testologia.ru/get-quiz?id=' + this.user.id);
            // Получаем массив правильных ответов с сервера
            this.answers = getRequest('https://testologia.ru/get-quiz-right?id=' + this.user.id);
            // Выводим название теста
            document.querySelector('.answers-bread-crumbs-current').innerText = this.quiz.name;
            // Выводим данные пользователя
            document.querySelector('.answers-user').innerText = `${this.user.firstName} ${this.user.lastName}, ${this.user.email}`;

            this.showAnswers();
        } else {
            console.log(this.user.id);
        };

    };    
    showAnswers() {
        // Первый цикл выводит вопросы теста
        for (let i = 0; i < this.quiz.questions.length; i++) {
            const questionTitleEl = document.createElement('div');
            questionTitleEl.className = 'answers-answer';
            questionTitleEl.innerHTML = `<span>Вопрос ${i + 1}:</span> ${this.quiz.questions[i].question}`;
            this.answerBoxEl.appendChild(questionTitleEl);
            // Второй цикл выводит ответы на каждый вопрос
            for (let j = 0; j < this.quiz.questions[i].answers.length; j++) {
                const answerEl = document.createElement('div');
                answerEl.className = 'answers-user-answer';
                // Находим ответ выбранный пользователем
                if (this.user.results[i].chosenAnswerId === this.quiz.questions[i].answers[j].id) {
                    // Если он совпадает с правильным, добавляем класс 'correct', если нет 'uncorrect'
                    if (this.user.results[i].chosenAnswerId === this.answers[i]) {
                        answerEl.classList.add('correct');
                    } else {
                        answerEl.classList.add('uncorrect');
                    };
                };
                answerEl.innerText = this.quiz.questions[i].answers[j].answer;
                this.answerBoxEl.appendChild(answerEl);
            };
        };
    };
};
