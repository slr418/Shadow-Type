var camera, scene, renderer, controls;
var geometry, material, mesh;
var planeMaterial;
var spotlight, ambientlight;

function init() {
  scene = new THREE.Scene();
  var width = window.innerWidth;
  var height = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 25000);
  camera.position.set(0, 400, 800);
  scene.add(camera);

  spotlight = new THREE.SpotLight(0xffffff, 1);
  spotlight.position.set(0, 800, 1000);
  spotlight.castShadow = true;

  // shadow map texture width
  spotlight.shadow.mapSize.width = 2000;
  // shadow map texture height
  spotlight.shadow.mapSize.height = 2000;
  // perspective shadow camera frustum near
  spotlight.shadow.camera.near = 500;
  // perspective shadow camera frustum far
  spotlight.shadow.camera.far = 2000;
  // perspective shadow camera frustum fov
  spotlight.shadow.camera.fov = 45;

  scene.add(spotlight);

  var loader = new THREE.JSONLoader();
  var modelMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

  loader.load('shadowtype.json', function(modelGeometry) {
    var modelMesh = new THREE.Mesh(modelGeometry, modelMaterial);
    modelMesh.position.z = 10;
    modelMesh.position.x = -190;
    modelMesh.castShadow = true;
    modelMesh.receiveShadow = true;
    modelMesh.rotation.y = -1.57;
    modelMesh.scale.set(130, 130, 130); // x, y, z scaled up or down
    scene.add(modelMesh);
  });
  loader.load('shadowtype.json', function(model2Geometry) {
    var model2Mesh = new THREE.Mesh(model2Geometry, modelMaterial);
    model2Mesh.position.x = 190;
    model2Mesh.castShadow = true;
    model2Mesh.receiveShadow = true;
    model2Mesh.rotation.y = -1.57;
    model2Mesh.rotation.x = Math.PI / -2;
    model2Mesh.scale.set(130, 130, 130); // x, y, z scaled up or down
    scene.add(model2Mesh);
  });

  var planeGeometry = new THREE.PlaneGeometry(1500, 1500, 10, 10);
  var randomHue = Math.round(Math.random() * 360);
  var planeColor = new THREE.Color("hsl(" + randomHue + ", 100%, 50%)")
  planeMaterial = new THREE.MeshLambertMaterial({color: planeColor, side: THREE.DoubleSide});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / -2; // flatten plane to be on the floor
  plane.position.y = -200;
  plane.receiveShadow = true;
  scene.add(plane);

  // var cubeGeometry = new THREE.CubeGeometry(259, 259, 5);
  // var cube = new THREE.Mesh(cubeGeometry, modelMaterial);
  // cube.position.y = -1.5;
  // cube.position.z = 3;
  // cube.castShadow = true;
  // cube.receiveShadow = true;
  // scene.add(cube);

  renderer = new THREE.WebGLRenderer({alpha: 1, antialias: true});
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  var date = new Date();
  var timer = date.getTime() * 0.0002; // get time string
  spotlight.position.x = 900 * Math.cos(timer); // x-coord of camera
  spotlight.position.z = 900 * Math.sin(timer); // z-coord of camera

  planeMaterial.color.offsetHSL( 0.0003, 0, 0 );

  renderer.render(scene, camera);
  controls.update();
}

init();
animate();
