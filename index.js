const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const courseRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/order')
const mongoose = require('mongoose');
const User = require('./models/user')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async(req, res, next) => {
    try {
        const user = await User.findById('5f04773102f3e877eff065da')
        req.user = user
        next()
    } catch (e) {
        console.log(e);
    }

})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}))

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', courseRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);


const PORT = process.env.PORT || 3000;
const password = 'rfWCPb3HVk4D8i9a'

async function start() {
    try {
        const url = 'mongodb+srv://den:rfWCPb3HVk4D8i9a@cluster0.1kp6p.mongodb.net/nodeJS'
        await mongoose.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                 })
        const candidate = await User.findOne();
        if (!candidate) {
            const user = new User({
                email: 'straus94@gmail.com',
                name: 'Den',
                cart: {items:[]}
            })
            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`start server on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();


