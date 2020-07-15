const {Router} = require('express');
const router = Router();
const Course = require('../models/course')
const authMiddleWare = require('../middleware/auth')


router.get('/', async (req, res) => {
    const courses = await Course.find().lean().populate('userId', 'email name');

    // console.log(courses);

    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', authMiddleWare, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id).lean();
    // console.log(course);

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/edit', authMiddleWare, async (req, res) => {
    const {id} = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id,
        {
            title: req.body.title,
            price: req.body.price,
            img: req.body.img
        }, {new: true}, function (err, post) {
            if (err) throw(err)
        });
    res.redirect('/courses');
})



router.get('/:id', async (req, res) => {
    // console.log(req.params);
    const course = await Course.findById(req.params.id).lean()
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

router.post('/remove', authMiddleWare, async (req, res) => {
    console.log(req.body);
    try {
        await Course.deleteOne({
            _id: req.body.id
        });
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }



})

module.exports = router
