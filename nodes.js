
THREE.Nodes = function(){
this.init = function (cnvs){

    document.addEventListener("mousemove", getX, false);

var renderer = new THREE.WebGLRenderer({canvas: cnvs, antialias: true, alpha: true});
renderer.setClearColor(0x0000aa, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 6000);
var scene = new THREE.Scene();
camera.translateZ(1000);

var mouseX;
var rotX = 0;
var rotZ = 0;

scene.fog = new THREE.Fog(0x151515, 0 , 1750);



var ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);


//0x99ff99


/**
var pointLight1 = new THREE.PointLight(0x3399ff, 1);
pointLight1.position.y = 2000;
scene.add(pointLight1);

var pointLight2 = new THREE.PointLight(0x3333cc, 1);
pointLight2.position.y = -2000;
scene.add(pointLight2);
**/


var geometry = new THREE.CubeGeometry(50, 50, 50);
//  var materialBlue = new THREE.MeshLambertMaterial({color: 0x70dbdb});


var randomColor = Math.random() * 0xffffff;

var materialBlue = new THREE.MeshBasicMaterial({color: 0xeeeeee});

materialBlue.transparent = true;
materialBlue.opacity = 1;

var materialWhite = new THREE.MeshBasicMaterial({color: randomColor});
materialWhite.transparent = true;
materialWhite.opacity = 1;


var arrNode = new Array();
var arrActive = new Array();


var currentIndex = 0;
var spread = 130;

var nodeSize = 4;

var linkWidth = 1.3;

var nodeCount = 12;


var exclusionZone = 64.99;
var deviationLimit = 4;
var connectionLimit = 1;

var clusterDistance = 110;


createCluster(new THREE.Vector3(0, 0, 0), nodeCount);

createCluster(new THREE.Vector3(clusterDistance*2, clusterDistance, clusterDistance), nodeCount);
createCluster(new THREE.Vector3(-clusterDistance*2, clusterDistance, clusterDistance), nodeCount);
createCluster(new THREE.Vector3(clusterDistance*2, -clusterDistance, -clusterDistance), nodeCount);
createCluster(new THREE.Vector3(-clusterDistance*2, -clusterDistance, -clusterDistance), nodeCount);
createCluster(new THREE.Vector3(-clusterDistance*2, clusterDistance, -clusterDistance), nodeCount);


function createCluster(seed, numberOfNodes){

  var nodeCluster = new Array();

  nodeCluster.push(createNode(seed.x, seed.y, seed.z, [nodeCluster[0]]));

  var currentX = seed.x;
  var currentY = seed.y;
  var currentZ = seed.z;

  for(var i = 0; i < (numberOfNodes - 1); i++){


    currentX = randomExclusion(1*spread, -0.5*spread, currentX, exclusionZone);
    currentY = randomExclusion(1*spread, -0.5*spread, currentY, exclusionZone);
    currentZ = randomExclusion(1*spread, -0.5*spread, currentZ, exclusionZone);

    //alert(currentX + " " + currentY + " " + currentZ);
    nodeCluster.push(createNode(currentX, currentY, currentZ, [arrNode[0]]));
  }

  for(var i = 0; i < numberOfNodes; i++){
    var connections = randomInt(connectionLimit, 1.5);
    var deviation;

    for(var j = 0; j < connections; j++){
      deviation = -(numberOfNodes + 1);
      while(((i + deviation) < 0) || ((i + deviation) >= numberOfNodes) || (deviation == 0)){
        deviation = randomInt(deviationLimit, -deviationLimit/2);
      }
      //alert("Node Count: " + nodeCount + " Selected Index: " + (i + deviation) + " Current Node: " + i );
      nodeCluster[i].connected[j] = (nodeCluster[i + deviation]);
    }
  }

  arrNode.push(nodeCluster);

}



function randomExclusion(max, min, exclusion, zone){
  var x = exclusion;
  while((x < (exclusion + zone)) && (x > (exclusion - zone))){
    x = exclusion + (Math.random()*max) + min;
  }
  return x;
}



function randomInt(max, min){
  var random = Math.floor((Math.random() * max) + min);
  return random;
}
//createNode(0, 0, 0, null);

drawAllNodes();

function drawAllNodes(){
  for(var i = 0; i < arrNode.length; i++){
    drawNode(arrNode[i]);
  }
}


function createNode(x, y, z, arr){
  var node = {
    nodeX: x,
    nodeY: y,
    nodeZ: z,
    connected: new Array (),
    active: 0,
    vector: new THREE.Vector3(0, 0, 0),
    mesh: null,
    startLinks: new Array(),
    endLinks: new Array()
  };

  node.connected.push(arr);
  arrNode.push(node);
  return node;

}



function createLink(linkMesh, startNode, endNode){
  link = {
    mesh: linkMesh,
    start: startNode,
    end: endNode
  }
  startNode.startLinks.push(link);
  endNode.endLinks.push(link);

}


function drawNode(node){
  var nodeShape = new THREE.SphereGeometry((Math.random()*0.5) + nodeSize, 8, 8);
  var nodeMesh = new THREE.Mesh(nodeShape, materialBlue);
  nodeMesh.position.set(node.nodeX, node.nodeY, node.nodeZ);

  if(node.connected != null) {
    for(var i = 0; i < node.connected.length; i++){

      if(node.connected[i] != null){

        var cX = node.nodeX
        var cY = node.nodeY
        var cZ = node.nodeZ


        var length = Math.sqrt(Math.pow((node.connected[i].nodeX - node.nodeX), 2) + Math.pow((node.connected[i].nodeY - node.nodeY), 2) + Math.pow((node.connected[i].nodeZ - node.nodeZ), 2));
        var connectorShape = new THREE.CylinderGeometry( linkWidth, linkWidth, length, 6 );


        var text = "rgb(" + Math.floor(Math.random()*20 + 5) + "," +  Math.floor(Math.random()*50 + 110) + "," +  Math.floor(Math.random()*50 + 130) + ")"

        var newColor = new THREE.Color(text);

        materialWhite = new THREE.MeshBasicMaterial({color: newColor});

        var connectorMesh = new THREE.Mesh(connectorShape, materialWhite);

        connectorMesh.geometry.rotateX( Math.PI / 2 );
        connectorMesh.position.set((node.connected[i].nodeX + node.nodeX)/2, (node.connected[i].nodeY + node.nodeY)/2, (node.connected[i].nodeZ + node.nodeZ)/2 );


        var endPoint   = new THREE.Vector3(cX, cY, cZ);

        var startPoint = new THREE.Vector3(0, 0, 0);

        var direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize();

        connectorMesh.lookAt(endPoint);

        var link = createLink(connectorMesh, node, node.connected[i]);
        scene.add(connectorMesh);



        var wireframe = new THREE.WireframeGeometry( nodeShape );


        var lineMaterial = new THREE.MeshLambertMaterial({color: 0x111111});
        var line = new THREE.LineSegments( wireframe, lineMaterial );
        line.material.depthTest = false;
        line.material.opacity = 0.1;
        line.material.transparent = true;

        //line.position.set(node.nodeX, node.nodeY, node.nodeZ);


        //nodeMesh.add( line );

      }
    }
  }


  node.mesh = nodeMesh;
  scene.add(nodeMesh)



}



function updateLink(node){


  newPosition = new THREE.Vector3(node.nodeX, node.nodeY, node.nodeZ);

  var direction = new THREE.Vector3().subVectors(newPosition, new THREE.Vector3(0,0,0)).normalize();

  for(var i = 0; i < node.startLinks.length; i++){
    var length = Math.sqrt(Math.pow((node.startLinks[i].end.nodeX - node.nodeX), 2) + Math.pow((node.startLinks[i].end.nodeY - node.nodeY), 2) + Math.pow((node.startLinks[i].end.nodeZ - node.nodeZ), 2));
    node.startLinks[i].mesh.geometry = (new THREE.CylinderGeometry( linkWidth, linkWidth, length, 6 ));
    node.startLinks[i].mesh.geometry.rotateX( Math.PI / 2 );
    node.startLinks[i].mesh.position.set((node.startLinks[i].end.nodeX + node.nodeX)/2, (node.startLinks[i].end.nodeY + node.nodeY)/2, (node.startLinks[i].end.nodeZ + node.nodeZ)/2 );

    node.startLinks[i].mesh.lookAt(newPosition);
  }

  for(var i = 0; i < node.endLinks.length; i++){
    var length = Math.sqrt(Math.pow((node.endLinks[i].start.nodeX - node.nodeX), 2) + Math.pow((node.endLinks[i].start.nodeY - node.nodeY), 2) + Math.pow((node.endLinks[i].start.nodeZ - node.nodeZ), 2));
    node.endLinks[i].mesh.geometry = (new THREE.CylinderGeometry( linkWidth, linkWidth, length, 6 ));
    node.endLinks[i].mesh.geometry.rotateX( Math.PI / 2 );
    node.endLinks[i].mesh.position.set((node.endLinks[i].start.nodeX + node.nodeX)/2, (node.endLinks[i].start.nodeY + node.nodeY)/2, (node.endLinks[i].start.nodeZ + node.nodeZ)/2 );

    node.endLinks[i].mesh.lookAt(newPosition);
  }

}

render();


function getX(event){
  if(event.clientX != null){
    mouseX = event.clientX - window.innerWidth/2;
  }
}



function render(){

  var nodeSpeed = 0.3;
  var nodeDuration = 150;


  if(Math.random() > 0.99){
    for(var i = 0; i < arrNode.length; i++){
      if(arrNode[i].active == 0){
        if(Math.random() > 0.96){
          arrActive.push(arrNode[i]);
          arrNode[i].active = nodeDuration;
          arrNode[i].vector = new THREE.Vector3((Math.random()*nodeSpeed) - nodeSpeed/2, (Math.random()*nodeSpeed) - nodeSpeed/2,(Math.random()*nodeSpeed) - nodeSpeed/2);
        }
      }
    }
  }

  for(var i = 0; i < arrActive.length; i++) {

    arrActive[i].mesh.position.x += arrActive[i].vector.x;
    arrActive[i].mesh.position.y += arrActive[i].vector.y;
    arrActive[i].mesh.position.z += arrActive[i].vector.z;
    arrActive[i].nodeX += arrActive[i].vector.x;
    arrActive[i].nodeY += arrActive[i].vector.y;
    arrActive[i].nodeZ += arrActive[i].vector.z;

    arrActive[i].active--;
    updateLink(arrActive[i]);

    if(arrActive[i].active <= 0){
      arrActive[i].vector = new THREE.Vector3(0,0,0);
      arrActive.splice(i, 1);
    }

  }

    if(mouseX != null){
    var x = camera.position.x;
    var z = camera.position.z;
    rotX = -mouseX*0.00003;
    rotZ = z * Math.cos(rotX) - x * Math.sin(rotX);
    if(rotZ > 850){
    camera.position.x = x * Math.cos(rotX) + z * Math.sin(rotX);
    camera.position.z = rotZ;
    camera.lookAt( new THREE.Vector3(0,0,0) );
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
}
}
