const bcrypt = require("bcrypt");

const compare = async (pass, hash) => {
  try {
    const result = await bcrypt.compare(pass, hash);
    return result;
  } catch (error) {
    console.log("Error comparando las contraseñas:", error);
    throw error;
  }
};

module.exports = compare;
