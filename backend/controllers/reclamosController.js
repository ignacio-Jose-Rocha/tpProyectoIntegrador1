const pool = require('../config.js');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: "ignacio.jose.pancho@outlook.com",
    pass: "Nro19975@gmail.com",
  },
  tls: {
    ciphers:'SSLv3'
  }
});

exports.reclamos = async (req, res) => {
    const { idUsuario } = req.params;
    try { 
      const [rows] = await pool.query('SELECT * FROM reclamos WHERE idUsuarioCreador = ?', [idUsuario]);
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los reclamos:', error);
      res.status(500).json({ error: 'Error al obtener los reclamos' });
    }
  }
  exports.todosReclamos = async (req, res) => {
    const { idUsuario } = req.params;
    try { 
      const [rows] = await pool.query('SELECT * FROM reclamos ', [idUsuario]);
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los reclamos:', error);
      res.status(500).json({ error: 'Error al obtener los reclamos' });
    }
  }
  exports.crearReclamo = async (req, res) => {
    const { idUsuarioCreador, asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioFinalizador } = req.body;
    try {
      
        const [rows] = await pool.query('INSERT INTO reclamos SET ?', { idUsuarioCreador, asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioFinalizador });
        res.json({ id: rows.insertId, idUsuarioCreador, asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioFinalizador });
    } catch (error) {
      console.error('Error al crear el reclamo:', error);
      res.status(500).json({ error: 'Error al crear el reclamo' });
    }
  };

  async function enviarCorreoCancelacion(idReclamo) {
    try {
      const [reclamo] = await pool.query('SELECT idUsuarioCreador FROM reclamos WHERE idReclamo = ?', [idReclamo]);
      if (reclamo.length === 0) {
        console.error('Reclamo no encontrado');
        return;
      }
      const idUsuarioCreador = reclamo[0].idUsuarioCreador;
      const [usuario] = await pool.query('SELECT correoElectronico FROM usuarios WHERE idUsuario = ?', [idUsuarioCreador]);
      if (usuario.length === 0) {
        console.error('Usuario no encontrado');
        return;
      }
      const correoUsuarioCreador = usuario[0].correoElectronico;
      const info = await transporter.sendMail({
        from: '"administracion" <ignacio.jose.pancho@outlook.com>',
        to: correoUsuarioCreador,
        subject: "Reclamo Cancelado",
        text: "Su reclamo ha sido cancelado exitosamente.",
        html: "<b>Su reclamo ha sido cancelado exitosamente.</b>",
      });
      console.log("Mensaje de cancelación enviado: %s", info.messageId);
    } catch (error) {
      console.error("Error al enviar correo de cancelación:", error);
    }
  }
  exports.cancelarReclamo = async (req, res) => {
    const { idReclamo } = req.params;
    try {
      const [rows] = await pool.query('UPDATE reclamos SET idReclamoEstado = 3 WHERE idReclamo = ?', [idReclamo]);
      if (rows.affectedRows === 0) {
        res.status(404).json({ error: 'Reclamo no encontrado' });
      } else {
        await enviarCorreoCancelacion(idReclamo); 
        res.json({ message: 'Reclamo cancelado exitosamente' });
      }
    } catch (error) {
      console.error('Error al cancelar el reclamo:', error);
      res.status(500).json({ error: 'Error al cancelar el reclamo' });
    }
  };