exports.getHTMLPage = (req, res, next) => {
  console.log('here')
  .open("index.html")
  .then(() => {
    res.status(200).send('Page opened')
  })
  .catch(next)
}

