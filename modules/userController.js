const { executeQuery } = require("../dbConnect");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const sqlString = require("sqlstring");
const registerUser = async (req, res) => {
  try {
    console.log("received registration request:", req.body);
    let { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber)
      return res.status(400).json("All field required");

    const salt = await bcrypt.genSalt(1);

    let hashpassword = await bcrypt.hash(password, salt);

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

    let result = await executeQuery(query);

    console.log("Database operation result:", result);

    if (result.affectedRows > 0) return res.status(200).send("Success");
    return res.status(200).send("successfully inserted");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { registerUser };
