/**
* Question.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Parse = require('parse/node');
var showAnswerChoices = true;

Parse.initialize(process.env['PARSE_APPLICATION_ID'], process.env['PARSE_JAVASCRIPT_KEY']);

module.exports = {

  attributes: {

    question: {
      type: 'string',
      required: true
    },

    quiz_id: {
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
          if (authErr || !foundAuth) {
            cb(authErr, null);
          } else if (foundAuth) {
            console.log(foundAuth.id)
            AnswerSet.findOne({quiz_id: quiz_id, user_id: foundAuth.id}).exec(function findCB(answersetErr, foundAnswerSet) {
              if (foundAnswerSet) {
                console.log("found answer set, updating");
                //Add answer and update answer set
                Answer.create({
                  question_id: question_id,
                  answer_valid: correct,
                  answer_choice: answer
                }).exec(function createCB(createAnswerErr, createdAnswer) {
                  if (createAnswerErr) {
                    cb(createAnswerErr, null);
                  } else {
                    foundAnswerSet.answers.push(createdAnswer.id);
                    foundAnswerSet.save();
                    cb(null, createdAnswer.toJSON());
                  }
                });
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
                    Answer.create({
                      question_id: question_id,
                      answer_valid: correct,
                      answer_choice: answer
                    }).exec(function createCB(createAnswerErr, createdAnswer) {
                      if (createAnswerErr) {
                        cb(createAnswerErr, null);
                      } else {
                        createdAnswerSet.answers.push(createdAnswer.id);
                        createdAnswerSet.save();
                        //Save this answer set ID to the User model for future reference
                        User.findOne({id: foundAuth.id}).exec(function findCB(userErr, foundUser) {
                          if (userErr) {
                            cb (userErr, null);
                          } else {
                            foundUser.answerSets.push(createdAnswerSet.id);
                            foundUser.save();
                            cb(null, createdAnswer.toJSON());
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
      }
    });    
  },

  ask: function (id, cb) {

    Question.findOne({id: id}).exec(function findCB(questionErr, foundQuestion) {
      if (questionErr) {
        cb(questionErr);
      } else if (foundQuestion) {
        foundQuestion.show_answers = showAnswerChoices;
        foundQuestion.expiration = Date.now() + foundQuestion.time_limit;
        Quiz.findOne({id: foundQuestion.quiz_id}).exec(function findCB(quizErr, foundQuiz) {
          if (quizErr) {
            cb(quizErr);
          } else if (foundQuiz) {
            Parse.Push.send({
              channels: [ 's' + foundQuiz.section_id ],
              data: foundQuestion.toJSON()
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
            cb("Quiz not found");
          }
        });
      } else {
        cb("Question not found");
      }
    });

  	
  }

};

