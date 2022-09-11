const express = require("express");
const router = express.Router();
const val = require("./modules.js");
const con = require("../db.js");
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  res.sendFile("home.html", { root: './pages' })
});

router.get('/login', (req, res) => {
  res.sendFile("login.html", { root: './pages/' })
});

router.get('/signup', (req, res) => {
  res.sendFile("signup.html", { root: './pages/' })
});

router.get('/user', (req, res) => {
  res.sendFile("user_index.html", { root: './pages/user_pages' })
});

router.get('/info-user', (req, res) => {
  res.sendfile("user_info.html", { root: './pages/user_pages' })
});

router.get('/showProducts', (req, res) => {
  // res.sendFile("products.html", { root: './pages/' })
  res.send(val.showProducts());
});

router.get('/buy', val.isLoggedIn, async (req, res) => {
  var email = req.user.email
  let date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

  // testing
  const p_name = ['Cama para perro mediano','Carnaza para perro','Pelotas (3pz)'];
  const p_price = [400, 50, 65];

  let product = "";
  for (let i=0; i<3; i++) {
    product+=`\nProducto: ${p_name[i]} Precio:$ ${p_price[i]}`
  }

  var transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    post: 587,
    secure: false,
    auth: {
      user: 'kassandra.friesen@ethereal.email',
      pass: 'YQHdCADq2k6TXF8cDD'
    }
  });

  var mailOpt = {
    from: "todo_perros@web.com",
    to: email,
    subject: "Tu compra fue realizada con exito",
    text: product,
  }

  transporter.sendMail(mailOpt, (err, info) => {
    if (err) throw err;
    console.log('Email send');
    res.status(200).jsonp(req.body);
  });


  con.query(`
    INSERT INTO pedidos (nombre_producto, precio_producto, user_email, fecha) VALUE ('${p_name}', 400, '${email}', '${date}')`,
          (err, results) => {
            if (err) throw err;
            res.redirect("/showProducts");
          })
});

/* ADMIN */
router.get('/admin', (req, res) => {
  res.sendFile("admin_index.html", { root: './pages/admin_pages' })
});

router.get('/admin_edit', (req, res) => {
  res.sendFile("admin_edit.html", { root: './pages/admin_pages' })
});

router.get('/admin_status', (req, res) => {
  con.query('SELECT * FROM pedidos', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
  // res.sendFile("admin_status.html", { root: './pages/admin_pages' })
});

module.exports = router;
