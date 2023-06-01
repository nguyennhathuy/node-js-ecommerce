'user strict';
const { Success } = require('../core/sucess.response');
const CartService = require('../services/cart.service');

class CartController {
    static async addToCart(req, res, next) {
        return new Success({
            message: 'Add to cart success !',
            metadata: await CartService.addTocart(req.body)
        }).send(res);
    }
    static async updateCart(req, res, next) {
        return new Success({
            message: 'Update cart success !',
            metadata: await CartService.addTocartV2(req.body)
        }).send(res);
    }
    static async deleteProductInCart(req, res, next) {
        return new Success({
            message: 'Delete product in cart success !',
            metadata: await CartService.deleteProductCart(req.body)
        }).send(res);
    }
    static async listToCart(req, res, next) {
        return new Success({
            message: 'get lsit cart success !',
            metadata: await CartService.getListCart(req.query)
        }).send(res);
    }
};

module.exports = CartController;