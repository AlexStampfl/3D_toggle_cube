export function makeStanceBuf(gl) {
  // Create a buffer for the square's positions.
  const buffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // Now create an array of positions for the square.
  const stances = [
    // Front side
    -1.0, -1.0,  1.0, 1.0, -1.0,  1.0, 1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
    // Rear side
    -1.0, -1.0, -1.0, -1.0,  1.0, -1.0, 1.0,  1.0, -1.0, 1.0, -1.0, -1.0,
    // Top side
    -1.0,  1.0, -1.0, -1.0,  1.0,  1.0, 1.0,  1.0,  1.0, 1.0,  1.0, -1.0,
    // Bottom side
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
    // Right side
    1.0, -1.0, -1.0, 1.0,  1.0, -1.0, 1.0,  1.0,  1.0, 1.0, -1.0,  1.0,
    // Left side
    -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(stances), gl.STATIC_DRAW);
  return buffer;
}

const scheme1 = [
  [0.0, 1.0, 1.0, 1.0], // Front side
  [1.0, 0.5, 0.0, 1.0], // Rear side
  [0.0, 1.0, 0.0, 1.0], // Over side
  [0.0, 0.0, 1.0, 1.0], // Back side
  [1.0, 1.0, 0.0, 1.0], // Right side
  [1.0, 0.0, 1.0, 1.0], // Left side
],
scheme2 = [
  [0.5, 0.5, 0.5, 1.0], // Gray
  [0.8, 0.4, 0.0, 1.0], // Orange
  [0.3, 0.7, 0.0, 1.0], // Olive
  [0.6, 0.2, 0.8, 1.0], // Purple
  [0.2, 0.8, 0.6, 1.0], // Aqua
  [1.0, 1.0, 1.0, 1.0], // White
],
scheme3 = [
  [1.0, 0.4, 0.4, 1.0], // Light Red
  [0.4, 1.0, 0.4, 1.0], // Light Green
  [0.4, 0.4, 1.0, 1.0], // Light Blue
  [1.0, 1.0, 0.4, 1.0], // Light Yellow
  [1.0, 0.4, 1.0, 1.0], // Light Magenta
  [0.4, 1.0, 1.0, 1.0], // Light Cyan
];

export const colorSchemes = { scheme1, scheme2, scheme3 };


export function makeColBuf(gl, colorScheme) {
  // Convert the array of colors into a table for all the vertices.
  let colors = [];
  for (const color of colorScheme) {
    colors = colors.concat(color, color, color, color); // Repeat for each side
  }
  // Create and populate the color buffer
  const cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return cBuffer;
}


function makeiBuf(gl, mode) {
  const iBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuf);
  
  let indices;
  if (mode === "Wireframe") {
    indices = [
      // Wireframe mode indices
      // Front side
      0, 1, 1, 2, 2, 3, 3, 0,
      // Back side
      4, 5, 5, 6, 6, 7, 7, 4,
      // Top side
      8, 9, 9, 10, 10, 11, 11, 8,
      // Bottom side
      12, 13, 13, 14, 14, 15, 15, 12,
      // Right side
      16, 17, 17, 18, 18, 19, 19, 16,
      // Left side
      20, 21, 21, 22, 22, 23, 23, 20,
    ];
  } else {
    indices = [
    // Solid mode indices
      0, 1, 2, 0, 2, 3, // Front
      4, 5, 6, 4, 6, 7, // Back
      8, 9, 10, 8, 10, 11, // Top
      12, 13, 14, 12, 14, 15, // Bottom
      16, 17, 18, 16, 18, 19, // Right
      20, 21, 22, 20, 22, 23, // Left
    ];
  }

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return iBuf;
}


function makeBuf(gl, mode) {
  const posBuf = makeStanceBuf(gl);
  const colorBuf = makeColBuf(gl);
  const iBuf = makeiBuf(gl, mode);

return {
  position: posBuf,
  color: colorBuf,
  indices: iBuf,
};
}

export { makeBuf, makeiBuf };