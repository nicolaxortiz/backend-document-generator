const bcrypt = require("bcrypt");

const encryptPass = async (pass) => {
  try {
    const hash = await bcrypt.hash(pass, 10);
    return hash;
  } catch (error) {
    console.log("Error encriptando la contraseña:", error);
    throw error;
  }
};

module.exports = encryptPass;
