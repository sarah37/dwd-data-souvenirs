// page setup

$(document).ready(function(){
  $("#button-1").click(function(){
    $("#section-1").hide();
    $("#section-2").show();
    $("#nav").show();
  });

  $("#prev-1").click(function(){
    $("#section-1").show();
    $("#section-2").hide();
    $("#nav").hide();
  });

  $("#next-1").click(function(){
    $("#section-2").hide();
    $("#prev-1").hide();
    $("#next-1").hide();

    $("#section-3").show();
    $("#prev-2").show();
    $("#next-2").show();

    document.getElementById("dot-1").style.border = "none";
  });

  $("#prev-2").click(function(){
    $("#section-3").hide();
    $("#prev-2").hide();
    $("#next-2").hide();

    $("#section-2").show();
    $("#prev-1").show();
    $("#next-1").show();

    document.getElementById("dot-1").style.border = "4px solid #141414";
  });

  $("#prev-3").click(function(){
    $("#section-4").hide();
    $("#prev-3").hide();
    // $("#next-2").hide();

    $("#section-3").show();
    $("#prev-2").show();
    $("#next-2").show();

    // document.getElementById("dot-1").style.border = "4px solid #141414";
  });

});

// create cards

// date formatting
var formatDate = d3.timeFormat("%d %B %Y");

Shiny.addCustomMessageHandler('eventdata', function(events_raw) {
	var events = JSON.parse(events_raw)
	console.log(events)

	var selectedEvents = []

	var div = d3.select('#eventoutput')

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
			console.log(d.performances)
			var dates = d.performances.filter(function(p) {return (d3.isoParse(p.start) >= d3.isoParse('2018-08-01 00:00:00'))})
			 // && (d3.isoParse(p.start) <= d3.isoParse('2018-08-31 23:59:59'))
			console.log(dates)
			return 	'<h2 class="date">' + formatDate(d3.isoParse(dates[0].start)) + '</h2>' +
					'<h2 class="title">'+ d.title + '</h2>' +
					// '<h2 class="artist">' + d.artist + '</h2>' +
					'<h2 class="venue">'+ d.venue.name + '</h2>'
		})

	card.append('a')
		.classed('card-button', true)
		.text('+ select')
		.on('click', function(d) {
			selectedEvents.push(d)
			console.log(selectedEvents)
			d3.select(this).attr('id', 'selected')
		})

	d3.select('#next-2').on('click', function() {
		console.log(selectedEvents)
				
		$("#section-3").hide();
		$("#prev-2").hide();
		$("#next-2").hide();

		$("#section-4").show();
		$("#prev-3").show();

		drawVis(selectedEvents)
	})

});