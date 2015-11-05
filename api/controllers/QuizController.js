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
	}, 

	allQuestions: function(req,res) {
		if (req.query.quiz_id) {
			Quiz.findOne({id: quiz_id}).exec(function findQuiz(quizErr, quizFound) {
		      if(quizErr) {
		        console.log(quizErr);
		        return res.status(400).send(quizErr);
		      }
		      else if (!quizFound) {
		        console.log("Could not find quiz");
		        return res.status(400).send("Could not find quiz");
		      }
		      else {
		        console.log("Found Quiz. Returning Question Set");
		        return res.status(200).send(JSON.parse(quizFound.questionSet));
		      }
		    });
		} else {
			return res.status(400).send("Invalid request");
		}
	}
};

