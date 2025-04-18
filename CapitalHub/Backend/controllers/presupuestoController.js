const { Presupuesto, Grupo } = require('../models');

exports.obtenerPresupuestosDeGrupo = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.findAll({
      where: { id_grupo: req.params.idGrupo }
    });
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los presupuestos' });
  }
};

exports.crearPresupuesto = async (req, res) => {
  try {
    const idGrupo = req.params.idGrupo;
    const grupo = await Grupo.findByPk(idGrupo);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });

    const nuevoPresupuesto = await Presupuesto.create({
      id_grupo: idGrupo,
      ...req.body
    });
    res.status(201).json(nuevoPresupuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el presupuesto' });
  }
};

exports.obtenerPresupuestoPorId = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findByPk(req.params.id);
    if (!presupuesto) return res.status(404).json({ error: 'Presupuesto no encontrado' });
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el presupuesto' });
  }
};

exports.actualizarPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findByPk(req.params.id);
    if (!presupuesto) return res.status(404).json({ error: 'Presupuesto no encontrado' });
    
    await presupuesto.update(req.body);
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el presupuesto' });
  }
};

exports.eliminarPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findByPk(req.params.id);
    if (!presupuesto) return res.status(404).json({ error: 'Presupuesto no encontrado' });

    await presupuesto.destroy();
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el presupuesto' });
  }
};
