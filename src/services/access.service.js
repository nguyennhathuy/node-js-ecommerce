'use strict';

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const ShopService = require("./shop.service");
const { findByEmail } = require("./shop.service");

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: ' ADMIN',
};

class AccessService {
    /*
        Khi AT hết hạn, lúc đó ng dùng sẽ dùng RT để lấy lại 1 cặp mới (AT và RT) thì thông qua cái hàm này
        Mà nếu như có ng đã sử dụng cái RT này rồi thì chúng ta sẽ đưa vào đặc biệt nghi vấn của user này
        Nếu tìm đc thì chúng ta sẽ decode ra xem mày là thằng nào ????
    */

    static handlerRefreshToken = async ({ refreshToken }) => {
        //check xem RT nay da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);

        //RT da duoc su dung, co the hacker dung RT nay
        if(foundToken) {
            //check xem thang nay la thang nao
            const { userId, email } = await verifyJWT(refreshToken, foundToken,privateKey);
            console.log('foundToken::::' , { userId, email });
            //Xoa tat ca token trong keyStore, bat user dang nhap lai
            await KeyTokenService.removeKeyToken(foundToken._id)
            throw new ForbiddenError('opps, something wrong');
        }


        //Neu RT chua duoc su dung, co the user dung RT de tao lai AT va RT moi khi AT cu het han
        //Check xem RT co ton tai trong keyStore khong?
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        //Khong ton tai
        if(!holderToken) throw new AuthFailureError('Shop is not register 1');

        //verify token
        const { userId, email } = await verifyJWT(refreshToken, foundToken,privateKey);
        console.log('verify token after::::' , { userId, email });

        const foundShop = await ShopService.findByEmail({ email });
        if(!foundShop) throw new AuthFailureError('Shop is not register 2');

        //Tao 1 cap token moi
        const tokens = await createTokenPair({
            userId,
            email
        }, holderToken.publicKey , holderToken.privateKey);

        //update AT va RT moi
        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            }
        });

        return {
            user: {
                userId, email,
            },
            tokens,
        };
    }

    static handlerRefreshTokenV2 = async (param) => {
        const { keyStore, user: { userId, email }, refreshToken } = param;
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyToken(foundToken._id)
            throw new ForbiddenError('opps, something wrong');
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop is not registered');

        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop is not registered');

        const tokens = await createTokenPair({
            userId,
            email
        }, keyStore.publicKey , keyStore.privateKey);

        await keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken,
            }
        })

        return {
            user,
            tokens,
        }
    }
    

    static logOut = async ({ _id }) => {
        const delKey = await KeyTokenService.removeKeyToken(_id);
        console.log('delKey:::::::', delKey);
        return delKey;
    }



    /*
        1 - Check email in database
        2 - match password
        3 - create accessToken, refreshToken and save
        4- Generate tokens
        5- Get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        //cái refreshToken dùng để phòng khi ngta login lại
        //nhưng mà có cookie rồi thì các anh chị cũng nên bảo
        //các anh em frontend cũng phải mang cookie đó đi theo
        //để chúng ta biết thằng này hồi xưa dã dùng token này nè
        //và nó muốn login lại thì chúng ta xoá token cũ đi để khỏi truy vấn vào DB làm gì, làm v cho nhanh

        //1 - Check email in database
        const foundShop = await ShopService.findByEmail({ email });

        if(!foundShop) throw new BadRequestError('Shop is not register!')

        //2 - match password
        const matchPassword = bcrypt.compare(password, foundShop.password);

        if(!matchPassword) throw new AuthFailureError('Authentication error');

        //3 - create accessToken, refreshToken and save
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        //4- Generate tokens
        const { _id: userId } = foundShop;
        const tokens = await createTokenPair({
            userId,
            email
        }, publicKey , privateKey);

        await KeyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        });

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop,
            }),
            tokens,
        }
    }


    static signUp = async ({ name, email, password }) => {
        //step 1: check email exists ?
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Shop already registered!');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, 
            email, 
            password: passwordHash, 
            roles: [roleShop.SHOP]
        });
        if (newShop) {
            //create privateKey, publicKey
            //private la cai khi chung ta tao xong, chung ta day cho nguoi dung
            //chung ta khong luu cai privateKey nay trong he thong cua chung ta
            //privatekey dung de sign cai token
            //publickey dung de verìy token
            //muon hack duoc he thong thi phai biet ca 2, ma muon biet duoc cả 2 thì rất khó
            //xác suất biết được cả 2 rất hiếm
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem',
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem',
            //     },
            //     //Public key cryptoGraphy Standards: 1 !
            // });

            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            //created token pair
            const tokens = await createTokenPair({
                userId: newShop._id,
                email
            }, publicKey , privateKey);

            //save collection key
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            });

            if (!keyStore) {
                throw new BadRequestError('publicKeyString error');
            }

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop,
                    }),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null,
        }
    }
}

module.exports = AccessService;