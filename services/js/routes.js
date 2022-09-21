const express = require("express");
const router = express.Router();
const val = require("./modules.js");
const con = require("../db.js");
const nodemailer = require('nodemailer');

router.get('/', val.isLoggedIn, (req, res) => {
  if (req.user) {
    res.sendFile("user_index.html", { root: './pages/user_pages' })
  } else {
    res.sendFile("home.html", { root: './pages' })
  }
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

router.post('/buy', val.isLoggedIn, async (req, res) => {
  if (req.user) {
    const {
      productName,
      productPrice,
    } = req.body;
    let product = "";
    let total=0;
    for (var i=0; i<productName.length; i++) {
      total+=parseFloat(productPrice[i]);
      product+=`Nombre del producto: ${productName[i]}, Precio del producto: $ ${productPrice[i]}\n`;
    }
    let ticket = `Productos:\n${product}\n\nTotal= $ ${total}`;

    var email = req.user.email
    let date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

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
      text: ticket,
    }

    transporter.sendMail(mailOpt, (err, info) => {
      if (err) throw err;
      console.log('Email send');
      res.status(200).jsonp(req.body);
    });


    con.query(`
      INSERT INTO pedidos (nombre_producto, precio_producto, user_email, fecha) VALUE ('${productName}', ${total}, '${email}', '${date}')`,
            (err, results) => {
              if (err) throw err;
              res.redirect("/showProducts");
            })
  } else {
    res.sendFile("login.html", { root: './pages/' }) // Si no esta logeado pedir que se logee el usuario
  }
}); // buy

/* ADMIN */
router.get('/admin', (req, res) => {
  res.sendFile("admin_index.html", { root: './pages/admin_pages' })
});

router.get('/admin_edit', (req, res) => {
  res.sendFile("admin_edit.html", { root: './pages/admin_pages' })
});

router.get('/status', (req, res) => {
  res.send(val.status());
});

// router.get('/admin_status', (req, res) => {
//   con.query('SELECT * FROM pedidos', (err, results) => {
//     if (err) throw err;
//     res.send(results);
//   });
//   // res.sendFile("admin_status.html", { root: './pages/admin_pages' })
// });

module.exports = router;
