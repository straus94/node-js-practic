const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys/index')
const regEmail = require('../emails/registration')
const router = Router()

// боъект служащий для того чтобы отправлять email
const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Log in',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            const areSave = await bcrypt.compare(password, candidate.password)

            if (areSave) {
                // const user = await User.findById('5cc1d29dcedab01481e03660')
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Incorrect password')
                res.redirect('/auth/login#login')

            }

        } else {
            req.flash('loginError', 'Incorrect user')
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log(e);
    }

})

router.post('/register', async (req, res) => {
    try {
        const {name, email, password, repeat} = req.body
        const candidate = await User.findOne({ email })

        if (candidate) {
            req.flash('registerError', 'email is not available')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            })
            await user.save()
            await transporter.sendMail(regEmail(email))
            res.redirect('/auth/login#login')
            // await transporter.sendMail(regEmail(email))

        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
