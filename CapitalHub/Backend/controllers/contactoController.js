// src/controllers/contactoController.js
const { Contacto } = require('../models');

exports.obtenerContactosUsuario = async (req, res) => {
  try {
    const ownerId = Number(req.params.idUsuario);
    const contactos = await Contacto.findAll({
      where: { id_usuario_propietario: ownerId }
    });
    res.json(contactos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
};

exports.crearContacto = async (req, res) => {
  try {
    const ownerId = Number(req.params.idUsuario);
    const {
      id_usuario_contacto,
      nombre,
      email,
      telefono,
      imagen_perfil
    } = req.body;

    if (!id_usuario_contacto) {
      return res.status(400).json({ error: 'Debe especificar id_usuario_contacto' });
    }

    const nuevoContacto = await Contacto.create({
      id_usuario_propietario: ownerId,
      id_usuario_contacto,
      nombre,
      email,
      telefono,
      imagen_perfil
    });

    res.status(201).json(nuevoContacto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear contacto' });
  }
};

exports.obtenerContactoPorId = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.json(contacto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener contacto' });
  }
};

exports.actualizarContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    // No permitimos cambiar el propietario ni el id del contacto
    const { nombre, email, telefono, imagen_perfil } = req.body;
    await contacto.update({ nombre, email, telefono, imagen_perfil });
    res.json(contacto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
};

exports.eliminarContacto = async (req, res) => {
  try {
    const contacto = await Contacto.findByPk(req.params.id);
    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    await contacto.destroy();
    res.json({ mensaje: 'Contacto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
};
