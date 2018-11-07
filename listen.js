const app = require('./app');

const PORT = process.env.port ? process.env.port : 9090;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`listening on port ${PORT}`);
});