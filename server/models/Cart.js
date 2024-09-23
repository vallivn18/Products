const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: String,  // To store selected variant like color or size
  quantity: { type: Number, default: 1 },
});

const cartSchema = new Schema({
  items: [cartItemSchema],
  totalQuantity: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
