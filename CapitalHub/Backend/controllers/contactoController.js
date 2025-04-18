const { Contacto } = require('../models');

exports.obtenerContactosUsuario = async (req, res) => {
  try {
    const contactos = await Contacto.findAll({ where: { id_usuario: req.params.idUsuario }});
    res.json(contactos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
};

exports.crearContacto = async (req, res) => {
  try {
    const nuevoContacto = await Contacto.create({
      id_usuario: req.params.idUsuario,
      ...req.body
    });
    res.status(201).json(nuevoContacto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear contacto' });
  }
};

exports.obtenerContactoPorId = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    contacto ? res.json(contacto) : res.status(404).json({ error: 'Contacto no encontrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener contacto' });
  }
};

exports.actualizarContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    await contacto.update(req.body);
    res.json(contacto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
};

exports.eliminarContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    await contacto.destroy();
    res.json({ mensaje: 'Contacto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
};
