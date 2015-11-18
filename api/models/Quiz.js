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
  	},

    section_id: {
      type: 'string',
      required: true
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
		  			quizFound.questionSet.push(question_id);
		  			quizFound.save(function(err,s) {
		  				console.log("Added new question id " + question_id);
		  			});
		  			cb();
		  		}
			});
  		}
  	});
  },

  allQuestions: function(quiz_id, cb) {
    Quiz.findOne({id: quiz_id}).exec(function findQuiz(quizErr, quizFound) {
      if(quizErr) {
        console.log(quizErr);
        cb(quizErr, null);
      }
      else if (!quizFound) {
        console.log("Could not find quiz");
        cb("Could not find quiz", null);
      }
      else {
        console.log("Found Quiz. Returning Question Set");
        var questions = [];
        async.each(quizFound.questionSet, function iterator(question_id, questionCallback) {
          Question.findOne({id: question_id}).exec(function findCB(questionErr, foundQuestion) {
            if (foundQuestion) {
              foundQuestion.section_id = quizFound.section_id;
              questions.push(foundQuestion);
            }
            questionCallback();
          });
        }, function done(err) {
          cb(null, questions);
        });
      }
    });
  }

};

