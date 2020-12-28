import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import {
    affineCurveGeometry, curveSurfaceGeometry
} from 'math/graphics.js';

/***** Setup *****/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth/window.innerHeight,
    1e-2, 1e8);
var orbitControls;

const CURVE_COLOR = 0x66B5F3;



/***** Main Scene *****/
/** Elliptic curve **/
const curveLineMaterial = new THREE.LineBasicMaterial({
    color: CURVE_COLOR, linewidth: 3});

// Loop component of two-component elliptic curve (optional)
const curveLineGeoA = new THREE.BufferGeometry();
curveLineGeoA.addAttribute('position',
    new THREE.BufferAttribute(affineCurveGeometry()[0], 3)
);
const curveLineA = new THREE.LineLoop(curveLineGeoA, curveLineMaterial);
scene.add(curveLineA);

// Unbounded component elliptic curve
const curveLineGeoB = new THREE.BufferGeometry();
curveLineGeoB.addAttribute('position',
    new THREE.BufferAttribute(affineCurveGeometry()[0], 3)
);
const curveLineB = new THREE.Line(curveLineGeoB, curveLineMaterial);
scene.add(curveLineB);

/** Coordinate Axes **/
// Main (xz) axes
const axesMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
const axesGeo = new THREE.BufferGeometry();
axesGeo.addAttribute('position',
    new THREE.BufferAttribute(new Float32Array([
        -1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0,
        0, 0, -1, 0, 0, 0,
        0, 0, 0, 0, 0, 1
    ]), 3)
);
const axes = new THREE.LineSegments(axesGeo, axesMaterial);
axes.position.setY(0.99);
scene.add(axes);

// y-axis (only visible in 3D)
const yAxisMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF, transparent: true, opacity: 0});
const yAxisGeo = new THREE.BufferGeometry();
yAxisGeo.addAttribute('position',
    new THREE.BufferAttribute(new Float32Array([
        0, -1, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0
    ]), 3)
);
const yAxis = new THREE.Line(yAxisGeo, yAxisMaterial);
yAxis.visible = false;
scene.add(yAxis);

/** Surfaces (3D) **/
// Projective curve surface
var curveSurfaceMaterial = new THREE.MeshPhongMaterial({
    color: CURVE_COLOR, side: THREE.DoubleSide,
    transparent: true, opacity: 0,
    wireframe: false
});

const curveSurfaceGeo = new THREE.BufferGeometry();
const [index, geoPoints] = curveSurfaceGeometry();
curveSurfaceGeo.setIndex(index);
curveSurfaceGeo.addAttribute('position',
    new THREE.BufferAttribute(geoPoints, 3));

const curveSurface = new THREE.Mesh(curveSurfaceGeo, curveSurfaceMaterial);
curveSurface.visible = false;
curveSurface.scale.setScalar(4);
scene.add(curveSurface);


// Plane at y=1
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x8888A0, side: THREE.DoubleSide,
    transparent: true, opacity: 0
});
const planeGeo = new THREE.PlaneBufferGeometry(2, 2, 10, 10);
const plane = new THREE.Mesh(planeGeo, planeMaterial);
plane.rotateX(Math.PI/2);
plane.position.setY(0.99);
plane.scale.setScalar(4);
scene.add(plane);


/** Lights **/
const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
directionalLight.target.position.set(5, 0, -1);
scene.add(directionalLight);
scene.add(directionalLight.target);

const light = new THREE.PointLight(0xFFFFFF, 0.7);
scene.add(light);

/*
const testCube = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({color: 0xFF0000})
);
scene.add(testCube);
*/



/***** API *****/
function initialize() {
    const canvas = document.getElementById('main-view');

    // Set initial camera state
    camera.quaternion.set(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    camera.quaternion.normalize();
    camera.position.set(0, 8, 0);
    camera.updateProjectionMatrix();

    // Initialize orbit controls
    orbitControls = new OrbitControls(camera, canvas);
    orbitControls.dampingFactor = 0.15;
    orbitControls.rotateSpeed = 0.15;
    orbitControls.screenSpacePanning = true;
}

function update() {
    if (orbitControls.enabled) {orbitControls.update();}

    const uxScale = 5 * Math.max(camera.position.length(), 0.1);
    axes.scale.setScalar(uxScale);
    //plane.scale.setScalar(uxScale);
    yAxis.scale.setScalar(uxScale);
    //curveSurface.scale.setScalar(uxScale);

    light.position.copy(camera.position);
}

// List of objects whose visibility depends on 2D/3D switch
const toggle3DList = [plane, yAxis, curveSurface];

export {
    initialize, update,
    toggle3DList,

    scene, camera, orbitControls,
    curveLineA, curveLineB, curveSurface,
    axes, yAxis, plane
};
