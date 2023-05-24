'use strict';

const ProductFactory = require("../services/product.service");
const { Created, Success } = require('../core/sucess.response');

class ProductController {
    static createProduct = async (req, res, next) => {
        const newProduct = await ProductFactory.createProduct(req.body.product_type, {
            ...req.body,
            product_shop: req.user.userId,
        });
        return new Created({
            message: 'Create product success!',
            metadata: newProduct,
        }
        ).send(res);
    }

    //{ product_shop, product_id }
    static publishProductByShop = async (req, res, next) => {
        const newProduct = await ProductFactory.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id });
        return new Success({
            message: 'Publish product success!',
            metadata: newProduct,
        }
        ).send(res);
    }

    static unPublishProductByShop = async (req, res, next) => {
        const newProduct = await ProductFactory.unPublishProductByShop({ product_shop: req.user.userId, product_id: req.params.id });
        return new Success({
            message: 'unpublish product success!',
            metadata: newProduct,
        }
        ).send(res);
    }

    static updateProduct = async (req, res, next) => {
        const newProduct = await ProductFactory.updateProduct(req.body.product_type, {
            ...req.body,
            product_shop: req.user.userId,
            _id: req.params.id
        });
        return new Success({
            message: 'Update product by Id success!',
            metadata: newProduct,
        }
        ).send(res);
    }

    // Query
    static getAllDraftsForShop = async (req, res, next) => {
        const newProducts = await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId });
        return new Success({
            message: 'Get list draft success!',
            metadata: newProducts,
        }
        ).send(res);
    };

    static getAllPublishesForShop = async (req, res, next) => {
        const newProducts = await ProductFactory.findAllPublishesForShop({ product_shop: req.user.userId });
        return new Success({
            message: 'Get list publish success!',
            metadata: newProducts,
        }
        ).send(res);
    }

    static getListSearchProduct = async (req, res, next) => {
        const newProducts = await ProductFactory.searchProducts(req.params);
        return new Success({
            message: 'Search products success!',
            metadata: newProducts,
        }
        ).send(res);
    }

    static findAllProducts = async (req, res, next) => {
        const newProducts = await ProductFactory.findAllProducts(req.query);
        return new Success({
            message: 'Get list product success!',
            metadata: newProducts,
        }
        ).send(res);
    }

    static findProduct = async (req, res, next) => {
        const newProduct = await ProductFactory.findProduct(req.params);
        return new Success({
            message: 'Get product by ID success!',
            metadata: newProduct,
        }
        ).send(res);
    }
    // End Query
}

module.exports = ProductController;