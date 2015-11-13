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
    }

  },

  statisticsQuiz: function (section_id, quiz_id, cb) {
    Quiz.findOne({id: quiz_id}).exec(function findQuiz(quizErr, foundQuiz) {
      if (quizErr) {
        cb(quizErr, null);
      } else {
        var quizResponse = [];
        async.each(foundQuiz.questionSet, function iterator(question_id, questionCallback) {
          statisticsQuestion(section_id, quiz_id, question_id, function (error, response) {
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
    Section.findOne({id: section_id}).exec(function findSection(sectionErr, foundSection) {
      if(sectionErr) {
        cb(sectionErr, null);
      } else {
        var answerResponse = {};
        async.each(foundSection.students, function iterator(student_id, studentCallback) {
          User.findOne({id: student_id}).exec(function findStudent(studentErr, foundStudent) {
            if (studentErr) {
              cb(studentErr, null);
            } else {
              AnswerSet.find({quiz_id: quiz_id, user_id: foundStudent.id}).exec(function findAnswerSet(answerSetErr, foundAnswerSet) {
                if (answerSetErr) {
                  cb(answerSetErr, null);
                } else {
                  async.each(foundAnswerSet.answers, function iterator(answer_id, answerCallback) {
                    Answer.findOne({id: answer_id}).exec(function findAnswer(answerErr, foudAnswer) {
                      if (answerErr) {
                        cb(answerErr);
                      } else if (foundAnswer.question_id == question_id) {
                        if (foundAnswer.answer_choice in answerResponse) {
                          answerResponse[foundAnswer.answer_choice] = foundAnswer.answer_choice[foundAnswer.answer_choice] +1;
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

  graphQuestion: function(section_id, quiz_id, question_id, cb) {

    statisticsQuestion(section_id, quiz_id, question_id, function (error, response) {
      if (error) {
        cb(error, null);
      } else {
        var bar = new charts('bar');
        bar.setWidth(400);
        bar.setHeight(265);
        bar.setTitle('QUESTION GOES HERE');
        bar.setBarStacked(); // Stacked chart
        bar.setBarWidth(0); 
        bar.setBarSpacing(6); // 6 pixles between bars/groups
        bar.setLegendBottom(); // Put legend at bottom
        bar.setTransparentBackground(); // Make background transparent

        bar.addData([19, 19, 21, 14, 19, 11, 10, 18, 19, 30], 'Foo', 'FF0000');
        bar.addData([4, 3, 2, 3, 0, 0, 3, 4, 2, 2], 'bar', '0000FF');
        bar.addData([10, 8, 2, 1, 18, 9, 20, 21, 19, 11], 'bin', '008000');
        bar.addData([2, 1, 1, 1, 1, 7, 3, 6, 2, 7], 'bash', '00FF00');
        bar.addData([1, 0, 0, 1, 2, 1, 0, 0, 0, 0], 'blah', '307000');     

        bar.setAutoScaling(); // Auto scale y axis
        bar.addAxisLabels('x', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

        var imageUrl = bar.getUrl(true); // First param controls http vs. https

        cb(null, {graphUrl: imageUrl});
      }
    });
  }

};

