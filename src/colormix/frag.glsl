uniform vec3 resolution;
uniform float time;

// https://gist.github.com/yiwenl/745bfea7f04c456e0101
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 rgb2hsv(vec3 rgb) {
 	float Cmax = max(rgb.r, max(rgb.g, rgb.b));
 	float Cmin = min(rgb.r, min(rgb.g, rgb.b));
 	float delta = Cmax - Cmin;
 	vec3 hsv = vec3(0., 0., Cmax);
 	if (Cmax > Cmin) {
 		hsv.y = delta / Cmax;
 		if (rgb.r == Cmax)
 			hsv.x = (rgb.g - rgb.b) / delta;
 		else {
 			if (rgb.g == Cmax)
 				hsv.x = 2. + (rgb.b - rgb.r) / delta;
 			else
 				hsv.x = 4. + (rgb.r - rgb.g) / delta;
 		}
 		hsv.x = fract(hsv.x / 6.);
 	}
 	return hsv;
 }

void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
	//gl_FragColor = vec4(uv, .5 + .5*sin(time), 1.);
    //vec3 col = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));
    //gl_FragColor = vec4(col,1.0);

    float t = time * .05;

    vec3 left   = hsv2rgb(vec3(mod(sin(t),1.), 1., 1.));
    vec3 right  = hsv2rgb(vec3(mod(sin(t)+0.33,1.), 1., 1.));
    vec3 top    = hsv2rgb(vec3(mod(sin(t*1.1)+0.66,1.), 1., 1.));
    vec3 bottom = hsv2rgb(vec3(mod(sin(t*2.6),1.), 1., 1.));

    float factor = 0.5;
    vec3 col = vec3(0.,0.,0.);
    col += mix(left, right, uv.x)*factor;
    col += mix(bottom, top, uv.y)*factor;

    // vec3 point = vec3(1.,1.,1.);
    // vec2 p = vec2(0.5+0.45*sin(time),0.5+0.45*cos(time));
    // if (uv.x < p.x)
    //     col *= mix(left, point, uv.x/p.x);
    // else
    //     col *= mix(point, right, (uv.x-p.x)/(resolution.x-p.x));
    // if (uv.y < p.y)
    //     col *= mix(bottom, point, uv.y/p.y);
    // else
    //     col *= mix(point, top, (uv.y-p.y)/(resolution.y-p.y));

    gl_FragColor = vec4(col, 1.0);
}