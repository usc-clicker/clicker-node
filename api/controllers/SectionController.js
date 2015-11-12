/**
 * SectionController
 *
 * @description :: Server-side logic for managing Sections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	statisticsQuiz: function(req,res) {
		if (req.query.section_id, req.query.quiz_id) {
			Section.statisticsQuiz(req.query.section_id, req.query.quiz_id, function(error, correct) {
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

