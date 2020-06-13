/* global Module */

/* Magic Mirror
 * Module: MMM-vels
 *
 * By dangrie158
 * MIT Licensed.
 */
var NodeHelper = require("node_helper");
var request = require("request");


module.exports = NodeHelper.create({
	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (notification === "GET_VELSDATA") {
			self.updateVelsData(payload.config.host);

			setInterval(function () { self.updateVelsData(payload.config.host); }, payload.config.reloadInterval);
		}
	},

	updateVelsData: function (host) {
		var self = this;
		var expenditures_url = host + '/vels.json';

		request(expenditures_url, function (error, response, dataBody) {
			if (!error && response.statusCode == 200) {
				let payload = {
					data: JSON.parse(dataBody)
				}
				self.sendSocketNotification("NEW_VELSDATA", payload);
			}
		});
	}
});