/**
* AnswerSet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		quiz_id: {
			type: 'string',
			required: true
		},

		user_id: {
			type: 'string',
			required: true
		},

		question_ids: {
			type: 'array',
			defaultsTo: []
		},

		answer_validity: {
			type: 'array',
			defaultsTo: []
		}

	}
};

