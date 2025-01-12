import { makeBuf, makeiBuf } from "./buffer.js";
import { sketchScene } from "./draw.js";
import { initCameraControls, updateCamera } from "./camera.js";
import { initializeShaderProgram } from "./shader.js";
import { makeColBuf, colorSchemes } from "./buffer.js";
import { makeStanceBuf } from "./buffer.js";

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

  let isPerspective = true;
  let visualizationMode = "Wireframe"; // default mode
  let buffers = {
    position: makeStanceBuf(gl),
    color: makeColBuf(gl, colorSchemes.scheme1),
    indices: makeiBuf(gl),
  };

  // Set up projection toggle
  document.getElementById("perspectiveToggle").addEventListener("change", (event) => {
    isPerspective = event.target.value === "perspective";
  });

  // color toggles
  document.getElementById("colorToggle").addEventListener("change", (event) => {
    const selectedScheme = colorSchemes[event.target.value];
    if (selectedScheme) {
      console.log(`Switching to color scheme: ${event.target.value}`);
      buffers.color = makeColBuf(gl, selectedScheme);
      render(0, gl, programInfo, buffers, cameraState, isPerspective, then, visualizationMode);
    } else {
      console.error(`Uknown color scheme: ${event.target.value}`);
    }
  });

  // canvas listener
  canvas.addEventListener("click", () => {
    turnCubeYellow(gl, buffers);
    render(0, gl, programInfo, buffers, cameraState, isPerspective, visualizationMode);
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

  requestAnimationFrame((now) => render(now, gl, programInfo, buffers, cameraState, isPerspective, then));
}

function turnCubeYellow(gl, buffers) {
  const yellowColor = [1.0, 1.0, 0.0, 1.0]; // Yellow color
  const yellowScheme = Array(6).fill(yellowColor); // Repeat for all 6 faces
  buffers.color = makeColBuf(gl, yellowScheme);
}

let then = 0;
function render(now, gl, programInfo, buffers, cameraState, isPerspective, visualizationMode) {
  now *= 0.001;
  const deltaTime = now - then;
  then = now;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear each frame

  const modelViewMatrix = mat4.create();
  updateCamera(cameraState, modelViewMatrix);
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]); // Move cube back

  sketchScene(gl, programInfo, buffers, modelViewMatrix, isPerspective, visualizationMode);

  requestAnimationFrame((newNow) => render(newNow, gl, programInfo, buffers, cameraState, isPerspective, visualizationMode));
}