import config from "../../config/config.js";

export class Auth {
    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                };
            } else {
                this.removeTokens();
                location.href = '#/';
                return false;
            };
        };
    };
    static async logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.removeTokens();
                    localStorage.removeItem('userInfo');
                    return true;
                };
            };
        };
    };
    static setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };
    static removeTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };
    static setUserInfo(info) {
        localStorage.setItem('userInfo', JSON.stringify(info));
    };
    static getUserInfo() {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            return JSON.parse(userInfo);
        };
        return null;
    };
}