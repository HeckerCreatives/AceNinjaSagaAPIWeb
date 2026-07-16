const mongoose = require("mongoose");

const PurchaseReceiptSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    packageName: { type: String, required: true },
    productType: { type: String, required: true, enum: ["inapp", "subs"] },

    productId: { type: String },
    purchaseToken: { type: String, required: true, unique: true, index: true },

    google: { type: Object, default: {} },

    status: {
      type: String,
      required: true,
      enum: ["received", "verified", "granted", "rejected"],
      default: "received",
      index: true,
    },

    grant: {
      type: Object,
      default: null,
    },

    lastError: { type: String, default: "" },
  },
  { timestamps: true }
);

const PurchaseReceipt = mongoose.model("PurchaseReceipt", PurchaseReceiptSchema);

module.exports = PurchaseReceipt;
