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
    },

  }
};

