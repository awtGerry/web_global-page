const express = require("express");
const router = express.Router();

const validate = require("./modules.js");

router.post('/login', validate.login);
router.post('/signup', validate.signup);
router.get('/logout', validate.logout);

// products
router.post('/delete', validate.delete);
router.post('/add', validate.add);

module.exports = router;
