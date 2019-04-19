import * as THREE from 'three';

import * as SCENE from './scene.js';
import * as TRANS from './transitions.js';

import * as CURVE from 'math/curve.js';
import {affineCurveGeometry, curveSurfaceGeometry} from 'math/graphics.js';

/***** State *****/
var initialized = false;
var view3D = false;

/***** Initialization *****/
var renderer;

function initializeRenderer() {
	const canvas = document.getElementById('main-view');
	renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true,
		logarithmicDepthBuffer: true
	});
	renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

	renderer.setSize(window.innerWidth, window.innerHeight);
	window.addEventListener('resize', handleResize);
}

function handleResize(e) {
	renderer.setSize(window.innerWidth, window.innerHeight);
	SCENE.camera.aspect = window.innerWidth / window.innerHeight;
	SCENE.camera.updateProjectionMatrix();
}

function initialize() {
	initializeRenderer();
	SCENE.initialize();
	TRANS.enableControlsTransition(0, view3D, 0);
	initialized = true;
}


function animate() {
	requestAnimationFrame(animate);
	renderer.render(SCENE.scene, SCENE.camera);

	SCENE.update();
	TRANS.runTransitions();
}


/***** Interface *****/
function render() {
	initialize();
	animate();
}

function updateCurve() {
	const curveGeo = affineCurveGeometry();

	const geoA = SCENE.curveLineA.geometry;
	const posA = geoA.attributes.position;
	const geoB = SCENE.curveLineB.geometry;
	const posB = geoB.attributes.position;

	if (curveGeo.length === 1) {
		posB.copyArray(curveGeo[0]);
		SCENE.curveLineA.visible = false;
	} else {
		posA.copyArray(curveGeo[0]);
		posA.needsUpdate = true;
		geoA.computeBoundingSphere();

		posB.copyArray(curveGeo[1]);
		SCENE.curveLineA.visible = true;
	}
	posB.needsUpdate = true;
	geoB.computeBoundingSphere();

	if (view3D) {
		const surfaceGeo = SCENE.curveSurface.geometry;
		const surfacePos = surfaceGeo.attributes.position;
		const [index, geoPoints] = curveSurfaceGeometry();
		surfaceGeo.index = index;
		surfacePos.copyArray(geoPoints);
		surfacePos.needsUpdate = true;
		surfaceGeo.computeBoundingSphere();
		surfaceGeo.computeVertexNormals();
	}
}

function set3D(newView3D) {
	if (initialized & (newView3D !== view3D)) {
		view3D = newView3D;
		TRANS.start3DTransition(view3D);
	}
}

export default render;
export {updateCurve, set3D};
