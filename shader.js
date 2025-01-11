
// Initialize a shader program, so WebGL knows how to draw our data
export function initializeShaderProgram(gl, vsSource, fsSource) {
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

export function compileAndAttachShader(gl, type, source) {
    const shade = gl.createShader(type);
  
    // Send the source to the shader object
    gl.shaderSource(shade, source);
  
    // Compile the shader program
    gl.compileShader(shade);
  
    // See if it compiled successfully
    if (!gl.getShaderParameter(shade, gl.COMPILE_STATUS)) {
      console.log(`Error compiling shader (${type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT'}):`, gl.getShaderInfoLog(shade))
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shade)}`,
      );
      gl.deleteShader(shade);
      return null;
    }
    return shade;
  }