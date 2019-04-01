// date formatting + parsing
var prettyDate = d3.timeFormat("%d %B %Y"); // e.g. 01 August 2018
var parseDate = d3.timeParse("%Y-%m-%d") //e.g. 2018-08-01
var parseISO = d3.timeParse("%Y-%m-%d %H:%M:%S");

var date_from = '2018-08-01+00:00:00';
var date_to = '2018-08-31+23:59:59';

function starList() {

	for (var i = 0; i < selectedEvents.length; i++) {
		selectedEvents[i].starred = false;
	}

	var divs = d3.select('#starlist')
		.selectAll('div')
		.data(selectedEvents)
		.enter()
		.append('div')
		.classed('starcard', true)
		.html(d => d.title)

	var stars = divs.append('div')
		.classed('star', true) //black &#9733; ☆	White Star	&#9734;
		.html('&#9733;')
	divs.on('click', function(d,i) {
			selectedEvents[i].starred = !selectedEvents[i].starred;
			d3.select(this)
				.classed('selected', !d3.select(this).classed('selected'))
		})
}

function updateCards(data) {

	var params = {title: $('#title').val(),
		artist: $('#artist').val(),
		venue: $('#venue').val()}

	Object.keys(params).forEach(function(key) {
		if (params[key] == '') {delete params[key]}
	})

	var str = 'year=2018&date_from=' + date_from + '&date_to=' + date_to +
	'&' + $.param( params );

	$.ajax({
		type: "POST", //AJAX type is "Post".
		url: "/select-vis/php/api.php", //Data will be sent to "api.php".
		data: {
			query: str
			},
		success: function(data) {
			drawCards(data)
		}
	});
}

function drawCards(data) {
	var events = JSON.parse(data)

	var div = d3.select('#eventoutput')
	div.selectAll('*').remove()

	var card = div.selectAll('.col-md-3')
		.data(events)
		.enter()
		.append('div')
		.classed('col-md-3', true)
		.append('div')
		.classed('card', true)
		.attr('id', d => 'card' + d.code)

	var items = card.append('div')
		.classed('card-items', true)

	items.append('div')
		.classed('card-img', true)
		.style('background-image', function(d) {
		var imgs = Object.values(d.images)
		var index = 0
		return 'url("' + imgs[index].versions['original'].url + '")'
		})

	items.append('div')
		.classed('card-text', true)
		.html(function(d) {
		var dates = d.performances.filter(function(p) {
			var min = parseISO('2018-08-01 00:00:00').getTime()
			var max = parseISO('2018-08-31 23:59:59').getTime()
			var now = parseISO(p.start).getTime()
			return ((now >= min) && (now <= max))
		})
		return 	'<h2 class="date">' + prettyDate(parseISO(dates[dates.length - 1].start)) + '</h2>' +
				'<h2 class="title">'+ d.title + '</h2>' +
				'<h2 class="artist">' + (d.artist ? d.artist : 'Unknown') + '</h2>' +
				'<h2 class="venue">'+ d.venue.name + '</h2>'
		})

	card.append('div')
		.classed('card-button button', true)
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
				d3.select(this).text('- remove')
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
	})

}
