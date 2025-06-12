const { Presupuesto, Grupo, Gasto } = require('../models');
const sequelize        = require('../config/database');

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

exports.eliminarPresupuestosEnCascada = async (req, res) => {
  const id = Number(req.params.id);
  const t = await sequelize.transaction();
  try {
    // 1) Borrar todos los gastos vinculados a esos presupuestos
    await Gasto.destroy({
      where: { id_presupuesto: id },
      transaction: t
    });

    // 2) Borrar los propios presupuestos
    const deleted = await Presupuesto.destroy({
      where: { id_presupuesto: id },
      transaction: t
    });

    await t.commit();
    if (deleted === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron presupuestos para eliminar' });
    }
    res.json({ mensaje: 'Presupuestos y sus gastos eliminados correctamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error al eliminar presupuestos en cascada:', error);
    res.status(500).json({ error: 'No se pudo eliminar los presupuestos' });
  }
};
