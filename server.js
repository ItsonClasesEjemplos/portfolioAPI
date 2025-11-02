const express = require('express');
const routerApi = require("./routes");
// const cors = require('cors')

const app = express();

app.use(express.json());

routerApi(app);

module.exports = app;