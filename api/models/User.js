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
    
    enrolledIn: {
      type: 'array',
      defaultsTo: []
    },

    answerSets: {
      type: 'array',
      defaultsTo: []
    }
    
  }),
  
  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate,

  enroll: function (user_email, section_id, cb) {

    Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
      if (authErr) {
        cb(authErr, null);
      } else {
        User.findOne({id: foundAuth.id}).exec(function findCB(userErr, foundUser) {
          if (userErr) {
            cb(userErr, null);
          } else {
            Section.findOne({section_id: section_id}).exec(function findCB(sectionErr, foundSection) {
              foundSection.students.push(foundUser.id);
              foundSection.save();
              foundUser.enrolledIn.push(section_id);
              foundUser.save()
              cb();
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
            async.each(foundUser.enrolledIn, function iterator(section, sectionCallback) {
              delete section.students;
              classes.push(section);
              sectionCallback();
            });
            cb(sections);
          }
        });
      }
    });
  },

  stats: function (user_email, cb) {
    Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
      if (authErr) {
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
                    if (foundQuiz) {
                      var quizResult = {};
                      quizResult.quiz_name = foundQuiz.quiz_name;
                      var numCorrect = 0.0;
                      foundAnswerSet.answer_validity.forEach(function(valid) {
                        if (valid)
                          numCorrect++;
                      });
                      var score = numCorrect / foundAnswerSet.answer_validity.length;
                      quizResult.score = score * 100;
                      console.log("quizResult");
                      console.log(quizResult);
                      quizScores.push(quizResult);
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
