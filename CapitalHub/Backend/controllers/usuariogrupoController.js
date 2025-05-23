const { UsuarioGrupo } = require('../models');

exports.obtenerUsuariosGrupos = async (req, res) => {
  try {
    const relaciones = await UsuarioGrupo.findAll();
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener relaciones usuario-grupo' });
  }
};

exports.crearUsuarioGrupo = async (req, res) => {
  try {
    const relacion = await UsuarioGrupo.create(req.body);
    res.status(201).json(relacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear relación usuario-grupo' });
  }
};

exports.obtenerGruposDeUsuario = async (req, res) => {
  try {
    const relaciones = await UsuarioGrupo.findAll({
      where: { id_usuario: req.params.idUsuario },
      include: [{ model: require('../models').Grupo, as: 'grupo' }]
    });
    res.json(relaciones.map(r => r.grupo));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener grupos del usuario' });
  }
};

exports.obtenerUsuarioGrupoPorId = async (req, res) => {
  try {
    const relacion = await UsuarioGrupo.findByPk(req.params.id);
    relacion ? res.json(relacion) : res.status(404).json({ error: 'Relación no encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener relación usuario-grupo' });
  }
};

exports.actualizarUsuarioGrupo = async (req, res) => {
  try {
    const relacion = await UsuarioGrupo.findByPk(req.params.id);
    if (!relacion) return res.status(404).json({ error: 'Relación no encontrada' });
    await relacion.update(req.body);
    res.json(relacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar relación usuario-grupo' });
  }
};

exports.eliminarUsuarioGrupo = async (req, res) => {
  try {
    const relacion = await UsuarioGrupo.findByPk(req.params.id);
    if (!relacion) return res.status(404).json({ error: 'Relación no encontrada' });
    await relacion.destroy();
    res.json({ mensaje: 'Relación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar relación usuario-grupo' });
  }
};
