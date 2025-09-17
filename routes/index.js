const routers = app => {
    console.log("Routers are all available");

    app.use("/analytics", require("./analytics"))
    app.use("/announcement", require("./announcement"))
    app.use("/auth", require("./auth"))
    app.use("/badge", require("./badge"))
    app.use("/battlepass", require("./battlepass"))
    app.use("/character", require("./character"))
    app.use("/chapter", require("./chapter"))
    app.use("/companion", require("./companion"))
    app.use("/contactus", require("./contactus"))
    app.use("/dashboard", require('./dashboard'));
    app.use("/downloadlinks", require('./downloadlinks'));
    app.use("/friends", require("./friends"))
    app.use("/maintenance", require("./maintenance"))
    app.use("/marketplace", require("./marketplace"))
    app.use("/news", require("./news"))
    app.use("/newsletter", require("./newsletter"))
    app.use("/patchnote", require("./patchnote"))
    app.use("/patchnotefilemanager", require("./patchnotefilemanager"))
    app.use("/payin", require("./payin"))
    app.use("/pvp", require('./pvp'));
    app.use("/quest", require('./quest'));
    app.use("/raidboss", require("./raidboss"))
    app.use("/ranking", require("./ranking"))
    app.use("/rankreward", require("./rankreward"))
    app.use("/chest", require("./chest"))
    app.use("/ranktier", require('./ranktier'));
    app.use("/redeemcode", require("./redeemcode"))
    app.use("/reset", require("./reset"))
    app.use("/rewards", require("./rewards"))
    app.use("/seasons", require('./seasons'));
    app.use("/skills", require("./skills"))
    app.use("/sociallinks", require("./sociallinks"))
    app.use("/subscription", require("./subscription"))
    app.use("/title", require("./title"))
    app.use("/transaction", require("./transaction"))
    app.use("/uploads", require('./picture'));
    app.use("/user", require("./user"))
    app.use("/version", require("./version"))

}

module.exports = routers