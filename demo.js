
import { initBuffers } from "./buffer.js";
import { drawScene } from "./draw.js";
import { initCameraControls, updateCamera } from "./camera.js";
import { initializeShaderProgram } from "./shader.js";

let cubeRotation = 7.0;
let deltaTime = 3;

main();

function main() {
  const canvas = document.querySelector("#gl-canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) { alert("Can't start WebGL."); return; }

  const cameraState = initCameraControls();
  
  // Load shaders from html file
  const vertexShaderSource = document.getElementById("vertex-shader").textContent;
  const fragmentShaderSource = document.getElementById("fragment-shader").textContent;
  
  const linkedShaderProgram = initializeShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

  console.log("WebGL context initialized:", gl);

  // Set background color & clear canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  console.log("Background cleared to black");

  // Projection toggle: Perspective vs Orthographic
  let isPerspective = true;

  document.getElementById("projectionToggle").addEventListener("change", (event) => {
    isPerspective = event.target.value === "perspective";
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

  // Debugging: log uniform locations
  console.log('Projection Matrix Location:', programInfo.uniformLocations.projectionMatrix);
  console.log('Model-View Matrix Location:', programInfo.uniformLocations.modelViewMatrix);

  // Here's where we call the routine that builds all the objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Draw the scene
  let then = 0;


  function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const modelViewMatrix = mat4.create();
    // updateCamera(modelViewMatrix);
    updateCamera(cameraState, modelViewMatrix);

    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]); // Move cube back

    drawScene(gl, programInfo, buffers, modelViewMatrix, isPerspective);

    requestAnimationFrame(render);
    console.log("Model-View Matrix:", modelViewMatrix);

  }
  requestAnimationFrame(render);
}