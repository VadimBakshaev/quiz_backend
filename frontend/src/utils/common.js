function checkUserData() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user.firstName || !user.lastName || !user.email) {
        location.href = './index.html';
    };
};

/**
 * Function sends a GET request to the specified server, and returns a response
 * @param {string} addr - http server address
 * @returns {object} - returns the response from the server as an object
 */
function getRequest(addr) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', addr, false);
    xhr.send();
    if (xhr.status === 200 && xhr.responseText) {
        try {
            return JSON.parse(xhr.responseText);
        } catch (e) {
            console.log(e);
        };
    } else {
        console.log(xhr.status);
    };
};

export { checkUserData, getRequest };