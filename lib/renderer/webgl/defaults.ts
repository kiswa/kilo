export const defaults = {
  shaders: {
    vertex: `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  uniform mat3 u_posMatrix;
  uniform mat3 u_texMatrix;

  varying vec2 v_texCoord;
  varying float v_texAlpha;

  void main() {
    gl_Position = vec4((u_posMatrix * vec3(a_position, 1)).xy, 0, 1);

    v_texCoord = (u_texMatrix * vec3(a_texCoord, 1)).xy;
  }
`,

    fragment: `
  precision highp float;

  uniform sampler2D u_sampler;

  varying vec2 v_texCoord;
  varying float v_texAlpha;

  void main() {
    gl_FragColor = texture2D(u_sampler, v_texCoord);
  }
`,
  }
}
