export class Result {
    constructor() {
        const url = new URL(location.href);
        const user = JSON.parse(sessionStorage.getItem('user'));
        document.querySelector('.result-score')
            .innerText = `${user.score}/${user.total}`;
    };
};
