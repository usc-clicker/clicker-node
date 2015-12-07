/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

var async = require('async');

module.exports = {

  attributes: require('waterlock').models.user.attributes({
    
    usc_id: {
      type: 'string',
      required: true
    },

    enrolledIn: {
      type: 'array',
      defaultsTo: []
    },

    answerSets: {
      type: 'array',
      defaultsTo: []
    },
    
  }),
  
  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate,

  enroll: function (user_email, section_id, cb) {

    Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
      if (authErr || !foundAuth) {
        cb(authErr, null);
      } else {
        User.findOne({id: foundAuth.id}).exec(function findCB(userErr, foundUser) {
          if (userErr || !foundUser) {
            cb(userErr, null);
          } else {
            Section.findOne({section_id: section_id}).exec(function findCB(sectionErr, foundSection) {
              if (sectionErr || !foundSection) {
                cb(sectionErr, null);
              } else {
                if (!foundSection.quizzes) {
                  foundSection.quizzes = [];
                }
                if (!foundSection.students) {
                  foundSection.students = [];
                }
                if (foundSection.students.indexOf(foundUser.id) < 0) {
                  foundSection.students.push(foundUser.id);
                }
                foundSection.save();
                if (!foundUser.enrolledIn) {
                  foundUser.enrolledIn = [];
                }
                if (foundUser.enrolledIn.indexOf(section_id) < 0) {
                  foundUser.enrolledIn.push(section_id);
                }
                if (!foundUser.usc_id) {
                  foundUser.usc_id = 0123456789;
                }
                foundUser.save()
                delete foundSection.students;
                cb(null, foundSection.toJSON());
              }
            });
          }
        });
      }
    });
  },

  unenroll: function (user_email, section_id, cb) {
    Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
      if (authErr || !foundAuth) {
        cb(authErr, null);
      } else {
        User.findOne({id: foundAuth.id}).exec(function findCB(userErr, foundUser) {
          if (userErr) {
            cb(userErr, null);
          } else {
            Section.findOne({section_id: section_id}).exec(function findCB(sectionErr, foundSection) {
              if (sectionErr || !foundSection) {
                cb (sectionErr, null);
              } else {
                if (!foundSection.quizzes) {
                  foundSection.quizzes = [];
                }
                if (!foundSection.students) {
                  foundSection.students = [];
                }
                if (foundSection.students.indexOf(foundUser.id) >= 0) {
                  foundSection.students.splice(foundSection.students.indexOf(foundUser.id), 1);
                }
                foundSection.save();
                if (!foundUser.enrolledIn) {
                  foundUser.enrolledIn = [];
                }
                if (foundUser.enrolledIn.indexOf(section_id) >= 0) {
                  foundUser.enrolledIn.splice(foundUser.enrolledIn.indexOf(section_id), 1);
                }
                if (!foundUser.usc_id) {
                  foundUser.usc_id = 0123456789;
                }
                foundUser.save()
                delete foundSection.students;
                cb(null, foundSection.toJSON());
              }
            });
          }
        });
      }
    });
  },

  classes: function(user_email, cb) {
    Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
      if (authErr) {
        cb(authErr, null);
      } else {
        User.findOne({id: foundAuth.id}).exec(function findCB(userErr, foundUser) {
          if (userErr) {
            cb(userErr, null);
          } else {
            var sections = [];
            async.each(foundUser.enrolledIn, function iterator(section_id, sectionCallback) {
              Section.findOne({section_id: section_id}).exec(function findCB(sectionErr, foundSection) {
                if (foundSection) {
                  delete foundSection.students;
                  sections.push(foundSection);
                }
                sectionCallback();
              });
            }, function done(err) {
                cb(null, sections);
            });
          }
        });
      }
    });
  },

  stats: function (user_email, section_id, cb) {
    Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
      if (authErr || !foundAuth) {
        cb(authErr, null);
      } else {
        User.findOne({id: foundAuth.id}).exec(function findCB(userErr, foundUser) {
          if (userErr) {
            cb(userErr, null);
          } else {
            var quizScores = [];

            async.each(foundUser.answerSets, function iterator(answer_set_id, answerSetCallback) {
              AnswerSet.findOne({id: answer_set_id}).exec(function findCB(answerSetErr, foundAnswerSet) {
                if (foundAnswerSet) {
                  Quiz.findOne({id: foundAnswerSet.quiz_id}).exec(function findCB(quizErr, foundQuiz) {
                    if (foundQuiz && (!section_id || foundQuiz.section_id == section_id)) {
                      var quizResult = {};
                      quizResult.quiz_name = foundQuiz.quiz_name;
                      quizResult.quiz_id = foundQuiz.id;
                      var numCorrect = 0.0;
                      async.each(foundAnswerSet.answers, function iterator(answer_id, answerCallback) {
                        Answer.findOne({id: answer_id}).exec(function findCB(answerErr, foundAnswer) {
                          if (foundAnswer && foundAnswer.answer_valid) {
                            numCorrect++;
                          }
                          answerCallback();
                        });
                      }, function done(err) {
                        var score = numCorrect / foundAnswerSet.answers.length;
                        quizResult.score = score * 100;
                        console.log("quizResult");
                        console.log(quizResult);
                        quizScores.push(quizResult);
                        answerSetCallback();
                      });
                    } else {
                      answerSetCallback();
                    }
                  });
                } else {
                  answerSetCallback();
                }
              });
            }, function done(err) {
              console.log("quizScores");
              console.log(quizScores);
              cb(null, quizScores);
            });
          } 
        });
      }
    });
  }

};
