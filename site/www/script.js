// page setup

$(document).ready(function(){
  $(window).scroll(function() {
      var scroll = $(window).scrollTop();

      if (scroll >= 130) {
          //clearHeader, not clearheader - caps H
          $("#bar").addClass("fixed-bar");
      }
      else {
        $("#bar").removeClass("fixed-bar");
      }
  }); //missing );


});


// date formatting + parsing
var prettyDate = d3.timeFormat("%d %B %Y"); // e.g. 01 August 2018
var parseDate = d3.timeParse("%Y-%m-%d") //e.g. 2018-08-01

// check if shiny session has been initialised
$(document).on('shiny:sessioninitialized', function(event) {

	// set date inputs - shiny doesn't like these as they are so we have to help a little
	Shiny.onInputChange("date_from", "2018-08-01")
	Shiny.onInputChange("date_to", "2018-08-31")

	d3.select('#date_from').on('change', function() {
		var date_from = document.getElementById('date_from').value
		Shiny.onInputChange("date_from", date_from)
	})
	d3.select('#date_to').on('change', function() {
		var date_to = document.getElementById('date_to').value
		Shiny.onInputChange("date_to", date_to)
	})


	// create cards
	Shiny.addCustomMessageHandler('eventdata', function(events_raw) {
		var events = JSON.parse(events_raw)
		console.log(events)

		var selectedEvents = []

		var div = d3.select('#eventoutput')
		div.selectAll('*').remove()

		var card = div.selectAll('.card')
			.data(events)
			.enter()
			.append('div')
			.classed('card', true)

		var items = card.append('div')
				.classed('card-items', true)

		items.append('img')
			.classed('card-image', true)
			.attr('src', function(d) {
				var imgs = Object.values(d.images)
				var index = imgs.findIndex(d => d.orientation == 'square')
				if (index == -1) {index = 0}
				return imgs[index].versions['square-150'].url
			})

		items.append('div')
			.classed('card-text', true)
			.html(function(d) {
				var dates = d.performances.filter(function(p) {
					var min = d3.isoParse(document.getElementById('date_from').value)
					var max = d3.isoParse(document.getElementById('date_to').value)
					var now = d3.isoParse(p.start)
					return ((now >= min) && (now <= max))
				})
				return 	'<h2 class="date">' + prettyDate(d3.isoParse(dates[0].start)) + '</h2>' +
						'<h2 class="title">'+ d.title + '</h2>' +
						'<h2 class="artist">' + (d.artist ? d.artist : 'Unknown') + '</h2>' +
						'<h2 class="venue">'+ d.venue.name + '</h2>'
			})

		card.append('a')
			.classed('card-button', true)
			.text('+ select')
			.on('click', function(d) {
				if (d3.select(this.parentNode).classed('selected')) {
					// delete from selectedEvents !
					var index = selectedEvents.findIndex(e => e.url == d.url)
					selectedEvents.splice(index, 1)
					d3.select(this.parentNode).classed('selected', false)
					d3.select(this).text('+ select')
				} else {
					selectedEvents.push(d)
					d3.select(this.parentNode).classed('selected', true)
					d3.select(this).text('- remove')
				}
				console.log(selectedEvents)
			})

		d3.select('#next-3').on('click', function() {
			console.log(selectedEvents)

			$("#section-3").hide();
			$("#prev-3").hide();
			$("#next-3").hide();

			$("#section-4").show();
			$("#prev-4").show();

			drawVis(selectedEvents)
		})

	});
});
