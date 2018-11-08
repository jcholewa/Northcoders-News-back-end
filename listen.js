const app = require('./app');

const PORT = process.env.port ? process.env.port : 9092;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`listening on port ${PORT}`);
});