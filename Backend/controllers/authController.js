const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Email = require("../utils/email");

// Register the user
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, phoneNumber } = req.body;

    if (!name || !email || !password || !passwordConfirm || !phoneNumber) {
      return next(new ErrorHandler("Please fill all required fields", 400));
    }

    if (password !== passwordConfirm) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    if (password.length < 6) {

    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email already registered", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      phoneNumber,
    });

    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Protect Route
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new ErrorHandler(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new ErrorHandler("User no longer exists. Please login again.", 401),
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new ErrorHandler(
          "User recently changed password! Please log in again.",
          401,
        ),
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Update Password
exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, newPasswordConfirm } = req.body;

    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      return next(new ErrorHandler("Please fill all fields", 400));
    }

    if (newPassword !== newPasswordConfirm) {
      return next(new ErrorHandler("New passwords do not match", 400));
    }

    if (newPassword.length < 6) {
      return next(new ErrorHandler("Password must be at least 6 characters", 400));
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isMatched = await user.correctPassword(oldPassword, user.password);

    if (!isMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;

    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Please provide your email", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("There is no user with that email", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${process.env.FRONTEND_URL}/users/resetPassword/${resetToken}`;
      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new ErrorHandler(
          "There was an error sending the email. Try again later.",
          500,
        ),
      );
    }
  } catch (err) {
    next(err);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { password, passwordConfirm } = req.body;

    if (!password || !passwordConfirm) {
      return next(new ErrorHandler("Please provide new password and confirmation", 400));
    }

    if (password !== passwordConfirm) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler("Token is invalid or has expired", 400));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    res.cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
