const { AlertaLimite } = require('../models');

exports.obtenerAlertasUsuario = async (req, res) => {
  try {
    const alertas = await AlertaLimite.findAll({ where: { id_usuario: req.params.idUsuario }});
    res.json(alertas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

exports.crearAlerta = async (req, res) => {
  try {
    const nuevaAlerta = await AlertaLimite.create({
      id_usuario: req.params.idUsuario,
      ...req.body
    });
    res.status(201).json(nuevaAlerta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear alerta' });
  }
};

exports.obtenerAlertaPorId = async (req, res) => {
  try {
    const alerta = await AlertaLimite.findByPk(req.params.id);
    alerta ? res.json(alerta) : res.status(404).json({ error: 'Alerta no encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alerta' });
  }
};

exports.actualizarAlerta = async (req, res) => {
  try {
    const alerta = await AlertaLimite.findByPk(req.params.id);
    if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });
    await alerta.update(req.body);
    res.json(alerta);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar alerta' });
  }
};

exports.eliminarAlerta = async (req, res) => {
  try {
    const alerta = await AlertaLimite.findByPk(req.params.id);
    if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });
    await alerta.destroy();
    res.json({ mensaje: 'Alerta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar alerta' });
  }
};
