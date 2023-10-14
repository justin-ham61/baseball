const express = require('express');
const app = express();
const port = 5001;
const cors = require('cors');
const bodyParser = require('body-parser');
//Middleware -------------------------------------------------------
app.use(cors());
app.use(bodyParser.json());

//Constants --------------------------------------------------------
const { api } = require('./util/class/api.js')
const  DataExtractor = require('./util/class/DataExtractor.js')


app.get('/',  async (req, res) => {
  const stats = await api.driver.getAllPlayers()
  const hitterArray = DataExtractor.getAllActive(stats.people)
  res.send(hitterArray)
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const apiRouter = require('./routes/api.js');
app.use('/api', apiRouter);
