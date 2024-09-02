const express = require('express');
const usuariosController = require('../controllers/reclamosController.js');
const router = express.Router();
router.get("/ObtenerReclamos/:idUsuario", usuariosController.reclamos);
router.get("/ObtenerTodosReclamos", usuariosController.todosReclamos);
router.post("/crearReclamo", usuariosController.crearReclamo);
router.put("/cancelarReclamo/:idReclamo", usuariosController.cancelarReclamo);
module.exports = router;