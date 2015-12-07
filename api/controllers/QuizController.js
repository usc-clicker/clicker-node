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
					return res.status(200).send("Success");
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	}, 

	allQuestions: function(req,res) {
		if (req.query.quiz_id) {
			Quiz.allQuestions(req.query.quiz_id, function(error, correct) {
				if(error) {
					return res.status(400).send(error);
				} else {
					return res.send(200, correct);
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	}
};

