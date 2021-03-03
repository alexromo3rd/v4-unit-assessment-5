const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db');
    const { username, password } = req.body;
    const profile_pic = `https://robohash.org/${username}.png`;

    const foundUser = await db.user.find_user_by_username({ username });
    if (foundUser[0]) {
      return res.status(200).send('User already exists');
    }
    let salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = await db.user.create_user({ username, hash, profile_pic });
    req.session.user = newUser[0];
    return res.status(201).send(req.session.user);
  },
  login: async (req, res) => {
    const db = req.app.get('db');
    const { username, password } = req.body;

    const existingUser = await db.user.find_user_by_username({ username });
    if (!existingUser[0]) {
      return res.status(404).send('User not found');
    }

    const isAuthenticated = bcrypt.compareSync(
      password,
      existingUser[0].password
    );
    if (!isAuthenticated) {
      return res.status(401).send('Password is incorrect');
    }

    delete existingUser[0].password;

    req.session.user = existingUser[0];
    return res.status(202).send(req.session.user);
  },
  logout: async (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  },
  getUser: async (req, res) => {
    if (req.session.user) {
      return res.status(200).send(req.session.user);
    } else {
      return res.status(404).send('Please log in');
    }
  },
};
