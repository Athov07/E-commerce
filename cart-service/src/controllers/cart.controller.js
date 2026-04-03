import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { sendCartEvent } from "../kafka/producers/cart.producer.js";

// cart.controller.js
export const addToCart = asyncHandler(async (req, res) => {
  const { user_id, productId, name, price, quantity } = req.body;
  
  let cart = await Cart.findOne({ user_id });
  if (!cart) {
    cart = await Cart.create({ user_id, items: [{ productId, name, price, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }
    await cart.save();
  }

  sendCartEvent("CART_UPDATED", cart).catch(err => {
    console.error("Kafka Background Error (Leadership Election):", err.message);
  });

  return res.status(200).json({ success: true, data: cart });
});





export const updateItemCount = asyncHandler(async (req, res) => {
  const { user_id, productId, quantity } = req.body;
  let cart = await Cart.findOne({ user_id });
  if (!cart) throw new ApiError(404, "Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }
  }

  if (cart.items.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
    return res
      .status(200)
      .json({ success: true, message: "Cart cleared as count reached zero" });
  }

  await cart.save();
  res.status(200).json({ success: true, data: cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { user_id, productId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user_id },
    { $pull: { items: { productId } } },
    { new: true },
  );

  if (cart && cart.items.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
    return res
      .status(200)
      .json({ success: true, message: "Cart deleted (empty)" });
  }

  res.status(200).json({ success: true, data: cart });
});
