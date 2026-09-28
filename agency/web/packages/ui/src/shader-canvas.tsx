'use client';
import { useEffect, useRef } from 'react';

export type ShaderPalette = [string, string, string, string];

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
// Domain-warped fbm noise mapped onto a four-colour palette, with film grain and pointer drift.
const FRAG = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 c0,c1,c2,c3;uniform float grain,zoom,flow;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 rot=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=rot*p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 p=(gl_FragCoord.xy-.5*r)/r.y*zoom;p+=(m-.5)*.25;float T=t*flow;
vec2 q=vec2(fbm(p+T*.06),fbm(p+vec2(5.2,1.3)-T*.05));
vec2 w=vec2(fbm(p+3.2*q+vec2(1.7,9.2)+T*.04),fbm(p+3.2*q+vec2(8.3,2.8)-T*.03));
float f=fbm(p+2.6*w);
vec3 col=mix(c0,c1,smoothstep(.15,.75,f));
col=mix(col,c2,smoothstep(.35,.95,length(q)*f*1.2));
col=mix(col,c3,smoothstep(.55,1.,w.y*f*1.7));
col+=(h(gl_FragCoord.xy+fract(t)*100.)-.5)*grain;
gl_FragColor=vec4(col,1.);}`;

const rgb = (hex: string) => {
  const v = parseInt(hex.replace('#', ''), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255] as const;
};

type Props = { palette: ShaderPalette; className?: string; grain?: number; zoom?: number; flow?: number; resolution?: number };

/**
 * Full-bleed generative gradient (raw WebGL, no library). Renders at reduced resolution for speed,
 * pauses off-screen, draws a single still frame for reduced motion, and falls back to a CSS gradient.
 */
export function ShaderCanvas({ palette, className, grain = 0.06, zoom = 1.6, flow = 1, resolution = 0.5 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  // palette is read every frame, so it can change (e.g. per hovered item) without a new WebGL context
  const pal = useRef(palette);
  pal.current = palette;
  useEffect(() => {
    const cv = ref.current!;
    const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (k: string) => gl.getUniformLocation(pr, k);
    gl.uniform1f(U('grain'), grain);
    gl.uniform1f(U('zoom'), zoom);
    gl.uniform1f(U('flow'), flow);
    const mouse = [0.5, 0.5], target = [0.5, 0.5];
    const size = () => {
      const s = Math.min(window.devicePixelRatio, 2) * resolution;
      cv.width = Math.max(1, cv.clientWidth * s);
      cv.height = Math.max(1, cv.clientHeight * s);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(U('r'), cv.width, cv.height);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const onMove = (e: PointerEvent) => {
      target[0] = e.clientX / window.innerWidth;
      target[1] = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMove);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(cv);
    const t0 = performance.now();
    const draw = () => {
      mouse[0]! += (target[0]! - mouse[0]!) * 0.03;
      mouse[1]! += (target[1]! - mouse[1]!) * 0.03;
      pal.current.forEach((c, i) => gl.uniform3fv(U('c' + i), rgb(c)));
      gl.uniform2f(U('m'), mouse[0]!, mouse[1]!);
      gl.uniform1f(U('t'), still ? 12 : (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = () => {
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };
    if (still) draw();
    else loop();
    cv.dataset.ready = '1';
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [grain, zoom, flow, resolution]);
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ background: `radial-gradient(120% 90% at 30% 20%, ${palette[2]}, transparent 60%), linear-gradient(160deg, ${palette[1]}, ${palette[0]})` }}
    />
  );
}
