'use strict'

const slugify = require('slugify');

const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';


const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: [ 'Electronic', 'Clothing', 'Furniture' ] },
    product_shop: { type:Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_attributes: { type:Schema.Types.Mixed, required: true },
    //more
    // cai package slugify la duoc
    product_slug: { type: String },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10,
    },
    // vi du co 1 san pham dt, nhieu mau, trong moi mau co bao nhieu Gb, thi ngta goi la variation
    product_variation: { type: Array, default: [] },

    // Mặc định tạo 1 product trong shopee là isCraft
    // select = false => find khong ra
    isCraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

}, {
    collation: COLLECTION_NAME,
    timestamps: true,
});

// create index for search
// Nếu không đánh index thì sẽ dính trường hợp nó sẽ bị lỗi "text index required for $text query, index not found"
productSchema.index({ product_name: 'text', product_description: 'text' })


//middleware
//document truoc khi duoc save thi chung ta se su dung o day
productSchema.pre('save', function ( next ) {
    // Quần Jean cao cấp => quan-jean-cao-cap
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
})


//define the product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    shop: { type:Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'Clothings',
    timestamps: true
});

//define the product type = electronic

const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    shop: { type:Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'Electronics',
    timestamps: true,
});

module.exports = {
    product: model( DOCUMENT_NAME, productSchema ),
    clothing: model( 'clothing', clothingSchema ),
    electronic: model( 'electronic', electronicSchema ),
};