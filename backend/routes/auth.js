const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

//Sign up
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User already exists!" });
    }

    const hashpassword = bcrypt.hashSync(password);
    const user = new User({
      email: email,
      username: username,
      password: hashpassword,
    });
    await user.save()
              .then(() => res.status(200).json({ message: "SignUp successfull" }));
  } catch (error) {
    return res.status(200).json({ message: "User already exists!" });
  }
});

//Sign In

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ message: "Please Sign Up first" });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(200).json({ message: "Icorrect Password!!" });
    }
    const { password, ...others } = user._doc; //password ke alawa baki sab dedo
    res.status(200).json({ others });
  } catch (error) {
    return res.status(200).json({ message: "password or email Incorrect!!" });
  }
});

module.exports = router;
