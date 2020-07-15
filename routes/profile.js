const Router = require('express')
const router = new Router();
const Order = require('../models/order')
const authMiddleWare = require('../middleware/auth')


const getTotalPriceOrders = orders => {
    let totalPrice = 0;
    orders.map(o => {
        let price = o.courses.reduce((total, c) => {
            return total += c.count * c.course.price
        }, 0);
        totalPrice += price;
    })

    return totalPrice;
}

router.get('/', authMiddleWare, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.userId').execPopulate()
        const orders = await Order.find({'user.userId': req.user._id}).populate('user.userId')
        console.log(orders.courses);

        res.render('profile', {
            title: 'Profile',
            isProfile: true,
            user,
            orders: orders.map(o => {
                return {
                    ...o._doc,
                    price: o.courses.reduce((total, c) => {
                        return total += c.count * c.course.price
                    }, 0)
                }
            }),
            totalPrice: getTotalPriceOrders(orders)
        })
    } catch (e) {
        console.log(e);
    }

})

module.exports = router;
