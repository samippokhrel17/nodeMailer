const { executeQuery } = require("../dbConnect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlString = require("sqlstring");

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  try {
    console.log("received registration request:", req.body);
    let { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!firstName || !lastName || !email || !password || !phoneNumber)
      return res.status(400).json("All fields are required");

    let emailCheckQuery = sqlString.format(
      `SELECT count(*) AS count FROM UserDb.user WHERE email = ?`,
      [email]
    );

    let emailCheckResult = await executeQuery(emailCheckQuery);

    if (emailCheckResult[0].count > 0) {
      return res.status(400).json("Email already exists");
    }

    let phoneNumberCheckQuery = sqlString.format(
      `SELECT count(*) AS count FROM UserDb.user WHERE phoneNumber = ?`,
      [phoneNumber]
    );

    let phoneNumberCheckResult = await executeQuery(phoneNumberCheckQuery);

    if (phoneNumberCheckResult[0].count > 0) {
      return res.status(400).json("Phone number already exists");
    }

    const salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);

    // Insert user data into database
    let insertObject = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashpassword,
      phoneNumber: phoneNumber,
    };

    let query = sqlString.format(`INSERT INTO UserDb.user SET ?`, [
      insertObject,
    ]);

    let result = await executeQuery(query);

    console.log("Database operation result:", result);

    if (result.affectedRows > 0) return res.status(200).send("Success");
    return res.status(200).send("Successfully inserted");
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

    // User authenticated, generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user[0].id);

    return res.status(200).json({
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      mobileNumber: user[0].phoneNumber,
      email: user[0].email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// const createBlog = async (req, res) => {
//   try {
//     const { title, content } = req.body;

//     // let AuthToken = req.rawHeaders[1];

//     // jwt decode

//     // fetch infotmation

//     // datbase sanga data info xa ki xaina vanera check garna paryo

//     //xa vane ok vannne xaina vane vayena vanerta message phatauna paryo

//     //xa vane create garna janneeeeeee
//     // const userId = req.user.id;

//     if (!title || !content)
//       return res.status(400).json("title and content are required");

//     let insertObject = {
//       title: title,
//       content: content,
//     };
//     let query = sqlString.format(`INSERT INTO UserDb.blog SET ?`, [
//       insertObject,
//     ]);

//     let result = await executeQuery(query);

//     console.log("database operation result:", result);

//     if (result.affectedRows > 0)
//       return res.status(200).send("Blog created successfully");
//     return res.status(200).send("Successfully inserted");
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json(error);
//   }
// };

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    // user authentication using jwt token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json("Authentication required");
    }
    //user id from jwt token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    if (!title || !content) {
      return res.status(400).json("Title and content are required");
    }

    let insertObject = {
      title: title,
      content: content,
      userId: userId,
    };
    let query = sqlString.format(`INSERT INTO UserDb.blog SET ?`, [
      insertObject,
    ]);

    let result = await executeQuery(query);

    console.log("Database operation result:", result);

    if (result.affectedRows > 0) {
      return res.status(200).send("Blog created successfully");
    }
    return res.status(500).send("Failed to create blog");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { registerUser, login, createBlog };
