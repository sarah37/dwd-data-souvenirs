function drawVis(events) {

	// empty section 4 in case there was a previous canvas
	document.getElementById('section-4').innerHTML = "";

	// set min and max date
	var thisyear = 2018
	var parseDate = d3.timeParse("%d/%m/%Y");
	var minDate = parseDate('01/08/' + thisyear)
	var maxDate = parseDate('15/08/' + thisyear)

	// create time scale (vertical axis)
	var timeScale = d3.scaleTime()
		.domain([minDate,maxDate])  // data space
		.range([0, 500]);  // display space

	////////////////////////////////////////////////////////////////////////////////
	// Draw a map which will be used as a texture on the plane
	//https:observablehq.com/@sarah37/edinburgh-map
	const s = 130000
	const t = [7900, 154200]
	const projection = d3.geoMercator().scale(s).translate(t);
	//
	// const height = 1024
	// const width = 1024;
	// var mapCanvas  = d3.select("body")
	// 	.append("canvas")
	// 	.attr('width', width)
	// 	.attr('height', height)
	// 	.node()
	//
	// var mapContext = mapCanvas.getContext("2d")
	//
	// const path = d3.geoPath().projection(projection).context(mapContext)
	// mapContext.fillStyle = '#222';
	// mapContext.fillRect( 0, 0, 1024, 1024 );
	// const context = DOM.context2d(width,height)
	// d3.json("edinburgh.json").then(function(edmap) {
	// 	mapContext.beginPath()
	// 	path(topojson.mesh(edmap))
	// 	mapContext.strokeStyle = "#fff";
	// 	mapContext.stroke()
	// })


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
	//draw plane
	var planeGeometry = new THREE.PlaneBufferGeometry( 975, 975 );
	//var planeTexture = new THREE.TextureLoader().load( "map_img.png" );
	//var planeTexture = new THREE.CanvasTexture( mapCanvas );
	//var planeMaterial = new THREE.MeshBasicMaterial( { map: planeTexture } );
	    // planeGeometry.rotateX( - Math.PI / 2 );
	    // var planeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );

	    //var plane = new THREE.Mesh( planeGeometry, planeMaterial );
	    //plane.position.z = 0;
	    //plane.receiveShadow = false;

	var texture = THREE.ImageUtils.loadTexture("vis/pic/map3.png",null,function(t)
	{});
	var material5 = new THREE.MeshBasicMaterial({map:texture,
		side:THREE.DoubleSide,
		transparent:true
	});
	var plane = new THREE.Mesh(planeGeometry, material5);
	// plane.position.x = 975/2;
	plane.rotation.x = 0.5 * Math.PI
	plane.rotation.y = -0.1 * Math.PI
	scene.add( plane );

	// draw red cube at origin for orientation
	var geometry = new THREE.BoxGeometry(10,10,10)
	var material = new THREE.MeshNormalMaterial();
	var cube = new THREE.Mesh(geometry, material)
	cube.position.x=0;
	cube.position.y=0;
	cube.position.z=0;
	scene.add(cube)


	    // console.log(events, edmap)

	    events.sort(function(x, y){
			return d3.ascending(x.performances[0].start, y.performances[0].start);
		})

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
	group.add(points2)
	scene.add(points2)

	//blue point
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
					Math.random() * 600 - 300,
					Math.random() * 100 -50,
					Math.random() * 600 - 300)
				geometry.vertices.push(particle)
				geometry.colors.push(new THREE.Color(0x6cd7ef))
			}
		}
	}
	var points3 = new THREE.Points(geometry, material)
	group.add(points3)
	scene.add(points3)

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
	console.log(wpoints1)
	scene.add(wpoints1)
	//white points2
	var geometry1= new THREE.Geometry()
	var material2 = new THREE.PointsMaterial({
		size: 1,
		vertexColors: true, // 是否为几何体的每个顶点应用颜色，默认值是为所有面应用材质的颜色
		color: 0xe8e8e8
	})
	for (var x = -4; x < 4; x++) {
		for (var y = -4; y < 4; y++) {
			for(var z = -4; z < 4; z++) {
				var particle = new THREE.Vector3(
					Math.random() * 60 - 30,
					Math.random() * 10 - 5,
					Math.random() * 100 - 50)
				geometry1.vertices.push(particle)
				geometry1.colors.push(new THREE.Color(0xe8e8e8))
			}
		}
	}
	var wpoints2 = new THREE.Points(geometry1, material2)
	console.log(wpoints2)
	scene.add(wpoints2)
	//red points1
	var geometry1= new THREE.Geometry()
	var material2 = new THREE.PointsMaterial({
		size: 1,
		vertexColors: true, // 是否为几何体的每个顶点应用颜色，默认值是为所有面应用材质的颜色
		color: 0xf9856e
	})


	for (var x = -5; x < 5; x++) {
		for (var y = -5; y < 5; y++) {
			for(var z = -5; z < 5; z++) {
				var particle = new THREE.Vector3(
					Math.random() * 110 - 55,
					Math.random() * 10 - 5,
					Math.random() * 120 - 60)
				geometry1.vertices.push(particle)
				geometry1.colors.push(new THREE.Color(0xf9856e))
			}
		}
	}
	var rpoints1 = new THREE.Points(geometry1, material2)
	console.log(rpoints1)
	scene.add(rpoints1)

	//nebula test
	// var geometry = new THREE.Geometry()
	// var material = new THREE.PointsMaterial({
	// 	size: 1,
	// 	vertexColors: true, // 是否为几何体的每个顶点应用颜色，默认值是为所有面应用材质的颜色
	// 	color: 0xffffff
	// })
	//
	// for (var x = 0; x < 8; x++) {
	// 	for (var y = 0; y < 8; y++) {
	// 		for (var z = 0; z < 8; z++) {
	// 			for (var z = 0; z < 8; z++) {
	//
	// 				var particle = new THREE.Vector3(
	// 					10 + Math.random() * 400 - 200,
	// 					10 + Math.random() * 400 - 200,
	// 					10 + Math.random() * 200 - 100)
	//
	// 				geometry.vertices.push(particle)
	// 				geometry.colors.push(new THREE.Color(0xffffff))
	//
	// 			}
	// 		}
	// 	}
	// }
	//
	// var test1 = new THREE.Points(geometry, material)
	// console.log(test1)
	// scene.add(test1)
	//
	//
	// for (var x = 0; x < 8; x++) {
	// 	for (var y = 0; y < 8; y++) {
	// 		for (var z = 0; z < 8; z++) {
	// 			for (var z = 0; z < 8; z++) {
	//
	// 				var particle = new THREE.Vector3(
	// 					10 + Math.random() * 300 - 150,
	// 					10 + Math.random() * 300 - 150,
	// 					10 + Math.random() * 150 - 75)
	//
	// 				geometry.vertices.push(particle)
	// 				geometry.colors.push(new THREE.Color(0x9c43db))
	// 			}
	// 		}
	// 	}
	// }
	// var test2 = new THREE.Points(geometry, material)
	// console.log(test2)
	// scene.add(test2)
	//
	// for (var x = 0; x < 7; x++) {
	// 	for (var y = 0; y < 7; y++) {
	// 		for (var z = 0; z < 7; z++) {
	// 			for (var z = 0; z < 8; z++) {
	//
	// 				var particle = new THREE.Vector3(
	// 					50 + Math.random() * 300 - 150,
	// 					100 + Math.random() * 300 - 150,
	// 					50 + Math.random() * 150 - 75)
	//
	// 				geometry.vertices.push(particle)
	// 				geometry.colors.push(new THREE.Color(0x31F3FF))
	//
	// 			}
	// 		}
	// 	}
	// }
	// var test3 = new THREE.Points(geometry, material)
	// console.log(test3)
	// scene.add(test3)
	//
	// for (var x = 0; x < 7; x++) {
	// 	for (var y = 0; y < 7; y++) {
	// 		for (var z = 0; z < 7; z++) {
	// 			for (var z = 0; z < 8; z++) {
	// 				var particle = new THREE.Vector3(
	// 					10 + Math.random() * 300 - 150,
	// 					10 + Math.random() * 220 - 50,
	// 					10 + Math.random() * 100 - 50)
	//
	// 				geometry.vertices.push(particle)
	// 				geometry.colors.push(new THREE.Color(0xFFF001))
	// 			}
	// 		}
	// 	}
	// }
	// var test3 = new THREE.Points(geometry, material)
	// console.log(test3)
	// scene.add(test3)


	// To make sure that the matrixWorld is up to date for the boxhelpers
	var sphere = new THREE.SphereGeometry();
	var object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( 0xff0000 ) );
	var box = new THREE.BoxHelper(wpoints1, 0x898989 );
	scene.add( box );


	//3d
	var unipoints

	// 创建模型加载器
	var loader = new THREE.OBJLoader();
	loader.load('vis/pic/sphere.obj', function (loadedMesh) {
		var material = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.4,
			// 使用 opacity 的前提是开启 transparent
			opacity: 0.6,
			transparent: true,
			// 设置元素与背景的融合模式
			blending: THREE.AdditiveBlending,
			// 指定粒子的纹理
			map: generateSprite(),
			// 用于去除纹理的黑色背景，关于 depthTest 和 depthWrite 的详细解释，请查看https://stackoverflow.com/questions/37647853/three-js-depthwrite-vs-depthtest-for-transparent-canvas-texture-map-on-three-p
			depthTest: false
		})
		loadedMesh.children.forEach(function (child) {
			unipoints = new THREE.Points(child.geometry, material)
			unipoints.position.z = 200;
			unipoints.position.x=100;
			unipoints.position.y=200;
			scene.add(unipoints);
		})
	})


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
	// DRAW BOXES ETC.
	// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	// var cube = new THREE.Mesh( geometry, material );
	// scene.add( cube );
	var step = 0
	// animate/render loop
	var animate = function () {
		requestAnimationFrame( animate );
	   //background color
		renderer.setClearColor(0x232323,1.0);
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

	///////////////
	//GUI
	//var gui = new dat.GUI();

	// var cam = gui.addFolder('Camera');
	// cam.add(options.camera, 'speed', 0, 0.0010).listen();
	// cam.add(camera.position, 'y', 0, 100).listen();
	// cam.open();

}