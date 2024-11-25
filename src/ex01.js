import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ----- 주제: glb 파일 불러오기

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	// camera.position.x = 3;
	// camera.position.y = 5;
	// camera.position.z = 5;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.autoRotate = true;

	// gltf loader
	const gltfLoader = new GLTFLoader();
	gltfLoader.load(
		'./models/isometric-room-02.glb',
		gltf => {
			const room = gltf.scene.children[0];

			console.log(gltf.scene.children[0]);
			console.log(gltf.scene);

			const box = new THREE.Box3().setFromObject(gltf.scene); // 가상의 박스를 만들어서 gltf.scene의 크기를 구함
			const size = box.getSize(new THREE.Vector3()).length();
			const center = box.getCenter(new THREE.Vector3());

			controls.reset(); // 카메라 위치 초기화

			room.position.x -= center.x;
			room.position.y -= center.y;
			room.position.z -= center.z;

			controls.maxDistance = size * 10;

			camera.near = size / 100;
			camera.far = size * 100;
			camera.updateProjectionMatrix();

			camera.position.copy(center);
			camera.position.x += size / 2;
			camera.position.y += size / 5;
			camera.position.z += size / 2;
			camera.lookAt(center);

			console.log("CAMERA POSITION: ", camera.position);

			controls.saveState();

			console.log("BOX: ", box);
			console.log("SIZE: ", size);
			console.log("CENTER: ", center);

			scene.add(room);
		}
	)


	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		controls.update();

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
