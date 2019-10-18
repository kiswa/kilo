/**
 * @category kilo/renderer/webgl
 */
export const defaults = {
  shaders: {
    vertexTexture: `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  uniform mat3 u_posMatrix;
  uniform mat3 u_texMatrix;
  uniform float u_texAlpha;

  varying vec2 v_texCoord;
  varying float v_texAlpha;

  void main() {
    v_texCoord = (u_texMatrix * vec3(a_texCoord, 1)).xy;
    v_texAlpha = u_texAlpha;

    gl_Position = vec4((u_posMatrix * vec3(a_position, 1)).xy, 0, 1);
  }
`,

    fragmentTexture: `
  precision highp float;

  uniform sampler2D u_sampler;

  varying vec2 v_texCoord;
  varying float v_texAlpha;

  void main() {
    vec4 color = texture2D(u_sampler, v_texCoord);
    color.a *= v_texAlpha;

    gl_FragColor = color;
  }
`,

    vertexColor: `
  attribute vec2 a_position;

  uniform mat3 u_posMatrix;

  void main() {
    gl_Position = vec4((u_posMatrix * vec3(a_position, 1)).xy, 0, 1);
  }
`,

    fragmentColor: `
  precision mediump float;

  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`,
  },
}
