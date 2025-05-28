const { Grupo } = require('../models');

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
