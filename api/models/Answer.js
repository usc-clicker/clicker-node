/**
* Answer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	question_id: {
  		type: 'string',
  		required: true
  	},

  	//Whether or not the Answer is correct
  	answer_valid: {
  		type: 'boolean',
  		required: true
  	},

  	//The actual answer choice that they chose
  	answer_choice: {
  		type: 'string',
  		required: true
  	}

  }
};

