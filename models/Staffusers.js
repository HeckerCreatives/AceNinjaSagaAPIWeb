const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const StaffUsersSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            index: true // Automatically creates an index on 'amount'
        },
        password: {
            type: String
        },
        webtoken: {
            type: String
        },
        status: {
            type: String,
            default: "active",
            index: true // Automatically creates an index on 'amount'
        },
        auth: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

StaffUsersSchema.pre("save", async function (next) {
    // Only (re)hash when the password actually changed, otherwise every save
    // would double-hash and break login. `isModified` is a method — it must be
    // called with the field name.
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10)
    return next();
})

StaffUsersSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const Staffusers = mongoose.model("Staffusers", StaffUsersSchema)
module.exports = Staffusers