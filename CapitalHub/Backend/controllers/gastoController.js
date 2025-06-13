const { Gasto } = require('../models');

exports.obtenerGastosDeGrupo = async (req, res) => {
  try {
    const gastos = await Gasto.findAll({ where: { id_grupo: req.params.idGrupo }});
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos' });
  }
};

exports.crearGasto = async (req, res) => {
  const { idGrupo } = req.params;
  const {
    nombre,
    descripcion,
    cantidad,
    estado,
    id_presupuesto,
    id_usuario
  } = req.body;

  try {
    const nuevoGasto = {
      nombre,
      descripcion,
      cantidad,
      estado,
      id_grupo: parseInt(idGrupo, 10),
      id_presupuesto: parseInt(id_presupuesto, 10),
      id_usuario: parseInt(id_usuario, 10)
    };

    const gasto = await Gasto.create(nuevoGasto);
    return res.status(201).json(gasto);
  } catch (error) {
    console.error('Error al crear gasto:', error);
    return res.status(500).json({
      error: 'Error al crear gasto',
      details: error.message
    });
  }
};

exports.obtenerGastoPorId = async (req, res) => {
  try {
    const gasto = await Gasto.findByPk(req.params.id);
    gasto ? res.json(gasto) : res.status(404).json({ error: 'Gasto no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gasto' });
  }
};

exports.actualizarGasto = async (req, res) => {
  try {
    const gasto = await Gasto.findByPk(req.params.id);
    if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
    await gasto.update(req.body);
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar gasto' });
  }
};

exports.eliminarGasto = async (req, res) => {
  try {
    const gasto = await Gasto.findByPk(req.params.id);
    if (!gasto) return res.status(404).json({ error: 'Gasto no encontrado' });
    await gasto.destroy();
    res.json({ mensaje: 'Gasto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar gasto' });
  }
};