'use strict';
const voucherModel = require('../../models/voucher.model');
const { 
    convertStringToObjectIdMongoDb,
 } = require('../../utils');



const findVoucherActiveByShopId = async (body) => {
    const { code, shopId } = body;
    const newVoucher = await voucherModel.findOne({
        voucher_isActive: true,
        voucher_code: code,
        voucher_shopId: convertStringToObjectIdMongoDb(shopId),
    }).lean();
    return newVoucher;
}

const createVoucher = async (body) => {
    const newVoucher = {
        voucher_name: body.name,
        voucher_description: body.description,
        voucher_type: body.type,
        voucher_value: body.value,
        voucher_code: body.code,
        voucher_startDate: body.startDate,
        voucher_endDate: body.endDate,
        voucher_maxUses: body.maxUses,
        voucher_maxUsePerAccount: body.maxUsePerAccount,
        voucher_minOrderValue: body.minOrderValue,
        voucher_shopId: body.shopId,
        voucher_applyTo: body.applyTo,
        voucher_productIds: body.productIds,
    };
    return await voucherModel.create(newVoucher);
    
}

module.exports = {
    findVoucherActiveByShopId,
    createVoucher
}