
THREE.Grid = function(){
this.init = function (cnvs){


var renderer = new THREE.WebGLRenderer({canvas: cnvs, antialias: true, alpha: true});

renderer.setClearColor(0x151515, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var width = window.innerWidth;
var height = window.innerHeight;

var camera = new THREE.PerspectiveCamera(20, width / height, 0.1, 6000);

//var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );

var scene = new THREE.Scene();

camera.position.z = 1000;
scene.add( camera );



//var ambient = new THREE.AmbientLight(0xffffff, 0.4);
//scene.add(ambient);

var pl = new THREE.PointLight(0xff7722, 1.5);
pl.position.set(0, -800, 1000);
scene.add(pl);

var material = new THREE.LineBasicMaterial({ color: 0xffffff });
material.transparent = true;
material.opacity = 0.04;

var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x151515});

var cubeGeometry = new THREE.CubeGeometry(70, 70, 70);

var arrCube = new Array();

/**
for(var j = 0; j < 20; j++){
  for(var i = 0; i < 40; i++){

    var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.set((-width/2) + i*75, (-height/2) + j*75, 0);
    arrCube.push(cubeMesh);
    scene.add(cubeMesh);
  }
}
material.transparent = true;
material.opacity = 0.15;


**/


for(var i = 0; i < 100; i++){
  var geometry = new THREE.Geometry();
  var size = 50;
  geometry.vertices.push(new THREE.Vector3(width/1.5, -height/1.5 + (i*50), -1000));
  geometry.vertices.push(new THREE.Vector3(-width/1.5, -height/1.5 + (i*50), -1000));
  var line = new THREE.Line(geometry, material);
  scene.add(line);
}

for(var i = 0; i < 100; i++){
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-width/1.5 + (i*50), height/1.5, -1000));
  geometry.vertices.push(new THREE.Vector3(-width/1.5 + (i*50), -height/1.5, -1000));
  var line = new THREE.Line(geometry, material);
  scene.add(line);
}


anim();

function anim(){

  renderer.render(scene, camera);
  requestAnimationFrame(anim);
}

}
}
