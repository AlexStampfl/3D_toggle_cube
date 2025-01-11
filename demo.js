
import { initBuffers } from "./buffer.js";
import { drawScene } from "./draw.js";
import { initCameraControls, updateCamera } from "./camera.js";

let cubeRotation = 7.0;
let deltaTime = 3;

main();

function main() {
  const canvas = document.querySelector("#gl-canvas");
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is up & running
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    return;
  }

  const cameraState = initCameraControls();

  // Load shaders from html file
  const vertexShaderSource = document.getElementById("vertex-shader").textContent;
  const fragmentShaderSource = document.getElementById("fragment-shader").textContent;

  //Initialize a shader program; where all lighting for vertices is established
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

// Initialize a shader program, so WebGL knows how to draw our data
function initializeShaderProgram(gl, vsSource, fsSource) {
  const vShader = compileAndAttachShader(gl, gl.VERTEX_SHADER, vsSource);
  const fShader = compileAndAttachShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const linkedShaderProgram = gl.createProgram();
  gl.attachShader(linkedShaderProgram, vShader);
  gl.attachShader(linkedShaderProgram, fShader);
  gl.linkProgram(linkedShaderProgram);

  if (!gl.getProgramParameter(linkedShaderProgram, gl.LINK_STATUS)) {
    console.log("Unable to initialize the shader program:", gl.getProgramInfoLog(linkedShaderProgram));
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        linkedShaderProgram,
      )}`,
    );
    return null;
  }

  return linkedShaderProgram;
}

function compileAndAttachShader(gl, type, source) {
  const shade = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shade, source);

  // Compile the shader program
  gl.compileShader(shade);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shade, gl.COMPILE_STATUS)) {
    console.log(`Error compiling shader (${type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT'}):`, gl.getShaderInfoLog(shader))
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shade)}`,
    );
    gl.deleteShader(shade);
    return null;
  }

  return shade;
}