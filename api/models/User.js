/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

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

  enroll: function (options, cb) {

    User.findOne(options.id).exec(function (err, theUser) {
      if (err) return cb(err);
      if (!theUser) return cb(new Error('User not found.'));
      theUser.enrolledIn.push(options.courses);
      theUser.save(cb);
    });
  },

  stats: function (user_email, cb) {
    Auth.findOne({email: user_email}).exec(function findCB(authErr, foundAuth) {
      if (authErr) {
        cb(authErr);
      } else {
        var quizScores = [];
        foundAuth.user.answerSets.forEach(function(answer_set_id) {
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
                  quizResult.score = numCorrect / foundAnswerSet.answer_validity.length;
                  quizScores.push(quizResult);;
                }
              });
            }
          });
        });
        cb(quizScores);
      }
    });
  }

};
