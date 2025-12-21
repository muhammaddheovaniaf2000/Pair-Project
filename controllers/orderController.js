// controllers/orderController.js
const { Order, Product, User, Profile } = require('../models'); 

class OrderController {
    static async showOrderDetails(req, res) {
        try {
            // Eager Loading 3+ tabel: Order -> Product & Order -> User -> Profile
            const orders = await Order.findAll({
                include: [
                    { model: Product },
                    { model: User, include: [Profile] } 
                ]
            });
            res.render('order_details', { orders }); // views/order_details.ejs
        } catch (error) {
            res.send(error);
        }
    }
}
module.exports = OrderController;