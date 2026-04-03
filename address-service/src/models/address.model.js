import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address_line_1: {
      type: String,
      required: true,
    },
    address_line_2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pin_code: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Address = mongoose.model("Address", addressSchema);
