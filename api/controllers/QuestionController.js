/**
 * QuestionController
 *
 * @description :: Server-side logic for managing Questions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	ask: function (req, res) {
		if (req.query.id) {
			Question.ask(req.query.id, function(error) {
				if (error) {
					return res.status(400).send(error);
				} else {
					return res.status(200).send("Push Sent");
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
  	},

  	answer: function (req, res) {
  		if (req.body.quiz_id && req.body.question_id && req.body.answer && req.body.location && req.body.user) {
  			Question.answer(req.body.quiz_id, req.body.question_id, req.body.answer, req.body.location, req.body.user, function(error, correct) {
  				if (error) {
					return res.status(400).send(error);
				} else {
					return res.status(200).send({
						correct: correct
					});
				}
  			});
  		} else {
			return res.status(400).send("Invalid request");
		}
  	}
};

