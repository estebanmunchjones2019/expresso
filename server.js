const express = require('express');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('./api/api');
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', apiRouter);

app.use(errorhandler());

app.listen(()=>{
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
