const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const authMiddleWare = require('../middleware/auth')

function mapCartItems(cart) {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }));
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0)
}


router.post('/add', authMiddleWare, async (req, res) => {
    const course = await Course.findById(req.body.id);

    await req.user.addToCard(course)
    res.redirect('/card')

})


router.delete('/remove/:id', authMiddleWare, async (req, res) => {
    await req.user.removeFromCart(req.params.id)

    const user = await req.user.populate('cart.items.courseId').execPopulate()

    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price: computePrice(courses)
    }

    res.status(200).json(cart)
})



router.get('/', authMiddleWare, async (req, res) => {
 const user = await req.user
   .populate('cart.items.courseId')
   .execPopulate();

    const courses = mapCartItems(user.cart)

    res.render('card', {
     title: `Card`,
     isCard: true,
     courses: courses,
     price: computePrice(courses)
 })
})

module.exports = router
