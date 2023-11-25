// Scene Mesh Camera Renderer
import "./style.css";
import * as THREE from "three";
import {
	MapControls,
	OrbitControls,
} from "three/examples/jsm/controls/OrbitControls";
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/textures/alphaSnow.jpg");

scene.background = new THREE.CubeTextureLoader()
	.setPath("textures/env/")
	.load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

// const geometry = new THREE.PlaneGeometry(1, 1);
const geometry = new THREE.BufferGeometry();

const vertices = [];

for (let i = 0; i < 10000; i++) {
	const x = THREE.MathUtils.randFloatSpread(4);
	const y = THREE.MathUtils.randFloatSpread(4);
	const z = THREE.MathUtils.randFloatSpread(4);

	vertices.push(x, y, z);
}

geometry.setAttribute(
	"position",
	new THREE.Float32BufferAttribute(vertices, 3)
);
const material = new THREE.PointsMaterial({
	transparent: true,
	alphaMap: particlesTexture,
	depthTest: false,
});
material.size = 0.02;
const points = new THREE.Points(geometry, material);

// const material = new THREE.MeshBasicMaterial({
// 	color: "red",
// 	side: THREE.DoubleSide,
// });

// const cube = new THREE.Mesh(geometry, material);
scene.add(points);
const aspect = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
	75,
	aspect.width / aspect.height,
	0.01,
	1000
);

camera.position.z = 2;
scene.add(camera);

window.addEventListener("resize", () => {
	aspect.width = window.innerWidth;
	aspect.height = window.innerHeight;
	camera.aspect = aspect.width / aspect.height;
	camera.updateProjectionMatrix();
	renderer.setSize(aspect.width, aspect.height);
});
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(aspect.width, aspect.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableRotate = true;
// controls.enableZoom = false;

const clock = new THREE.Clock();

const gravity = new THREE.Vector3(0, -0.001, 0); // Adjust the Y component to control the falling speed
const wind = new THREE.Vector3(0.002, 0, 0); // Optional wind effect, adjust as needed

// Update point positions for snowfall

const animate = () => {
	// const elapsedTime = clock.getElapsedTime();

	// points.rotation.y = elapsedTime * 0.05;

	// controls.update();
	// renderer.render(scene, camera);
	// requestAnimationFrame(animate);

	const elapsedTime = clock.getElapsedTime();

	const data = geometry.attributes.position.array;

	for (let i = 0; i < data.length; i += 3) {
		data[i] += Math.random() * 0.0002;

		data[i + 1] += gravity.y;

		if (data[i] > 2) {
			data[i] = -2;
		}
		if (data[i + 1] < -2) {
			data[i + 1] = 2;
		}
	}

	// Log the minimum Y-coordinate for debugging
	// console.log("Min Y:", minY);

	geometry.attributes.position.needsUpdate = true;
	points.rotation.y = elapsedTime * 0.01;
	points.rotation.z = elapsedTime * 0.01;
	// points.rotation.x = elapsedTime * 0.01;

	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();
