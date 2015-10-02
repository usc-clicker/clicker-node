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
					return res.send("Push Sent");
				}
			});
		} else {
			return res.status(400).send("Invalid request");
		}
  	},
};

