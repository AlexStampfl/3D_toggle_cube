
import { initBuffers } from "./buffer.js";
import { drawScene } from "./draw.js";
import { initCameraControls, updateCamera } from "./camera.js";
import { initializeShaderProgram } from "./shader.js";

let cubeRotation = 7.0;

main();

function main() {
  const canvas = document.querySelector("#gl-canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) { alert("Can't start WebGL."); return; }

  gl.disable(gl.BLEND);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL); // use default depth test function
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear immediately
  gl.viewport(0, 0, canvas.clientWidth, canvas.height); // Ensure proper viewport setup

  console.log("Clear Color (initial):", gl.getParameter(gl.COLOR_CLEAR_VALUE));

  // Initialize camera controls
  const cameraState = initCameraControls();

  // Load shaders from html
  const vertexShaderSource = document.getElementById("vertex-shader").textContent;
  const fragmentShaderSource = document.getElementById("fragment-shader").textContent;

  // compile and link the shader program
  const linkedShaderProgram = initializeShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Set up projection toggle
  let isPerspective = true;
  document.getElementById("projectionToggle").addEventListener("change", (event) => {
    isPerspective = event.target.value === "perspective";
  });

  // Visualization toggles
  let visualizationMode = "Wireframe"; // default mode
  document.getElementById("visualToggle").addEventListener("change", (event) => {
    visualizationMode = event.target.value;
    console.log("Visualization mode selected: ", visualizationMode);
  });

  const colorSquare = [1.0, 1.0, 1.0, 1.0];
  const uSquareColorLocation = gl.getUniformLocation(linkedShaderProgram, 'uSquareColor');
  gl.useProgram(linkedShaderProgram);
  gl.uniform4fv(uSquareColorLocation, colorSquare);

  const programInfo = {
    program: linkedShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(linkedShaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(linkedShaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(linkedShaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(linkedShaderProgram, "uModelViewMatrix"),
    },
  };

  const buffers = initBuffers(gl, visualizationMode);

  requestAnimationFrame((now) => render(now, gl, programInfo, buffers, cameraState, isPerspective, then));
}

let then = 0;
function render(now, gl, programInfo, buffers, cameraState, isPerspective, then, visualizationMode) {
  now *= 0.001;
  const deltaTime = now - then;
  then = now;

  console.log("Before gl.clear() COLOR_CLEAR_VALUE:", gl.getParameter(gl.COLOR_CLEAR_VALUE));
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear each frame
  console.log("Canvas cleared with color:", gl.getParameter(gl.COLOR_CLEAR_VALUE));

  const modelViewMatrix = mat4.create();
  updateCamera(cameraState, modelViewMatrix);
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]); // Move cube back

  drawScene(gl, programInfo, buffers, modelViewMatrix, isPerspective, visualizationMode);

  requestAnimationFrame((newNow) => render(newNow, gl, programInfo, buffers, cameraState, isPerspective, then));
}