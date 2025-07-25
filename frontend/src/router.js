import { Form } from "./components/form.js";
import { Choice } from "./components/choice.js";
import { Test } from "./components/test.js";
import { Result } from "./components/result.js";
import { Answers } from "./components/answers.js";
import { Auth } from "./services/auth.js";

export class Router {
    constructor() {
        this.contentEl = document.getElementById('content');
        this.stylesEl = document.getElementById('styles');
        this.titleEl = document.getElementById('page-title');
        this.profileEl = document.querySelector('.profile');
        this.profileUserEl = document.querySelector('.profile-user');
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'styles/index.css',
                load: () => {

                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/form.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                styles: 'styles/choice.css',
                load: () => {
                    new Choice();
                }
            },
            {
                route: '#/test',
                title: 'Прохождение теста',
                template: 'templates/test.html',
                styles: 'styles/test.css',
                load: () => {
                    new Test();
                }
            },
            {
                route: '#/result',
                title: 'Результат',
                template: 'templates/result.html',
                styles: 'styles/result.css',
                load: () => {
                    new Result();
                }
            },
            {
                route: '#/answers',
                title: 'Ответы',
                template: 'templates/answers.html',
                styles: 'styles/answers.css',
                load: () => {
                    new Answers();
                }
            },
        ]
    };
    async openRoute() {
        if (location.hash === '#/logout') {
            await Auth.logout();
            location.href = '#/';
            return;
        };
        const newRoute = this.routes.find(item => { return item.route === location.hash });
        if (!newRoute) {
            location.href = '#/';
            return;
        };
        this.contentEl.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.stylesEl.setAttribute('href', newRoute.styles);
        this.titleEl.innerText = newRoute.title;
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem('accessToken');
        if (userInfo && accessToken) {
            this.profileEl.style.display = 'flex';
            this.profileUserEl.innerText = userInfo.fullName;
        } else {
            this.profileEl.style.display = 'none';
        }
        newRoute.load();
    };
}