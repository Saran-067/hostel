// generate-jwt-key.js
const crypto = require("crypto");

const jwtSecret = crypto.randomBytes(64).toString("hex");
console.log("Your secure JWT secret key:");
console.log(jwtSecret);
