const express = require('express');
const router = express.Router();
var UserService = require('../services/UserService');
const knex = require('../models/database');
router.get('/',(req,res) => {
	//console.log("first here")
	
	let user ={};
	if(!req.headers.token){
		res.sendStatus(403);
		//console.log("then here")
	}
	else {
		return UserService.getByToken(req.headers.token)
		.then((data)=>{
			user = UserService.present(data);
			return res.status(200).send(user);
			

		})
		.catch((e)=>{
			
			return res.status(403).send(e);
		})
		
		}
	
});


router.post('/',(req,res) => {
	let user = {};
	if(!req.headers.token){
		res.sendStatus(403);
	}
	else{
		user = UserService.Change(req.user,req.body)
		knex('Users').where('token',req.headers.token).update({
			username:user.username,
			email:user.email
		}).then((data)=>{
			return res.sendStatus(200);
		}).catch((e)=>{
			return res.status(403).send(e);
		})
	}
})






module.exports = router;