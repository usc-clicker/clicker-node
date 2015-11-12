/**
* Section.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

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
    var A = [], B = [], C = [], D = [];
    Section.findOne({id: section_id}).exec(function findSection(sectionErr, foundSection) {
      if(sectionErr) {
        cb(sectionErr, null);
      } else if (foundSection) {
        for(var i = 0; i < foundSection.students.length; i++) {
          User.findOne({id: foundSection.students[i]}).exec(function findStudent(studentErr, foundStudent) {
            if(studentErr) {
              cb(studentErr, null);
            }
            else if (foundStudent) {
              AnswerSet.find({quiz_id: quiz_id}).exec(function findAnswerSet(answerSetErr, foundAnswerSet) {
                if(answerSetErr) {
                  cb(answerSetErr, null);
                } else if (foundAnswerSet) {
                  while(foundAnswerSet.length) {
                    var answerSet = foundAnswerSet.pop();
                    cb(null, answerSet);
                    if(answerSet.user_id == foundStudent.id.toString()) {
                      for(var j = 0; j < answerSet.answer_choice.length; j++) {
                        if(A.length < answerSet.answer_choice.length) {
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
                    }
                  }
                }
                else {
                  cb("No answer set for this quiz exists", null);
                }
              });
            }
            else {
              cb("Student Section Mismatch. Make sure the student id in the Section table is actually in the User table.");
            }
          });
        }
        var correct = [];
        correct.push(A);
        correct.push(B);
        correct.push(C);
        correct.push(D);
        //cb(null, correct);
      }
      else {
        cb("Could not find Section", null);
      }
    });
    
  }
};

