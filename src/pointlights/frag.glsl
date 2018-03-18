uniform vec3 resolution;
uniform float time;

// https://gist.github.com/yiwenl/745bfea7f04c456e0101
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    float t = time;
    float tcolor = time * .05;

    float range = 0.66;
    float intensity = 1.0;
    vec3 bgcol = vec3(0.,0.,0.);
    vec3 col = vec3(0.,0.,0.);

    col += intensity*mix(
        hsv2rgb(vec3(mod(sin(tcolor),1.), 1., 1.)),
        bgcol,
        distance(
            vec2(0.5+0.3*sin(t),0.5+0.3*cos(t)),
            uv.xy
        )/range
    );

    col += intensity*mix(
        hsv2rgb(vec3(mod(0.33+sin(tcolor),1.), 1., 1.)),
        bgcol,
        distance(
            vec2(0.5+0.2*sin(-t*0.5),0.5+0.2*cos(-t*0.5)) + vec2(0.2*sin(t),0.2*cos(t*1.5)),
            uv.xy
        )/range
    );

    col += intensity*mix(
        hsv2rgb(vec3(mod(0.66+sin(tcolor),1.), 1., 1.)),
        bgcol,
        distance(
            vec2(0.5+0.5*sin(t*0.25), 0.5+0.4*sin(t)),
            uv.xy
        )/range
    );

    gl_FragColor = vec4(col, 1.0);
}