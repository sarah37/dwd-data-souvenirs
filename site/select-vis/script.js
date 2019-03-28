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



  $("#next-3").click(function(){
		// go to print
		$("#section-3").hide();
		$("#prev-3").hide();
		$("#next-3").hide();

		$("#section-3-a").show();
    $("#prev-3-a").show();
    $("#next-3-a").show();

    document.getElementById("dot-1").style.border = "6px solid #fff";
    document.getElementById("dot-2").style.border = "6px solid #2B2B2B";
    document.getElementById("dot-3").style.border = "6px solid #2B2B2B";

    starList(selectedEvents)
	});

  $("#prev-3-a").click(function(){
    // go to print
    $("#section-3-a").hide();
    $("#prev-3-a").hide();
    $("#next-3-a").hide();

    $("#section-3").show();
    $("#prev-3").show();
    $("#next-3").show();

    document.getElementById("dot-1").style.border = "6px solid #fff";
    document.getElementById("dot-2").style.border = "6px solid #2B2B2B";
    document.getElementById("dot-3").style.border = "6px solid #2B2B2B";
  });

	$("#next-4").click(function(){
		// go to print
		$("#section-4").hide();
		$("#prev-4").hide();
		$("#next-4").hide();

		$("#section-5").show();

		$(".nav").hide()


	    document.getElementById("dot-1").style.border = "6px solid #2B2B2B";
	    document.getElementById("dot-2").style.border = "6px solid #2B2B2B";
	    document.getElementById("dot-3").style.border = "6px solid #fff";
	    

    	// halt animation
		cancelAnimationFrame( anim );

		// d3.selectAll('.nav, h1').classed('hidden', true)
		// var dataUrl = d3.select('#canvas>canvas').node().toDataURL();
		var dataUrl = renderer.domElement.toDataURL()

		// var ratio = window.innerHeight / window.innerWidth
		// if (ratio < (13/19)) {
		// 	// height is the limit
		// 	var h = window.innerHeight * 0.9;
		// 	var w = h / 13 * 19;
		// 	// console.log(ratio, w, h, h/w)
		// }
		// else {
		// 	var w = window.innerWidth * 0.9;
		// 	var h = w / 19 * 13
		// }
		
		d3.select('#print')
			.append('img')
			.style('height', '11cm')
			.style('width', '18cm')
			.attr('src', dataUrl)
			// .style('background-position', 'center')
			// .style('background-repeat', 'no-repeat')
			// .style('background-size', 'cover');

		d3.select('body').style('background-color', '#fff').style('text-align', 'center')

	// actually print

	window.print()
	// set timer to reload after 15s
    setTimeout(function() {window.location.assign('/')}, 30000)

	// setTimeout(function () {
	// 		console.log('move to waiting page')
	// 		// take user to waiting page
	// 		d3.select('body').style('background-color', '#000')

	// 		$('#section-5').hide()
	// 		$('#section-6').show()


	// }, 30000);

	//  } ,200)
	
	});

  $("#prev-4").click(function(){
    // go to print
    $("#section-4").hide();
    $("#prev-4").hide();
    $("#next-4").hide();

    $("#section-3-a").show();
    $("#prev-3-a").show();
    $("#next-3-a").show();

    document.getElementById("dot-1").style.border = "6px solid #fff";
    document.getElementById("dot-2").style.border = "6px solid #2B2B2B";
    document.getElementById("dot-3").style.border = "6px solid #2B2B2B";

    // empty canvas div
    d3.select('#canvas').selectAll('*').remove();
  });

	// page 5 has no buttons

$('#next-3-a').click(function() {

	$("#section-3-a").hide();
	$("#prev-3-a").hide();
	$("#next-3-a").hide();

	$("#section-4").show();
	$("#prev-4").show();
	$("#next-4").show();

	document.getElementById("dot-1").style.border = "6px solid #2B2B2B";
	document.getElementById("dot-2").style.border = "6px solid #fff";
	document.getElementById("dot-3").style.border = "6px solid #2B2B2B";

	console.log('drawing vis now: ', selectedEvents)
	drawVis(selectedEvents)
});


});
