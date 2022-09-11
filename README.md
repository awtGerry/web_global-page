# Pagina web 💘
Usando mysql, con nodejs ~ base javascript base html & scss para crear la pagina **TODO PERROS**

## DATA BASE
```sql
create table usuarios (
  id int not null auto_increment,
  nombre_usuario varchar (20) default null,
  email varchar (100) default null,
  pass varchar (50) default null,
  primary key (id)
);

create table productos (
  id int not null auto_increment,
  nombre varchar (100) default null,
  precio float default null,
  imagen longblob default null,
  primary key (id)
);

/* TESTING */
create table pedido (
  id int not null auto_increment,
  usuarios_id int default null,
  fecha date,
  primary key (id)
);
create table pedido_detalle (
  id int not null auto_increment,
  pedido_id int default null,
  productos_id int default null,
  precio_producto double default null,
  primary key (id)
);
select * from pedido;

select nvl(max(id),1) + 1  vId from pedido
select nvl(max(id),1) from pedido_detalle

select p.id, p.fecha, pr.nombre as producto, pd.precio_producto, u.nombre_usuario, u.email
from pedido p, pedido_detalle pd, productos pr, usuarios u
where p.id = pd.pedido_id
and u.id = p.usuarios_id
and pr.id = pd.productos_id

select  sum(pd.precio_producto) as importe
from pedido p, pedido_detalle pd, productos pr, usuarios u
where p.id = pd.pedido_id
and u.id = p.usuarios_id
and pr.id = pd.productos_id
```

## Conexion a nodejs
Se encontran en [app](services/app.js) y la conexion a la base de datos desde express en
[mysql2](services/db.js) el resto de conexiones es entre archivos html y customizaciones tanto de
javascript como de css (dentro de [pages](pages)).
