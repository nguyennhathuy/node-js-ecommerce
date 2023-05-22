'use strict';

const express = require('express');
const { asyncHandler, authenticationV2 } = require('../../auth/authUtils');
const ProductController = require('../../controllers/product.controller');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct));
router.get('', asyncHandler(ProductController.findAllProducts));
router.get('/:product_id', asyncHandler(ProductController.findProduct));


router.use(asyncHandler(authenticationV2));
router.post('/product', asyncHandler(ProductController.createProduct));
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop));
router.post('unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))
// Query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop));
router.get('/publishes/all', asyncHandler(ProductController.getAllPublishesForShop));

module.exports = router;