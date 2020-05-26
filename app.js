// Requires
var express = require('express');
var mongoose = require('mongoose')



// Inicializar variables
var app = express();
// coneccion bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
    if (err) throw err;
    console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//  rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    });
});


// escuchar peticiones


app.listen(3000, () => {
    console.log('Express  server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});