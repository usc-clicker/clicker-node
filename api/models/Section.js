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
    
    Section.findOne({id: section_id}).exec(function findSection(sectionErr, foundSection) {
      if(sectionErr) {
        cb(sectionErr, null);
      } else if (foundSection) {
        var A = [], B = [], C = [], D = [], correct = [];
        for(var i = 0; i < foundSection.students.length; i++) {
          User.findOne({id: foundSection.students[i]}).exec(function findStudent(studentErr, foundStudent) {
            if(studentErr) {
              cb(studentErr, null);
            }
            else if (foundStudent) {
              AnswerSet.find({quiz_id: quiz_id.toString(), user_id: foundStudent.id.toString()}).exec(function findAnswerSet(answerSetErr, foundAnswerSet) {
                if(answerSetErr) {
                  cb(answerSetErr, null);
                } else {
                  while(foundAnswerSet.length) {
                    var answerSet = foundAnswerSet.pop();
                      for(var j = 0; j < answerSet.answer_choice.length; j++) {
                        if(A.length <= j) {
                          A.push(0);
                          B.push(0);
                          C.push(0);
                          D.push(0);
                        }
                        if(answerSet.answer_choice[j].toUpperCase() == "A") {
                          A[j]++;
                        }
                        else if (answerSet.answer_choice[j].toUpperCase() == "B") {
                          B[j]++;
                        }
                        else if (answerSet.answer_choice[j].toUpperCase() == "C") {
                          C[j]++;
                        }
                        else if (answerSet.answer_choice[j].toUpperCase() == "D") {
                          D[j]++;
                        }
                      }
                      if(correct.length < 4) {
                        correct.push(A);
                        correct.push(B);
                        correct.push(C);
                        correct.push(D);
                      } else {
                        correct[0] = A;
                        correct[1] = B;
                        correct[2] = C;
                        correct[3] = D;
                        if ( i == foundSection.students.length && foundAnswerSet.length == 0) {
                          cb(null, correct);
                        }
                        //cb(null, correct);
                      }
                      
                      
                    }
                  }
              });
            }
            else {
              cb("Student Section Mismatch. Make sure the student id in the Section table is actually in the User table.");
            }
          });
        }
        //var correct = [];
      }
      else {
        cb("Could not find Section", null);
      }
    });
  },

  statisticsQuestion: function (section_id, quiz_id, index, cb) {
    
    Section.findOne({id: section_id}).exec(function findSection(sectionErr, foundSection) {
      if(sectionErr) {
        cb(sectionErr, null);
      } else if (foundSection) {
        var A = 0, B = 0, C = 0, D = 0, correct = [];
        for(var i = 0; i < foundSection.students.length; i++) {
          User.findOne({id: foundSection.students[i]}).exec(function findStudent(studentErr, foundStudent) {
            if(studentErr) {
              cb(studentErr, null);
            }
            else if (foundStudent) {
              AnswerSet.find({quiz_id: quiz_id.toString(), user_id: foundStudent.id.toString()}).exec(function findAnswerSet(answerSetErr, foundAnswerSet) {
                if(answerSetErr) {
                  cb(answerSetErr, null);
                } else {
                  while(foundAnswerSet.length) {
                    var answerSet = foundAnswerSet.pop();
                    if(answerSet.answer_choice.length <= index) {
                      cb("Index is invalid", null);
                    } else {
                      if(answerSet.answer_choice[index].toUpperCase() == "A") {
                        A++;
                      }
                      else if (answerSet.answer_choice[index].toUpperCase() == "B") {
                        B++;
                      }
                      else if (answerSet.answer_choice[index].toUpperCase() == "C") {
                        C++;
                      }
                      else if (answerSet.answer_choice[index].toUpperCase() == "D") {
                        D++;
                      }
                      if(correct.length < 4) {
                        correct.push(A);
                        correct.push(B);
                        correct.push(C);
                        correct.push(D);
                      } else {
                        correct[0] = A;
                        correct[1] = B;
                        correct[2] = C;
                        correct[3] = D;
                        if ( i == foundSection.students.length && foundAnswerSet.length == 0) {
                          cb(null, correct);
                        }
                      }
                    }
                  }
                }
              });
            }
            else {
              cb("Student Section Mismatch. Make sure the student id in the Section table is actually in the User table.");
            }
          });
        }
        //var correct = [];
      }
      else {
        cb("Could not find Section", null);
      }
    });
  },

  graphQuestion: function(section_id, quiz_id, question_id, cb) {

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

  }

};

