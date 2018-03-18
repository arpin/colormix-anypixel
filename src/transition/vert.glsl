uniform vec3 resolution;
uniform float transition;
uniform sampler2D buffer1;
uniform sampler2D buffer2;
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}