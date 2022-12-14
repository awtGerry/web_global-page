const express = require("express");
const router = express.Router();

const validate = require("./modules.js");

router.post('/login', validate.login);
router.post('/signup', validate.signup);
router.get('/logout', validate.logout);

// products
router.post('/add', validate.add);
router.post('/edit', validate.edit);
router.post('/delete', validate.delete);
// router.post('/buy', validate.buy);

module.exports = router;
