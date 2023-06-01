'use strict';

const express = require('express');
const { asyncHandler, authenticationV2 } = require('../../auth/authUtils');
const CartController = require('../../controllers/cart.controller');
const router = express.Router();


router.post('/cart/addToCart', asyncHandler(CartController.addToCart));
router.post('/cart/updateCart', asyncHandler(CartController.updateCart));
router.delete('/cart/deleteProduct', asyncHandler(CartController.deleteProductInCart));
router.get('/cart/getListCart', asyncHandler(CartController.listToCart));


module.exports = router;