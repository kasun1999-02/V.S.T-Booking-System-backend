const router = require("express").Router();
const User = require("../models/user");

// Register a User
router.route("/user/register").post((req, res) => {
  const { email, password, role } = req.body; 

  if (!role) {
    return res.status(400).json({ success: false, error: "Role is required." });
  }

  const newUser = new User({
    email,
    password,
    role: role === "admin" ? "admin": "user"
  });

  newUser.save()
    .then(() => {
      res.status(201).json({ success: true, user: newUser });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: "Failed to register User" });
    });
});

// Login a User
router.route("/user/login").post((req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ success: false, error: "Invalid credentials." });
      }

      // Check if the provided password matches the stored password
      if (user.password !== password) {
        return res.status(400).json({ success: false, error: "Invalid credentials." });
      }

      res.status(200).json({
        success: true,
        message: "Login successful!",
        role: user.role, // Include the user's role in response
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: "Server error" });
    });
});

module.exports = router;
