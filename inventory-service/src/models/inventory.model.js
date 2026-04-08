import mongoose from "mongoose";
const inventorySchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: { updatedAt: "updated_at", createdAt: false } },
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
