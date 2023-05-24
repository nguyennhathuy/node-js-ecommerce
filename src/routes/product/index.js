'use strict';

const express = require('express');
const { asyncHandler, authenticationV2 } = require('../../auth/authUtils');
const ProductController = require('../../controllers/product.controller');
const router = express.Router();


router.get('/product/all', asyncHandler(ProductController.findAllProducts));
router.get('/product/search/:keySearch', asyncHandler(ProductController.getListSearchProduct));
router.get('/product/:product_id', asyncHandler(ProductController.findProduct));


router.use(asyncHandler(authenticationV2));
router.post('/product/create', asyncHandler(ProductController.createProduct));
router.post('/product/publish/:id', asyncHandler(ProductController.publishProductByShop));
router.post('/product/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop));
router.patch('/product/update/:id', asyncHandler(ProductController.updateProduct));

// Query
router.get('/product/drafts/all', asyncHandler(ProductController.getAllDraftsForShop));
router.get('/product/publishes/all', asyncHandler(ProductController.getAllPublishesForShop));

module.exports = router;