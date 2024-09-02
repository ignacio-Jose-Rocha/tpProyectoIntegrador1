const pool = require('../config.js');

exports.getAllclientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 1');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};


exports.login = async (req, res) => {
  const { correoElectronico, contrasenia } = req.body;
  console.log('Datos recibidos:', correoElectronico, contrasenia);
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE correoElectronico = ? AND contrasenia = ?', [correoElectronico, contrasenia]);
    connection.release();
    if (rows.length > 0) {
      let tipoUsuario = '';
      switch (rows[0].idTipoUsuario) {
        case 1:
          tipoUsuario = `'Administrador' {${rows[0].correoElectronico}}`;
          break;
        case 2:
          tipoUsuario = `'Empleado' {${rows[0].correoElectronico}}`;
          break;
        case 3:
          tipoUsuario = `'Cliente' {${rows[0].correoElectronico}}`;
          break;
        default:
          tipoUsuario = 'Desconocido';
      }
      res.json({ success: true, message: `Inicio de sesión exitoso. Usuario: ${tipoUsuario}` });
    } else {
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.eliminarCliente = async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const [rows] = await pool.query('DELETE FROM usuarios WHERE idUsuario = ?', [idUsuario]);
    if (rows.affectedRows === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json({ message: 'Usuario eliminado exitosamente' });
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
}
exports.crearCliente = async (req, res) => {
  const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;
  try {
    if (!nombre || !apellido || !correoElectronico || !contrasenia || !idTipoUsuario) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
 
    const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
    if (usuarios.length > 0) {
      return res.status(400).json({ error: 'Datos ya cargados anteriormente' });
    }

    const [rows] = await pool.query('INSERT INTO usuarios SET ?', { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo });
    res.json({ id: rows.insertId, nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

exports.actualizarCliente = async (req, res) => {
  const {idUsuario} = req.params;
  const {nombre, apellido,correoElectronico, contrasenia,idTipoUsuario,imagen, activo}   = req.body;
  try{
    
    const [rows]=await pool.query("update usuarios set nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=?, activo=? where idUsuario=? and  idTipoUsuario = 1",[nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo, idUsuario]);  
    res.json({
      id:idUsuario,
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idTipoUsuario,
      imagen,
      activo})
  } 
  catch(error){
    console.log(Error);
}

}