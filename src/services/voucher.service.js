'use strict';

const { BadRequestError } = require('../core/error.response');
const { 
    findVoucherActiveByShopId,
    createVoucher
 } = require('../services/repositories/voucher.repo');
const { 
    findAllProducts
} = require('../services/repositories/product.repo');
const {
    convertStringToObjectIdMongoDb
} = require('../utils');




// DISCOUNT SERVICE
// Generator discount code SHOP || ADMIN
// Get all discount codes  USER || SHOP
// Get all product by discount code USER
// Get discount amount User
// Delete discount code ADMIN || SHOP
// Cancel discount code USER
class VoucherService {
    static async createVoucherCode (body) {
        const { code, startDate, endDate, shopId } = body;
        // Check date
        if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
            throw new BadRequestError('Cannot create voucher before current !');
        };
        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Start date must be before end date !');
        };

        // Check voucher đã có trong hệ thống chưa ?
        const foundVoucher = await findVoucherActiveByShopId({ code, shopId });
        if (foundVoucher) {
            throw new BadRequestError('Voucher exists !');
        }; 

        // Nếu vượt qua 2 điều kiện trên thì ta khởi tạo voucher
        const newVoucher = await createVoucher(body);

        if (!newVoucher) {
            throw new BadRequestError('Opps, something wrong in create voucher !');
        };
        return newVoucher;
    }


    static async updateVoucherCode () {
        
    }


    // lay nhung voucher hien co cua shop
    static async getAllVoucherCodesByShop () {
        
    }


    // lay nhung san pham duoc ap dung boi voucher do
    static async getProductsByVoucherCode(body) {
        const { code, shopId, limit, page } = body;

        // Tìm voucher xem có tồn tại hay không
        const foundVoucher = await findVoucherActiveByShopId({ code, shopId });
        if (!foundVoucher) {
            throw new BadRequestError('Voucher does not exists !');
        };
        const { voucher_applyTo, voucher_productIds } = foundVoucher;
        let product;
        if (voucher_applyTo === "all") {
            product = await findAllProducts({
                filter: {
                    product_shop: convertStringToObjectIdMongoDb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                sort: 'ctime',
                page: +page,
                select: ['product_name'],
            })
        }
        if (voucher_applyTo === "specific") {
            product = await findAllProducts({
                filter: {
                    _id: { $in: voucher_productIds },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            });
        }
        return products;
    }

    static async getVoucherAmount(body) {
        const { code, shopId } = body;

        // Tìm xem có voucher tồn tại không ?
        const foundVoucher = await findVoucherActiveByShopId({ code, shopId });
        if (!foundVoucher) throw new BadRequestError('Voucher doesnt exist !');

        const {
            voucher_maxUses,
            voucher_minOrderValue,
            voucher_shopsUsed,
            voucher_endDate,
            voucher_maxUsePerAccount,
            voucher_value,
            voucher_code,
            voucher_shopId,
        } = foundVoucher;

        // check lượt sử dụng
        if (voucher_maxUses === 0) throw new BadRequestError('Voucher is out !');
        // check xem voucher còn hạn sử dụng hay không ?
        if (new Date(voucher_endDate) < new Date()) {
            throw new BadRequestError('Voucher is expired !');
        }
        // Check xem co gia tri toi thieu hay khong ?
        let totalOrder = 0;
        const products = VoucherService.getProductsByVoucherCode({
            code: voucher_code,
            shopId: voucher_shopId,
            limit: 50,
            page: -1,
        })
        if (voucher_minOrderValue > 0) {
            totalOrder = products.reduce((currentValue, product) => {
                return currentValue + (product.price * product.quantity);
            }, 0);

            if (totalorder < voucher_minOrderValue) throw new BadRequestError('Value of cart is not enough !');
        }

        if (voucher_maxUsePerAccount > 0) {
            const userUseVoucher = voucher_shopsUsed.find(user => user.userId === shopId);
            if (userUseVoucher) {
                
            }
        }
        const amount = voucher_type === "fixed-amount" ? voucher_value : totalOrder * (voucher_value / 100);
        return {
            amount,
            totalorder,
            totalPrice: totalorder - amount,
        }
    }

}
module.exports = VoucherService;