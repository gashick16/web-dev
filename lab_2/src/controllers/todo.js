const todoService = require('../services/todo');
const { createTodoSchema, updateTodoSchema, paginationSchema } = require('../dto/todo');

async function getAll(req, res, next) {
  try {
    const { error, value } = paginationSchema.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const result = await todoService.findAll(value);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const todo = await todoService.findById(req.params.id);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { error, value } = createTodoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const todo = await todoService.create(value);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { error, value } = updateTodoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const todo = await todoService.update(req.params.id, value);
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await todoService.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  patch,
  remove,
};