const { UsuarioGrupo, Historico, Gasto, Presupuesto, Grupo } = require('../models');
const sequelize                                              = require('../config/database');
const { Op }                                                 = require('sequelize');

exports.obtenerGrupos = async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los grupos' });
  }
};

exports.crearGrupo = async (req, res) => {
  try {
    const nuevoGrupo = await Grupo.create(req.body);
    res.status(201).json(nuevoGrupo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el grupo' });
  }
};

exports.obtenerGrupoPorId = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el grupo' });
  }
};

exports.searchGrupos = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const id_usuario = parseInt(req.params.uid, 10);
    // Validación inmediata: si no es un entero válido, respondemos 400
    if (isNaN(id_usuario)) {
      return res.status(400).json({ error: 'UID inválido (no se recibió un número).' });
    }

    if (!query || query.length < 1) {
      return res.json([]);
    }

    // Buscamos grupos cuyo nombre contenga "query" Y en los que el usuario está relacionado
    const grupos = await Grupo.findAll({
      where: {
        nombre: { [Op.like]: `%${query}%` }
      },
      include: [
        {
          model: UsuarioGrupo,
          as: 'miembros',
          where: { id_usuario },       // sólo incluimos si existe relación con este usuario
          attributes: []
        }
      ],
      attributes: ['id_grupo', 'nombre', 'fecha_creacion']
    });

    return res.json(grupos);
  } catch (error) {
    console.error('Error en searchGrupos:', error);
    return res.status(500).json({ error: 'Error al buscar grupos.' });
  }
};

exports.actualizarGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
    
    await grupo.update(req.body);
    res.json(grupo);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el grupo' });
  }
};

exports.eliminarGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });

    await grupo.destroy();
    res.json({ mensaje: 'Grupo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el grupo' });
  }
};

exports.obtenerUsuariosDeGrupo = async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id, {
      include: [{ model: require('../models').Usuario, as: 'usuarios' }]
    });
    if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
    
    res.json(grupo.usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios del grupo' });
  }
}

exports.eliminarGruposEnCascada = async (req, res) => {
  const { ids } = req.body;
  const t = await sequelize.transaction();
  try {
    // 1) Relaciones usuario‐grupo
    await UsuarioGrupo.destroy({
      where: { id_grupo: ids },
      transaction: t
    });

    // 2) Histórico
    await Historico.destroy({
      where: { id_grupo: ids },
      transaction: t
    });

    // 3) Presupuestos y sus gastos
    // primero identificar los presupuestos de esos grupos
    const presupuestos = await Presupuesto.findAll({
      where: { id_grupo: ids },
      transaction: t
    });
    const presIds = presupuestos.map(p => p.id_presupuesto);
    // borrar gastos
    if (presIds.length) {
      await Gasto.destroy({
        where: { id_presupuesto: presIds },
        transaction: t
      });
    }
    // borrar presupuestos
    await Presupuesto.destroy({
      where: { id_grupo: ids },
      transaction: t
    });

    // 4) finalmente borrar los grupos
    await Grupo.destroy({
      where: { id_grupo: ids },
      transaction: t
    });

    await t.commit();
    res.json({ mensaje: 'Grupos y dependencias eliminados correctamente' });
  } catch (error) {
    await t.rollback();
    console.error('Error en eliminación en cascada:', error);
    res.status(500).json({ error: 'No se pudo eliminar los grupos' });
  }
};
