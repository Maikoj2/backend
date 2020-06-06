// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')



// Inicializar variables
var app = express();

// parse application/json
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rutas importadas

var appRoutes = require('./rutas/app');
var UsuarioRoutes = require('./rutas/usuario');
var loginRout = require('./rutas/login');
var HospitalRout = require('./rutas/hospital');
var medicoRout = require('./rutas/medico');
var BusquedaRout = require('./rutas/Busqueda');
var uploadRout = require('./rutas/upload');
var imgRout = require('./rutas/imagenes');

// coneccion bd
mongoose.connection.openUri('mongodb://localhost:27017/bernongshops', (err, res) => {
    if (err) throw err;
    console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
});



//rutas
app.use('/login', loginRout);
app.use('/Usuario', UsuarioRoutes);
app.use('/hospital', HospitalRout);
app.use('/medico', medicoRout);
app.use('/Busqueda', BusquedaRout);
app.use('/upload', uploadRout);
app.use('/img', imgRout);
app.use('/', appRoutes);


// escuchar peticiones


app.listen(3000, () => {
    console.log('Express  server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});