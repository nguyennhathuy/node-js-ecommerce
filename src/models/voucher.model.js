'use strict';

const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Voucher';
const COLLECTION_NAME = 'Vouchers';

const voucherSchema = new Schema({
    voucher_name: { type: String, required: true },
    voucher_description: { type: String, required: true },
    voucher_type: { type: String, default: 'fixed-amount', enum: ['fixed-amount', 'percentage'] },
    voucher_value: { type: Number, required: true }, //10.000VND or 10%
    voucher_code: { type: String, required: true },
    voucher_startDate: { type: Date, required: true },
    voucher_endDate: { type: Date, required: true },
    voucher_maxUses: { type: Number, required: true }, // so luong voucher duoc ap dung
    voucher_usesCount: { type: Number, default: 0 }, // so luong voucher da su dung
    voucher_shopsUsed: { type: Array, default: [] }, // ai da su dung
    voucher_maxUsePerAccount: { type: Number, required: true }, // so luong cho phep toi da su dung moi shop
    voucher_minOrderValue: { type: Number, required: true },
    voucher_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    voucher_isActive: { type: Boolean, default: true },
    voucher_applyTo: { type: String, required: true, enum: ['all', 'specific'] },
    voucher_productIds: { type: Array, default: [] }, // so san pham duoc ap dung 
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, voucherSchema);