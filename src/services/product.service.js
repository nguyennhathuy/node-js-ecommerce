'use strict';

const {product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');

const { 
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishesForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    updateProductById,
    findProduct,
} = require('./repositories/product.repo');

const { 
    removeUndefinedObject,
    updateNestedObjectParser
 } = require('../utils');

// define factory class to create product
//v1
// class ProductFactory {
//     static async createProduct (type, payload) {
//         switch (type) {
//             case 'Electronic': 
//                 return new Electronic(payload);
//             case 'Clothing':
//                 return new Clothing(payload).createProduct();
//             default:
//                 throw new BadRequestError(`Invalid product type ::: ${type}`);
//         }
//     }
// };

//v2
class ProductFactory {
    /*
        type: 'Clothing,
        payload
    */

    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError(`Invalid product type ::: ${type}`);

        return new productClass(payload).createProduct();
    }
    
    static async updateProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if(!productClass) throw new BadRequestError(`Invalid product type ::: ${type}`);

        return new productClass(payload).updateProduct(payload._id);
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        //limit để phân trang
        //nhược điểm của thằng scroll, khi ở trang thứ 3 chúng ta reload lại, chúng ta tìm kiếm 1 sản phẩm, tin tức nào đó cũng khó
        //cho nên phân trang nó tiện lợi vì sản phẩm ở trang thứ bao nhiêu thì nó chỉ nằm ở đó
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishesForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishesForShop({ query, limit, skip });
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }

    static async searchProducts ({ keySearch }) {
        // search product chung ta danh cho user, cho nen khong can verify token, no chi co keyapi
        // Chi search nhung product ma da publish
        return await searchProducts(keySearch);
    }

    static async findAllProducts({
        limit = 50,
        sort = 'ctime',
        page = 1,
        filter = { isPublished: true }
    }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] });
    }
}


// define base product class

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name,
        this.product_thumb = product_thumb,
        this.product_description = product_description,
        this.product_price = product_price,
        this.product_quantity = product_quantity,
        this.product_type = product_type,
        this.product_shop = product_shop,
        this.product_attributes = product_attributes
    }
    async createProduct(item_id) {
        return await product.create({
            ...this,
            _id: item_id,
        });
    }

    async updateProduct(productId, bodyUpdate) {
        return updateProductById(productId, bodyUpdate, product);
    }
};

// define sub-class for different product types Clothing
class Clothing extends Product{
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            shop: this.product_shop,
        });
        if (!newClothing) throw new BadRequestError('Create new clothing error');
        
        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) throw new BadRequestError('Create new product error');

        return newProduct;
    }

    async updateProduct(productId) {
        const updateNest = updateNestedObjectParser(this);
        const objectParams = removeUndefinedObject(updateNest);
        if (objectParams.product_attributes) {
            updateProductById(productId, objectParams, clothing);
        }
        const updateProduct = await super.updateProduct(productId, objectParams);
        return updateProduct;
    }
}

// define sub-class for different product types Electronic
class Electronic extends Product{
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError('Create new electronic error');

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new product error');
        
        return newProduct;
    }
}

ProductFactory.registerProductType('Clothing', Clothing);

module.exports = ProductFactory;