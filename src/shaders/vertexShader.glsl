uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  
  // Modify vertex position based on time
  vec3 pos = position;
  pos.z += sin(position.x * 3.0 + time * 5.0) * 0.1; // Wave effect
  pos.y += sin(position.x * 3.0 + time * 5.0) * 0.1; // Wave effect
  pos.x += sin(position.x * 3.0 + time * 5.0) * 0.1; // Wave effect
  
  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}