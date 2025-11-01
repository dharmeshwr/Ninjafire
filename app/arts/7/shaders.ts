export const fragmentShaderSource = /* glsl */ `
precision highp float;

uniform vec2 u_resolution;
uniform float u_zr_offset;
uniform float u_zi_offset;
uniform vec2 u_pan;
uniform float u_zoom;

vec3 drawAxis(vec2 uv) {
    vec3 color = vec3(0.0);
    float thickness = 0.001;
    if (abs(uv.x) < thickness || abs(uv.y) < thickness) {
        color = vec3(1.0, 0.5, 0.0);
    }
    return color;
}

void main() {
    vec2 old_pos = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    
    vec2 c = vec2(
        (old_pos.x * 3.5 - 2.5) / u_zoom + u_pan.x,
        ((old_pos.y * 2.0 - 1.0) * (2.0 / 3.5) * aspect) / u_zoom + u_pan.y
    );
    
    vec3 color = vec3(0.0);
    
    float zr = u_zr_offset;
    float zi = u_zi_offset;
    float cr = c.x;
    float ci = c.y;
    const int max_iteration = 100;
    
    for (int i = 0; i < max_iteration; i++) {
        float temp_zr = zr * zr - zi * zi + cr;
        float temp_zi = 2.0 * zr * zi + ci;
        
        zr = temp_zr;
        zi = temp_zi;
        
        if(zr * zr + zi * zi > 4.0) {
            float t = float(i) / float(max_iteration);
            color = vec3(t * 2.0);
            break;
        }
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;

export const vertexShaderSource = /* glsl */ `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;
