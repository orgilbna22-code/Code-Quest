import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Sparkles, MessageSquare, ArrowLeftRight, X, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface NexbotRobotCompanion3DProps {
  soundEnabled?: boolean;
  language?: 'en' | 'mn';
  celebrateTrigger?: number; // increments on level complete
}

const ROBOT_TIPS_EN = [
  'Odyssey Cyber Robot online! Following your cursor & ready to help.',
  'Pro Tip: Python indentation is 4 spaces! Never mix tabs and spaces.',
  'Boss Battle ahead! Master conditionals, while loops, and list logic.',
  'Did you know? Python was created by Guido van Rossum in 1991.',
  'Variables are labeled storage boxes in RAM. Keep names descriptive!',
  'C++ uses std::cout for console output. Fast, efficient, and typed.',
  'Functions are reusable building blocks. Avoid repeating your code (DRY).',
  'Click me anytime to trigger a 360° spin & receive fresh coding advice!',
];

const ROBOT_TIPS_MN = [
  'Цонжин Кибер Робот бэлэн! Таны курсорыг яг даган ажиглаж байна.',
  'Зөвлөмж: Python-д догол мөр (indentation) 4 зай байна! Таб ба зайг бүү холь.',
  'Босс тулаанд бэлэн үү? Нөхцөлт шалгалт, давталт, жагсаалтаа сайн бататгаарай.',
  'Python хэлийг Гвидо ван Россум 1991 онд бүтээсэн түүхтэй!',
  'Хувьсагч бол санах ойн хайрцаг юм. Нэрийг нь ойлгомжтой өгөөрэй!',
  'C++ хэл std::cout ашигладаг бөгөөд маш хурдан, системийн түвшний хэл юм.',
  'Функц бол дахин ашиглах блок юм. Кодоо давтахгүй байх (DRY) зарчмыг баримтал.',
  'Над дээр дарж 360° эргэлдэх хөдөлгөөн үзэж, шинэ зөвлөгөө аваарай!',
];

export const NexbotRobotCompanion3D: React.FC<NexbotRobotCompanion3DProps> = ({
  soundEnabled = true,
  language = 'mn',
  celebrateTrigger = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [speech, setSpeech] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dockSide, setDockSide] = useState<'right' | 'left'>('right');
  const [isMuted, setIsMuted] = useState(!soundEnabled);

  // References to animate robot internal meshes
  const animStateRef = useRef({
    targetYaw: 0,
    targetPitch: 0,
    currentYaw: 0,
    currentPitch: 0,
    spinAngle: 0,
    isSpinning: false,
    pupilOffsetX: 0,
    pupilOffsetY: 0,
  });

  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tips = language === 'mn' ? ROBOT_TIPS_MN : ROBOT_TIPS_EN;

  const triggerTip = useCallback(() => {
    if (!isMuted) {
      soundFx.click(true);
    }
    // Trigger spin animation
    animStateRef.current.isSpinning = true;

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setSpeech(randomTip);

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null);
    }, 6000);
  }, [tips, isMuted]);

  // Celebrate when user clears a level
  useEffect(() => {
    if (celebrateTrigger > 0) {
      animStateRef.current.isSpinning = true;
      setSpeech(
        language === 'mn'
          ? '🎉 Баяр хүргэе! Даалгавар амжилттай дууслаа! Таны цуврал өслөө!'
          : '🎉 Outstanding! Mission accomplished! Your learning streak increased!'
      );
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = setTimeout(() => setSpeech(null), 7000);
    }
  }, [celebrateTrigger, language]);

  const toggleDockSide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMuted) soundFx.click(true);
    setDockSide((prev) => (prev === 'right' ? 'left' : 'right'));
  };

  // -------------------------------------------------------------------------
  // THREE.JS 3D ROBOT RUNTIME (Robust WebGLRenderer with zero WebGPU errors)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // Defensive sizing: ensure dimensions are always positive non-zero
    const initialWidth = Math.max(mountEl.clientWidth || 220, 120);
    const initialHeight = Math.max(mountEl.clientHeight || 250, 140);

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0.45, 5.0);

    // 2. High-performance standard WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0xffffff, 1.8);
    primaryLight.position.set(2.5, 4.0, 3.5);
    scene.add(primaryLight);

    const emeraldKeyLight = new THREE.PointLight(0x20e779, 4.5, 12);
    emeraldKeyLight.position.set(2.0, 2.0, 2.5);
    scene.add(emeraldKeyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 3.2, 10);
    cyanRimLight.position.set(-2.5, -1.0, 2.0);
    scene.add(cyanRimLight);

    // 4. Materials (Black chassis, pearl armor plates, glowing emerald LEDs)
    const darkObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x0c120e,
      roughness: 0.25,
      metalness: 0.88,
    });

    const pearlWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf3f5f4,
      roughness: 0.15,
      metalness: 0.35,
    });

    const glassVisorMat = new THREE.MeshStandardMaterial({
      color: 0x040806,
      roughness: 0.04,
      metalness: 0.95,
      transparent: true,
      opacity: 0.92,
    });

    const emeraldGlowMat = new THREE.MeshStandardMaterial({
      color: 0x20e779,
      emissive: 0x10b981,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.1,
    });

    const softGreenMat = new THREE.MeshStandardMaterial({
      color: 0x78f5a6,
      emissive: 0x20e779,
      emissiveIntensity: 0.9,
    });

    // 5. Robot Root Container
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // 5A. HEAD GROUP
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.65, 0);

    // Main Helmet Shell
    const helmetGeo = new THREE.SphereGeometry(0.56, 32, 32);
    helmetGeo.scale(1.0, 0.94, 0.92);
    const helmetMesh = new THREE.Mesh(helmetGeo, darkObsidianMat);
    headGroup.add(helmetMesh);

    // White Top Crown Plate
    const crownPlateGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.16, 24);
    crownPlateGeo.scale(1.0, 0.6, 0.9);
    const crownPlate = new THREE.Mesh(crownPlateGeo, pearlWhiteMat);
    crownPlate.position.set(0, 0.42, -0.02);
    headGroup.add(crownPlate);

    // Front Glass Visor (Smooth curved front)
    const visorGeo = new THREE.SphereGeometry(0.54, 32, 32, 0, Math.PI);
    visorGeo.scale(0.88, 0.64, 0.82);
    visorGeo.rotateY(Math.PI / 2);
    visorGeo.translate(0, 0.02, 0.16);
    const visorMesh = new THREE.Mesh(visorGeo, glassVisorMat);
    headGroup.add(visorMesh);

    // Dual Digital Glowing Pupils (Track pointer inside visor)
    const pupilGroup = new THREE.Group();
    pupilGroup.position.set(0, 0.06, 0.58);

    const pupilGeo = new THREE.CapsuleGeometry(0.045, 0.07, 12, 16);
    pupilGeo.rotateZ(Math.PI / 2);

    const leftPupil = new THREE.Mesh(pupilGeo, emeraldGlowMat);
    leftPupil.position.set(-0.16, 0, 0);
    pupilGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, emeraldGlowMat);
    rightPupil.position.set(0.16, 0, 0);
    pupilGroup.add(rightPupil);

    headGroup.add(pupilGroup);

    // Antenna Ears with glowing LED nodes
    const earCylinderGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.14, 16);
    earCylinderGeo.rotateZ(Math.PI / 2);

    const leftEar = new THREE.Mesh(earCylinderGeo, pearlWhiteMat);
    leftEar.position.set(-0.55, 0.06, 0);
    const leftEarLed = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), emeraldGlowMat);
    leftEarLed.position.set(-0.08, 0, 0);
    leftEar.add(leftEarLed);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earCylinderGeo, pearlWhiteMat);
    rightEar.position.set(0.55, 0.06, 0);
    const rightEarLed = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), emeraldGlowMat);
    rightEarLed.position.set(0.08, 0, 0);
    rightEar.add(rightEarLed);
    headGroup.add(rightEar);

    // Floating Halo Sensor on top
    const haloGeo = new THREE.TorusGeometry(0.26, 0.015, 16, 48);
    haloGeo.rotateX(Math.PI / 2);
    const haloMesh = new THREE.Mesh(haloGeo, emeraldGlowMat);
    haloMesh.position.set(0, 0.62, 0);
    headGroup.add(haloMesh);

    robotRoot.add(headGroup);

    // 5B. TORSO & CORE MATRIX
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.22, 0);

    // Upper Chest Armored Plate
    const chestGeo = new THREE.CylinderGeometry(0.34, 0.26, 0.52, 24);
    chestGeo.scale(1.0, 1.0, 0.78);
    const chestMesh = new THREE.Mesh(chestGeo, pearlWhiteMat);
    torsoGroup.add(chestMesh);

    // Core Reactor Matrix (Glowing emerald core)
    const coreGeo = new THREE.OctahedronGeometry(0.11, 1);
    const coreMesh = new THREE.Mesh(coreGeo, emeraldGlowMat);
    coreMesh.position.set(0, 0.04, 0.22);
    torsoGroup.add(coreMesh);

    // Waist / Spine Link
    const spineGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.18, 16);
    const spineMesh = new THREE.Mesh(spineGeo, darkObsidianMat);
    spineMesh.position.set(0, -0.32, 0);
    torsoGroup.add(spineMesh);

    // Ion Levitation Thruster (Lower base)
    const thrusterGeo = new THREE.ConeGeometry(0.18, 0.24, 20);
    thrusterGeo.rotateX(Math.PI);
    const thrusterMesh = new THREE.Mesh(thrusterGeo, darkObsidianMat);
    thrusterMesh.position.set(0, -0.48, 0);
    torsoGroup.add(thrusterMesh);

    // Thruster Ion Glow Ring
    const ionRingGeo = new THREE.TorusGeometry(0.20, 0.02, 16, 32);
    ionRingGeo.rotateX(Math.PI / 2);
    const ionRingMesh = new THREE.Mesh(ionRingGeo, emeraldGlowMat);
    ionRingMesh.position.set(0, -0.56, 0);
    torsoGroup.add(ionRingMesh);

    robotRoot.add(torsoGroup);

    // 5C. FLOATING MAGNETIC HANDS
    const leftHandGroup = new THREE.Group();
    leftHandGroup.position.set(-0.52, -0.15, 0.12);
    const handGeo = new THREE.CapsuleGeometry(0.05, 0.12, 12, 16);
    handGeo.rotateZ(0.2);
    const leftHand = new THREE.Mesh(handGeo, pearlWhiteMat);
    const leftHandGlow = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), emeraldGlowMat);
    leftHandGlow.position.set(0, -0.06, 0.04);
    leftHand.add(leftHandGlow);
    leftHandGroup.add(leftHand);
    robotRoot.add(leftHandGroup);

    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0.52, -0.15, 0.12);
    const rightHand = new THREE.Mesh(handGeo, pearlWhiteMat);
    const rightHandGlow = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), emeraldGlowMat);
    rightHandGlow.position.set(0, -0.06, 0.04);
    rightHand.add(rightHandGlow);
    rightHandGroup.add(rightHand);
    robotRoot.add(rightHandGroup);

    // 5D. Orbiting Particle Swarm
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.75 + (i % 3) * 0.15;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = ((i % 5) - 2) * 0.2;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x20e779,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    robotRoot.add(particles);

    // 6. Pointer Movement Tracking (Vector calculation from Robot center on screen)
    const handleMouseMove = (e: MouseEvent) => {
      if (!mountEl) return;
      const rect = mountEl.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height * 0.38;

      const deltaX = e.clientX - robotCenterX;
      const deltaY = e.clientY - robotCenterY;
      const depth = 460;

      // Angular clamping for natural movement
      animStateRef.current.targetYaw = Math.max(-1.1, Math.min(1.1, Math.atan2(deltaX, depth)));
      animStateRef.current.targetPitch = Math.max(-0.65, Math.min(0.65, Math.atan2(deltaY, depth)));

      // Pupil offset inside visor
      animStateRef.current.pupilOffsetX = Math.max(-0.06, Math.min(0.06, (deltaX / depth) * 0.08));
      animStateRef.current.pupilOffsetY = Math.max(-0.04, Math.min(0.04, (-deltaY / depth) * 0.06));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 7. Resize Observer for Rock-Solid Responsive Dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 100);
        const h = Math.max(entry.contentRect.height, 100);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(mountEl);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const time = clock.getElapsedTime();
      const state = animStateRef.current;

      // Damped spring interpolation for head & body rotation
      state.currentYaw += (state.targetYaw - state.currentYaw) * 0.11;
      state.currentPitch += (state.targetPitch - state.currentPitch) * 0.11;

      // Handle 360 Spin celebration animation
      if (state.isSpinning) {
        state.spinAngle += 0.28;
        if (state.spinAngle >= Math.PI * 2) {
          state.spinAngle = 0;
          state.isSpinning = false;
        }
      }

      // Root rotation combining pointer tracking & spin
      robotRoot.rotation.y = state.currentYaw * 0.4 + state.spinAngle;
      headGroup.rotation.y = state.currentYaw * 0.75;
      headGroup.rotation.x = state.currentPitch * 0.82;

      // Update pupil tracking inside the visor
      pupilGroup.position.x = state.pupilOffsetX;
      pupilGroup.position.y = 0.06 + state.pupilOffsetY;

      // Gentle levitation breathing bobbing
      const hoverOffset = Math.sin(time * 2.3) * 0.07;
      robotRoot.position.y = hoverOffset;

      // Floating hands organic counter-motion
      leftHandGroup.position.y = -0.15 + Math.sin(time * 2.3 + 1.2) * 0.04;
      leftHandGroup.rotation.z = Math.sin(time * 1.8) * 0.12;

      rightHandGroup.position.y = -0.15 + Math.sin(time * 2.3 + 2.0) * 0.04;
      rightHandGroup.rotation.z = -Math.sin(time * 1.8) * 0.12;

      // Core reactor pulsation
      coreMesh.rotation.y = time * 1.5;
      coreMesh.rotation.x = time * 0.8;
      const coreScale = 1.0 + Math.sin(time * 4.0) * 0.08;
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      // Orbiting particles rotation
      particles.rotation.y = time * 0.45;

      renderer.render(scene, camera);
    };

    render();

    // 9. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      helmetGeo.dispose();
      crownPlateGeo.dispose();
      visorGeo.dispose();
      pupilGeo.dispose();
      earCylinderGeo.dispose();
      haloGeo.dispose();
      chestGeo.dispose();
      coreGeo.dispose();
      spineGeo.dispose();
      thrusterGeo.dispose();
      ionRingGeo.dispose();
      handGeo.dispose();
      particleGeo.dispose();

      darkObsidianMat.dispose();
      pearlWhiteMat.dispose();
      glassVisorMat.dispose();
      emeraldGlowMat.dispose();
      softGreenMat.dispose();
      particleMat.dispose();

      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <aside
      ref={containerRef}
      aria-label="Tsonjin Cyber Robot Companion"
      className={`fixed bottom-5 ${
        dockSide === 'right' ? 'right-3 sm:right-6 items-end' : 'left-3 sm:left-6 items-start'
      } z-40 flex flex-col pointer-events-auto select-none transition-all duration-300`}
    >
      {/* Speech Tip Bubble */}
      {speech && !isMinimized && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-2.5 max-w-xs sm:max-w-sm rounded-2xl border border-emerald-500/35 bg-[#0a0f0c]/95 p-3.5 shadow-[0_20px_45px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-bottom-2 ${
            dockSide === 'left' ? 'text-left' : 'text-right'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="h-3 w-3" />
              <span>TSONJIN CYBER BOT</span>
            </div>
            <button
              type="button"
              onClick={() => setSpeech(null)}
              aria-label="Close message"
              className="rounded p-0.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <p className="mt-1.5 text-xs text-white leading-relaxed text-left font-medium">
            {speech}
          </p>
        </div>
      )}

      {/* Main 3D Robot Card / Widget */}
      <div className="relative group">
        {!isMinimized ? (
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[#101713]/90 via-[#0a0e0b]/92 to-[#040605]/96 p-2 shadow-[0_22px_55px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all hover:border-emerald-500/50 hover:shadow-[0_25px_60px_rgba(16,185,129,0.18)]">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-2.5 pt-1 pb-1.5 gap-2 border-b border-emerald-500/15">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider">
                  CYBER BOT 3D
                </span>
                <span className="text-[8px] font-mono rounded bg-emerald-500/15 text-emerald-300 px-1 py-0.5 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-0.5">
                {/* Mute SFX Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  title={isMuted ? 'Аудио асаах (Unmute)' : 'Аудио хаах (Mute)'}
                  className="rounded-lg p-1 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>

                {/* Dock Side Switcher (Right <-> Left) */}
                <button
                  type="button"
                  onClick={toggleDockSide}
                  title={
                    dockSide === 'right'
                      ? 'Зүүн тийш шилжүүлэх (Move to Left)'
                      : 'Баруун тийш шилжүүлэх (Move to Right)'
                  }
                  className="rounded-lg p-1 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                </button>

                {/* Speak / Tip Trigger */}
                <button
                  type="button"
                  onClick={triggerTip}
                  title="Зөвлөгөө авах (Get Tip)"
                  className="rounded-lg p-1 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </button>

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  title="Нуух (Minimize)"
                  className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* 3D WebGL Robot Mount */}
            <div
              onClick={triggerTip}
              title="Над дээр дарж эргэлдүүлж, зөвлөгөө авна уу! (Click to spin & interact)"
              className="relative h-[210px] w-[205px] sm:h-[235px] sm:w-[225px] cursor-pointer overflow-hidden rounded-2xl flex items-center justify-center bg-[#030604]/50"
            >
              <div ref={mountRef} className="h-full w-full block" />
            </div>

            {/* Bottom Status & Security Badge */}
            <div className="flex items-center justify-between border-t border-emerald-500/15 px-2.5 py-1.5 font-mono text-[9px] text-slate-400">
              <button
                type="button"
                onClick={triggerTip}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                <span>SPIN & TIP</span>
              </button>

              <div className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>ODYSSEY AI</span>
              </div>
            </div>
          </div>
        ) : (
          /* Minimized Floating Bot Orb */
          <button
            type="button"
            onClick={() => {
              if (!isMuted) soundFx.click(true);
              setIsMinimized(false);
            }}
            className="flex items-center gap-2 rounded-2xl border border-emerald-500/35 bg-[#0a0f0c]/90 px-3.5 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.7)] backdrop-blur-2xl hover:border-emerald-400 hover:scale-105 transition-all text-xs font-mono font-bold text-emerald-400"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span>CYBER BOT ({dockSide.toUpperCase()})</span>
          </button>
        )}
      </div>
    </aside>
  );
};
