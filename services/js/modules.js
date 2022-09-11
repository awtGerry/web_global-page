const con = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {promisify} = require("util");

/******* USUARIOS *******/
exports.login = async (req, res) => {
  const {
    v_email,
    v_password,
  } = req.body;

  con.query(`SELECT * FROM usuarios WHERE email = '${v_email}' AND pass = '${v_password}'`,
    async (err, results) => {
      if (err) throw err;
      console.log(results);
      if (results.length > 0) {
        if(v_email === 'admin@ceti.mx' && v_password === 'admin') {
          res.redirect("/admin");
        } else {
          const token = jwt.sign({ id: results[0].id }, process.env.JWT_TKN, {
            expiresIn: process.env.JWT_EXPIRE_DAY
          });

          const cookieOptions = {
            expiresIn: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
          }
          res.cookie('userSave', token, cookieOptions);
          res.status(200).redirect("/user");
        }
      }
    })
} // login

exports.logout = (req, res) => {
    res.cookie('userSave', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).redirect("/");
} // logout

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.userSave) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.userSave,
        process.env.JWT_TKN
      );
      console.log(decoded);

      con.query('SELECT * FROM usuarios WHERE id = ?', [decoded.id], (err, results) => {
        console.log(results);
        if (!results) {
            return next();
        }
        req.user = results[0];
        return next();
      });
    } catch (err) {
      console.log(err)
      return next();
    }
  } else {
    next();
  }
}

exports.signup = (req, res) => {
  console.log(req.body);
  const {
    uname,
    email,
    password,
  } = req.body;

  con.query('INSERT INTO usuarios SET ?',
            {nombre_usuario : uname, email : email, pass : password},
            (err, results) => {
              if (err) throw err;
              res.redirect("/signup");
            })
} // signup


/******* PRODUCTOS *******/

/******* JUST ADMIN *******/
exports.add = (req, res) => {
  console.log(req.body);
  const {
    v_product,
    v_price,
    v_image,
  } = req.body;

  con.query(
    `INSERT INTO productos (nombre, precio, imagen) VALUES (LOWER('${v_product}'), '${v_price}', '${v_image}')`,
    (err, results) => {
      if (err) throw err;
      console.log(results);
      res.redirect("/admin_edit");
  })
}

exports.delete = (req, res) => {
  console.log(req.body);
  const { v_product, } = req.body;
  con.query(`DELETE FROM productos WHERE productos.nombre = LOWER('${v_product}')`, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.redirect("/admin_edit");
  })
}

/******* VISTA PRODUCTOS *******/

var container = ''
exports.showProducts = (req, res) => {
  con.query('SELECT * FROM productos', (err, results) => {
    if (err) throw err;
    container = '';
    let v_product, v_price, v_image;
    for (var i=0; i<results.length; i++) {
      v_product = results[i].nombre;
      v_price = results[i].precio;
      v_image = results[i].imagen;
      container += `
        <div class="products products-f">
          <img src="${v_image}">
          <h3>${v_product.charAt(0).toUpperCase() + v_product.slice(1)}</h3>
          <p>$${v_price}</p>
          <button class="cart-button">
            <span class="add-to-cart" data-image="${v_image}" data-name="${v_product}" data-price="${v_price}">Añadir al Carrito</span>
            <span class="added">Añadido</span>
            <i class="uil uil-shopping-cart"></i>
            <i class="uil uil-gift"></i>
          </button>
        </div>`
      container += '\n';
    }
  })
  var htmlFile = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="styles/style.css"/>

    <title>Todo perros - Productos</title>
  </head>
  <body>

    <header class="header">
      <nav class="flex flex-juscont-space flex-al-items">

        <!-- logo -->
        <a href="/user" class="header__logo"><img src="../../images/jack.png"></a>

        <!-- menu -->
        <div class="header__menu">
          <a href="/user">Inicio</a>
          <a href="#">Productos</a>
        </div>

        <!-- log in & sign in -->
        <div class="header__log-sign">
          <a id="cart" class="button button__cart"><i class="uil uil-shopping-cart"></i></a>
          <a href="/val/logout" class="button">Cerrar sesion</a>
        </div>
      </nav>
    </header>
    <div class="shopping shopping__display">
      <!-- CARRITO -->
      <div class="cart__container">
        <form>
          <div class="shopping-cart">
            <div class="shopping-cart-header">
              <i class="uil uil-shopping-cart"></i>

              <span class="total-count contador">0</span>
              <div class="shopping-cart-total">
                <span>Total: $</span>
                <span class="total-cart price-color">0</span>
              </div>

            </div> <!-- shopping-cart-header -->

            <ul class="shopping-cart-items">
            </ul>

            <!-- <a class="button">Pedir ahora</a> -->
            <div class="button__shopping">
                <a class="emptyCart button__shopping-btnClean"> <i class="uil uil-trash-alt" alt=""></i> Vaciar carrito</a>
                <input type="submit" class="button button__shopping-btnBuy" value="Comprar ahora" formaction="/buy" id="send_msg">
            </div>

          </div> <!-- shopping-cart -->
        </form>
      </div> <!-- cart__container -->

      <!-- PRODUCTOS -->
      ` + container + `

    </div> <!-- shopping -->

    <div class="notification" id="notification">
      <img src="./images/info-circle.svg">
      Su pedido fue realizado, checar email
    </div>

  </body>
  <script src="styles/js/shopping.js"></script>
  <script src="styles/js/notification.js"></script>
  </html>`

  return htmlFile;
}
