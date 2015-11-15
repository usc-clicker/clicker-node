/**
* Section.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var charts = require('quiche');

module.exports = {

  attributes: {

    course_id: {
      type: 'string',
      required: true
    },

  	section_id: {
      type: 'string',
      required: true
    },

    instructor: {
      type: 'string',
    },

    location: {
      type: 'string',
    },

    start_time: {
      type: 'string',
      required: true
    },

    end_time: {
      type: 'string',
      required: true
    },

    students: {
      type: 'array',
      defaultsTo: []
    },

    quizzes: {
      type: 'array',
      defaultsTo: []
    }

  },

  statisticsQuiz: function (section_id, quiz_id, cb) {
    Quiz.findOne({id: quiz_id}).exec(function findQuiz(quizErr, foundQuiz) {
      if (quizErr || !foundQuiz) {
        cb(quizErr, null);
      } else if (foundQuiz) {
        var quizResponse = [];
        async.each(foundQuiz.questionSet, function iterator(question_id, questionCallback) {
          Section.statisticsQuestion(section_id, quiz_id, question_id, function (error, response) {
            if (error) {
              cb(error, null);
            } else {
              quizResponse.push(response);
              questionCallback();
            }
          });
        }, function done(err) {
          cb(null, quizResponse);
        });
      }
    });
  },

  statisticsQuestion: function(section_id, quiz_id, question_id, cb) {
    Section.findOne({section_id: section_id}).exec(function findSection(sectionErr, foundSection) {
      if(sectionErr || !foundSection) {
        cb(sectionErr, null);
      } else if (foundSection) {
        console.log("foundSection");
        console.log(foundSection);
        var answerResponse = {};
        async.each(foundSection.students, function iterator(student_id, studentCallback) {
          User.findOne({id: student_id}).exec(function findStudent(studentErr, foundStudent) {
            if (studentErr) {
              cb(studentErr, null);
            } else {
              console.log("foundStudent");
              console.log(foundStudent);
              AnswerSet.findOne({quiz_id: quiz_id, user_id: foundStudent.id}).exec(function findAnswerSet(answerSetErr, foundAnswerSet) {
                if (answerSetErr || !foundAnswerSet) {
                  cb(answerSetErr, null);
                } else if (foundAnswerSet.answers) {
                  console.log("foundAnswerSet");
                  console.log(foundAnswerSet);
                  async.each(foundAnswerSet.answers, function iterator(answer_id, answerCallback) {
                    Answer.findOne({id: answer_id}).exec(function findAnswer(answerErr, foundAnswer) {
                      if (answerErr || !foundAnswer) {
                        cb(answerErr);
                      } else if (foundAnswer.question_id == question_id) {
                        console.log("foundAnswer");
                        console.log(foundAnswer);
                        console.log("looking for: " + question_id);
                        if (foundAnswer.answer_choice in answerResponse) {
                          answerResponse[foundAnswer.answer_choice] = answerResponse[foundAnswer.answer_choice] + 1;
                        } else {
                          answerResponse[foundAnswer.answer_choice] = 1;
                        }
                      }
                      answerCallback();
                    });
                  }, function done(err) {
                      studentCallback();
                  });
                }
              });
            }
          });
        }, function done(err) {
          cb(null, answerResponse);
        });
      }
    });
  },

  graphQuiz: function (section_id, quiz_id, cb) {
    Quiz.findOne({id: quiz_id}).exec(function findQuiz(quizErr, foundQuiz) {
      if (quizErr || !foundQuiz) {
        cb(quizErr, null);
      } else if (foundQuiz) {
        var quizResponse = [];
        async.each(foundQuiz.questionSet, function iterator(question_id, questionCallback) {
          Section.graphQuestion(section_id, quiz_id, question_id, function (error, response) {
            if (error) {
              cb(error, null);
            } else {
              quizResponse.push(response);
              questionCallback();
            }
          });
        }, function done(err) {
          cb(null, quizResponse);
        });
      }
    });
  },

  graphQuestion: function(section_id, quiz_id, question_id, cb) {

    Question.findOne({id: question_id}).exec(function findQuestion(questionErr, foundQuestion) {
      if (questionErr || !foundQuestion) {
        cb(questionErr, null);
      } else {
        Section.statisticsQuestion(section_id, quiz_id, question_id, function (error, response) {
          if (error) {
            cb(error, null);
          } else {
            var bar = new charts('bar');
            bar.setWidth(620);
            bar.setHeight(480);
            bar.setTitle(foundQuestion.question);
            bar.setBarWidth(20); 
            bar.setBarSpacing(80); // 6 pixles between bars/groups
            bar.setLegendBottom(); // Put legend at bottom
            bar.setTransparentBackground(); // Make background transparent

            var counts = [];
            var labels = [];
            for (var answer in response) {
              counts.push(response[answer]);
              labels.push(answer);
            }

            bar.addData(counts, 'Response', 'F44336');
            bar.setAutoScaling(); // Auto scale y axis
            bar.addAxisLabels('x', labels);

            var imageUrl = bar.getUrl(true); // First param controls http vs. https

            cb(null, {graphUrl: imageUrl.split('%2B').join('+')});
          }
        });
      }
    });
  }

};

