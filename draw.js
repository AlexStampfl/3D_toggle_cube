import { createIndexBuffer } from "./buffer.js";


function setupPosBuf(gl, buffers, programInfo) {
  const numComponentsPerVertex = 3;
  const dType = gl.FLOAT;
  const shudNorm = false;
  const strideLen = 0;
  const startOffset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponentsPerVertex,
    dType,
    shudNorm,
    strideLen,
    startOffset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// Show WebGL to take out colors from colorbuffer into vertexColor attribute.
function setupColBuf(gl, buffers, programInfo) {
  const numComp = 4;
  const dType = gl.FLOAT;
  const norm = false;
  const strydLen = 0;
  const startOffset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComp,
    dType,
    norm,
    strydLen,
    startOffset,
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

// setProjectionMatrix(gl, programInfo, isPerspective) 



function sketchScene(gl, programInfo, buffers, modelViewMatrix, isPerspective, visualizationMode) {
  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Reinitialize the index buffer for the current visualization mode
  buffers.indices = createIndexBuffer(gl, visualizationMode); // Update indices buffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

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

  // Bind buffers and configure attributes
  setupPosBuf(gl, buffers, programInfo);
  setupColBuf(gl, buffers, programInfo);
  
  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
  gl.useProgram(programInfo.program);
  
  // Pass matrices to shaders
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

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

export { sketchScene };