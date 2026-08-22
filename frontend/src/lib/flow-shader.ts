export const VERTEX_SHADER = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_cycle;
uniform float u_grain;
uniform vec3 u_gray;
uniform vec3 u_coral;
uniform vec3 u_violet;
uniform vec3 u_blue;
uniform vec3 u_navy;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = uv * vec2(aspect, 1.0);

  float t = u_time / max(u_cycle, 1.0);

  vec2 q = vec2(
    fbm(p + vec2(0.0, t * 0.85)),
    fbm(p + vec2(5.2, -t * 0.63))
  );
  vec2 r = vec2(
    fbm(p + 1.6 * q + vec2(1.7, 9.2) + t * 0.21),
    fbm(p + 1.6 * q + vec2(8.3, 2.8) - t * 0.17)
  );
  float n = fbm(p + r);

  float braid = uv.x + (n - 0.5) * 0.2;
  vec3 col = u_gray;
  col = mix(col, u_coral, smoothstep(0.08, 0.38, braid) * (0.5 + 0.5 * n));
  col = mix(col, u_violet, smoothstep(0.38, 0.64, braid));
  col = mix(col, u_blue, smoothstep(0.58, 0.92, braid));
  col = mix(col, u_navy, smoothstep(0.9, 1.0, braid) * 0.12);

  vec2 well = (uv - vec2(0.5, 0.5)) * vec2(1.12, 1.85);
  float dark = exp(-dot(well, well) * 2.6);
  col = mix(col, col * 0.9 + u_navy * 0.06, dark * 0.12);

  float grain = hash(gl_FragCoord.xy + u_time * 0.12) - 0.5;
  col += grain * u_grain;

  gl_FragColor = vec4(col, 1.0);
}
`;
