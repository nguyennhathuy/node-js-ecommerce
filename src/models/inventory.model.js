'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema({
    inventory_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
    inventory_location: {
        type: String,
        default: 'unknow'
    },
    inventory_stock: {
        type: Number,
        required: true,
    },
    inventory_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    //reservation: hang dat truoc, khi ngta add vao gio hang thi se luu du lieu vao day
    inventory_reservations : {
        type: Array,
        default: [],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, inventorySchema);