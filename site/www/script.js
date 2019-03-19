// page setup

$(document).ready(function(){
  $("#button-1").click(function(){
  	// go to instructions page, show nav
    $("#section-1").hide();
    $("#section-2").show();
    $("#nav").show();
  });

  $("#prev-2").click(function(){
  	// go back to start page
    $("#section-1").show();
    $("#section-2").hide();
    $("#nav").hide();
  });

  $("#next-2").click(function(){
  	// go to select page
    $("#section-2").hide();
    $("#prev-2").hide();
    $("#next-2").hide();

    $("#section-3").show();
    $("#prev-3").show();
    $("#next-3").show();

  	document.getElementById("dot-1").style.border = "4px solid #343434";
    document.getElementById("dot-2").style.border = "4px solid #141414";
    document.getElementById("dot-3").style.border = "4px solid #141414";
  });

  $("#prev-3").click(function(){
  	// go back to instruction page
    $("#section-3").hide();
    $("#prev-3").hide();
    $("#next-3").hide();

    $("#section-2").show();
    $("#prev-2").show();
    $("#next-2").show();

    document.getElementById("dot-1").style.border = "4px solid #141414";
    document.getElementById("dot-2").style.border = "4px solid #141414";
    document.getElementById("dot-3").style.border = "4px solid #141414";
  });

  // next-3 go to animation -> see below

  $("#prev-4").click(function(){
  	// go back to select page
    $("#section-4").hide();
    $("#prev-4").hide();
    $("#next-4").hide();

    $("#section-3").show();
    $("#prev-3").show();
    $("#next-3").show();

    document.getElementById("dot-1").style.border = "4px solid #343434";
    document.getElementById("dot-2").style.border = "4px solid #141414";
    document.getElementById("dot-3").style.border = "4px solid #141414";

	// empty section 4 (delete canvas)
	document.getElementById('section-4').innerHTML = "";
  });

	$("#next-4").click(function(){
		// go to print
		$("#section-4").hide();
		$("#prev-4").hide();
		$("#next-4").hide();

		$("#section-5").show();
		// no buttons just a timer

		document.getElementById("dot-1").style.border = "4px solid #141414";
		document.getElementById("dot-2").style.border = "4px solid #141414";
		document.getElementById("dot-3").style.border = "4px solid #343434";

		// set timer to reload after 15s
		setTimeout(function() {location.reload()}, 10000)
	});

	// page 5 has no buttons






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
			.attr('id', d => 'card' + d.code)

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
					d3.select('#sel' + d.code).remove()
				} else {
					selectedEvents.push(d)
					d3.select(this.parentNode).classed('selected', true)
					d3.select(this).html('- remove')
					var box = d3.select('#selectedevents').append('div')
						.attr('id', 'sel' + d.code)
						.classed('selectedbox', true)
					box.text(d.title)
					box.append('div')
						.classed('selectedx', true)
						.html('X')
						.on('click', function() {
							var index = selectedEvents.findIndex(e => e.url == d.url)
							selectedEvents.splice(index, 1)
							d3.select(this.parentNode).remove()
							d3.select('#card' + d.code).classed('selected', false)
							d3.select('#card' + d.code).select('.card-button').text('+ select')


						})
				}
				console.log(selectedEvents)
			})

		d3.select('#next-3').on('click', function() {
			// go to animation page
			console.log(selectedEvents)
					
			$("#section-3").hide();
			$("#prev-3").hide();
			$("#next-3").hide();

			$("#section-4").show();
			$("#prev-4").show();
		    $("#next-4").show();

		    document.getElementById("dot-1").style.border = "4px solid #141414";
		    document.getElementById("dot-2").style.border = "4px solid #343434";
		    document.getElementById("dot-3").style.border = "4px solid #141414";

			drawVis(selectedEvents)
		})

	});
});
