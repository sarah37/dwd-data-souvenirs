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

	// SET UP SCENE
	var scene = new THREE.Scene();

	// SET UP CAMERA
	var camera = new THREE.PerspectiveCamera( 52, width/height, 0.1, 10000);
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

	// SET UP RENDERER
	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
	renderer.setSize( width, height );
	document.getElementById('canvas').appendChild( renderer.domElement );

	// initialize camera plugins to drag the camera
	var orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
	orbitControls.autoRotate = true


	var clock = new THREE.Clock();

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

    events.sort(function(x, y){
		return d3.ascending(x.performances[0].start, y.performances[0].start);
	})


    // add stars and satellites
	var objects = [];
	var sats=[];
    var labels=[];

    events.forEach(function(ev) {
		ev.pos = projection([ev.longitude, ev.latitude])

		var testcolor = new THREE.Color("hsl(10,100%,50%)");

		if(timeScale(parseISO(ev.performances[0].start))>=0 && timeScale(parseISO(ev.performances[0].start))<=900) {
    		var geometry = new THREE.OctahedronGeometry(30, 0);
    		var material = new THREE.MeshLambertMaterial({
    			color: Math.random()*0x3f33f3*timeScale(parseISO(ev.performances[0].start))/900,wireframe:false
    		})

    	var sphere = new THREE.Mesh( geometry, material );

		sphere.position.x = ev.pos[0]-512 //front-back
		sphere.position.z = ev.pos[1]-512 //left-right
		sphere.position.y = timeScale(parseISO(ev.performances[0].start)) - 450//vertical
		objects.push(sphere);
		scene.add(sphere);

		//labels
		var titlelabel = d3.select('#canvas').append('div').node()
		titlelabel.className = 'label';
		titlelabel.textContent = ev.title;
		titlelabel.style.marginTop = '-1em';

		var Label1 = new THREE.CSS2DObject(titlelabel);
		Label1.position.set(0, 50, 0);
		// sphere.add(Label1);
		labels.push(Label1);

		labelRenderer = new THREE.CSS2DRenderer();
		labelRenderer.setSize( width, height );
		labelRenderer.domElement.style.position = 'absolute';
		labelRenderer.domElement.style.top = 0;
		labelRenderer.domElement.style.opacity = '0.5';
		labelRenderer.domElement.style.fontFamily = 'Roboto,sans-serif';
		labelRenderer.domElement.style.fontWeight = '100';
		document.getElementById('canvas').appendChild( labelRenderer.domElement );

		var satgeometry = new THREE.TetrahedronGeometry(12, 0);
		var satmaterial = new THREE.MeshLambertMaterial({
			color: 0xfff001,wireframe:false
		})
		var  sat = new THREE.Mesh( satgeometry, satmaterial );
		sat.position.set(Math.random() * 50, 0, Math.random() * 50);
      if (ev.starred) {
        // add decorations to starred events here
        sphere.add(sat);
        sats.push(sat);
      }

		}

    }) // end events forEach

	// Create a closed wavey loop
	var curvespositions = [];
	console.log(objects)
	objects.forEach(function(cu) { curvespositions.push(cu.position) })
	console.log(curvespositions)
	var curve = new THREE.CatmullRomCurve3(curvespositions);
	var points = curve.getPoints( events.length * 10 );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var material = new THREE.LineDashedMaterial( { color: 0xffffff,dashSize: 20, gapSize: 5 } );

	// Create the final object to add to the scene
	var curveObject = new THREE.Line( geometry, material );
	curveObject.computeLineDistances();
	scene.add(curveObject);

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

	// add labels to event cubes
	for(var i = 0;i<objects.length;i++) {
		objects[i].add(labels[i]);
	}

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

		renderer.render( scene, camera );

		labelRenderer.render( scene, camera );
  };

	animate();

}
