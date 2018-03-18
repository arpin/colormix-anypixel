uniform vec3 resolution;
uniform float transition;
uniform sampler2D buffer1;
uniform sampler2D buffer2;

void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 col1 = texture2D(buffer1, uv);
    vec4 col2 = texture2D(buffer2, uv);
    gl_FragColor = mix(col1, col2, transition);
}