// One-off script to create or promote an admin user.
// Usage: npm run db:createadmin -- <email> <password> [name] [phoneNumber]
// Or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME / ADMIN_PHONE in config/config.env

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const connectDatabase = require("../config/database");
const User = require("../models/user");

const [, , argEmail, argPassword, argName, argPhone] = process.argv;

const email = argEmail || process.env.ADMIN_EMAIL;
const password = argPassword || process.env.ADMIN_PASSWORD;
const name = argName || process.env.ADMIN_NAME || "Admin";
const phoneNumber = argPhone || process.env.ADMIN_PHONE || "9999999999";

const run = async () => {
  if (!email || !password) {
    console.error(
      "Usage: npm run db:createadmin -- <email> <password> [name] [phoneNumber]\n" +
        "(or set ADMIN_EMAIL / ADMIN_PASSWORD in config/config.env)"
    );
    process.exit(1);
  }

  await connectDatabase();

  let user = await User.findOne({ email });

  if (user) {
    user.role = "admin";
    await user.save({ validateBeforeSave: false });
    console.log(`Existing user ${email} promoted to admin.`);
  } else {
    user = await User.create({
      name,
      email,
      password,
      passwordConfirm: password,
      phoneNumber,
      role: "admin",
    });
    console.log(`Admin user ${email} created.`);
  }

  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
