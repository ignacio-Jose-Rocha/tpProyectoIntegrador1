const express = require('express');
const oficinasController = require('../controllers/oficinasController.js');
const router = express.Router();
router.get("/ObtenerOficinas", oficinasController.getAllOficinas);
router.get("/obtenerOficina/:idOficinas", oficinasController.getOficinasById);
module.exports = router;