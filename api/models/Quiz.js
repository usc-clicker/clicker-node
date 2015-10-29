/**
* Quiz.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	quiz_name: {
  	  type: 'string',
  	  required: true
  	},
    
  	questionSet: {
  		type: 'array',
  		defaultsTo: []
  	}
  },

  add: function(quiz_id, question_id, cb) {
  	//Check if question exists
  	Question.findOne({id: question_id}).exec(function findQuestion(err, found) {
  		if (err) {
  			console.log(err);
  			cb(err);
  		}
  		else if (!found) {
  			console.log("Could not find question");
  			cb("Could not find question");
  		}
  		else {
			Quiz.findOne({id: quiz_id}).exec(function findQuiz(quizErr, quizFound) {
		  		if (quizErr) {
		  			console.log(quizErr);
		  			cb(quizErr);
		  		}
		  		else if (!quizFound) {
		  			console.log("Could not find quiz");
		  			cb("Could not find quiz");
		  		}
		  		else {
		  			quizFound.questionSet = [question_id];
		  			cb();
		  		}
			});
  		}
  	});
  }
};

