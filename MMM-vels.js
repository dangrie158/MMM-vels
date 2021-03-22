/* global Module */

/* Magic Mirror
 * Module: MMM-expenditures
 *
 * By dangrie158
 * MIT Licensed.
 */
Module.register('MMM-vels', {

	defaults: {
		host: undefined,
		reloadInterval: 10 * 60 * 1000, // every 10 minutes,
		opensAt: [6, 00], // should be in UTC
	},

	requiresVersion: '2.1.0', // Required version of MagicMirror

	// Define required scripts.
	getStyles: function () {
		return ['MMM-vels.css'];
	},

	getScripts: function () {
		return ['sparkline.js'];
	},

	// Load translations files
	getTranslations: function () {
		return {
			en: 'translations/en.json',
			de: 'translations/de.json'
		};
	},

	// Overrides start function.
	start: function () {
		var self = this;
		self.velsdata = [];
		self.sendSocketNotification('GET_VELSDATA', { 'config': self.config });
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (notification === 'NEW_VELSDATA') {
			self.velsdata = payload.data;
			self.updateDom();
			Log.log("UPDATE DOM");
		}
	},

	isToday: function (someDate) {
		const today = new Date()
		return someDate.getDate() == today.getDate() &&
			someDate.getMonth() == today.getMonth() &&
			someDate.getFullYear() == today.getFullYear()
	},

	isDuringOpeningHours: function (someDate) {
		return someDate.getHours() >= this.config.opensAt[0] &&
			someDate.getMinutes() >= this.config.opensAt[1]
	},

	getHeader: function () {
		return this.translate('HEADER');
	},

	// Override dom generator.
	getDom: function () {
		var self = this;

		var wrapper = document.createElement('div');

		wrapper.classList.add('vels');

		var sparklineData = [];
		var data = self.velsdata.results[0].series[0].values;
		for (var i in data) {
			current_data = data[i];
			let date = new Date(Date.parse(current_data[0]));
			if (self.isToday(date) && self.isDuringOpeningHours(date)) {

				sparklineData.push({
					"date": date,
					"act": current_data[1],
					"total": current_data[2],
				})
			}
		}

		if (sparklineData.length == 0) {
			var nodataPar = document.createElement('p');
			nodataPar.innerHTML = self.translate('NO_DATA');
			nodataPar.classList.add('datanone');
			wrapper.appendChild(nodataPar);
		} else {
			var currentData = sparklineData[sparklineData.length - 1];
			var active = currentData.act;
			var total = currentData.total;
			var usageClass = '';
			if (active <= total * 1 / 3) {
				usageClass = 'low';
			} else if (active <= total * 2 / 3) {
				usageClass = 'medium';
			} else {
				usageClass = 'high';
			}

			var sparkline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			sparkline.id = 'sparkline';
			sparkline.setAttribute('width', sparklineData.length * 3);
			sparkline.setAttribute('height', total);
			sparkline.setAttribute('stroke-width', 3);
			wrapper.appendChild(sparkline);

			var sparklineScript = document.createElement('script');
			var datastring = '[' + sparklineData.map((v) => v.act).join(',') + ']'
			sparklineScript.innerHTML = "Module.definitions['MMM-vels'].generateSparkline(" + datastring + ", " + total + ");";
			wrapper.appendChild(sparklineScript);

			var dataText = document.createElement('p');
			dataText.innerHTML = '<span class="vels data' + usageClass + '">' + active + '</span>';
			dataText.innerHTML += '<span class="vels datatotal">/' + total + '</span>';
			wrapper.appendChild(dataText);
		}

		return wrapper;
	},

	generateSparkline: function (linedata, total) {
		let svgelem = document.getElementById("sparkline")
		sparkline.sparkline(svgelem, linedata, { max: total });
		let gradient = sparkline.buildElement('linearGradient', {
			id: 'velsgrad',
			x1: '0%',
			y1: '100%',
			x2: '0%',
			y2: '0%'
		});

		let stop1 = sparkline.buildElement('stop', {
			offset: '0%',
			style: "stop-color:greenyellow;stop-opacity:0.5"
		});
		let stop2 = sparkline.buildElement('stop', {
			offset: '100%',
			style: "stop-color:red;stop-opacity:0.5"
		});
		gradient.appendChild(stop1);
		gradient.appendChild(stop2);

		svgelem.appendChild(gradient)
	}
});
