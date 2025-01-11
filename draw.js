import { initIndexBuffer } from "./buffer.js";

function drawScene(gl, programInfo, buffers, modelViewMatrix, isPerspective, visualizationMode) {
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set up the projection matrix
  const fieldOfView = (65 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;

  const projectionMatrix = mat4.create();
  if (isPerspective) {
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  } else {
    mat4.ortho(projectionMatrix, -3, 3, -3, 3, zNear, zFar);
  }
  
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]); // Move cube into view

  // Pass matrices to shaders
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

  // Bind buffers and configure attributes
  configurePositionBuffer(gl, buffers, programInfo);
  configureColorBuffer(gl, buffers, programInfo);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
  gl.useProgram(programInfo.program);

  console.log("Current visualization mode:", visualizationMode);

  switch (visualizationMode) {
    case "Wireframe":
      console.log("Drawing in Wireframe mode");
      gl.uniform1i(gl.getUniformLocation(programInfo.program, 'uWireframeMode'), true); // Set shader to wireframe
      gl.drawElements(gl.LINES, 48, gl.UNSIGNED_SHORT, 0);
      break;
    case "Solid":
      console.log("Drawing in Solid mode");
      gl.uniform1i(gl.getUniformLocation(programInfo.program, 'uWireframeMode'), false); // Set shader to solid

      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      break;
    case "Flat-shading":
      console.log("Drawing in Flat-shading mode");
      // Adjust shaders to use flat shading
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      break;
    case "Smooth-shading":
      console.log("Drawing in Smooth-shading mode");
      // Adjust shaders
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      break;
    default:
      console.warn("Unknown visualization mode:", visualizationMode);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
      break;
  }
}

function configurePositionBuffer(gl, buffers, programInfo) {
  const numComponentsPerVertex = 3;
  const dataType = gl.FLOAT;
  const shouldNormalize = false;
  const strideLength = 0;
  const startOffset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponentsPerVertex,
    dataType,
    shouldNormalize,
    strideLength,
    startOffset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Tell WebGL how to pull out the colors from the color buffer into the vertexColor attribute.
function configureColorBuffer(gl, buffers, programInfo) {
  const numComponents = 4;
  const dataType = gl.FLOAT;
  const normalize = false;
  const strideLength = 0;
  const startOffset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    dataType,
    normalize,
    strideLength,
    startOffset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

export { drawScene };