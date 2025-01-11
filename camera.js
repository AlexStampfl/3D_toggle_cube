export function initCameraControls() {
    const cameraState = {
        radius: 6.0,
        theta: 45.0,
        phi: 45.0,
        isPerspective: true,
    };

    // Update radius, theta, and phi from sliders
    document.getElementById("radiusSlider").addEventListener("input", (e) => {
       cameraState.radius = parseFloat(e.target.value);
    });

    document.getElementById("thetaSlider").addEventListener("input", (e) => {
        cameraState.theta = parseFloat(e.target.value) * Math.PI / 180;
    });

    document.getElementById("phiSlider").addEventListener("input", (e) => {
        cameraState.phi = parseFloat(e.target.value) * Math.PI / 180;
    });

    document.getElementById("projectionToggle").addEventListener("change", (event) => {
        cameraState.isPerspective = event.target.value === "perspective";
    });

    return cameraState;
}

export function updateCamera(cameraState, modelViewMatrix) {
    const eye = vec3.create();
    const { radius, theta, phi } = cameraState;

    eye[0] = radius * Math.sin(theta) * Math.cos(phi);
    eye[1] = radius * Math.sin(theta) * Math.sin(phi);
    eye[2] = radius * Math.cos(theta);

    mat4.lookAt(modelViewMatrix, eye, [0, 0, 0], [0, 1, 0]);
}