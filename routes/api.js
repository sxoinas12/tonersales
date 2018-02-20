const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const users = require('../models/users');


const mc = require('../models/database');



router.get('/todos',function(req,res,next){
	mc.query('SELECT * FROM tasks',function(error,results,fields){
		if (error) throw error
		res.send({error:false , data :results ,message:'Todos list.'});
	});
});



router.get('/todos/:id',function(req,res,next){
	let id = req.params.id;

	if (!id){
		res.status(400).send({error : true , message:"please provide is"});
	}
	mc.query('SELECT * FROM tasks where id=?',id,function(error,results,fields){
		if (error) throw error;
		res.send({error:false,data:results[0],message:'todo list'})

	});
});

// Search for todos with ‘bug’ in their name
router.get('/todos/search/:keyword', function (req, res,next) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM tasks WHERE task LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos search list.' });
    });
});


//add new data

router.post('/todo', function (req, res,next) {
 
    let task = req.body.task;
 
    if (!task) {
        res.status(400).send({ error:true, message: 'Please provide task' });
    }
 
    mc.query("INSERT INTO tasks SET ? ", { task: task }, function (error, results, fields) {
        if (error) throw error;
        res.send({ error: false, data: results, message: 'New task has been created successfully.' });
    });
});


router.post('/register',function(req,res){
    //var today = new Date();
    var user={
    username:req.body.username,
    email:req.body.email,
    password:req.body.password
    //created: today.toISOString();
  }
    flag = users.Register(user);
    console.log(flag);
    if(flag === 0){
        res.send({
            "code":200,
            "success":"register sucessfull"
        });
    }
    else{
        res.send({
            "code":400,
            "failed":"error occured"
        });
    }

});

//router.post('/register',users.Register);

router.post('/login',users.Login);


//not working 
router.get('/logout',function(req,res,next){
    delete req.session.authenticated;
    res.redirect('/login')
});


//update data
router.put('/todo', function (req, res,next) {
 
    let id = req.body.id;
    let task = req.body.task;
 
    if (!id || !task) {
        res.status(400).send({ error: task, message: 'Please provide task and id' });
    }
 
    mc.query("UPDATE tasks SET task = ? WHERE id = ?", [task, id], function (error, results, fields) {
        if (error) throw error;
        res.send({ error: false, data: results, message: 'Item has been updated successfully.' });
    });
});


//delete data

router.delete('/todo/:id', function (req, res) {
 
    let id = req.params.id;
 
    mc.query('DELETE FROM tasks WHERE id = ?', [id], function (error, results, fields) {
        if (error) throw error;
        res.send({ error: false, data: results, message: 'Item has been deleted successfully.' });
    });
 
});
 

module.exports = router;
