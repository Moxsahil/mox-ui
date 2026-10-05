import { hexToRgb } from "@/lib/webgl";

// the shader from 21st.dev's spooky smoke background, settled onto the footer's near-black
const FRAGMENT = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
uniform float u_amount;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 uv=(FC-.5*R)/R.y;
  vec3 col=vec3(1);
  uv.x+=.25;
  uv*=vec2(2,1);

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  col=clamp(col,0.,1.);
  col=mix(col,u_color,dot(col,vec3(.21,.71,.07)));

  // heavier at the bottom behind the wordmark, lighter behind the links
  vec3 base=vec3(.027,.031,.047);
  float lum=clamp(dot(col,vec3(.21,.71,.07))*1.5,0.,1.);
  float rise=mix(.35,1.,1.-FC.y/R.y);
  col=mix(base,col,lum*rise*u_amount*min(time*.5,1.));
  O=vec4(col,1);
}`;

const VERTEX = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

// soft smoke loses nothing at reduced resolution, and the gpu does far less work
const SCALE = 0.6;

export type Smoke = {
  resize: (width: number, height: number) => void;
  draw: (now: number, amount: number) => void;
  dispose: () => void;
};

export function createSmoke(
  canvas: HTMLCanvasElement,
  color: string,
): Smoke | null {
  const gl = canvas.getContext("webgl2", { antialias: false });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
    gl.STATIC_DRAW,
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const u = {
    time: gl.getUniformLocation(program, "time"),
    resolution: gl.getUniformLocation(program, "resolution"),
    color: gl.getUniformLocation(program, "u_color"),
    amount: gl.getUniformLocation(program, "u_amount"),
  };
  gl.uniform3fv(u.color, hexToRgb(color));

  return {
    resize(width, height) {
      canvas.width = Math.max(1, Math.round(width * SCALE));
      canvas.height = Math.max(1, Math.round(height * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
    },
    draw(now, amount) {
      gl.uniform1f(u.time, now / 1000);
      gl.uniform1f(u.amount, amount);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
}
