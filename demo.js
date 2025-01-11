
import { initBuffers } from "./buffer.js";
import { drawScene } from "./draw.js";

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

  // Projection toggle: Perspective vs Orthographic
  let isPerspective = true;

  document.getElementById("projectionToggle").addEventListener("change", (event) => {
    isPerspective = event.target.value === "perspective";
  })

  // Camera control variables
  let radius = 6.0, theta = 45.0, phi = 45.0;

  // Update radius, theta, and phi from sliders
  document.getElementById("radiusSlider").addEventListener("input", (e) => {
    radius = parseFloat(e.target.value);
  });
  document.getElementById("thetaSlider").addEventListener("input", (e) => {
    theta = parseFloat(e.target.value) * Math.PI / 180;
  });
  document.getElementById("phiSlider").addEventListener("input", (e) => {
    phi = parseFloat(e.target.value) * Math.PI / 180;
  });

  // Camera update function
  function updateCamera(modelViewMatrix) {
    const eye = vec3.create();
    eye[0] = radius * Math.sin(theta) * Math.cos(phi);
    eye[1] = radius * Math.sin(theta) * Math.sin(phi);
    eye[2] = radius * Math.cos(theta);
    mat4.lookAt(modelViewMatrix, eye, [0, 0, 0], [0, 1, 0]);
  }

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader - compute the color of each pixel of the primitive being drawn
const fsSource = `
    precision mediump float;
    varying lowp vec4 vColor;
    uniform vec4 uSquareColor;

    void main(void) {
      gl_FragColor = mix(vColor, uSquareColor, 0.1);
    }
  `;

  //Initialize a shader program; where all lighting for vertices is established
  const linkedShaderProgram = initializeShaderProgram(gl, vsSource, fsSource);
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

// Draw the scene repeatedly
function render(now) {
  now *= 0.001; // convert to seconds
  const deltaTime = now - then;
  then = now;

  // Create the modelViewMatrix and update the camera
  const modelViewMatrix = mat4.create();
  updateCamera(modelViewMatrix); // Updates camera based on sliders

  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]); // Move cube back

  // Pass the updated modelViewMatrix to drawScene
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