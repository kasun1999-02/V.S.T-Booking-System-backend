const router = require("express").Router();
const User = require("../models/user");

// Register a User
router.route("/user/register").post((req, res) => {
  const { email, password, role } = req.body; 

  console.log('\n[DB WRITE] Attempting to register new user...');
  console.log('[DB WRITE] User data received:', { email, role });

  if (!role) {
    console.log('[DB WRITE] ✗ Validation failed: Role is required');
    return res.status(400).json({ success: false, error: "Role is required." });
  }

  const newUser = new User({
    email,
    password,
    role: role === "admin" ? "admin": "user"
  });

  console.log('[DB WRITE] Writing to database: Users collection');
  newUser.save()
    .then(() => {
      console.log('[DB WRITE] ✓ User registered successfully!');
      console.log('[DB WRITE] User ID:', newUser._id);
      console.log('[DB WRITE] User email:', newUser.email);
      console.log('[DB WRITE] User role:', newUser.role);
      console.log('[DB WRITE] Registered at:', new Date().toISOString());
      res.status(201).json({ success: true, user: newUser });
    })
    .catch((err) => {
      console.error('[DB WRITE] ✗ Error registering user:', err.message);
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
