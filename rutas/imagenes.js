var expres = require('express')
var app = expres();
const path = require('path');
const fs = require('fs');

//  rutas
app.get('/:tipo/:img', (req, res, next) => {
    var img = req.params.img;
    var tipo = req.params.tipo;

    var pathimagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`)
    if (fs.existsSync(pathimagen)) {
        res.sendFile(pathimagen);
    } else {

        var pathnoimagen = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathnoimagen);
    }
});


module.exports = app;