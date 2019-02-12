let width = window.innerWidth;
let height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 1000);
camera.position.z = 1;

const scene = new THREE.Scene();

const color = 0x00ff00;

const geometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);

const raycaster = new THREE.Raycaster();
let clicked = false;
let animCompleted = true;
let intersected;
let mouse = {
	x: null,
	y: null
}
const minX = -29;
const maxX = 29;
const minY = -19;
const maxY = 19;
const meshPositionList = [];

for (let i = minX; i <= maxX; i++) {
	for (let j = minY; j <= maxY; j++) {
		const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
		mesh.position.x = i;
		mesh.position.y = j;
		mesh.position.z = -10;
		scene.add(mesh);
		meshPositionList.push(mesh.position);
	}
}

const light = new THREE.PointLight(0xFFFFFF, 1.0, 50);
scene.add(light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

function bigBounce(objectList, minX, maxX, minY, maxY, index) {
	animCompleted = false;
	anime({
		targets: objectList,
		z: [
			{ value: -20, easing: 'easeOutSine', duration: 1000 },
			{ value: -10, easing: 'easeInOutQuad', duration: 2400 }
		],
		delay: anime.stagger(100, { grid: [Math.abs(minY - maxY) + 1, Math.abs(minX - maxX) + 1], from: index }),
		easing: 'spring',
		complete: _ => animCompleted = true
	});
}

function removeHighlight(object) {
	if (object) {
		intersected.material.color.setHex(color);
	}
}

animate();

function animate() {
	requestAnimationFrame(animate);
	update();
	render();
}

function update() {
	// Wait for the animation to complete before starting a new one or highlighting
	if (animCompleted) {
		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children);
		
		// The user is pointing a cube
		if (intersects.length > 0) {
			// He is just pointing (no click)
			if (!clicked) {
				if (intersects[0].object != intersected) {
					removeHighlight(intersected);
					intersected = intersects[0].object;
					console.log('add red as cube selected')
					intersected.material.color.setHex(0xff0000);
				}
			// He has clicked the cube
			} else {
				if (intersects[0].object && intersects[0].object.position) {
					const x = intersects[0].object.position.x;
					const y = intersects[0].object.position.y;
					const index = -1 * (minY - y) + -1 * (minX - x) * (Math.abs(minY - maxY) + 1);
					bigBounce(meshPositionList, minX, maxX, minY, maxY, index);
				}
				clicked = false;
			}
		} else {
			removeHighlight(intersected);
			intersected = null;
		}
	} else {
		removeHighlight(intersected);
	}
}

function render() {
	renderer.render(scene, camera);
}

function updateMousePosition(e, mouse) {
	mouse.x = (e.clientX / width) * 2 - 1;
	mouse.y = - (e.clientY / height) * 2 + 1;
}

window.addEventListener('click', e => {
	if (animCompleted && !clicked) {
		updateMousePosition(e, mouse);
		clicked = true;
	}
})

window.addEventListener('mousemove', e => {
	if (animCompleted) {
		updateMousePosition(e, mouse);
	}
})

window.addEventListener('resize', _ => {
	width = window.innerWidth;
	height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
})