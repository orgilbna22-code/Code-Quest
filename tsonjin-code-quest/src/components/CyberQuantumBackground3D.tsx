import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CyberQuantumBackground3DProps {
  enabled?: boolean;
}

export const CyberQuantumBackground3D: React.FC<CyberQuantumBackground3DProps> = ({
  enabled = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let width = Math.max(window.innerWidth || 1024, 100);
    let height = Math.max(window.innerHeight || 768, 100);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060807, 0.035);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // ========================================================
    // 1. MATHEMATICAL UNDULATING CYBER WAVE MATRIX (3D Grid)
    // ========================================================
    const gridCols = 55;
    const gridRows = 55;
    const count = gridCols * gridRows;
    const sep = 1.35;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Primary palette: Cyber emerald (#00FF66 / #10B981) to deep teal-cyan (#06b6d4)
    const colorA = new THREE.Color(0x10b981); // Emerald
    const colorB = new THREE.Color(0x06b6d4); // Cyan
    const colorC = new THREE.Color(0x047857); // Deep Jade

    let idx = 0;
    for (let ix = 0; ix < gridCols; ix++) {
      for (let iy = 0; iy < gridRows; iy++) {
        const x = (ix - gridCols / 2) * sep;
        const z = (iy - gridRows / 2) * sep;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = z;

        // Gradient coloring based on radial distance from center
        const distFromCenter = Math.sqrt(x * x + z * z);
        const norm = Math.min(distFromCenter / 30, 1);
        const mixed = colorA.clone().lerp(norm > 0.5 ? colorB : colorC, norm);

        colors[idx * 3] = mixed.r;
        colors[idx * 3 + 1] = mixed.g;
        colors[idx * 3 + 2] = mixed.b;

        idx++;
      }
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite texture (smooth circle gradient)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(52, 211, 153, 0.8)');
      grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const waveMaterial = new THREE.PointsMaterial({
      size: 0.75,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    });

    const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
    wavePoints.position.y = -6;
    scene.add(wavePoints);

    // ========================================================
    // 2. FLOATING DEEP-SPACE 3D CRYSTAL POLYHEDRA
    // ========================================================
    const polyGroup = new THREE.Group();

    // 4 Floating wireframe crystals at varying depths
    const crystalGeo1 = new THREE.OctahedronGeometry(2.2, 0);
    const crystalMat1 = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.22,
    });
    const crystal1 = new THREE.LineSegments(new THREE.EdgesGeometry(crystalGeo1), crystalMat1);
    crystal1.position.set(-18, 6, -15);
    polyGroup.add(crystal1);

    const crystalGeo2 = new THREE.IcosahedronGeometry(2.8, 0);
    const crystalMat2 = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.18,
    });
    const crystal2 = new THREE.LineSegments(new THREE.EdgesGeometry(crystalGeo2), crystalMat2);
    crystal2.position.set(20, 8, -18);
    polyGroup.add(crystal2);

    const crystalGeo3 = new THREE.DodecahedronGeometry(1.6, 0);
    const crystalMat3 = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25,
    });
    const crystal3 = new THREE.LineSegments(new THREE.EdgesGeometry(crystalGeo3), crystalMat3);
    crystal3.position.set(12, -2, -8);
    polyGroup.add(crystal3);

    // Subtle 4D Gyro orbit rings in background
    const ringGeo = new THREE.TorusGeometry(5, 0.02, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 2, -12);
    polyGroup.add(ring);

    scene.add(polyGroup);

    // ========================================================
    // 3. MOUSE INTERACTION & HYDRAULIC PARALLAX
    // ========================================================
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      width = Math.max(window.innerWidth || 1024, 100);
      height = Math.max(window.innerHeight || 768, 100);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    // ========================================================
    // 4. FLUID 60 FPS WAVE COMPUTATION LOOP
    // ========================================================
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth inertia damping for camera parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.035;
      currentMouseY += (targetMouseY - currentMouseY) * 0.035;

      camera.position.x = currentMouseX * 5;
      camera.position.y = 8 + currentMouseY * 2.5;
      camera.lookAt(0, -1, 0);

      // Compute mathematical undulating wave heights (y) in real-time
      const posAttr = waveGeometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      let pIdx = 0;
      for (let ix = 0; ix < gridCols; ix++) {
        for (let iy = 0; iy < gridRows; iy++) {
          const x = arr[pIdx * 3];
          const z = arr[pIdx * 3 + 2];

          // Complex layered sinusoidal harmonic waves
          const wave1 = Math.sin(ix * 0.25 + time * 1.1) * 1.2;
          const wave2 = Math.cos(iy * 0.22 + time * 0.9) * 1.2;
          const wave3 = Math.sin((ix + iy) * 0.15 + time * 1.4) * 0.8;
          const ripple = Math.sin(Math.sqrt(x * x + z * z) * 0.3 - time * 1.6) * 0.6;

          // Parallax mouse tilt displacement
          const mouseDisplace = (x * currentMouseX + z * currentMouseY) * 0.06;

          arr[pIdx * 3 + 1] = wave1 + wave2 + wave3 + ripple + mouseDisplace;
          pIdx++;
        }
      }
      posAttr.needsUpdate = true;

      // Slow orbital drift of background crystal structures
      crystal1.rotation.x = time * 0.12;
      crystal1.rotation.y = time * 0.16;

      crystal2.rotation.y = -time * 0.14;
      crystal2.rotation.z = time * 0.1;

      crystal3.rotation.x = time * 0.18;
      crystal3.rotation.z = -time * 0.15;

      ring.rotation.x = time * 0.08;
      ring.rotation.y = time * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      waveGeometry.dispose();
      waveMaterial.dispose();
      particleTexture.dispose();
      crystalGeo1.dispose();
      crystalGeo2.dispose();
      crystalGeo3.dispose();
      ringGeo.dispose();
      crystalMat1.dispose();
      crystalMat2.dispose();
      crystalMat3.dispose();
      ringMat.dispose();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="absolute inset-0 h-full w-full opacity-70" />

      {/* Atmospheric Apple Vision Pro style Vignette & Soft Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060807]/70 via-[#070a08]/40 to-[#060807]/90 pointer-events-none" />

      {/* Subtle Corner Ambient Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-emerald-500/[0.04] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
    </div>
  );
};
