import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Sparkles, Compass, Eye, RefreshCw, Cpu } from 'lucide-react';

interface CyberSpatialCore3DProps {
  className?: string;
  interactive?: boolean;
}

export const CyberSpatialCore3D: React.FC<CyberSpatialCore3DProps> = ({
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelMode, setModelMode] = useState<'4d_tesseract' | 'quantum_orb' | 'cyber_matrix'>('4d_tesseract');
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0, w: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Keep ref to scene objects to mutate mode dynamically
  const sceneRef = useRef<{
    tesseractGroup: THREE.Group;
    orbGroup: THREE.Group;
    matrixGroup: THREE.Group;
    particles: THREE.Points;
  } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth || 360, 100);
    const height = Math.max(container.clientHeight || 280, 100);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060807, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Subtle Apple-style lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x10b981, 3.5, 10);
    pointLight1.position.set(2, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00f59b, 2.5, 8);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // ==========================================
    // 1. 4D TESSERACT HYPERCUBE GROUP
    // ==========================================
    const tesseractGroup = new THREE.Group();

    // Outer cube
    const outerGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85, linewidth: 2 });
    const outerCube = new THREE.LineSegments(outerEdges, outerMat);
    tesseractGroup.add(outerCube);

    // Inner cube (4D projection)
    const innerGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.95 });
    const innerCube = new THREE.LineSegments(innerEdges, innerMat);
    tesseractGroup.add(innerCube);

    // Connecting hyper-edges between inner and outer 8 vertices
    const hyperLinesGeo = new THREE.BufferGeometry();
    const cornerPositions: number[] = [];
    const signs = [-1, 1];
    for (const sx of signs) {
      for (const sy of signs) {
        for (const sz of signs) {
          // outer vertex
          cornerPositions.push((sx * 1.6) / 2, (sy * 1.6) / 2, (sz * 1.6) / 2);
          // inner vertex
          cornerPositions.push((sx * 0.85) / 2, (sy * 0.85) / 2, (sz * 0.85) / 2);
        }
      }
    }
    hyperLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(cornerPositions, 3));
    const hyperLinesMat = new THREE.LineSegments(
      hyperLinesGeo,
      new THREE.LineBasicMaterial({ color: 0x059669, transparent: true, opacity: 0.55 })
    );
    tesseractGroup.add(hyperLinesMat);

    // Center quantum node
    const coreGeo = new THREE.OctahedronGeometry(0.35, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f59b,
      metalness: 0.85,
      roughness: 0.15,
      wireframe: true,
      emissive: 0x047857,
      emissiveIntensity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    tesseractGroup.add(coreMesh);
    scene.add(tesseractGroup);

    // ==========================================
    // 2. QUANTUM ORB GROUP
    // ==========================================
    const orbGroup = new THREE.Group();
    const sphereGeo = new THREE.IcosahedronGeometry(0.9, 3);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      emissive: 0x064e3b,
      emissiveIntensity: 0.6,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    orbGroup.add(sphereMesh);

    // Outer gyro orbit rings
    const ringGeo1 = new THREE.TorusGeometry(1.3, 0.015, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    orbGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.5, 0.012, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat1);
    ring2.rotation.x = Math.PI / 2.5;
    orbGroup.add(ring2);
    orbGroup.visible = false;
    scene.add(orbGroup);

    // ==========================================
    // 3. CYBER MATRIX LATTICE
    // ==========================================
    const matrixGroup = new THREE.Group();
    const dodecaGeo = new THREE.DodecahedronGeometry(1.1, 1);
    const dodecaEdges = new THREE.EdgesGeometry(dodecaGeo);
    const dodecaLine = new THREE.LineSegments(
      dodecaEdges,
      new THREE.LineBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.8 })
    );
    matrixGroup.add(dodecaLine);

    const innerIcoGeo = new THREE.IcosahedronGeometry(0.65, 0);
    const innerIco = new THREE.LineSegments(
      new THREE.EdgesGeometry(innerIcoGeo),
      new THREE.LineBasicMaterial({ color: 0x10b981 })
    );
    matrixGroup.add(innerIco);
    matrixGroup.visible = false;
    scene.add(matrixGroup);

    // ==========================================
    // 4. FLOATING PARTICLE CONSTELLATION
    // ==========================================
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.6 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePos[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    sceneRef.current = { tesseractGroup, orbGroup, matrixGroup, particles };

    // Mouse interactive target tracking with inertia
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.9;
      targetRotX = -y * 0.9;
    };

    container.addEventListener('pointermove', handlePointerMove);

    // Animation Loop (60 FPS fluid)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth inertia lerp (Apple-like physics dampening)
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      // Rotate groups
      if (tesseractGroup.visible) {
        tesseractGroup.rotation.x = currentRotX + time * 0.25;
        tesseractGroup.rotation.y = currentRotY + time * 0.35;
        innerCube.rotation.x = -time * 0.4;
        innerCube.rotation.y = time * 0.5;
        coreMesh.rotation.y = time * 0.8;
      }

      if (orbGroup.visible) {
        orbGroup.rotation.x = currentRotX + time * 0.15;
        orbGroup.rotation.y = currentRotY + time * 0.3;
        ring1.rotation.z = time * 0.6;
        ring2.rotation.y = -time * 0.4;
      }

      if (matrixGroup.visible) {
        matrixGroup.rotation.x = currentRotX + time * 0.2;
        matrixGroup.rotation.y = currentRotY + time * 0.25;
        innerIco.rotation.z = -time * 0.3;
      }

      particles.rotation.y = time * 0.08;
      particles.rotation.x = time * 0.04;

      // Coordinate telemetry readout updates
      if (Math.floor(time * 10) % 3 === 0) {
        setCoords({
          x: Number((currentRotX + Math.sin(time) * 0.5).toFixed(2)),
          y: Number((currentRotY + Math.cos(time) * 0.5).toFixed(2)),
          z: Number((Math.sin(time * 0.8) * 1.2).toFixed(2)),
          w: Number((Math.cos(time * 0.5) * 1.5).toFixed(2)),
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      outerGeo.dispose();
      innerGeo.dispose();
      sphereGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      dodecaGeo.dispose();
      particleGeo.dispose();
    };
  }, [interactive]);

  // Update visible group on modelMode change
  useEffect(() => {
    if (!sceneRef.current) return;
    const { tesseractGroup, orbGroup, matrixGroup } = sceneRef.current;
    tesseractGroup.visible = modelMode === '4d_tesseract';
    orbGroup.visible = modelMode === 'quantum_orb';
    matrixGroup.visible = modelMode === 'cyber_matrix';
  }, [modelMode]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#131a16]/80 via-[#0d120f]/90 to-[#070a08]/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_25px_60px_rgba(16,185,129,0.12)] ${className}`}
    >
      {/* Apple-style 1px top specular highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Top Controls & Status Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-500/30 bg-[#0B0F0D] text-emerald-400">
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              SPATIAL 3D / 4D RUNTIME
            </div>
            <div className="text-xs font-semibold text-white">
              Tsonjin Quantum Node
            </div>
          </div>
        </div>

        {/* Mode Selector (Apple segmented control) */}
        <div className="flex items-center rounded-xl border border-slate-800/80 bg-[#070a08]/90 p-1 font-mono text-[10px]">
          <button
            type="button"
            onClick={() => setModelMode('4d_tesseract')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
              modelMode === '4d_tesseract'
                ? 'bg-emerald-500 text-[#070a08] shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4D Tesseract
          </button>
          <button
            type="button"
            onClick={() => setModelMode('quantum_orb')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
              modelMode === 'quantum_orb'
                ? 'bg-emerald-500 text-[#070a08] shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quantum Orb
          </button>
          <button
            type="button"
            onClick={() => setModelMode('cyber_matrix')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
              modelMode === 'cyber_matrix'
                ? 'bg-emerald-500 text-[#070a08] shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Neural Matrix
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        className="relative mx-auto my-1 h-56 w-full cursor-grab active:cursor-grabbing sm:h-64"
      />

      {/* Bottom Telemetry HUD */}
      <div className="relative z-10 flex items-center justify-between border-t border-emerald-500/10 pt-3 font-mono text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            60 FPS LIVE
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            COORDS: X={coords.x} Y={coords.y} Z={coords.z} W={coords.w}
          </span>
        </div>

        <div className="text-slate-500">
          {isHovered ? 'Pointer inertia active' : 'Drag or move cursor to tilt'}
        </div>
      </div>
    </div>
  );
};
