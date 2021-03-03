const bcrypt = require('bcryptjs');

module.exports = {
  create_user: async (req, res) => {
    const db = req.app.get('db');

    await db.create_user();
  },
};
