"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnoAI = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance" 
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.zIndex = '0';
    
    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(1, 1) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float shootingStar(vec2 uv, float time, float offset) {
          // Subtle angle
          float angle = 0.4; 
          mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
          vec2 p = rot * uv;
          
          // Slower and less frequent for subtleness
          float speed = 1.2;
          float t = mod(time * speed + offset, 12.0); 
          
          // Very thin trail
          float trail = smoothstep(0.015, 0.0, abs(p.y)) * smoothstep(1.2, 0.0, t - p.x) * smoothstep(0.0, 0.15, t - p.x);
          
          // Small pinpoint head
          float head = smoothstep(0.008, 0.0, length(p - vec2(t, 0.0)));
          
          return (trail * 0.4 + head) * smoothstep(8.0, 7.0, t);
        }

        void main() {
          vec2 res = iResolution.xy;
          if (res.x < 1.0) res = vec2(1000.0, 1000.0);
          vec2 uv = (gl_FragCoord.xy * 2.0 - res) / min(res.x, res.y);
          
          vec3 col = vec3(0.0);
          
          // Very subtle static background stars
          float s = hash(uv);
          if (s > 0.9994) {
             col += vec3(0.8, 0.9, 1.0) * s * (0.2 + 0.8 * sin(iTime * 0.4 + s * 100.0));
          }
          
          // Subtle white shooting stars
          vec3 starCol = vec3(0.95, 0.98, 1.0);
          col += starCol * shootingStar(uv + vec2(-0.7, 0.3), iTime, 0.0);
          col += starCol * shootingStar(uv + vec2(0.2, -0.5), iTime * 0.9, 4.0);
          col += starCol * shootingStar(uv + vec2(0.6, 0.1), iTime * 1.1, 8.5);
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;
    const animate = (time: number) => {
      material.uniforms.iTime.value = time * 0.001;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width && height) {
        renderer.setSize(width, height, false);
        material.uniforms.iResolution.value.set(width, height);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0" />
  );
};

export default AnoAI;
