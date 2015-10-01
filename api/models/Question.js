/**
* Question.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Parse = require('parse/node');
Parse.initialize(process.env['PARSE_APPLICATION_ID'], process.env['PARSE_JAVASCRIPT_KEY']);

module.exports = {

  attributes: {

  	title: {
      type: 'string'
    },

    question: {
      type: 'string'
    },

    // answers: {
    //   collection: 'string'
    // }

  },


  ask: function (options, cb) {

  	Parse.Push.send({
  	  channels: [ "Students" ],
  	  data: {
  	    alert: "This is a question sent from the Node app"
  	  }
  	}, {
  	  success: function() {
  	    cb();
  	  },
  	  error: function(error) {
  	  	console.log("error: Parse.Push.send code: " + error.code + " msg: " + error.message);
  	    cb(error);
  	  }
  	});
  }

};

