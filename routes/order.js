const {Router} = require('express');
const router = Router();
const Order = require('../models/order');
const authMiddleWare = require('../middleware/auth')


router.get('/', authMiddleWare, async (req, res) => {
  try {
    console.log('req -----------> ', req.user._id);
    const orders = await Order.find({'user.userId': req.user._id})
      .populate('user.userId')

    // console.log(orders);
    // console.log(orders.courses);
    res.render('orders', {
      isOrder: true,
      title: 'Orders',
      orders: orders.map(o => {
        return {
          ...o._doc,
          price: o.courses.reduce((total, c) => {
            return total += c.count * c.course.price
          }, 0)
        }
      })
    })
  } catch (e) {
    console.log(e);
  }

})

router.post('/', authMiddleWare, async (req, res) => {

  try {
    const user = await req.user.populate('cart.items.courseId').execPopulate()

    const courses = user.cart.items.map(i => ({
      count: i.count,
      course: {...i.courseId._doc}
    }))

    console.log('user -----> ', req.user);
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      courses: courses
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  } catch (e) {
    console.log(e);
  }


})


module.exports = router
