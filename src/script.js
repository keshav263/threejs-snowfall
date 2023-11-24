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
	0.001,
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
controls.enableRotate = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;

const clock = new THREE.Clock();
const animate = () => {
	const elapsedTime = clock.getElapsedTime();

	// points.rotation.z = elapsedTime * 0.05;

	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();
