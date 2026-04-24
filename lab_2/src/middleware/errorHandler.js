module.exports = (err, req, res, next) => {
  if (err.message === 'Project not found') {
    return res.status(404).json({ error: 'Project not found' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};