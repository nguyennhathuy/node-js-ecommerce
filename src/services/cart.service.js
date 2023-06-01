'use strict';

const {
    findCart,
    createCart,
    updateCart,
    updateProductQuantity
} = require('./repositories/cart.repo');
const {
    findProduct
} = require('./repositories/product.repo');

const {
    NotFoundError
} = require('../core/error.response');

const cartModel = require('../models/cart.model');

/*
    key features: Cart service
    - add product to cart
    - reduce product quantity by one
    - increase product quantity by one
    - get cart
    - delete cart
    - delete cart item
*/



class CartService {
    static async addTocart({ userId, product = {} }) {
        /*
            1. Nếu chúng ta chưa có giỏ hàng thì chúng ta phải tạo
            2. Nếu chúng ta có giỏ hàng rồi mà đúng sản phẩm đó, thì chúng ta sẽ update lên bằng 2 hoặc n
        */
        //check cart ton tai hay khong?
        const cart = await findCart(userId);
        if (!cart) {
            //create cart for user
            return await createCart(userId, product);
        }

        // update cart khong co product ton tai trong cart
        if (cart.cart_product.length === 0) {
            cart.cart_product = [product];
            return await cart.save();
        };

        // update cart co product ton tai trong cart
        return await updateCart(userId, product);
    }

    static async addTocartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        // check product
        const foundProduct = await findProduct({ product_id: productId, unSelect: ['__v'] });
        if (!foundProduct) throw new NotFoundError('Product do not belong to the shop!');

        if (quantity === 0) {
            // delete product
        };

        return await updateProductQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity,
            }
        });
    }

    static async deleteProductCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' };
        const updateSet = {
            $pull: {
                cart_product: {
                    productId
                }
            }
        };
        return await cartModel.updateOne(query, updateSet);
    };

    static async getListCart({ userId }) {
        return await cartModel.findOne({
            cart_userId: userId,
        })
    }
};

module.exports = CartService;