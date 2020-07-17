const express = require('express')
const app = express()
const path = require('path')
const csurf = require('csurf')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const courseRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/order')
const profileRoutes = require('./routes/profile')
const authRoutes = require('./routes/auth')
// const resetRoutes = require('./routes/auth/reset')
const mongoose = require('mongoose')
const session = require('express-session')
const varMiddleWare = require('./middleware/variables')
const userMiddleWare = require('./middleware/user')
const MongoStore = require('connect-mongodb-session')(session)
const keys = require('./keys/index')


// const MONGODB_URI = 'mongodb+srv://den:rfWCPb3HVk4D8i9a@cluster0.1kp6p.mongodb.net/nodeJS'
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI,
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// app.use(async(req, res, next) => {
//     try {
//         const user = await User.findById('5f04773102f3e877eff065da')
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e);
//     }
//
// })

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csurf())
app.use(flash())
app.use(varMiddleWare)
app.use(userMiddleWare)

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', courseRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/profile', profileRoutes);
app.use('/auth', authRoutes);
// app.use('/auth/reset', resetRoutes);


const PORT = process.env.PORT || 3000;
const password = 'rfWCPb3HVk4D8i9a'

async function start() {
    try {
        // const url = 'mongodb+srv://den:rfWCPb3HVk4D8i9a@cluster0.1kp6p.mongodb.net/nodeJS'
        console.log(keys.MONGODB_URI);
        await mongoose.connect(keys.MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                 })
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const user = new User({
        //         email: 'straus94@gmail.com',
        //         name: 'Den',
        //         cart: {items:[]}
        //     })
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`start server on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();


