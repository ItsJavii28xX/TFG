const { Historico } = require('../models');

exports.obtenerHistoricoGrupo = async (req, res) => {
  try {
    const historicos = await Historico.findAll({ where: { id_grupo: req.params.idGrupo }});
    res.json(historicos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el histórico' });
  }
};

exports.crearHistorico = async (req, res) => {
  try {
    const nuevoHistorico = await Historico.create({
      id_grupo: req.params.idGrupo,
      ...req.body
    });
    res.status(201).json(nuevoHistorico);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear registro histórico' });
  }
};

exports.obtenerHistoricoPorId = async (req, res) => {
  try {
    const historico = await Historico.findByPk(req.params.id);
    historico ? res.json(historico) : res.status(404).json({ error: 'Registro histórico no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener registro histórico' });
  }
};

exports.actualizarHistorico = async (req, res) => {
  try {
    const historico = await Historico.findByPk(req.params.id);
    if (!historico) return res.status(404).json({ error: 'Registro histórico no encontrado' });
    await historico.update(req.body);
    res.json(historico);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar registro histórico' });
  }
};

exports.eliminarHistorico = async (req, res) => {
  try {
    const historico = await Historico.findByPk(req.params.id);
    if (!historico) return res.status(404).json({ error: 'Registro histórico no encontrado' });
    await historico.destroy();
    res.json({ mensaje: 'Registro histórico eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar registro histórico' });
  }
};
