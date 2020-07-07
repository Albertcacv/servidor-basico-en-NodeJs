'use strict'

//Cargar modulos de node para crear el servidor
let express = require('express');
let bodyParser = require('body-parser');
const e = require('express');

//Ejecutar express(http)
let app = express();

//Cargar ficheros rutas

//MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//CORS

// añadir prefijos a las rutas

//ruta o metodo de prueba
app.get('/probando', (req, res) => {
    console.log('Hola mundo');

    return res.status(200).send({
        curso: 'Master en frameworks',
        author: 'Alberto'
    });
});
//exportar modulo(fichero actual)

module.exports = app;