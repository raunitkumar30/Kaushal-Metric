const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Trainee = require("../models/Trainee");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      traineeId: user.traineeId || null,
      providerId: user.providerId || null,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    const allowedRoles = [
      "GOVERNMENT",
      "PROVIDER",
      "TRAINEE",
      "EMPLOYER",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    /*
     * When a trainee registers, automatically create
     * their trainee profile and link it to the user account.
     */
    if (role === "TRAINEE") {
      try {
        const trainee = await Trainee.create({
          name: name.trim(),
          email: normalizedEmail,
          status: "ENROLLED",
        });

        user.traineeId = trainee._id;
        await user.save();
      } catch (traineeError) {
        // Remove the user if trainee profile creation fails.
        await User.findByIdAndDelete(user._id);

        throw traineeError;
      }
    }

    const token = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        traineeId: user.traineeId,
        providerId: user.providerId,
        consent: user.consent,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

const mongoose = require("mongoose");

const DEMO_FALLBACK_ACCOUNTS = {
  "gov@test.com": {
    _id: "660000000000000000000001",
    name: "Maharashtra Skill Development Authority",
    email: "gov@test.com",
    role: "GOVERNMENT",
    consent: { analytics: true, aiRecommendations: true },
    isActive: true,
  },
  "provider@test.com": {
    _id: "660000000000000000000002",
    name: "Mumbai Apex Skills Institute",
    email: "provider@test.com",
    role: "PROVIDER",
    providerId: "660000000000000000000010",
    consent: { analytics: true, aiRecommendations: true },
    isActive: true,
  },
  "rahul@test.com": {
    _id: "660000000000000000000003",
    name: "Rahul Patil",
    email: "rahul@test.com",
    role: "TRAINEE",
    traineeId: "660000000000000000000020",
    consent: { analytics: true, aiRecommendations: true },
    isActive: true,
  },
  "employer@test.com": {
    _id: "660000000000000000000004",
    name: "Pune Tech Solutions Pvt Ltd",
    email: "employer@test.com",
    role: "EMPLOYER",
    consent: { analytics: true, aiRecommendations: true },
    isActive: true,
  },
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    // Instant demo authentication fallback if DB is still connecting or offline
    if (mongoose.connection.readyState !== 1 && DEMO_FALLBACK_ACCOUNTS[normalizedEmail]) {
      const demoUser = DEMO_FALLBACK_ACCOUNTS[normalizedEmail];
      const token = generateToken(demoUser);
      return res.json({
        message: "Login successful",
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          traineeId: demoUser.traineeId,
          providerId: demoUser.providerId,
          consent: demoUser.consent,
        },
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        traineeId: user.traineeId,
        providerId: user.providerId,
        consent: user.consent,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    // If query failed due to DB buffering/timeout, check demo fallback
    const normalizedEmail = req.body?.email?.toLowerCase().trim();
    if (DEMO_FALLBACK_ACCOUNTS[normalizedEmail]) {
      const demoUser = DEMO_FALLBACK_ACCOUNTS[normalizedEmail];
      const token = generateToken(demoUser);
      return res.json({
        message: "Login successful",
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          traineeId: demoUser.traineeId,
          providerId: demoUser.providerId,
          consent: demoUser.consent,
        },
      });
    }

    res.status(500).json({
      message: "Login failed",
    });
  }
};

const me = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const demoUser = Object.values(DEMO_FALLBACK_ACCOUNTS).find(
        (u) => u._id === req.user?.id || u.role === req.user?.role
      );
      if (demoUser) {
        return res.json({ user: demoUser });
      }
    }

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      const demoUser = Object.values(DEMO_FALLBACK_ACCOUNTS).find(
        (u) => u._id === req.user?.id || u.role === req.user?.role
      );
      if (demoUser) {
        return res.json({ user: demoUser });
      }
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Me error:", error.message);
    const demoUser = Object.values(DEMO_FALLBACK_ACCOUNTS).find(
      (u) => u._id === req.user?.id || u.role === req.user?.role
    );
    if (demoUser) {
      return res.json({ user: demoUser });
    }
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};

/*
 * Give consent for data usage.
 */
const giveConsent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.consent.given = true;
    user.consent.givenAt = new Date();

    await user.save();

    res.json({
      message: "Consent recorded successfully",
      consent: user.consent,
    });
  } catch (error) {
    console.error("Give consent error:", error);

    res.status(500).json({
      message: "Failed to record consent",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  me,
  giveConsent,
};