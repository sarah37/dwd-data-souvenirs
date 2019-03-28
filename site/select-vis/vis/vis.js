var anim;
var renderer;

function drawVis(events) {

	var width = window.innerWidth;
	var height = window.innerHeight - 60;

	// set min and max date
	var thisyear = 2018
	var parseDate = d3.timeParse("%d/%m/%Y");
	var minDate = parseDate('01/08/' + thisyear)
	var maxDate = parseDate('31/08/' + thisyear)

	// create time scale (vertical axis)
	var timeScale = d3.scaleTime()
		.domain([minDate,maxDate])  // data space
		.range([0, 900]);  // display space

	// projection
	const s = 130000
	const t = [7900, 154200]
	const projection = d3.geoMercator().scale(s).translate(t);

	////////////////////////////////////////////////////////////////////////////////

	// SET UP SCENE
	var scene = new THREE.Scene();

	// SET UP CAMERA
	var camera = new THREE.PerspectiveCamera( 60, width/height, 0.1, 10000);
	camera.position.x = 1500
	camera.position.y = 0
	camera.position.z = 1100

	//SET UP LIGHT
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	var light1 = new THREE.SpotLight( 0xffffff, 1.5 );
	light1.position.set( 1000, 500, 2000 );
	scene.add( light1 );

	var light2 = new THREE.SpotLight( 0xffffff, 1 );
	light2.position.set( -1000, 500, -2000 );
	scene.add( light2 );

	// initialize camera plugins to drag the camera
	var orbitControls = new THREE.OrbitControls(camera)
	orbitControls.autoRotate = true

	// SET UP RENDERER
	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
	renderer.setSize( width, height );
	document.getElementById('canvas').appendChild( renderer.domElement );

	var clock = new THREE.Clock();

	////////////////////////////////////////////////////////////////////////////////
	//draw plane w/ map pictures
	var planeGeometry = new THREE.PlaneBufferGeometry( 975, 975 );

	var texture = THREE.ImageUtils.loadTexture("vis/pic/map3.png",null,function(t)
	{});
	var material5 = new THREE.MeshBasicMaterial({map:texture,
		side:THREE.DoubleSide,
		transparent:true
	});
	var plane = new THREE.Mesh(planeGeometry, material5);
	plane.position.y = -975/2;
	plane.rotation.x = 0.5 * Math.PI
	// plane.rotation.y = -0.1 * Math.PI
	scene.add( plane );

	// // draw red cube at origin for orientation
	// var geometry = new THREE.BoxGeometry(10,10,10)
	// var material = new THREE.MeshNormalMaterial();
	// var cube = new THREE.Mesh(geometry, material)
	// cube.position.x=0;
	// cube.position.y=0;
	// cube.position.z=0;
	// scene.add(cube)


    events.sort(function(x, y){
		return d3.ascending(x.performances[0].start, y.performances[0].start);
	})


    // add stars and satellites
	var objects = [];
	var sats=[];
    var labels=[];
    events.forEach(function(ev) {
    	ev.pos = projection([ev.longitude, ev.latitude])

		var geometry = new THREE.OctahedronGeometry(20, 0);
		var material = new THREE.MeshLambertMaterial({
			color: Math.random() * 0x31f3ff,wireframe:false
		})
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.x = ev.pos[0]-512 //front-back
		sphere.position.z = ev.pos[1]-512 //left-right
		if(timeScale(parseISO(ev.performances[0].start))>-600 && timeScale(parseISO(ev.performances[0].start))<900) {
			sphere.position.y = timeScale(parseISO(ev.performances[0].start)) - 260//vertical
			objects.push(sphere);
			scene.add(sphere);

			//labels
			var titlelabel = d3.select('#canvas').append('div').node()
			titlelabel.className = 'label';
			titlelabel.textContent = ev.title;
			titlelabel.style.marginTop = '-1em';

			// var datelabel = document.createElement('div');
			// datelabel.className = 'label';
			// datelabel.textContent = ev.performances[0].start;
			// datelabel.style.marginTop = '-1em';

			var Label1 = new THREE.CSS2DObject(titlelabel);
			Label1.position.set(0, 50, 0);
			// sphere.add(Label1);
			labels.push(Label1);

			// var Label2 = new THREE.CSS2DObject(datelabel);
			// Label2.position.set(0, 80, 0);
			// // sphere.add(Label2);
			// labels.push(Label2);

			labelRenderer = new THREE.CSS2DRenderer();
			labelRenderer.setSize( width, height );
			labelRenderer.domElement.style.position = 'absolute';
			labelRenderer.domElement.style.top = 0;
			labelRenderer.domElement.style.opacity = '0.5';
			labelRenderer.domElement.style.fontFamily = 'Roboto,sans-serif';
			labelRenderer.domElement.style.fontWeight = '100';
			document.getElementById('canvas').appendChild( labelRenderer.domElement );

			var satgeometry = new THREE.TetrahedronGeometry(5, 0);
			var satmaterial = new THREE.MeshBasicMaterial({
				color: 0xfff001,wireframe:false
			})
			var  sat = new THREE.Mesh( satgeometry, satmaterial );
			sat.position.set(Math.random() * 50, 0, Math.random() * 50);

			sphere.add(sat);
			sats.push(sat);
			}

	    })

	    // Create a closed wavey loop
	    var curvespositions = [];
	    console.log(objects)
	    objects.forEach(function(cu) { curvespositions.push(cu.position) })
	    console.log(curvespositions)
	    var curve = new THREE.CatmullRomCurve3(curvespositions);
	    var points = curve.getPoints( events.length * 10 );
	    var geometry = new THREE.BufferGeometry().setFromPoints( points );
	    var material = new THREE.LineDashedMaterial( { color: 0xffffff,dashSize: 20, gapSize: 5 } );
		// 线的材质可以由2点的颜色决定
		// var material = new THREE.LineBasicMaterial( { vertexColors: true } );
		// var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );
		// geometry.vertices.push(p1);
		// geometry.vertices.push(p2);
		// geometry.colors.push( color1, color2 );
	    // Create the final object to add to the scene
	    var curveObject = new THREE.Line( geometry, material );
	    curveObject.computeLineDistances();
	    scene.add(curveObject);
	// })

	// light
	// var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	// scene.add( light );

	//white points at the corners
	var geometry1= new THREE.Geometry()
	var material2 = new THREE.PointsMaterial({
		size: 5,
		vertexColors: true, // 是否为几何体的每个顶点应用颜色，默认值是为所有面应用材质的颜色
		color: 0xe8e8e8
	})

	for (var x = 0; x <2 ; x++) {
		for (var y = 0; y < 2; y++) {
			for(var z = 0; z < 2; z++) {
				var particle = new THREE.Vector3(
					x*1000-500,
					y*1000-500,
					z*1000-500)
				geometry1.vertices.push(particle)
				geometry1.colors.push(new THREE.Color(0xe8e8e8))
			}
		}
	}

	var wpoints1 = new THREE.Points(geometry1, material2)
	scene.add(wpoints1);

	// To make sure that the matrixWorld is up to date for the boxhelpers
	var sphere = new THREE.SphereGeometry();
	var object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( 0x141414 ) );
	var box = new THREE.BoxHelper(wpoints1, 0x565656  );
	scene.add( box );


	// GUI - this broke stuff so please do not add it back in
	// 
  
	// add labels to event cubes
	for(var i = 0;i<objects.length;i++) {
		objects[i].add(labels[i]);
	}

	// checkbox for labels on/off
	// d3.select('#control-labels').on('change', function() {
	// 	var e = this.value;
	// 	if (e) {
	// 		for (var i = 0;i<objects.length;i++) {
	// 			objects[i].add(labels[i]);
	// 		}
	// 	}
	// 	else {
	// 		for (var i = 0;i<objects.length;i++) {
	// 			objects[i].remove(labels[i]);
	// 		}
	// 	}
	// })
    
	// //camera control
	// d3.select('#control-overview').on('change', function() {
	// 	var e = this.value;
	// 	if(e){
	// 		//camera1
	// 		camera = new THREE.OrthographicCamera( width/-1.3, width/1.3, height/1.3,  height/-1.3, 1, 10000 );
	// 		camera.position.x = 0
	// 		camera.position.y = -200
	// 		camera.position.z = 0
	// 		camera.rotation.x=-0.5 * Math.PI;
	// 	}
	// 	else {
	// 		camera = new THREE.PerspectiveCamera( 60, width/height, 0.1, 10000);
	// 		camera.position.x = 1500
	// 		camera.position.y = 0
	// 		camera.position.z = 1100
	// 		var orbitControls = new THREE.OrbitControls(camera)
	// 		orbitControls.autoRotate = true

	// 	}
	// });

	// animate/render loop
	var animate = function () {
		anim = requestAnimationFrame( animate );
		renderer.setClearColor(0x232323,1.0);
		for(var i = 0; i < sats.length;i++) {

			var elapsed = clock.getElapsedTime();
			sats[i].position.set(Math.sin( elapsed ) * 50 , 0 ,Math.cos( elapsed ) * 50);

			sats[i].rotation.x += 0.001;
			sats[i].rotation.y += 0.001;
		}
		//background color
		// cube.rotation.x += 0.01;
		// cube.rotation.y += 0.01;
		// step += 0.0001;
		// points2.rotation.y -= 0.0006;
		//points3.rotation.y -=0.0003;
		// wpoints1.rotation.x = step;
		// wpoints1.rotation.y = step;
		// wpoints1.rotation.z = step;


		renderer.render( scene, camera );

		labelRenderer.render( scene, camera );
  };

	animate();


}