const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

//Connect to datadbase
mongoose.connect('mongodb://localhost/APIAuthentication');

//Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

//Routes
app.use('/users', require('./routes/users'));

//Listen on server
app.listen(9090, () => {
	console.log('Server started on port 9090')
})