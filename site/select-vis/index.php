<!DOCTYPE html>
<html lang="en">
<head>

	<title>Design with Data</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- Bootstrap/JQuery -->
	<script src="../lib/jquery-3.3.1.min.js" type="text/javascript"></script>
	<script src="../lib/bootstrap.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../lib/bootstrap.min.css">

	<!-- Stylesheet + fonts -->
	<link rel="stylesheet" type="text/css" href="../css/stylesheet.css"/>
	<link href="https://fonts.googleapis.com/css?family=Audiowide|Roboto:300,500,700" rel="stylesheet">

	<!-- D3 -->
	<script src="https://d3js.org/d3.v5.min.js"></script>
	<script src="https://unpkg.com/topojson@3"></script>

	<script type="text/javascript" src='cards.js'></script>

	<!-- vis -->
	<script src="vis/js/three.js"></script>
	<script src="vis/js/controls/OrbitControls.js"></script>
	<script src="https://threejs.org/examples/js/loaders/OBJLoader.js"></script>
	<script src="vis/js/WebGL.js"></script>
	<script src="vis/js/renderers/CSS2DRenderer.js"></script>
	<script src="vis/js/geometries/hilbert3D.js"></script>
    <script src ="vis/js/libs/dat.gui.min.js"></script>
	<script type="text/javascript" src='vis/vis.js'></script>


</head>
<body class="select-vis">


	<div id="nav" class="nav">
		<a href="../instructions" id="prev-3" class="prev-button">Prev</a>
		<button id="prev-3-a" class="prev-button">Prev</button>
		<button id="prev-4" class="prev-button">Prev</button>
		<div class="dots">
			<div id="dot-1" class="dot dot-1"></div>
			<div id="dot-2" class="dot dot-2"></div>
			<div id="dot-3" class="dot dot-3"></div>
		</div>
		<button id="next-3" class="next-button">Next</button>
		<button id="next-3-a" class="next-button">Next</button>
		<button id="next-4" class="next-button">Next</button>
	</div>

	<div id="section-3">
		<div class="container-3 top">
			<div class="container">
				<div class="row">
					<div class="col col-md-12">
						<h1>Select the Events You Attended</h1>
					</div>
				</div>
			</div>
		</div>
		<div id="bar">
			<div class="container-3 filter-bar">
				<div class="container-fluid">
					<div class="row">
						<form>
							<div class="row">
								<div class="col-md-3">
									<h2>Date</h2>
									<input type="date" class="date" value="2018-08-01" min="2018-08-01" max="2018-08-31" id="date_from"> --
									<input type="date" class="date" value="2018-08-31" min="2018-08-01" max="2018-08-31" id="date_to">
								</div>
								<div class="col-md-3">
									<h2>Title</h2><input type='text' name='title' id='title'>
								</div>
								<div class="col-md-3">
									<h2>Artist</h2><input type='text' name='artist' id='artist'>
								</div>
								<div class="col-md-3">
									<h2>Venue</h2><input type='text' name='venue' id='venue'>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		<div class="container-3 selected-block">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-12">
						<p>Selected</p>
						<div id='selectedevents'></div>
					</div>
				</div>
			</div>
		</div>
		<div class="container-3 bottom">
			<div class="container-fluid">
				<div class="row">
					<div id='eventoutput'></div>
				</div>
			</div>
		</div>
	</div>

	<div id="section-3-a" class="container-3-a">
		<div class="container">
			<div class="row">
				<div class="col col-md-12">
					<h1>Star your favourite events</h1>
				</div>
				<div class="col col-md-12" id='starlist'>
					
				</div>
			</div>
		</div>
	</div>

	<div id="section-4" class="container-4">
		<h1>Select a view for print</h1>
		<div id='canvas'></div>
	</div>

	<div id="section-5" class="container-5">
		<div class="container">
			<div class="row">
				<div class="col col-md-12">
					<h1>Print</h1>
				</div>
			</div>
		</div>
	</div>

	<script src="script.js"></script>


	<script type="text/javascript">

		// global var to store selected events
		var selectedEvents = [];

		updateCards()

		d3.selectAll('#date_from, #date_to, #title, #artist, #venue')
			.on('keyup', delay(function() {
				updateCards()				
			}, 400))

		function delay(callback, ms) {
			var timer = 0;
			return function() {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
			callback.apply(context, args);
			}, ms || 0);
			};
		}
	</script>


</body>
</html>
