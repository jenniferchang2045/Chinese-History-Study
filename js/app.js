let scene,camera,renderer,controls,earth;
init(); animate();
function init(){
 scene=new THREE.Scene();
 camera=new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,0.1,2000);
 camera.position.set(0,0,400);
 renderer=new THREE.WebGLRenderer({antialias:true});
 renderer.setSize(window.innerWidth-450, window.innerHeight);
 document.getElementById("globe-container").appendChild(renderer.domElement);
 controls=new THREE.OrbitControls(camera,renderer.domElement);
 const earthTexture = new THREE.TextureLoader().load(
  "https://cdn.jsdelivr.net/gh/ajd-123/earth-textures@main/earthmap4k.jpg"
);
 earth=new THREE.Mesh(new THREE.SphereGeometry(120,64,64), new THREE.MeshBasicMaterial({map:tex}));
 scene.add(earth);
}
async function loadDynasty(key){
 const url="assets/dynasties/"+key+".geojson";
 const data=await fetch(url).then(r=>r.json());
 alert("Loaded dynasty: "+key);
}
function animate(){
 requestAnimationFrame(animate);
 earth.rotation.y+=0.0005;
 renderer.render(scene,camera);
}
function askTutor(){
 const q=document.getElementById("tutor-input").value;
 document.getElementById("tutor-output").innerHTML += "<div>You: "+q+"</div><div>Tutor: Placeholder reply.</div>";
 document.getElementById("tutor-input").value="";
}
