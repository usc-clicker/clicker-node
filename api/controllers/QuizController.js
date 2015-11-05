/**
 * QuizController
 *
 * @description :: Server-side logic for managing Quizzes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	add: function(req,res) {
		if (req.body.quiz_id, req.body.question_id) {
			Quiz.add(req.body.quiz_id, req.body.question_id, function(error) {
				if (error) {
					return res.status(400).send(error);
				} else {
					return res.status(200).send("Push Sent");
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	}
};

