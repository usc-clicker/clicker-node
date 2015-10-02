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

  },


  ask: function (id, cb) {

    var payload;

    if (id == 0) {
      payload = {
        question: 'What year was USC founded?',
        type: 'numeric',
        answer: 1880,
        start_time: Date.now(),
        time_limit: 15000
      };
    } else if (id == 1) {
      payload = {
        question: 'Who is the current President of USC?',
        type: 'free-response',
        answer: 'Max Nikias',
        start_time: Date.now(),
        time_limit: 15000
      }
    } else if (id == 2) {
      payload = {
          question: 'Who is USC’s starting quarterback?',
          type: 'multiple-choice',
          choices: ['Max Browne', 'Cody Kessler', 'Mark Sanchez', 'Marcus Mariota', 'Matt Barkley'],
          answer: 'Cody Kessler',
          start_time: Date.now(),
          time_limit: 15000
      }
    } else {
      return cb("Question not found");
    }

  	Parse.Push.send({
  	  channels: [ "Students" ],
  	  data: payload
  	}, {
  	  success: function() {
  	    return cb();
  	  },
  	  error: function(error) {
  	  	console.log("error: Parse.Push.send code: " + error.code + " msg: " + error.message);
  	    return cb(error);
  	  }
  	});
  }

};

