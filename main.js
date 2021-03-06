const express = require('express');
const session = require('express-session');
const routes = require('./routes/index');
const passportSetup = require('./services/passport-setup');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const parseToken = require('./middlewares/author.js');
const passport = require('passport');

const FileService = require('./services/FileService');

app.use(bodyParser.json({limit: '10mb'}));


app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');

	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type, token');
	next();
})

app.use(express.static('front-end'));
app.use(parseToken);


app.use(passport.initialize());
app.use(passport.session());
app.use('/users',routes.User);
app.use('/globals',routes.Globals);
app.use('/products',routes.Products);
app.use('/categories',routes.Categories);
app.use('/orders',routes.Orders);
app.use('/shipping',routes.Shipping);
app.use('/payment',routes.Payment);
app.use('/auth',routes.AuthRoutes);
app.use('/profile',routes.Profile);
app.use('/fileupload',FileService.router);
//app.use('/braintree',routes.Braintree);



app.use(function(err,req,res,next){
	res.status(422).send({error:err.message});
});




app.listen(5000,function(){
	console.log('now listening to requests');
});
