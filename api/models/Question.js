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

    question: {
      type: 'string',
      required: true
    },

    answer: {
      type: 'string',
      required: true
    },

    choices: {
      type: 'array',
      required: true
    },

    time_limit: {
      type: 'integer',
      required: true
    },

    type: {
      type: 'string',
      required: true
    }

  },

  answer: function(quiz_id, question_id, answer, location, user_email, cb) {
    Question.find({id: question_id}).exec(function findCB(questionErr, foundQuestion) {
      if (questionErr) {
        cb(questionErr, null);
      } else {
        var correct = (answer == foundQuestion.answer);
        console.log("Correct? : " + question);

        Auth.find({email: user_email}).exec(function findCB(userErr, foundUser) {
          if (userErr) {
            cb(err, null);
          } else {

            AnswerSet.find({quiz_id: quiz_id, user: foundUser.id}).exec(function findCB(answersetErr, foundAnswerSet) {
              if (foundAnswerSet) {
                //Update answer set
                foundAnswerSet.question_ids.push(question_id);
                foundAnswerSet.answer_validity.push(correct);
                foundAnswerSet.save();
                cb(null, correct);
              } else {
                //Create answer set
                AnswerSet.create({
                  quiz_id: quiz_id,
                  user_id: foundUser.id
                }).exec(function createCB(createAnswerSetErr, createdAnswerSet) {
                  //Callback with correct answer
                  question_ids.push(question_id);
                  answer_validity.push(correct);
                  cb(null, correct);
                  //Save this answer set ID to the User model for future reference
                  foundUser.answerSets.push(createdAnswerSet.id);
                  foundUser.save();
                });
              }
            });

          }
        });
      }
    });    
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

