'use strict';

let express = require('express');
let articleController = require('../controllers/article');

let router = express.Router();

let multiparty = require('connect-multiparty');
const { route } = require('../app');
let md_upload = multiparty({ uploadDir: '/ulpoad/articles' });

//Rutas de prueba
router.get('/test-controller', articleController.test);
router.post('/datos-curso', articleController.datosCurso);

//Rutas utiles
router.post('/save', articleController.save);
router.get('/articles', articleController.getArticles);
router.get('/articles/:last?', articleController.getArticles);

router.get('/article/:id', articleController.getArticle);
router.put('/article/:id', articleController.update);

router.delete('/article/:id', articleController.delete);
router.post('/upload-image/:id', md_upload, articleController.upload);

router.get('/get-image/:image', articleController.getImage);
router.get('/search/:search', articleController.search);

module.exports = router;