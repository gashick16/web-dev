const Joi = require('joi');

const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500),
  status: Joi.string().valid('pending', 'completed', 'archived').default('pending'),
});

const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  description: Joi.string().max(500),
  status: Joi.string().valid('pending', 'completed', 'archived'),
}).min(1);

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createTodoSchema,
  updateTodoSchema,
  paginationSchema,
};