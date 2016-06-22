// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var $quakesList = $("#info");
var template;

$(document).on("ready", function() {

	$.get(weekly_quakes_endpoint,function(data) {
		var source = $("#quakeScript").html();
		template = Handlebars.compile(source);
		var quakeResults = data.features;	
		var coordinate = {};
		var today = Date.now();
		var severity;

		quakeResults.forEach(function(currQuake) {
			if(currQuake.properties.mag < 4) {
				severity="greenDot";
			} else if (currQuake.properties.mag < 5) {
				severity="yellowDot";
			} else if (currQuake.properties.mag < 6) {
				severity="orangeDot";
			}
			else {
				severity = "redDot";
			} 

			currQuake.properties.severity = severity;
			var howLongAgo = Math.round((today - currQuake.properties.time) / (1000*60*60)); //howLongAgo is in hours
			currQuake.properties.howLongAgo = howLongAgo;
			var lat = currQuake.geometry.coordinates[0];
			var lon = currQuake.geometry.coordinates[1];
			coordinate.lat = lat;
			coordinate.lng = lon;
			var marker = new google.maps.Marker({
			    position: coordinate,
			    map: map,
			    title: currQuake.properties.title
			});
		});

		var trackHTML = template({quakes: quakeResults});
		$("#info").append(trackHTML);
	});
});
