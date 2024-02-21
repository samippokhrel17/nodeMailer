const connection = require("./dbConnect");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        let { firstName, lastName, email, password, phoneNumber } = req.body; \
        
        if (!firstName || !lastName || !email || !password || !phoneNumber)
            return res.status(400).json("All field required")

        const salt = await bcrypt.genSalt(1);

        let hashpassword = await bcrypt.hash(password, salt)
        
        //to insert data into database creating an objects with user infotmation
        let insertObject = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashpassword,
            phoneNumber: phoneNumber,
        };

        let query = sqlString.format(`Insert into UserDb.user SET ?`, [
            insertObject,
        ]);

        let [result] = await connection.query(query);

    }
}

