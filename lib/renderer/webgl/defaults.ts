export const defaults = {
  shaders: {
    vertex: `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  uniform vec2 u_resolution;

  varying vec2 v_texCoord;

  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
  }
`,

    fragment: `
  precision mediump float;

  uniform vec4 u_color;
  uniform sampler2D u_sampler;

  varying vec2 v_texCoord;

  void main() {
    vec4 c = texture2D(u_sampler, vec2(v_texCoord.s, v_texCoord.t));

    vec3 r = vec3(c) * (1.0 - u_color.a) + vec3(u_color) * u_color.a;
    vec4 result = vec4(r, c.a);

    gl_FragColor = result;
  }
`,
  }
}
