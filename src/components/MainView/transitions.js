import * as THREE from 'three';
import * as SCENE from './scene.js';

var transitions = [];
const EPSILON = 1e-5;
const cubicEase = (x) => (x > 1) ? 1 : (1-Math.pow(1-x, 3));
const cosineEase = (x) => (x > 1) ? 1 : (1-Math.cos(x * Math.PI))/2;

/***** Helper Functions *****/
function runTransitions() {
    const running = [];
    const now = (new Date()).getTime();

    while (transitions.length > 0) {
        const transition = transitions.pop();
        const done = transition(now);

        if (!done) {
            running.push(transition);
        }
    }

    while (running.length > 0) {
        transitions.push(running.pop());
    }
}


/***** BEGIN TRANSITIONS *****/
function start3DTransition(view3D) {
    SCENE.orbitControls.enabled = false;
    transitions = [];

    SCENE.yAxis.material.transparent = true;
    SCENE.curveSurface.material.transparent = true;

    const now = (new Date()).getTime();
    if (!view3D) {
        const cameraTarget = SCENE.orbitControls.target.clone();
        const cameraPosition = SCENE.camera.position.clone();
        cameraPosition.sub(cameraTarget);
        const cameraDistance = cameraPosition.length();

        const initialQuaternion = SCENE.camera.quaternion.clone();
        const targetQuaternion = new THREE.Quaternion(
            -Math.sqrt(0.5) + EPSILON, 0, 0, Math.sqrt(0.5) + EPSILON);
        targetQuaternion.normalize();

        transitions.unshift(
            (t) => orbitCameraTransition(
                t, now, now + 300,
                cameraDistance, cameraTarget,
                initialQuaternion, targetQuaternion
            )
        );
    }

    // Shift axes position
    transitions.unshift(
        (t) => shiftAxesTransition(t, view3D, now, now + 300)
    );

    // Toggle surface visibility
    if (view3D) {
        for (var obj of SCENE.toggle3DList) {
            obj.visible = true;
        }
    }
    SCENE.yAxis.transparent = true;
    transitions.unshift(
        (t) => toggleSurfacesTransition(t, view3D, now, now + 300)
    );

    // Re-enable controls after delay
    transitions.unshift(
        (t) => enableControlsTransition(t, view3D, now + 350)
    );
}

function orbitCameraTransition(
    now, start, stop,
    radius, target,
    q0, q1) {
    const camera = SCENE.camera;
    const alpha = cosineEase((now-start) / (stop-start));

    // Compute new quaternion
    const quaternion = q0.clone();
    quaternion.slerp(q1, alpha);

    // Compute new camera position
    const newPosition = new THREE.Vector3(0, 0, radius);
    newPosition.applyQuaternion(quaternion);
    newPosition.add(target);

    // Update camera setup
    camera.quaternion.copy(quaternion);
    camera.position.copy(newPosition);
    camera.updateProjectionMatrix();
    return now > stop;
}


function shiftAxesTransition(now, view3D, start, stop) {
    const alpha = cubicEase((now-start) / (stop-start));
    const y = (view3D ? (1-alpha) : alpha) * 0.99 + 0.005;
    SCENE.axes.position.setY(y);
    return now > stop;
}

function toggleSurfacesTransition(now, view3D, start, stop) {
    const alpha = cubicEase((now-start) / (stop-start));
    const beta = view3D ? alpha : (1-alpha);

    SCENE.plane.material.opacity = 0.6 * beta;
    SCENE.curveSurface.material.opacity = beta;
    SCENE.yAxis.material.opacity = beta;

    if (now > stop) {
        if (!view3D) {
            for (var obj of SCENE.toggle3DList) {
                obj.visible = false;
            }
        }
        SCENE.yAxis.material.transparent = false;
        SCENE.curveSurface.material.transparent = false;
        return true;
    } else {
        return false;
    }
}


function enableControlsTransition(now, view3D, targetTime) {
    if (now < targetTime) {
        return false;
    } else {
        const controls = SCENE.orbitControls;

        // Enable/disable approrpiate features
        controls.enableRotate = view3D;
        controls.enableDamping = view3D;

        // Swap controls mouse buttons
        if (view3D) {
            controls.mouseButtons.LEFT = THREE.MOUSE.LEFT;
            controls.mouseButtons.RIGHT = THREE.MOUSE.RIGHT
        } else {
            controls.mouseButtons.LEFT = THREE.MOUSE.RIGHT;
            controls.mouseButtons.RIGHT = THREE.MOUSE.LEFT;
        }

        // Raise or lower control target appropriately
        controls.target.setY(view3D ? 0 : 1);

        controls.enabled = true;
        return true;
    }
}

export {
    runTransitions,
    start3DTransition,
    enableControlsTransition
};
