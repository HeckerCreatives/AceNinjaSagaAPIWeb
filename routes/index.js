const routers = app => {
    console.log("Routers are all available");

    app.use("/announcement", require("./announcement"))
    app.use("/skills", require("./skills"))
    app.use("/auth", require("./auth"))
    app.use("/battlepass", require("./battlepass"))
    app.use("/character", require("./character"))
    app.use("/friends", require("./friends"))
    app.use("/maintenance", require("./maintenance"))
    app.use("/marketplace", require("./marketplace"))
    app.use("/news", require("./news"))
    app.use("/newsletter", require("./newsletter"))
    app.use("/patchnote", require("./patchnote"))
    app.use("/payin", require("./payin"))
    app.use("/ranking", require("./ranking"))
    app.use("/redeemcode", require("./redeemcode"))
    app.use("/rewards", require("./rewards"))
    app.use("/skills", require("./skills"))
    app.use("/sociallinks", require("./sociallinks"))
    app.use("/subscription", require("./subscription"))
    app.use("/user", require("./user"))
    app.use("/transaction", require("./transaction"))
    app.use("/uploads", require('./picture'));
    app.use("/downloadlinks", require('./downloadlinks'));
    app.use("/seasons", require('./seasons'));
    app.use("/pvp", require('./pvp'));
    app.use("/ranktier", require('./ranktier'));

}

module.exports = routers