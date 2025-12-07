let scene, camera, renderer, controls;
let earthMesh;
let activeDynastyMesh = null;

// Earth textures
const earthTextures = {
    diffuse: "assets/earth.jpg",
    bump: "assets/earth.jpg",
    specular: "assets/earth.jpg"
};

// Dynasty GeoJSON folder
const DYNASTY_PATH = "assets/dynasties/";
const DYNASTY_FILES = {
    qin: "qin.geojson",
    han: "han.geojson",
    tang: "tang.geojson",
    song: "song.geojson",
    ming: "ming.geojson",
    qing: "qing.geojson"
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 500);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globe-container").appendChild(renderer.domElement);

    // Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Earth
    const tex = earthTextures;

    const textureLoader = new THREE.TextureLoader();
    const diffuseMap = textureLoader.load(tex.diffuse);
    const bumpMap = textureLoader.load(tex.bump);

    const earthGeo = new THREE.SphereGeometry(150, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
        map: diffuseMap,
        bumpMap: bumpMap,
        bumpScale: 1
    });

    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.0005;
    controls.update();
    renderer.render(scene, camera);
}

async function loadDynasty(key) {
    if (!DYNASTY_FILES[key]) return;

    if (activeDynastyMesh) {
        scene.remove(activeDynastyMesh);
        activeDynastyMesh = null;
    }

    const url = DYNASTY_PATH + DYNASTY_FILES[key];
    const response = await fetch(url);
    const data = await response.json();

    const group = new THREE.Group();

    data.features.forEach(feature => {
        const coords = feature.geometry.coordinates[0];
        const shape = new THREE.Shape();

        coords.forEach(([lng, lat], i) => {
            const p = convertLatLngTo3D(lat, lng, 152);
            if (i === 0) shape.moveTo(p.x, p.y);
            else shape.lineTo(p.x, p.y);
        });

        const geom = new THREE.ExtrudeGeometry(shape, { depth: 4 });
        const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);
    });

    activeDynastyMesh = group;
    scene.add(group);
}

function convertLatLngTo3D(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return {
        x: -(radius * Math.sin(phi) * Math.cos(theta)),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta)
    };
}

init();
