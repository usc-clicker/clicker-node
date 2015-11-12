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
  }

};

