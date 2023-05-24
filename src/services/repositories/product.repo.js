'use strict';

const { product, clothing, electronic } = require('../../models/product.model');
const { Types } = require('mongoose');
const { getSelectData, getUnselectData } = require('../../utils');

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    const convertQuery = {
        ...query,
        product_shop: new Types.ObjectId(query.product_shop),
    }
    return await queryProduct({ query: convertQuery, limit, skip });
};

const findAllPublishesForShop = async ({ query, limit, skip }) => {
    const convertQuery = {
        ...query,
        product_shop: new Types.ObjectId(query.product_shop),
    }
    return await queryProduct({ query: convertQuery, limit, skip });
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });
    if (!foundProduct) return null;

    foundProduct.isDraft = false;
    foundProduct.isPublished = true;

    //modifiedCount khi k có update thì return 0, còn có update return > 1
    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    });
    if (!foundProduct) return null;

    foundProduct.isDraft = true;
    foundProduct.isPublished = false;

    //modifiedCount khi k có update thì return 0, còn có update return > 1
    const { modifiedCount } = await foundProduct.updateOne(foundProduct);

    return modifiedCount;
}

const searchProducts = async (keySearch) => {
    console.log('keySearch::::::::', keySearch);
    const regexSearch = new RegExp(keySearch);
    const result = await product
    .find({ isPublished: true, $text: { $search: regexSearch } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean();

    return result;
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    // vi du page 1, page - 1 = 0, 0 * limit = 0
    const skip = (page -1) * limit;
    const sortBy = sort === ' ctime' ? { _id: -1 } : { _id: 1 };
    const convertSelect = getSelectData(select);
    const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(convertSelect).lean();
    return products;
}

const findProduct = async ({ product_id, unselect }) => {
    const filter = { _id: new Types.ObjectId(product_id), isPublished: true }
    return await product.findOne(filter).select(getUnselectData(unselect)).lean();
};

const updateProductById = async (productId, bodyUpdate, model, isNew = true) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishesForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct,
    updateProductById
};