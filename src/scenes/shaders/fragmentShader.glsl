uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Map position to color
  // Position ranges from -0.5 to 0.5, so we normalize to 0.0 to 1.0
  vec3 color = vec3(
    (vPosition.x + 0.5) + time, // Red channel: 0.0 at left, 1.0 at right
    (vPosition.y + 0.5), // Green channel: 0.0 at bottom, 1.0 at top
    1.0 - time                 // Blue channel: constant 1.0
  );
  
  gl_FragColor = vec4(color, 1.0);
}