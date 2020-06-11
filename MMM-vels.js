/* global Module */

/* Magic Mirror
 * Module: MMM-expenditures
 *
 * By dangrie158
 * MIT Licensed.
 */
Module.register('MMM-velss', {

	defaults: {
		host: undefined,
		reloadInterval: 10 * 60 * 1000, // every 10 minutes
	},

	requiresVersion: '2.1.0', // Required version of MagicMirror

	// Define required scripts.
	getStyles: function () {
		return ['MMM-vels.css'];
	},

	getScripts: function () {
		return ['sparkline.js']
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
		self.data = [Date(), 0, 0];
		self.sendSocketNotification('GET_VELSDATA', { 'config': self.config });
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		var self = this;

		if (notification === 'NEW_VELSDATA') {
			self.data = payload.data;
			self.updateDom();
		}
	},

	isToday: function(someDate) {
		const today = new Date()
		return someDate.getDate() == today.getDate() &&
			someDate.getMonth() == today.getMonth() &&
			someDate.getFullYear() == today.getFullYear()
	},

	// Override dom generator.
	getDom: function () {
		var self = this;

		var wrapper = document.createElement('div');

		var headerWrappper = document.createElement('header');
		headerWrappper.innerHTML = self.translate('HEADER');
		wrapper.appendChild(headerWrappper)


		var contentWrapper = document.createElement('div');

		sparklineData = [];
		for (var i in self.data) {
			data = self.data[i];
			data.date = Date.parse(data.date)
			if( self.isToday(data.date) ){
				sparklineData.push(data)
			}
		}

		if(sparklineData.length == 0){
			var nodataPar = document.createElement('p')
			nodataPar.innerHTML = self.translate('NO_DATA')
			contentWrapper.appendChild(nodataPar);
		}else{
			var currentData = sparklineData[sparklineData.length - 1];
			var active = currentData.act;
			var free = currentData.free;
			var total = active + free;
			var usageClass = '';
			if(active <= (total * 0.34)){
				usageClass = 'low';
			}else if(active <= (total * 0.66)){
				usageClass = 'medium';
			}else{
				usageClass = 'high';
			}

			var sparkline = document.createElement('svg');
			sparkline.id = 'sparkline';
			sparkline.width = sparklineData.length * 2;
			sparkline.height = '60';
			sparkline.strokeWidth = '3';
			sparkline.classList.add('sparkline'+usageClass);
			contentWrapper.appendChild(sparkline);

			var sparklineScript = document.createElement('script');
			sparklineScript.innerHTML = 'sparkline(document.getElementById("sparkline"), ' + sparklineData + ');';
			contentWrapper.appendChild(sparklineScript);

			var dataText = document.createElement('p');
			dataText.innerHTML = '<span class="vels data'+ usageClass +'">' + active + '</span>';
			dataText.innerHTML += '<span class="vels datatotal">/' + total + '</span>';
			contentWrapper.appendChild(dataText);
		}

		return wrapper;
	}
});
