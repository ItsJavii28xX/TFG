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
  try {
    const gasto = await Gasto.create({ id_grupo: req.params.idGrupo, ...req.body });
    res.status(201).json(gasto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear gasto' });
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