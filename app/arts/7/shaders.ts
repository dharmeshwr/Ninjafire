export const fragmentShaderSource = /* glsl */ `
precision mediump float;

uniform vec2 u_resolution;

// vec3 drawAxis(vec2 uv) {
//     vec3 color = vec3(0.0);
//     float thickness = 0.001;
//
//     if (abs(uv.x) < thickness || abs(uv.y) < thickness) {
//         color = vec3(1.0, 0.5, 0.0);
//     }
//
//     return color;
// }

void main() {
    vec2 old_pos = gl_FragCoord.xy / u_resolution.xy;
    
    vec2 c = vec2(old_pos.x * 3.5 - 2.5, old_pos.y * 2.0 - 1.0);  
    
    // vec3 color = drawAxis(c);
    vec3 color = vec3(0.0);

    float zr = 0.0;
    float zi = 0.0;
    float cr = c.x;
    float ci = c.y;

    const int max_iteration = 100;
    for (int i = 0; i < max_iteration; i++) {
        float temp_zr = zr * zr - zi * zi + cr;
        float temp_zi = 2.0 * zr * zi + ci;
        
        zr = temp_zr;
        zi = temp_zi;
        
         if(zr * zr + zi * zi > 4.0) {
            color = vec3(1.0, 0.0, 0.0);
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
