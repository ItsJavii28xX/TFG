const { Categoria } = require('../models');

exports.obtenerCategoriasDeGrupo = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({ where: { id_grupo: req.params.idGrupo }});
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};

exports.crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = await Categoria.create({
      id_grupo: req.params.idGrupo,
      ...req.body
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
};

exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    categoria ? res.json(categoria) : res.status(404).json({ error: 'Categoría no encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
};

exports.actualizarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    await categoria.update(req.body);
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
};

exports.eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    await categoria.destroy();
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};
