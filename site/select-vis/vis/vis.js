function drawVis(events) {

	console.log(events)

	// set min and max date
	var thisyear = 2018
	var parseDate = d3.timeParse("%d/%m/%Y");
	var minDate = parseDate('01/08/' + thisyear)
	var maxDate = parseDate('31/08/' + thisyear)

	// create time scale (vertical axis)
	var timeScale = d3.scaleTime()
		.domain([minDate,maxDate])  // data space
		.range([0, 1000]);  // display space

	// projection
	const s = 130000
	const t = [7900, 154200]
	const projection = d3.geoMercator().scale(s).translate(t);

	////////////////////////////////////////////////////////////////////////////////

	// SET UP SCENE
	var scene = new THREE.Scene();

	// SET UP CAMERA
	var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 0.1, 10000);
	camera.position.x = 1500
	camera.position.y = 0
	camera.position.z = 1100

	//SET UP LIGHT
	var light = new THREE.DirectionalLight( 0xffffff,2 );
	light.position.set( 100, 100, 100 ).normalize();
	scene.add( light );


	// initialize camera plugins to drag the camera
	var orbitControls = new THREE.OrbitControls(camera)
	orbitControls.autoRotate = true

	// SET UP RENDERER
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('section-4').appendChild( renderer.domElement );

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

	// draw red cube at origin for orientation
	var geometry = new THREE.BoxGeometry(10,10,10)
	var material = new THREE.MeshNormalMaterial();
	var cube = new THREE.Mesh(geometry, material)
	cube.position.x=0;
	cube.position.y=0;
	cube.position.z=0;
	scene.add(cube)


    events.sort(function(x, y){
		return d3.ascending(x.performances[0].start, y.performances[0].start);
	})


    // add stars and satellites
	var objects = [];
	var sats=[];
  var Labels=[];
    events.forEach(function(ev) {
    	ev.pos = projection([ev.longitude, ev.latitude])

		var geometry = new THREE.OctahedronGeometry(20, 0);
		var material = new THREE.MeshLambertMaterial({
			color: Math.random() * 0x31f3ff,wireframe:false
		})
		var sphere = new THREE.Mesh( geometry, material );
		sphere.position.x = ev.pos[0]-512 //front-back
		sphere.position.z = ev.pos[1]-512 //left-right
		if(timeScale(d3.isoParse(ev.performances[0].start))>-600 && timeScale(d3.isoParse(ev.performances[0].start))<1000) {
			sphere.position.y = timeScale(d3.isoParse(ev.performances[0].start)) - 200//vertical
			objects.push(sphere);
			scene.add(sphere);

			var labelDiv = document.createElement('div');
			labelDiv.className = 'label';
			labelDiv.textContent = ev.title;
			labelDiv.style.marginTop = '-1em';

			var Label = new THREE.CSS2DObject(labelDiv);
			Label.position.set(0, 50, 0);
      //sphere.add(Label);
			Labels.push(Label);



			labelRenderer = new THREE.CSS2DRenderer();
			labelRenderer.setSize( window.innerWidth, window.innerHeight );
			labelRenderer.domElement.style.position = 'absolute';
			labelRenderer.domElement.style.top = 0;
			labelRenderer.domElement.style.opacity = '0.5';
			labelRenderer.domElement.style.fontFamily = 'Roboto,sans-serif';
			labelRenderer.domElement.style.fontWeight = '100';
			document.body.appendChild( labelRenderer.domElement );

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
	    objects.forEach(function(cu) { curvespositions.push(cu.position) })
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
	console.log(wpoints1);
	scene.add(wpoints1);

	// To make sure that the matrixWorld is up to date for the boxhelpers
	var sphere = new THREE.SphereGeometry();
	var object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( 0x141414 ) );
	var box = new THREE.BoxHelper(wpoints1, 0x565656  );
	scene.add( box );

	//grid Helper
  var gridHelper = new THREE.GridHelper(1000, 50, 0xFF4444, 0x404040 );
  scene.add( gridHelper );
	//GUI for gridhelper
  var gui=new dat.GUI();
  var controls = new function(){
    this.gridHelper =false;
    this.label=true;
  }
  var allGui=gui.addFolder('Control');
  allGui.add(controls,'gridHelper').onChange(function(e){
  console.log(e);
  if(e){
    scene.remove(gridHelper);
  }else{
    scene.add(gridHelper);
  }
  });
  //GUI for label

  for(var i=0;i<objects.length;i++){
    objects[i].add(Labels[i]);
  }
  allGui.add(controls,'label').onChange(function(e){
    if(e){
      for(var i=0;i<objects.length;i++){
        objects[i].add(Labels[i]);
      }
    }else{
      for(var i=0;i<objects.length;i++){
        objects[i].remove(Labels[i]);
      }
    }
  });


	// // var step = 0

	// animate/render loop
	var animate = function () {
		requestAnimationFrame( animate );
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
