export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uMix;
uniform float uText;
uniform float uPrune;
uniform float uClutter;
uniform float uTurbulence;
uniform float uIdle;
uniform float uIntro;
uniform float uSize;
uniform float uProjection;
uniform float uAlpha;
uniform float uPulse;
uniform float uPulseOn;
uniform vec3 uPointer;
uniform float uPointerForce;
uniform vec3 uShock;
uniform float uShockAge;

attribute vec3 aTo;
attribute vec3 aText;
attribute vec4 aRand;

varying float vAlpha;
varying float vTone;
varying float vHot;

vec3 swirl(vec3 p, float t) {
  return 0.5 * vec3(
    sin(p.y * 1.7 + t) + sin(p.z * 1.3 - t * 0.7),
    sin(p.z * 1.9 + t * 0.8) + sin(p.x * 1.1 + t),
    sin(p.x * 1.5 - t * 0.6) + sin(p.y * 1.2 + t * 0.9)
  );
}

// Cada punto arranca con su propio retraso: la forma se deshace y se rehace por oleadas.
float staggered(float progress, float delay, float spread) {
  float t = clamp((progress - delay * spread) / (1.0 - spread), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  float morph = staggered(uMix, aRand.x, 0.45);
  float written = staggered(uText, aRand.z, 0.4);
  vec3 p = mix(mix(position, aTo, morph), aText, written);

  vec3 flow = swirl(p * 0.9 + aRand.yzw * 6.2831, uTime * 0.6);
  float inFlight = sin(morph * 3.14159) + sin(written * 3.14159);
  p += flow * (inFlight * uTurbulence + uIdle);

  float scattered = (1.0 - uIntro) * (1.0 - uIntro);
  p += (p * 1.4 + (aRand.yzw - 0.5) * 5.0) * scattered;

  // El código que sobra: primero estorba alrededor de la forma, después cae.
  float prunable = step(aRand.y, PRUNE_FRACTION);
  p += (aRand.zwx - 0.5) * 2.0 * uClutter * prunable;
  float turn = aRand.y / PRUNE_FRACTION * 0.8;
  float gone = prunable * smoothstep(turn, turn + 0.2, uPrune);
  p.y -= gone * gone * 2.6;
  p.xz += flow.xz * gone * 0.5;

  float wave = exp(-pow((p.x - uPulse) / 0.2, 2.0)) * uPulseOn;
  p.yz *= 1.0 + wave * 0.55;

  vec4 world = modelMatrix * vec4(p, 1.0);

  vec3 away = world.xyz - uPointer;
  float push = smoothstep(1.1, 0.0, length(away)) * uPointerForce;
  world.xyz += normalize(away + 0.0001) * push * 0.38;

  vec3 blast = world.xyz - uShock;
  float ring = exp(-pow((length(blast) - uShockAge * 3.2) / 0.35, 2.0)) * max(0.0, 1.0 - uShockAge / SHOCK_SECONDS);
  world.xyz += normalize(blast + 0.0001) * ring * 0.55;

  vec4 view = viewMatrix * world;
  gl_Position = projectionMatrix * view;
  gl_PointSize = uSize * (0.55 + aRand.z * 0.95) * (1.0 + wave * 0.9 + ring * 0.6) * uProjection / -view.z;

  float depth = smoothstep(10.5, 4.5, -view.z);
  vAlpha = uAlpha * uIntro * (1.0 - gone) * (0.35 + 0.65 * depth);
  vTone = aRand.w;
  vHot = max(step(0.93, aRand.x), min(1.0, wave + ring));
}
`

export const trafficVertexShader = /* glsl */ `
uniform float uSize;
uniform float uProjection;
uniform float uAlpha;

attribute float aTail;

varying float vAlpha;

void main() {
  vec4 view = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * view;
  gl_PointSize = uSize * (1.0 - 0.65 * aTail) * uProjection / -view.z;
  vAlpha = uAlpha * pow(1.0 - aTail, 1.5);
}
`

export const trafficFragmentShader = /* glsl */ `
uniform vec3 uAccent;

varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float falloff = exp(-dot(uv, uv) * 18.0) - 0.011;
  if (falloff <= 0.0) discard;

  gl_FragColor = vec4(uAccent, falloff * vAlpha);
  #include <colorspace_fragment>
}
`

export const fragmentShader = /* glsl */ `
uniform vec3 uCold;
uniform vec3 uWarm;
uniform vec3 uAccent;

varying float vAlpha;
varying float vTone;
varying float vHot;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float falloff = exp(-dot(uv, uv) * 18.0) - 0.011;
  if (falloff <= 0.0) discard;

  vec3 color = mix(mix(uCold, uWarm, vTone), uAccent, vHot);
  gl_FragColor = vec4(color, falloff * vAlpha);
  #include <colorspace_fragment>
}
`
