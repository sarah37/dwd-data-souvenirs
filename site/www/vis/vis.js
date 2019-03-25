function drawVis(events) {

	// set min and max date
	var thisyear = 2018
	var parseDate = d3.timeParse("%d/%m/%Y");
	var minDate = parseDate('01/08/' + thisyear)
	var maxDate = parseDate('15/08/' + thisyear)

	// create time scale (vertical axis)
	var timeScale = d3.scaleTime()
		.domain([minDate,maxDate])  // data space
		.range([0, 500]);  // display space

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

	// initialize camera plugins to drag the camera
	var orbitControls = new THREE.OrbitControls(camera)
	orbitControls.autoRotate = true

	// SET UP RENDERER
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById('section-4').appendChild( renderer.domElement );

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


    // add cubes and add small nebula around each cube (?)
    var cubes = []
    events.forEach(function(ev) {
    	ev.pos = projection([ev.longitude, ev.latitude])
    	var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		var material = new THREE.MeshNormalMaterial();
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = ev.pos[0]-512 //front-back
		cube.position.z = ev.pos[1]-512 //left-right
		if(timeScale(d3.isoParse(ev.performances[0].start))>-500 && timeScale(d3.isoParse(ev.performances[0].start))<500) {
			cube.position.y = timeScale(d3.isoParse(ev.performances[0].start))-200//vertical
			cubes.push(cube);
			scene.add( cube );
			var geometry = new THREE.Geometry()
			var material = new THREE.PointsMaterial({
				size: 6,
				vertexColors: true, // 是否为几何体的每个顶点应用颜色，默认值是为所有面应用材质的颜色
				color: 0xffffff
			})


			for ( var i = 0; i < cubes.length; i++){

				for (var x = 0; x < 2; x++) {
					for (var y = 0; y < 2; y++) {
						for (var z = 0; z < 2; z++) {
							var particle = new THREE.Vector3(
								cubes[i].position.x - Math.random() * 30 + Math.random() * 20 + 10,
								cubes[i].position.y - Math.random() * 30+Math.random() * 20 + 10,
								cubes[i].position.z - Math.random() * 30+Math.random() * 20 + 10)

							geometry.vertices.push(particle)
							geometry.colors.push(new THREE.Color(Math.random() * 0xffffff))
						}
					}
				}
				var nebula = new THREE.Points(geometry, material)
				// console.log(nebula)
				scene.add(nebula)

				}
			}

	    })

	    // Create a closed wavey loop
	    var curvespositions = [];
	    cubes.forEach(function(cu) { curvespositions.push(cu.position) })
	    var curve = new THREE.CatmullRomCurve3(curvespositions);
	    var points = curve.getPoints( events.length * 10 );
	    var geometry = new THREE.BufferGeometry().setFromPoints( points );
	    var material = new THREE.LineBasicMaterial( { color : 0xcccccc } );
		// 线的材质可以由2点的颜色决定
		// var material = new THREE.LineBasicMaterial( { vertexColors: true } );
		// var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );
		// geometry.vertices.push(p1);
		// geometry.vertices.push(p2);
		// geometry.colors.push( color1, color2 );
	    // Create the final object to add to the scene
	    var curveObject = new THREE.Line( geometry, material );
	    scene.add(curveObject);
	// })

	//Create Decoration
	var group;
	var allCubes=[];
	group = new THREE.Group();
	scene.add( group );
	//purple color point
	var geometry = new THREE.Geometry()
	new THREE.MeshNormalMaterial(1,1,1)
	var material = new THREE.PointsMaterial({
		size: 3,
		vertexColors: true, // 是否为几何体的每个顶点应用颜色，默认值是为所有面应用材质的颜色
	})

	for (var x = -3; x < 3; x++) {
		for (var y = -3; y < 3; y++) {
			for(var z = -3; z < 3; z++){
				var particle = new THREE.Vector3(
					Math.random() * 300 - 150,
					Math.random() * 150 - 75,
					Math.random() * 300 - 150)
				geometry.vertices.push(particle)
				geometry.colors.push(new THREE.Color(0x996cef))
			}
		}
	}
	var points2 = new THREE.Points(geometry, material)

	// light
	var light = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( light );

	//white points1
	var geometry1= new THREE.Geometry()
	var material2 = new THREE.PointsMaterial({
		size: 5,
		vertexColors: true, // 是否为几何体的每个顶点应用颜色，默认值是为所有面应用材质的颜色
		color: 0xe8e8e8
	})

	for (var x = -3; x < 3; x++) {
		for (var y = -3; y < 3; y++) {
			for(var z = -3; z < 3; z++) {
				var particle = new THREE.Vector3(
					Math.random() * 1100 - 550,
					Math.random() * 1100 - 550,
					Math.random() * 1100 - 550)
				geometry1.vertices.push(particle)
				geometry1.colors.push(new THREE.Color(0xe8e8e8))
			}
		}
	}
	var wpoints1 = new THREE.Points(geometry1, material2)

	// To make sure that the matrixWorld is up to date for the boxhelpers
	var sphere = new THREE.SphereGeometry();
	var object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( 0xff0000 ) );
	var box = new THREE.BoxHelper(wpoints1, 0x898989 );
	scene.add( box );


	// 生成纹理
	function generateSprite() {

		var canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 100;

		var context = canvas.getContext('2d');
		var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
		gradient.addColorStop(0, 'rgba(255,255,255,1)');
		gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
		gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
		gradient.addColorStop(1, 'rgba(255,255,255,1)');

		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);

		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		return texture;

	}


	var step = 0

	// animate/render loop
	var animate = function () {
		requestAnimationFrame( animate );
	   //background color
		renderer.setClearColor(0x000000,1.0);
		// cube.rotation.x += 0.01;
		// cube.rotation.y += 0.01;
		step += 0.0001;
		points2.rotation.y -= 0.0006;
		//points3.rotation.y -=0.0003;
		wpoints1.rotation.x = step;
		wpoints1.rotation.y = step;
		wpoints1.rotation.z = step;
		renderer.render( scene, camera );

	};

	animate();

}