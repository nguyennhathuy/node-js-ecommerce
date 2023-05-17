'use strict';

const express = require('express');
const { asyncHandler, authentication, authenticationV2 } = require('../../auth/authUtils');
const accessController = require('../../controllers/access.controller');
const router = express.Router();

//signUp
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.logIn));


router.use(asyncHandler(authenticationV2));
router.post('/shop/logout', asyncHandler(accessController.logOut));
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken));


module.exports = router;