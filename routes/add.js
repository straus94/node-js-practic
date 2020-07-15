const {Router} = require('express');
const router = Router();
const authMiddleWare = require('../middleware/auth')
const Course = require('../models/course')


router.get('/', authMiddleWare, (req, res) => {
    res.render('add', {
        title: 'Add new course',
        isAdd: true
    })
})

router.post('/', authMiddleWare, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try {
        await course.save();
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }


})


module.exports = router
