var expres = require('express')
var app = expres();


//  rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente'
    });
});


module.exports = app;