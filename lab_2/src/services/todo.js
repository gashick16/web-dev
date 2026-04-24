const todo = require('../models/todo');

class TodoService {
  async create(data) {
    return await todo.create(data);
  }

  async findAll({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const { count, rows } = await todo.findAndCountAll({
      where: { deletedAt: null },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findById(id) {
    const todo = await todo.findByPk(id, { paranoid: true });
    if (!todo) throw new Error('Todo not found');
    return todo;
  }

  async update(id, data) {
    const todo = await this.findById(id);
    await todo.update(data);
    return todo;
  }

  async softDelete(id) {
    const todo = await this.findById(id);
    await todo.destroy();
    return todo;
  }
}

module.exports = new TodoService();