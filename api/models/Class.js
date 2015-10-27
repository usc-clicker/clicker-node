/**
* Class.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var request = require('request');

module.exports = {

  attributes: {
  	
  	department: {
      type: 'string',
      required: true
    },

    course_id: {
      type: 'string',
      required: true
    },

    title: {
      type: 'string',
      required: true
    },

    sections: {
      collection: 'string'
    }

  },

  exists: function(course_id) {
    return false;
  },

  createClassWithSections: function(department, course, cb) {
    if (!Class.exists(course.PublishedCourseID)) {

      Class.create({
        department: department, 
        course_id: course.PublishedCourseID,
        title: course.CourseData.title
      }).exec(function createCB(err, createdClass){
        console.log('Created Class with id ' + createdClass.course_id);

        if (Array.isArray(course.CourseData.SectionData)) {
          course.CourseData.SectionData.forEach(function(section) {
            Class.createAndAddSection(createdClass, section, cb);
          });
        } else if (course.CourseData.SectionData) {
          Class.createAndAddSection(createdClass, course.CourseData.SectionData, cb);
        }

      });

    }
  },

  createAndAddSection: function(createdClass, section, cb) {
    var instructorName;
    if (Array.isArray(section.instructor)) {
      instructorName = section.instructor[0].first_name + section.instructor[1].last_name;
    } else if (section.instructor) {
      instructorName = section.instructor.first_name + section.instructor.last_name;
    }
    Section.create({
      course_id: createdClass.course_id,
      section_id: section.id,
      instructor: instructorName,
      // location: section.location,
      start_time: section.start_time,
      end_time: section.end_time
    }).exec(function createCB(err, createdSection) {
      if (err) {
        cb(err);
      } else {
        console.log('Created Section with id ' + createdSection.section_id);
        createdClass.sections.add(createdSection.section_id);
        createdClass.save();
      }
    });
  },

  importFromAPI: function (term, cb) {
    console.log("importFromAPI");

    var url = "http://web-app.usc.edu/web/soc/api/depts/" + term;
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var response = JSON.parse(body);
        response.department.forEach(function(school) {
          var deptCodes = [];

          if (Array.isArray(school.department)) {
            school.department.forEach(function(dept) {
              deptCodes.push(dept.code);
            });
          } else if (school.department) {
            deptCodes.push(school.department.code);
          }

          deptCodes.forEach(function(deptCode) {
            var url = "http://web-app.usc.edu/web/soc/api/classes/" + deptCode + "/" + term;
            request(url, function(deptError, deptResponse, deptBody) {
              if (!deptError && deptResponse.statusCode == 200) {
                var deptResponse = JSON.parse(deptBody);

                if (Array.isArray(deptResponse.OfferedCourses.course)) {
                  deptResponse.OfferedCourses.course.forEach(function(course) {
                    Class.createClassWithSections(deptResponse.Dept_Info.department, course, cb);
                  });
                } else if (deptResponse.OfferedCourses.course) {
                  Class.createClassWithSections(deptResponse.Dept_Info.department, deptResponse.OfferedCourses.course, cb);
                }

              } else {
                cb(deptError);
              }
            });
          });
          
        })
      } else {
        cb(error);
      }
    });
    
  }
};

