/**
 * SectionController
 *
 * @description :: Server-side logic for managing Sections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	graphQuiz: function(req,res) {
		if (req.query.section_id, req.query.quiz_id) {
			Section.graphQuiz(req.query.section_id, req.query.quiz_id, function (error, result) {
				if(error) {
					return res.status(400).send(error);
				} else {
					return res.send(200, result);
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	},

	statisticsQuiz: function(req,res) {
		if (req.query.section_id, req.query.quiz_id) {
			Section.statisticsQuiz(req.query.section_id, req.query.quiz_id, function (error, correct) {
				if(error) {
					return res.status(400).send(error);
				} else {
					return res.send(200, correct);
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	},

	graphQuestion: function(req, res) {
		if (req.query.section_id, req.query.quiz_id, req.query.question_id) {
			Section.graphQuestion(req.query.section_id, req.query.quiz_id, req.query.question_id, function (error, result) {
				if (error) {
					return res.status(400).send(error);
				} else {
					return res.send(200, result);
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
	},

	statisticsQuestion: function(req,res) {
		if (req.query.section_id, req.query.quiz_id, req.query.question_id) {
			Section.statisticsQuestion(req.query.section_id, req.query.quiz_id, req.query.question_id, function (error, correct) {
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

