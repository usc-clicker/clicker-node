/**
* Section.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var charts = require('quiche');
var red500 = 'F44336';
var yellow700 = 'FBC02D';

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
            if (foundStudent) {
              console.log("foundStudent");
              console.log(foundStudent);
              AnswerSet.findOne({quiz_id: quiz_id, user_id: foundStudent.id}).exec(function findAnswerSet(answerSetErr, foundAnswerSet) {
                if (foundAnswerSet && foundAnswerSet.answers) {
                  console.log("foundAnswerSet");
                  console.log(foundAnswerSet);
                  async.each(foundAnswerSet.answers, function iterator(answer_id, answerCallback) {
                    Answer.findOne({id: answer_id}).exec(function findAnswer(answerErr, foundAnswer) {
                      if (answerErr || !foundAnswer) {
                        cb(answerErr, null);
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
                } else {
                  studentCallback();
                }
              });
            } else {
              studentCallback();
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
          console.log("statisticsQuestion response");
          console.log(response);
          if (error || !response) {
            cb(error, null);
          } else {
            var bar = new charts('bar');
            bar.setWidth(625);
            bar.setHeight(480);
            bar.title = {
                          'text': foundQuestion.question,
                          'color': '000000',
                          'size': 20,
                          'align': 'c'
                        };
            bar.setBarWidth(20); 
            bar.setBarSpacing(80); 
            bar.setLegendHidden(); 
            bar.setTransparentBackground(); 

            var counts = [];
            var labels = [];
            var colors = [];

            foundQuestion.choices.forEach(function (choice) {
              if (response[choice]) {
                counts.push(response[choice]);
              } else {
                counts.push(0);
              }
              labels.push(choice);
              if (choice === foundQuestion.answer) {
                colors.push(yellow700);
              } else {
                colors.push(red500);
              }
            });

            bar.addData(counts, 'Response', colors.join('|'));
            bar.setAutoScaling(); // Auto scale y axis
            bar.addAxisLabels('x', labels);

            var imageUrl = bar.getUrl(true);

            cb(null, {
              graphUrl: imageUrl.split('%2B').join('+'),
              counts: counts,
              labels: labels,
              colors: colors.join('|')
            });
          }
        });
      }
    });
  }

};

