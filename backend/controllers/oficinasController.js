const pool = require('../config.js');

exports.getAllOficinas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM oficinas');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener oficinas:', error);
        res.status(500).json({ error: 'Error al obtener oficinas' });
    }
}
exports.getOficinasById = async (req, res) => {
    const { idOficina } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM oficinas WHERE idOficina = ?', [idOficina]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Oficina no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener oficinas:', error);
        res.status(500).json({ error: 'Error al obtener oficinas' });
    }
}   