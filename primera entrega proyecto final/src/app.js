const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars').create;

const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
app.engine('.handlebars', exphbs({ extname: '.handlebars' }).engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const productsRouter = require('./rutas/products');
const cartsRouter = require('./rutas/carts');
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Escucha eventos desde el cliente
  socket.on('productoNuevo', () => {
    // Actualiza la lista de productos y emite a todos los clientes conectados
    io.emit('actualizarProductos', productManager.getAllProducts());
  });

  socket.on('productoEliminado', () => {
    // Actualiza la lista de productos y emite a todos los clientes conectados
    io.emit('actualizarProductos', productManager.getAllProducts());
  });

  // Maneja la desconexión del usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor Express iniciado en http://localhost:${PORT}`);
});
