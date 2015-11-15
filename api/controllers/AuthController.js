/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').waterlocked({

    register: function(req, res){
 		var params = waterlock._utils.allParams(req); 
 		var auth = {
 		  email: params.email, 
 		  password: params.password
 		}; 
 		delete(params.email); 
 		delete(params.password); 
 		User.create(params).exec(function createCB(userErr, createdUser){
 		  if(userErr) {
 		    return res.status(400).send(userErr);
 		  } else {
 		  	waterlock.engine.attachAuthToUser(auth, createdUser, function(authError, ua){
 		  	  if(authError){
 		  	  	return res.status(400).send(authError);
 		  	  } else {
 		  	    waterlock.cycle.loginSuccess(req, res, ua); 
 		  	  }
 		  	}); 
 		  }
 		}); 
    }

});