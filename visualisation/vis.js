// set min and max date
var thisyear = 2018
var parseDate = d3.timeParse("%d/%m/%Y");
var minDate = parseDate('01/08/' + thisyear)
var maxDate = parseDate('31/08/' + thisyear)

// create time scale (vertical axis)
var timeScale = d3.scaleTime()
	.domain([minDate,maxDate])  // data space
	.range([0, 300]);  // display space

////////////////////////////////////////////////////////////////////////////////
// Draw a map which will be used as a texture on the plane
// https://observablehq.com/@sarah37/edinburgh-map
const s = 130000
const t = [7900, 154200]
const projection = d3.geoMercator().scale(s).translate(t);

const height = 1024
const width = 1024;
var mapCanvas  = d3.select("body")
	.append("canvas")
	.attr('width', width)
	.attr('height', height)
	.node()

var mapContext = mapCanvas.getContext("2d")

const path = d3.geoPath().projection(projection).context(mapContext)
mapContext.fillStyle = '#222';
mapContext.fillRect( 0, 0, 1024, 1024 );
// const context = DOM.context2d(width,height)
d3.json("edinburgh.json").then(function(edmap) {
	mapContext.beginPath()
	path(topojson.mesh(edmap))
	mapContext.strokeStyle = "#fff";
	mapContext.stroke()
})



////////////////////////////////////////////////////////////////////////////////

// SET UP SCENE
var scene = new THREE.Scene();

// SET UP CAMERA
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 2000 );
camera.position.z = 300;
camera.position.y = -1000;
// camera.position.x = 300
// initialize camera plugins to drag the camera
var orbitControls = new THREE.OrbitControls(camera)
orbitControls.autoRotate = true

// SET UP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

////////////////////////////////////////////////////////////////////////////////
//draw plane
var planeGeometry = new THREE.PlaneBufferGeometry( 975, 975 );
// var planeTexture = new THREE.TextureLoader().load( "map_img.png" );
var planeTexture = new THREE.CanvasTexture( mapCanvas );
var planeMaterial = new THREE.MeshBasicMaterial( { map: planeTexture } );
    // planeGeometry.rotateX( - Math.PI / 2 );
    // var planeMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );

    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    // plane.position.x = 975/2;
    // plane.position.y = 975/2;
    plane.position.z = 0;
    plane.receiveShadow = false;
    scene.add( plane );

// draw red cube at origin for orientation
var geometry = new THREE.BoxGeometry(10,10,10)
var material = new THREE.MeshBasicMaterial( {color: 0xff0000 })
var cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// load data + draw cubes
var files = [d3.json("test-events.json"), 
			d3.json("edinburgh.json")]


Promise.all(files).then(function([events, edmap]) {

    console.log(events, edmap)

    events.sort(function(x, y){
		return d3.ascending(x.performances[0].start, y.performances[0].start);
	})

    var cubes = []
    events.forEach(function(ev) {
    	ev.pos = projection([ev.longitude, ev.latitude])

    	var geometry = new THREE.BoxGeometry( 10, 10, 10 );
		var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = ev.pos[0] - 512 //front-back
		cube.position.y = ev.pos[1] - 512 //left-right
		cube.position.z = timeScale(d3.isoParse(ev.performances[0].start)) //vertical
		cubes.push(cube)
		scene.add( cube );
    })

    // Create a closed wavey loop
    var curvespositions = [];
    cubes.forEach(function(cu) { curvespositions.push(cu.position) })
    var curve = new THREE.CatmullRomCurve3(curvespositions);
    var points = curve.getPoints( events.length * 10 );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var material = new THREE.LineBasicMaterial( { color : 0xffffff } );

    // Create the final object to add to the scene
    var curveObject = new THREE.Line( geometry, material );
    scene.add(curveObject);

})



// DRAW BOXES ETC.
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


// animate/render loop
var animate = function () {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
