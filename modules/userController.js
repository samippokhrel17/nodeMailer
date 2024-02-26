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

    let emailCheckQuery = sqlString.format(
      `select count(*) as count from UserDb.user Where email = ? `,
      [email]
    );

    let emailCheckResult = await executeQuery(emailCheckQuery);

    if (emailCheckResult[0].count > 0) {
      return res.status(400).json("email already exist");
    }
    let phoneNumberCheckQuery = sqlString.format(
      `select count(*) as count from UserDb.user Where phoneNumber = ? `,
      [phoneNumber]
    );

    let phoneNumberCheckResult = await executeQuery(phoneNumberCheckQuery);

    if (phoneNumberCheckResult[0].count > 0) {
      return res.status(400).json("Phone Number already exist");
    }
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json("Email and password are required");

    let emailCheckQuery = sqlString.format(
      `SELECT * FROM UserDb.user WHERE email = ?`,
      [email]
    );

    let user = await executeQuery(emailCheckQuery);

    if (user.length === 0) {
      return res.status(404).json("User not found");
    }

    const hashedPassword = user[0].password;

    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json("Invalid password");
    }

    // User authenticated, generate JWT token
    const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      mobileNumber: user[0].phoneNumber,
      email: user[0].email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { registerUser, login };
