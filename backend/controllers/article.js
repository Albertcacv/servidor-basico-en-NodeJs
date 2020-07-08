'use strict';

let validator = require('validator');
let fs = require('fs');
let path = require('path');

let Article = require('../models/article');
const article = require('../models/article');

let controller = {
    datosCurso: (req, res) => {
        console.log('Hola mundo');

        return res.status(200).send({
            curso: 'Master en frameworks',
            author: 'Alberto'
        });
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        //Recoger los parametros por POST
        let params = req.body;

        //validar datos(validator)
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            //Crear el objeto a guardar
            var article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }

                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
        } else {
            return res.status(400).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }
    },

    getArticles: (req, res) => {
        let query = Article.find({});
        let last = req.params.last;

        if (last && last != undefined) {
            query.limit(5);
        }
        //Find
        Article.find({})
            .sort('-id')
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al devolver los articulos'
                    });
                }
                if (!articles) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos para mostrar'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });
    },
    getArticle: (req, res) => {
        //Recoger el id de la url
        let articleId = req.params.id;
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }
        //Buscar el articulo
        Article.findById(articleId, (err, article) => {
            //Comprobar que existe
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }
            //Devolver el json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    update: (req, res) => {
        //Recoger el id del articulo de la ulr
        let articleId = req.params.id;

        //REcoger los datos que llegan por put
        let params = req.body;

        //Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            //hacer la consulta y actualizar
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        } else {
            return res.status(500).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }
    },

    delete: (req, res) => {
        //Recoger el id de la url
        let articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar el articulo'
                });
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha podido borrar el articulo, articulo inexistente'
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },

    upload: (req, res) => {
        //Recoger el fichero de la peticion
        let filename = 'imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: 'filename'
            });
        }
        //Conseguir el nombre y la extension del archivo
        let file_path = req.files.file0.path;
        let file_split = file_path.split('\\');

        //Nombre del archivo
        let file_name = file_split[2];

        //Extension del archivo
        let extension_split = file_name.split('.');
        let file_extension = extension_split[1];

        //Comprobar la extension(solo imagenes)
        if (file_extension != 'png' && file_extension != 'jpg' && file_extension != 'gif') {
            //Borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                });
            });
        } else {
            //Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            let articleId = req.params.id;
            Article.findOneAndUpdate({ _id: articleId }, { image: filename }, { new: true },
                (err, articleUpdated) => {
                    if (err || !articleUpdated) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al subir la imagen del archivo'
                        });
                    }
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                }
            );
        }
    },

    getImage: (req, res) => {
        let file = req.params.image;
        let path_file = './upload/articles/' + file;

        fs.exists(path_file, (exist) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(500).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res) => {
        //Sacar el strring a buscar
        let searchStr = req.params.search;
        //Find or
        Article.find({
                $or: [
                    { title: { $regex: searchStr, $options: 'i' } },
                    { content: { $regex: searchStr, $options: 'i' } }
                ]
            })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al buscar'
                    });
                }
                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos coincidentes con tu busqueda'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });
    }
}; // end controller

module.exports = controller;