function initBuffers(gl, mode) {
  const positionBuffer = initPositionBuffer(gl);
  const colorBuffer = initColorBuffer(gl);
  const iBuffer = initIndexBuffer(gl, mode);

return {
  position: positionBuffer,
  color: colorBuffer,
  indices: iBuffer,
};

}

export function initPositionBuffer(gl) {
  // Create a buffer for the square's positions.
  const pBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);

  // Now create an array of positions for the square.
  const positions = [
    // Front face
    -1.0, -1.0,  1.0, 1.0, -1.0,  1.0, 1.0,  1.0,  1.0, -1.0,  1.0,  1.0,
    // Back face
    -1.0, -1.0, -1.0, -1.0,  1.0, -1.0, 1.0,  1.0, -1.0, 1.0, -1.0, -1.0,
    // Top face
    -1.0,  1.0, -1.0, -1.0,  1.0,  1.0, 1.0,  1.0,  1.0, 1.0,  1.0, -1.0,
    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0,  1.0, -1.0, -1.0,  1.0,
    // Right face
    1.0, -1.0, -1.0, 1.0,  1.0, -1.0, 1.0,  1.0,  1.0, 1.0, -1.0,  1.0,
    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return pBuffer;
}

const scheme1 = [
  [0.0, 1.0, 1.0, 1.0], // Front face: cyan
  [1.0, 0.5, 0.0, 1.0], // Back face: orange
  [0.0, 1.0, 0.0, 1.0], // Top face: green
  [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
  [1.0, 1.0, 0.0, 1.0], // Right face: yellow
  [1.0, 0.0, 1.0, 1.0], // Left face: purple
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


export function initColorBuffer(gl, colorScheme) {
  // Convert the array of colors into a table for all the vertices.
  let colors = [];
  
  for (const color of colorScheme) {
    colors = colors.concat(color, color, color, color); // Repeat for each face
  }

  // Create and populate the color buffer
  const cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return cBuffer;
}

function initIndexBuffer(gl, mode) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  
  let indices;
  if (mode === "Wireframe") {
    indices = [
      // Wireframe mode indices
      // Front face
      0, 1, 1, 2, 2, 3, 3, 0,
      // Back face
      4, 5, 5, 6, 6, 7, 7, 4,
      // Top face
      8, 9, 9, 10, 10, 11, 11, 8,
      // Bottom face
      12, 13, 13, 14, 14, 15, 15, 12,
      // Right face
      16, 17, 17, 18, 18, 19, 19, 16,
      // Left face
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
  return indexBuffer;
}

export { initBuffers, initIndexBuffer };