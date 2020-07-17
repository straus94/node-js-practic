const keys = require('../keys/index')

module.exports = function (email, token) {
  console.log(token);
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Reset password',
    html: `
            <h1>You are forgot password</h1>
            <p>If no - ignore this mail</p>
            <p>else click to link under</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
            <hr />
            
            <a href="${keys.BASE_URL}">Course shop</a>
        `
  }
}