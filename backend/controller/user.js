const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const { sendToken } = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const {
  createShopSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,


} = require("../validators/userValidator");
const {
  sendResetTokenByEmail,
  generateResetToken,
  validateResetToken

} = require('../services/auth.service');
const Shop = require("../model/shop");
const bcrypt = require("bcrypt");


// create user
router.post("/create-user", async (req, res, next) => {
  try {
    const { error } = createShopSchema.validate(req.body);
    if (error) {
      throw new ErrorHandler(error.details[0].message, 400);
    }
    const { name, email, password, avatar } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `https://medical-e-app.vercel.app/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate Your Account",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center;">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARIAAABGCAYAAAAAXxt2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzA4MTI2MjRGOENCMTFFQjhEQzVBQUE0RTAwRkFBMzAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzA4MTI2MjVGOENCMTFFQjhEQzVBQUE0RTAwRkFBMzAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDgxMjYyMkY4Q0IxMUVCOERDNUFBQTRFMDBGQUEzMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMDgxMjYyM0Y4Q0IxMUVCOERDNUFBQTRFMDBGQUEzMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpJDoS8AABakSURBVHja7F19dFXV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" alt="Company Logo" style="width: 150px; margin-bottom: 20px;">
            </div>
            <h2 style="text-align: center; color: #007BFF;">Activate Your Account</h2>
            <p>Hello ${user.name},</p>
            <p>Thank you for registering with us! To complete your registration and activate your account, please click the button below:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${activationUrl}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                Activate Account
              </a>
            </div>
            <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
            <p><a href="${activationUrl}" style="color: #007BFF;">${activationUrl}</a></p>
            <p>Best regards,</p>
            <p>The [Your Company Name] Team</p>
            <hr />
            <p style="font-size: 12px; color: #999;">If you did not sign up for an account, please ignore this email.</p>
          </div>
        `,
      });      

      // Include user data in the response
      res.status(201).json({
        success: true,
        message: `Please check your email (${user.email}) to activate your account!`,
        user: user, // Include user data here
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Checks Email
router.post('/check-email', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }); // Adjust based on your DB
  if (user) {
    return res.json({ exists: true });
  }
  return res.json({ exists: false });
});


// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "30m",
  });
};


// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      // Include user data in the response
      res.status(201).json({
        success: true,
        message: "User activated successfully",
        user: user, // Include user data here
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        throw new ErrorHandler(error.details[0].message, 400);
      }
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Incorrect email or password", 400));
      }

      // Send token only
      sendToken(user, 200, res); // Assuming 200 is the status code for success
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.post('/forgot-password', catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.details[0].message,
        message: "Password reset email failed",
      });
    }

    const { email } = value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Generate a reset token and save its hash in the user document
    const { token, hash } = await generateResetToken();
    user.resetToken = token;
    user.resetTokenHash = hash;
    user.resetTokenExpiry = Date.now() + 3600000; // Token expiry time (1 hour)
    await user.save();

    // Send the reset token via email
    await sendResetTokenByEmail(user.email, token);

    res.status(200).json({
      success: true,
      data: { email: user.email },
      message: "Password reset email sent",
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }

})
);

// Reset-Password
router.put('/reset-password', catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.details[0].message,
        message: "Password reset failed",
      });
    }

    const { email, resetToken, newPassword } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Validate the reset token
    if (!validateResetToken(user.resetTokenHash, resetToken)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired reset token" });
    }

    // Reset the user's password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 is the number of salt rounds
    user.password = hashedPassword;
    user.resetToken = null; // Clear the reset token after use
    user.resetTokenHash = null; // Clear the reset token hash after use
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      data: { email: user.email },
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }

})
);





// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user


router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// router.get(
//   "/logout",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       // Instruct the client to remove the token on the front-end side
//       res.status(201).json({
//         success: true,
//         message: "Log out successful!",
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );


// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== "") {
        const imageId = existsUser.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });

        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findByIdAndDelete(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




module.exports = router;