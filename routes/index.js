const routers = app => {
    console.log("Routers are all available");

    app.use("/auth", require("./auth"))
    app.use("/character", require("./character"))
    app.use("/news", require("./news"))
    app.use("/announcement", require("./announcement"))
    app.use("/user", require("./user"))
    app.use("/transaction", require("./transaction"))
}

module.exports = routers