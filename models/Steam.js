const mongoose = require("mongoose");

const SteamOrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    steamId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    itemDefId: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    credits: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "authorized", "completed", "failed", "canceled"],
      default: "pending",
      index: true,
    },

    steamTransId: { type: String, default: null },
    steamCurrency: { type: String, default: null },
    steamCountry: { type: String, default: null },

    characterId: { type: String, default: null },

    authTicketHex: { type: String, default: null },
    errorCode: { type: String, default: null },
    errorDesc: { type: String, default: null },

    finalizedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SteamOrder", SteamOrderSchema);
