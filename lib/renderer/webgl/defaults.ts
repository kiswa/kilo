/**
 * @module kilo/renderer/webgl
 */

/**
 * Default shader sources for both texture and color-based rendering.
 */
export const defaults = {
  shaders: {
    /** Texture-based rendering vertex shader. */
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

    /** Texture-based rendering fragment shader. */
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

    /** Color-based rendering vertex shader. */
    vertexColor: `
  attribute vec2 a_position;

  uniform mat3 u_posMatrix;

  void main() {
    gl_Position = vec4((u_posMatrix * vec3(a_position, 1)).xy, 0, 1);
  }
`,

    /** Color-based rendering fragment shader. */
    fragmentColor: `
  precision highp float;

  uniform vec4 u_color;

  void main() {
    gl_FragColor = u_color;
  }
`,
  },
}
