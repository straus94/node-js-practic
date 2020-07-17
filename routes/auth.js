const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const keys = require('../keys/index')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
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

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Forgot password',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          req.flash('error', 'retry, please')
          return res.redirect('/aut/reset')
        }

        const token = buffer.toString('hex')

        const candidate = await User.findOne({email: req.body.email})
        // console.log(candidate);

        if (candidate) {
          candidate.resetToken = token
          candidate.resetTokenExp = Date.now() + 60 * 60 * 1000

          await candidate.save()
          await transporter.sendMail(resetEmail(candidate.email, token))
          res.redirect('/auth/login')
        } else {
          req.flash('error', 'unknown email')
          res.redirect('/auth/reset')
        }
      })
    } catch (e) {
        console.log(e);
    }
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login')
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if (!user) {
      return res.redirect('/auth/login')
    } else {
      res.render('auth/password', {
        title: 'Set new password',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }
  } catch (e) {
    console.log(e);
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {$gt: Date.now()}
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      req.flash('loginError', 'Retry, your time is left')
      res.redirect('/auth/login')
    }

  } catch (e) {
    console.log(e);
  }
})

module.exports = router
