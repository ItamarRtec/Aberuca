"use client";

import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "@/components/atmosphere";
import { hexToVec3, prefersReducedMotion, readToken, readTokenNumber } from "@/lib/color";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "@/lib/flow-shader";

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function getContext(canvas: HTMLCanvasElement) {
  const options: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "default",
  };

  return (
    canvas.getContext("webgl", options) ||
    canvas.getContext("experimental-webgl", options)
  ) as WebGLRenderingContext | null;
}

export function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    const gl = getContext(canvas);
    if (!gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();

    if (!vertex || !fragment || !program) return;

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const loc = {
      res: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      cycle: gl.getUniformLocation(program, "u_cycle"),
      grain: gl.getUniformLocation(program, "u_grain"),
      gray: gl.getUniformLocation(program, "u_gray"),
      coral: gl.getUniformLocation(program, "u_coral"),
      violet: gl.getUniformLocation(program, "u_violet"),
      blue: gl.getUniformLocation(program, "u_blue"),
      navy: gl.getUniformLocation(program, "u_navy"),
    };

    gl.uniform3fv(loc.gray, hexToVec3(readToken("--color-flow-gray")));
    gl.uniform3fv(loc.coral, hexToVec3(readToken("--color-flow-coral")));
    gl.uniform3fv(loc.violet, hexToVec3(readToken("--color-flow-violet")));
    gl.uniform3fv(loc.blue, hexToVec3(readToken("--color-flow-blue")));
    gl.uniform3fv(loc.navy, hexToVec3(readToken("--color-flow-navy")));
    gl.uniform1f(loc.cycle, readTokenNumber("--flow-cycle", 32));
    gl.uniform1f(loc.grain, readTokenNumber("--flow-grain", 0.035));

    const fps = readTokenNumber("--flow-fps", 24);
    const frameMs = 1000 / fps;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    let frame = 0;
    let last = 0;
    const start = performance.now();
    let paused = document.hidden;
    let shown = false;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(bounds.width * pixelRatio));
      const height = Math.max(1, Math.floor(bounds.height * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(loc.res, width, height);
      }
    };

    const paint = (now: number) => {
      resize();
      gl.uniform1f(loc.time, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        setLive(true);
      }
    };

    const draw = (now: number) => {
      frame = window.requestAnimationFrame(draw);
      if (paused) return;
      if (last !== 0 && now - last < frameMs) return;
      last = now;
      paint(now);
    };

    const onVisibility = () => {
      paused = document.hidden;
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    paint(performance.now());
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      setLive(false);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <div className="aberuca-flow" aria-hidden="true">
      <Atmosphere hero label="" />
      <canvas
        ref={canvasRef}
        className={live ? "aberuca-smoke is-live" : "aberuca-smoke"}
      />
    </div>
  );
}
