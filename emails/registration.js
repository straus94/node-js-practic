const keys = require('../keys/index')

module.exports = function (email) {
    console.log(email);
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Register successfully',
        html: `
            <h1>Welcome to the shop</h1>
            <p>You are lucky</p>
            
            <a href="${keys.BASE_URL}">Course shop</a>
        `
    }
}