uniform vec3 resolution;
uniform float transition;
uniform sampler2D buffer1;
uniform sampler2D buffer2;
uniform sampler2D buffer_additive;

void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 col1 = texture2D(buffer1, uv);
    vec4 col2 = texture2D(buffer2, uv);
    vec4 col3 = texture2D(buffer_additive, uv);
    vec4 mixedcolor = mix(col1, col2, transition);
    gl_FragColor = mix(mixedcolor, col3, col3.a);
}