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
    Question.findOne({id: question_id}).exec(function findCB(questionErr, foundQuestion) {
      if (questionErr) {
        cb(questionErr, null);
      } else {
        var correct = (answer == foundQuestion.answer);

        Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
          if (authErr) {
            cb(authErr, null);
          } else {
            console.log(foundAuth.id)
            AnswerSet.findOne({quiz_id: quiz_id, user_id: foundAuth.id}).exec(function findCB(answersetErr, foundAnswerSet) {
              if (foundAnswerSet) {
                console.log("found answer set, updating");
                //Update answer set
                foundAnswerSet.question_ids.push(question_id);
                foundAnswerSet.answer_validity.push(correct);
                foundAnswerSet.save();
                cb(null, correct);
              } else {
                //Create answer set
                console.log("creating new answer set");
                AnswerSet.create({
                  quiz_id: quiz_id,
                  user_id: foundAuth.id
                }).exec(function createCB(createAnswerSetErr, createdAnswerSet) {
                  if (createAnswerSetErr) {
                    cb(createAnswerSetErr, null);
                  } else {
                    //Callback with correct answer
                    createdAnswerSet.question_ids.push(question_id);
                    createdAnswerSet.answer_validity.push(correct);
                    createdAnswerSet.save();
                    cb(null, correct);
                    //Save this answer set ID to the User model for future reference
                    User.findOne({id: foundAuth.id}).exec(function findCB(userErr, foundUser) {
                      if (userErr) {
                        cb (userErr, null);
                      } else {
                        foundUser.answerSets.push(createdAnswerSet.id);
                        foundUser.save();
                      }
                    });   
                  }
                });
              }
            });

          }
        });
      }
    });    
  },

  ask: function (id, cb) {

    Question.findOne({id: id}).exec(function findCB(questionErr, foundQuestion) {
      if (questionErr) {
        cb(questionErr);
      } else if (foundQuestion) {
        if (questionPayload) {
          Parse.Push.send({
            channels: [ "Students" ],
            data: questionPayload.toJSON()
          }, {
            success: function() {
              return cb();
            },
            error: function(error) {
              console.log("error: Parse.Push.send code: " + error.code + " msg: " + error.message);
              return cb(error);
            }
          });
        } else {
          cb("Question not found");
        }
      }
    });

  	
  }

};

