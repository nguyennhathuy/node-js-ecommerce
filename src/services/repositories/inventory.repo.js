'use strict';

const inventoryModel = require("../../models/inventory.model");


const insertInventory = async ({
    productId, stock, shopId
}) => {
    const newInventory = await inventoryModel.create({
        inventory_productId: productId,
        inventory_stock: stock,
        inventory_shopId: shopId,
    });
    return newInventory;
}


module.exports = {
    insertInventory,
};