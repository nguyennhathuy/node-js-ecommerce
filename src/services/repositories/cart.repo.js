'user strict';

const cartModel = require('../../models/cart.model');


const findCart = async (userId) => {
    return await cartModel.findOne({ cart_userId: userId });
}

const createCart = async (userId, product) => {
    return await cartModel.create({
        cart_userId: userId,
        cart_product: [product],
    });
}

const updateCart = async (userId, product) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_product.productId': productId,
        cart_state: 'active',
    };
    const updateSet = {
        $inc: {
            'cart_product.$.quantity': quantity,
        }
    }

    return await cartModel.updateOne(query, updateSet);
}

const updateProductQuantity = async ({ userId, product }) => {
    const { productId, quantity } = product;
    const query = {
        cart_userId: userId,
        'cart_product.productId': productId,
        cart_state: 'active'
    };
    const updateSet = {
        $inc: {
            'cart_product.$.quantity': quantity
        }
    };
    const option = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate( query, updateSet, option);
}

const createCartProduct = async ({ userId, product }) => {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
        $addToSet: {
            cart_product: product,
        }
    };
    const option = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, option);
}

module.exports = {
    findCart,
    createCart,
    updateCart,
    updateProductQuantity,
    createCartProduct
}