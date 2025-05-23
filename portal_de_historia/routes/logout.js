const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/login');
});

module.exports = router;