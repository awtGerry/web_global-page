/****** VER CARRITO ******/
const btnCarrito = document.querySelector('#cart');
const container = document.querySelector('.shopping-cart');

btnCarrito.addEventListener('click', function() {
  console.log('clicked');
  if (container.classList.contains('open')) {
    container.classList.remove('open');
  } else {
    container.classList.add('open');
  }
})

/****** ANIMACION ******/
const cartButtons = document.querySelectorAll('.cart-button');

cartButtons.forEach(button => {
  button.addEventListener('click', cartClick);
});

function cartClick() {
  let button = this;
  button.classList.add('clicked');
}


/****** AGREGAR AL CARRITO ******/
var shoppingCart = (function() {
  carrito = [];

  function Item(image, name, price, count) {
    this.image = image;
    this.name = name;
    this.price = price;
    this.count = count;
  }

  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(carrito));
  }

  function loadCart() {
    carrito = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }

  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }


  var obj = {};

  obj.addToCart = (image, name, price, count) => {
    for (var item in carrito) {
      if(carrito[item].name === name) {
        carrito[item].cont ++;
        saveCart();
        return;
      }
    }
    var item = new Item(image, name, price, count);
    carrito.push(item);
    saveCart();
  }

  obj.setContador = (name, count) => {
    for (var i in carrito) {
      if(carrito[i].name === name) {
        carrito[i].cont = count;
        break;
      }
    }
  }

  obj.getContador = () => {
    var total = 0;
    for (var item in carrito) {
      total+=carrito[item].count;
    }
    return total;
  }

  obj.getTotal = () => {
    var total = 0;
    for (var item in carrito) {
      total += carrito[item].price * carrito[item].count;
    }
    return Number(total.toFixed(2));
  }

  obj.limpiarCarrito = () => {
    carrito = [];
    saveCart();
  }

  obj.listCarrito = function() {
    var carritoTemp = [];
    for (i in carrito) {
      item = carrito[i];
      itemTemp = {};
      for (j in item) {
        itemTemp[j] = item[j];
      }
      itemTemp.total = Number(item.price * item.count).toFixed(2);
      carritoTemp.push(itemTemp)
    }
    return carritoTemp;
  }

  return obj;

})();

$('.add-to-cart').click(function(event) {
  event.preventDefault();
  var image = $(this).data('image');
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  shoppingCart.addToCart(image, name, price, 1);
  displayCart();
});

$('.emptyCart').click(function() {
  shoppingCart.limpiarCarrito();
  displayCart();
});

function displayCart() {
  var cartArray = shoppingCart.listCarrito();
  var ul = "";
  for(var i in cartArray) {
    ul += '<li class="clearfix">'
      +'<img src="' + cartArray[i].image + '" id="productImg'+ i + '"/>'
      +'<span class="item-name" id="productName' + i + '">' + cartArray[i].name + '</span>'
      +'<span class="item-price" id="productPrice'+ i + '">$ ' + cartArray[i].price + '</span>'
      +'</li>'
  }
  $('.shopping-cart-items').html(ul);
  $('.total-cart').html(shoppingCart.getTotal());
  $('.total-count').html(shoppingCart.getContador());
}

function getBuy() {
  let product = [];
  var cartArray = shoppingCart.listCarrito();
  for (var i in cartArray) {
    let productName = document.getElementById(`productName${i}`).innerText;
    let productPrice = document.getElementById(`productPrice${i}`).innerText;
    product[i] = {productName, productPrice};
  }
  console.log(product);
  return product;
}

displayCart();
