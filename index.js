const express = require('express')
const app = express()
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const courseRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true
}))

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', courseRoutes);
app.use('/card', cardRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`start server on port ${PORT}`);
})
