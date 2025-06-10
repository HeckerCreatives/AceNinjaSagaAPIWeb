const Payin = require("../models/Payin");
const Transaction = require("../models/Transaction")



exports.gettotalsales = async (req, res) => {
    const transactiondata = await Transaction.aggregate([
        {
            $match: {
                status: "completed"
            }
        },
        {
            $unwind: "$items"
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$items.price" },
                totalTransactions: { $sum: 1 }
            }
        }
    ]);

    const finaldata = {};

    finaldata.websales = transactiondata[0] ? transactiondata[0].totalSales : 0;

    const payinsales = await Payin.aggregate([
        {
            $match: {
                status: "done",
                currency: "topupcredit"
            }
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$value" },
                totalTransactions: { $sum: 1 }
            }
        }
    ]);

    finaldata.payinsales = payinsales[0] ? payinsales[0].totalSales : 0;

    finaldata.totalsales = finaldata.websales + finaldata.payinsales;

    res.status(200).json({
        success: true,
        data: finaldata
    });
}