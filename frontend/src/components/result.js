import { Auth } from "../services/auth.js";

export class Result {
    constructor() {
        const user = Auth.getUserInfo();
        if (user) {
            document.querySelector('.result-score')
                .innerText = `${user.score}/${user.total}`;
        };
    };
};
