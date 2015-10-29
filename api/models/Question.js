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
            cb(userErr, null);
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
                  createdAnswerSet.question_ids.push(question_id);
                  createdAnswerSet.answer_validity.push(correct);
                  createdAnswerSet.save();
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

    Question.find({id: id}).exec(function findCB(questionErr, foundQuestion) {
      if (questionErr) {
        cb(questionErr);
      } else {
        Parse.Push.send({
          channels: [ "Students" ],
          data: foundQuestion.pop().toJSON()
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
    });

  	
  }

};

