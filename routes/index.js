const routers = app => {
    console.log("Routers are all available");

    app.use("/announcement", require("./announcement"))
    app.use("/auth", require("./auth"))
    app.use("/character", require("./character"))
    app.use("/friends", require("./friends"))
    app.use("/maintenance", require("./maintenance"))
    app.use("/marketplace", require("./marketplace"))
    app.use("/news", require("./news"))
    app.use("/payin", require("./payin"))
    app.use("/ranking", require("./ranking"))
    app.use("/skills", require("./skills"))
    app.use("/sociallinks", require("./sociallinks"))
    app.use("/subscription", require("./subscription"))
    app.use("/user", require("./user"))
    app.use("/transaction", require("./transaction"))
}

module.exports = routers