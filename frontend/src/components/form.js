import config from "../../config/config.js";
import { Auth } from "../services/auth.js";
import { CustomHttp } from "../services/custom-http.js";

export class Form {
    constructor(page) {
        this.formElement = null;
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;
        const that = this;
        this.fields = [
            {
                name: 'email',
                element: null,
                regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                valid: false
            },
            {
                name: 'password',
                element: null,
                regex: /^(?=.*[0-9])(?=.*)[a-zA-Z0-9!@#$%^&*]{6,16}$/,
                valid: false
            }
        ];
        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: 'firstName',
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false
                },
                {
                    name: 'lastName',
                    element: null,
                    regex: /^[А-Я][а-я]+\s*$/,
                    valid: false
                }
            );
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.addEventListener('change', function () {
                that.validateForm();
            });
        };
        this.fields.forEach(item => {
            item.element = document.getElementById(item.name);
            item.element.addEventListener('change', function () {
                that.validateField(item, this);
            })
        });
        this.formElement = document.querySelector('.form');
        this.formElement.addEventListener('submit', function (e) {
            e.preventDefault();
            that.processForm();
        });
        this.processElement = document.querySelector('.form-btn');
    };
    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.parentNode.removeAttribute('style');
            field.valid = true;
        };
        this.validateForm();
    };
    validateForm() {
        if (
            this.agreeElement
                ? this.fields.every(item => item.valid)
                && this.agreeElement.checked
                : this.fields.every(item => item.valid)
        ) {
            this.processElement.removeAttribute('disabled');
            return true;
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
            return false;
        };
    };
    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        'name': this.fields.find(item => item.name === 'firstName').element.value,
                        'lastName': this.fields.find(item => item.name === 'lastName').element.value,
                        'email': email,
                        'password': password
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        };                        
                    };
                } catch (error) {
                   return console.log(error);
                };
            };
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    'email': email,
                    'password': password
                });

                if (result) {
                    if (result.error || !result.accessToken || !result.refreshToken || !result.fullName || !result.userId) {
                        throw new Error(result.message);
                    };
                    Auth.setTokens(result.accessToken, result.refreshToken);
                    Auth.setUserInfo({
                        fullName:result.fullName,
                        userId:result.userId
                    });
                    location.href = '#/choice';
                };
            } catch (error) {
                console.log(error);
            };

            // const user = {};
            // this.fields.forEach(item => {
            //     user[item.name] = item.element.value;
            // });

            // sessionStorage.setItem('user', JSON.stringify(user));
            // location.href = '#/choice';
        };
    };
};
