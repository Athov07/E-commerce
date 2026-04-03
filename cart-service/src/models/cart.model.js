import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    // user_id can be a MongoDB ID for logged-in users or a UUID string for guests
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

export const Cart = mongoose.model("Cart", cartSchema);
