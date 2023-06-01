'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'complete', 'failed', 'pending'],
        default: 'active',
    },
    /*
        productId,
        shopId,
        quantity,
        name,
        price
    */
    cart_product: { type: Array, default: [] },
    cart_countProduct: {
        type: Number, default: 0
    },
    cart_userId: {
        type: Number,
        required: true,
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, cartSchema);