import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { soundEngine } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface ThemeKeyframe {
  hour: number;
  skyColors: [string, string];
  lightColor: string;
  lightIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  showStars: boolean;
  treeLeafColor: number;
  pondColor: number;
  fogColor: string;
}

// Continuous keyframes across a 24h clock for smooth day/night transition
const KEYFRAMES: ThemeKeyframe[] = [
  {
    hour: 0, // Midnight
    skyColors: ['#09070f', '#120f1e'],
    lightColor: '#7b8ca3',
    lightIntensity: 0.3,
    ambientColor: '#121226',
    ambientIntensity: 0.2,
    showStars: true,
    treeLeafColor: 0x0a240f,
    pondColor: 0x071e33,
    fogColor: '#120f1e',
  },
  {
    hour: 4.5, // Late night / pre-dawn
    skyColors: ['#09070f', '#1c1229'],
    lightColor: '#7b8ca3',
    lightIntensity: 0.3,
    ambientColor: '#121226',
    ambientIntensity: 0.2,
    showStars: true,
    treeLeafColor: 0x0a240f,
    pondColor: 0x071e33,
    fogColor: '#1c1229',
  },
  {
    hour: 5.8, // Sunrise start
    skyColors: ['#ff7a80', '#fecfef'],
    lightColor: '#ff9473',
    lightIntensity: 0.9,
    ambientColor: '#ffa8a8',
    ambientIntensity: 0.45,
    showStars: false,
    treeLeafColor: 0x558b2f,
    pondColor: 0x1b5e20,
    fogColor: '#fecfef',
  },
  {
    hour: 7.0, // Early morning
    skyColors: ['#7bc4e7', '#e1f5fe'],
    lightColor: '#fff9c4',
    lightIntensity: 1.4,
    ambientColor: '#c8e6c9',
    ambientIntensity: 0.65,
    showStars: false,
    treeLeafColor: 0x33691e,
    pondColor: 0x0288d1,
    fogColor: '#e1f5fe',
  },
  {
    hour: 12.0, // Noon
    skyColors: ['#42a5f5', '#e1f5fe'],
    lightColor: '#ffffff',
    lightIntensity: 1.5,
    ambientColor: '#e0f2f1',
    ambientIntensity: 0.75,
    showStars: false,
    treeLeafColor: 0x2e7d32,
    pondColor: 0x0288d1,
    fogColor: '#e1f5fe',
  },
  {
    hour: 17.5, // Sunset start
    skyColors: ['#e64a19', '#ffcc80'],
    lightColor: '#ff9800',
    lightIntensity: 1.3,
    ambientColor: '#ffe0b2',
    ambientIntensity: 0.5,
    showStars: false,
    treeLeafColor: 0x6d4c41,
    pondColor: 0xe65100,
    fogColor: '#ffcc80',
  },
  {
    hour: 18.8, // Late sunset / twilight
    skyColors: ['#8e24aa', '#311b92'],
    lightColor: '#ff80ab',
    lightIntensity: 0.65,
    ambientColor: '#303f9f',
    ambientIntensity: 0.35,
    showStars: false,
    treeLeafColor: 0x1b5e20,
    pondColor: 0x1a237e,
    fogColor: '#311b92',
  },
  {
    hour: 20.2, // Night starts
    skyColors: ['#09070f', '#120f1e'],
    lightColor: '#7b8ca3',
    lightIntensity: 0.3,
    ambientColor: '#121226',
    ambientIntensity: 0.2,
    showStars: true,
    treeLeafColor: 0x0a240f,
    pondColor: 0x071e33,
    fogColor: '#120f1e',
  },
  {
    hour: 24, // Wrapped end
    skyColors: ['#09070f', '#120f1e'],
    lightColor: '#7b8ca3',
    lightIntensity: 0.3,
    ambientColor: '#121226',
    ambientIntensity: 0.2,
    showStars: true,
    treeLeafColor: 0x0a240f,
    pondColor: 0x071e33,
    fogColor: '#120f1e',
  }
];

// Helper to interpolate colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

export const LivingBackground: React.FC = () => {
  const { mode } = useTheme();
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // References for parallax
  const targetCameraX = useRef(0);
  const targetCameraY = useRef(0);
  const scrollYFraction = useRef(0);

  // Animation references
  const treesRef = useRef<THREE.Group[]>([]);
  const foliageRef = useRef<THREE.Object3D[]>([]); // grass, bushes, etc.
  const birdsRef = useRef<THREE.Group[]>([]);
  const butterfliesRef = useRef<THREE.Group[]>([]);
  const firefliesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const getDecimalHour = () => {
      if (modeRef.current === 'day') return 12.0;
      if (modeRef.current === 'night') return 0.0;
      const d = new Date();
      return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
    };

    const getInterpolatedTheme = (hour: number) => {
      let h = hour % 24;
      if (h < 0) h += 24;

      let k1 = KEYFRAMES[0];
      let k2 = KEYFRAMES[KEYFRAMES.length - 1];

      for (let i = 0; i < KEYFRAMES.length - 1; i++) {
        if (h >= KEYFRAMES[i].hour && h <= KEYFRAMES[i + 1].hour) {
          k1 = KEYFRAMES[i];
          k2 = KEYFRAMES[i + 1];
          break;
        }
      }

      const span = k2.hour - k1.hour;
      const factor = span === 0 ? 0 : (h - k1.hour) / span;

      const skyColorTop = interpolateColor(k1.skyColors[0], k2.skyColors[0], factor);
      const skyColorBottom = interpolateColor(k1.skyColors[1], k2.skyColors[1], factor);
      const lightColor = interpolateColor(k1.lightColor, k2.lightColor, factor);
      const lightIntensity = k1.lightIntensity + (k2.lightIntensity - k1.lightIntensity) * factor;
      const ambientColor = interpolateColor(k1.ambientColor, k2.ambientColor, factor);
      const ambientIntensity = k1.ambientIntensity + (k2.ambientIntensity - k1.ambientIntensity) * factor;
      const fogColor = interpolateColor(k1.fogColor, k2.fogColor, factor);

      const starOpacity1 = k1.showStars ? 0.8 : 0.0;
      const starOpacity2 = k2.showStars ? 0.8 : 0.0;
      const starOpacity = starOpacity1 + (starOpacity2 - starOpacity1) * factor;

      // Leaves color interpolation (numeric)
      const c1 = k1.treeLeafColor;
      const c2 = k2.treeLeafColor;
      const r1 = (c1 >> 16) & 0xff;
      const g1 = (c1 >> 8) & 0xff;
      const b1 = c1 & 0xff;
      const r2 = (c2 >> 16) & 0xff;
      const g2 = (c2 >> 8) & 0xff;
      const b2 = c2 & 0xff;
      const r = Math.round(r1 + (r2 - r1) * factor);
      const g = Math.round(g1 + (g2 - g1) * factor);
      const b = Math.round(b1 + (b2 - b1) * factor);
      const treeLeafColor = (r << 16) | (g << 8) | b;

      // Pond color
      const pc1 = k1.pondColor;
      const pc2 = k2.pondColor;
      const pr1 = (pc1 >> 16) & 0xff;
      const pg1 = (pc1 >> 8) & 0xff;
      const pb1 = pc1 & 0xff;
      const pr2 = (pc2 >> 16) & 0xff;
      const pg2 = (pc2 >> 8) & 0xff;
      const pb2 = pc2 & 0xff;
      const pr = Math.round(pr1 + (pr2 - pr1) * factor);
      const pg = Math.round(pg1 + (pg2 - pg1) * factor);
      const pb = Math.round(pb1 + (pb2 - pb1) * factor);
      const pondColor = (pr << 16) | (pg << 8) | pb;

      return {
        skyColorTop,
        skyColorBottom,
        lightColor,
        lightIntensity,
        ambientColor,
        ambientIntensity,
        starOpacity,
        treeLeafColor,
        pondColor,
        fogColor,
      };
    };

    const initialTheme = getInterpolatedTheme(getDecimalHour());

    // ─── Scene Setup ─────────────────────────────────────────────────
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(initialTheme.fogColor, 0.012);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Enable soft shadow mapping
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ─── Sky Background Canvas Texture ────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, initialTheme.skyColorTop);
      gradient.addColorStop(1, initialTheme.skyColorBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const skyTexture = new THREE.CanvasTexture(canvas);
    const skyGeo = new THREE.PlaneGeometry(80, 60);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTexture, depthWrite: false });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.set(0, 0, -22);
    scene.add(skyMesh);

    // ─── Lights ──────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(initialTheme.ambientColor, initialTheme.ambientIntensity);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(initialTheme.lightColor, initialTheme.lightIntensity);
    dirLight.position.set(20, 16, -22);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // ─── Sun/Moon Visual representation with Bloom/Glow ──────────────
    const sunMoonGroup = new THREE.Group();
    
    // Core Sun/Moon Sphere
    const sunMoonGeo = new THREE.SphereGeometry(1.6, 16, 16);
    const sunMoonMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    const sunMoonMesh = new THREE.Mesh(sunMoonGeo, sunMoonMat);
    sunMoonGroup.add(sunMoonMesh);

    // Glowing aura
    const sunGlowGeo = new THREE.SphereGeometry(3.2, 16, 16);
    const sunGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffea00,
      transparent: true,
      opacity: 0.15,
    });
    const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
    sunMoonGroup.add(sunGlow);

    sunMoonGroup.position.copy(dirLight.position);
    scene.add(sunMoonGroup);

    // ─── Majestic Mountain Range Terrain — depth = -16 to -12 ───────────────
    const buildMajesticMountain = (x: number, y: number, z: number, radius: number, height: number, rockyColor: number) => {
      const mountainGroup = new THREE.Group();

      // Main rocky peak (7-sided low-poly cone with rocky shading)
      const mountainGeo = new THREE.ConeGeometry(radius, height, 7);
      const mountainMat = new THREE.MeshStandardMaterial({
        color: rockyColor,
        flatShading: true,
        roughness: 0.88,
        metalness: 0.12,
      });
      const mountain = new THREE.Mesh(mountainGeo, mountainMat);
      mountain.position.y = height / 2;
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      mountainGroup.add(mountain);

      // Secondary rocky ridges attached to peak
      for (let i = 0; i < 3; i++) {
        const ridgeGeo = new THREE.ConeGeometry(radius * 0.45, height * 0.65, 5);
        const ridgeMat = new THREE.MeshStandardMaterial({
          color: 0x37474f,
          flatShading: true,
          roughness: 0.9,
        });
        const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
        const angle = (i / 3) * Math.PI * 2;
        ridge.position.set(Math.cos(angle) * (radius * 0.4), height * 0.25, Math.sin(angle) * (radius * 0.4));
        ridge.rotation.z = (Math.random() - 0.5) * 0.2;
        ridge.castShadow = true;
        mountainGroup.add(ridge);
      }

      // Green vegetation patches at the mountain base
      const vegGeo = new THREE.ConeGeometry(radius * 0.85, height * 0.35, 6);
      const vegMat = new THREE.MeshStandardMaterial({
        color: 0x1b5e20,
        flatShading: true,
        roughness: 0.95,
      });
      const vegBase = new THREE.Mesh(vegGeo, vegMat);
      vegBase.position.y = height * 0.12;
      vegBase.receiveShadow = true;
      mountainGroup.add(vegBase);

      mountainGroup.position.set(x, y, z);
      scene.add(mountainGroup);
      return mountainGroup;
    };

    // Build majestic mountain range (pushed well below card area)
    buildMajesticMountain(-22, -18, -24, 22, 15, 0x455a64); // Left majestic peak
    buildMajesticMountain(22, -18, -25, 26, 17, 0x37474f);  // Right majestic peak
    buildMajesticMountain(0, -18, -27, 20, 13, 0x263238);   // Center background peak
    buildMajesticMountain(-10, -18, -21, 14, 10, 0x546e7a); // Midground left ridge
    buildMajesticMountain(10, -18, -22, 15, 11, 0x455a64);  // Midground right ridge

    // ─── Ground Terrain with Procedural Grass Texture ─────────────────
    const createGrassTexture = () => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctxGrass = c.getContext('2d');
      if (ctxGrass) {
        ctxGrass.fillStyle = '#2e7d32'; // Base rich green
        ctxGrass.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 400; i++) {
          const rx = Math.random() * 128;
          const ry = Math.random() * 128;
          const rh = 3 + Math.random() * 6;
          ctxGrass.strokeStyle = Math.random() > 0.5 ? '#4caf50' : '#1b5e20';
          ctxGrass.lineWidth = 1;
          ctxGrass.beginPath();
          ctxGrass.moveTo(rx, ry);
          ctxGrass.lineTo(rx + (Math.random() - 0.5) * 2, ry - rh);
          ctxGrass.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(16, 6);
      return tex;
    };

    const groundGeo = new THREE.PlaneGeometry(120, 30, 8, 8);
    const groundMat = new THREE.MeshStandardMaterial({
      map: createGrassTexture(),
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2.5;
    ground.position.set(0, -11, -4);
    ground.receiveShadow = true;
    scene.add(ground);

    // ─── Stars (Twinkling) ───────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 250;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 60;
      starPositions[i + 1] = Math.random() * 25 - 1;
      starPositions[i + 2] = -18 + (Math.random() - 0.5) * 3;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.16,
      transparent: true,
      opacity: initialTheme.starOpacity,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Dynamic Star Twinkle
    gsap.to(starMat, {
      opacity: 0.15,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // ─── Pond with Sparkles ──────────────────────────────────────────
    const pondGeo = new THREE.CircleGeometry(3.6, 6); // 6-sided low-poly pond
    const pondMat = new THREE.MeshStandardMaterial({
      color: initialTheme.pondColor,
      roughness: 0.2,
      metalness: 0.8,
      flatShading: true,
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(0, -9.6, -2.5);
    pond.receiveShadow = true;
    scene.add(pond);

    const sparklesGroup = new THREE.Group();
    const sparkleGeo = new THREE.PlaneGeometry(0.18, 0.18);
    const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

    for (let i = 0; i < 4; i++) {
      const sp = new THREE.Mesh(sparkleGeo, sparkleMat);
      sp.rotation.x = -Math.PI / 2;
      sp.position.set((Math.random() - 0.5) * 4.5, 0.02, (Math.random() - 0.5) * 4.5);
      sparklesGroup.add(sp);

      gsap.to(sp.scale, {
        x: 0,
        y: 0,
        duration: 1 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    }
    pond.add(sparklesGroup);

    // ─── Low-Poly Trees & Foliage Varieties — depth = -4 to -7 ────────
    const buildTree = (x: number, y: number, z: number, scale: number, type: 'puffy' | 'pine' | 'disc') => {
      const treeGroup = new THREE.Group();

      // Trunk standard material
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x4e342e,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true,
      });

      // Leaves standard material with random variation multiplier
      const leavesMat = new THREE.MeshStandardMaterial({
        color: initialTheme.treeLeafColor,
        roughness: 0.85,
        metalness: 0.05,
        flatShading: true,
      });
      leavesMat.userData = {
        colorMultiplier: 0.85 + Math.random() * 0.3
      };

      if (type === 'pine') {
        // High-detail PBR Trunk with rugged brown bark
        const trunkGeo = new THREE.CylinderGeometry(0.18, 0.32, 2.8, 8);
        const trunkMatRugged = new THREE.MeshStandardMaterial({
          color: 0x4a2c11,
          roughness: 0.92,
          metalness: 0.08,
          flatShading: true,
        });
        const trunk = new THREE.Mesh(trunkGeo, trunkMatRugged);
        trunk.position.y = 1.4;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);

        // Layered dense realistic pine needle cone clusters (5 tiers with multi-cone radial offsets)
        const leavesGroup = new THREE.Group();
        const needleTiers = [
          { radius: 1.35, height: 1.1, y: 1.5, count: 5 },
          { radius: 1.15, height: 1.0, y: 2.1, count: 4 },
          { radius: 0.9, height: 0.9, y: 2.7, count: 4 },
          { radius: 0.65, height: 0.75, y: 3.2, count: 3 },
          { radius: 0.4, height: 0.6, y: 3.6, count: 2 },
        ];

        needleTiers.forEach((tier) => {
          const tierGroup = new THREE.Group();
          tierGroup.position.y = tier.y;

          for (let i = 0; i < tier.count; i++) {
            const coneGeo = new THREE.ConeGeometry(tier.radius * (0.85 + Math.random() * 0.3), tier.height, 7);
            const cone = new THREE.Mesh(coneGeo, leavesMat);

            const angle = (i / tier.count) * Math.PI * 2 + Math.random() * 0.3;
            const offset = Math.random() * 0.08;
            cone.position.set(Math.cos(angle) * offset, 0, Math.sin(angle) * offset);
            cone.rotation.y = Math.random() * Math.PI;
            cone.rotation.z = (Math.random() - 0.5) * 0.1;
            cone.castShadow = true;
            cone.receiveShadow = true;

            tierGroup.add(cone);
          }
          leavesGroup.add(tierGroup);
        });
        treeGroup.add(leavesGroup);

      } else if (type === 'disc') {
        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.12, 0.22, 2.4, 5);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);

        // Stacked flat disc layers
        const leavesGroup = new THREE.Group();
        const discs = [
          { r: 1.2, h: 0.35, y: 2.0 },
          { r: 0.95, h: 0.3, y: 2.55 },
          { r: 0.68, h: 0.25, y: 3.05 },
        ];
        discs.forEach((d) => {
          const discGeo = new THREE.CylinderGeometry(d.r, d.r * 0.9, d.h, 6);
          const disc = new THREE.Mesh(discGeo, leavesMat);
          disc.position.y = d.y;
          disc.scale.y = 0.8;
          disc.rotation.y = Math.random() * Math.PI;
          disc.castShadow = true;
          disc.receiveShadow = true;
          leavesGroup.add(disc);
        });
        treeGroup.add(leavesGroup);

      } else {
        // puffy
        // Trunk with branches
        const trunkGeo = new THREE.CylinderGeometry(0.18, 0.3, 2.2, 5);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.1;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        treeGroup.add(trunk);

        // Side branches
        const branchGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.8, 5);
        
        const branchL = new THREE.Mesh(branchGeo, trunkMat);
        branchL.position.set(-0.3, 1.6, 0.1);
        branchL.rotation.z = 0.5;
        branchL.castShadow = true;
        treeGroup.add(branchL);

        const branchR = new THREE.Mesh(branchGeo, trunkMat);
        branchR.position.set(0.3, 1.7, -0.1);
        branchR.rotation.z = -0.5;
        branchR.castShadow = true;
        treeGroup.add(branchR);

        // Fluffy cloud layers
        const leavesGroup = new THREE.Group();
        const sphereGeo = new THREE.SphereGeometry(0.9, 5, 5);

        // Main center
        const m1 = new THREE.Mesh(sphereGeo, leavesMat);
        m1.position.set(0, 2.5, 0);
        m1.scale.set(1.15, 1.25, 1.15);
        m1.castShadow = true;
        m1.receiveShadow = true;
        leavesGroup.add(m1);

        // Left cluster
        const m2 = new THREE.Mesh(sphereGeo, leavesMat);
        m2.position.set(-0.7, 2.1, 0.2);
        m2.scale.set(0.75, 0.75, 0.75);
        m2.castShadow = true;
        m2.receiveShadow = true;
        leavesGroup.add(m2);

        // Right cluster
        const m3 = new THREE.Mesh(sphereGeo, leavesMat);
        m3.position.set(0.7, 2.2, -0.2);
        m3.scale.set(0.8, 0.8, 0.8);
        m3.castShadow = true;
        m3.receiveShadow = true;
        leavesGroup.add(m3);

        // Front/Back clusters
        const m4 = new THREE.Mesh(sphereGeo, leavesMat);
        m4.position.set(0.1, 2.0, 0.65);
        m4.scale.set(0.7, 0.7, 0.7);
        m4.castShadow = true;
        m4.receiveShadow = true;
        leavesGroup.add(m4);

        treeGroup.add(leavesGroup);
      }

      treeGroup.position.set(x, y, z);
      treeGroup.scale.setScalar(scale);

      scene.add(treeGroup);
      treesRef.current.push(treeGroup);

      // Continuous gentle breeze swaying
      const leavesGroup = treeGroup.children[treeGroup.children.length - 1] as THREE.Group;
      if (leavesGroup) {
        gsap.to(leavesGroup.rotation, {
          z: 0.04 + Math.random() * 0.03,
          x: 0.02 + Math.random() * 0.02,
          duration: 3.2 + Math.random() * 2.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    };

    const treePlacements = [
      { x: -13, y: -9, z: -2.0, s: 1.9, t: 'pine' as const },
      { x: -9.5, y: -9, z: -4.0, s: 1.6, t: 'pine' as const },
      { x: -7, y: -9, z: -5.5, s: 1.3, t: 'puffy' as const },
      { x: 13, y: -9, z: -2.0, s: 1.9, t: 'pine' as const },
      { x: 9.5, y: -9, z: -4.0, s: 1.6, t: 'pine' as const },
      { x: 7, y: -9, z: -5.5, s: 1.3, t: 'puffy' as const },
    ];
    treePlacements.forEach(t => buildTree(t.x, t.y, t.z, t.s, t.t));

    // ─── Cartoon Owl Nesting at Night — depth = -6 ──────────────────
    const owlGroup = new THREE.Group();
    const owlBodyGeo = new THREE.SphereGeometry(0.38, 8, 8);
    const owlBodyMat = new THREE.MeshStandardMaterial({ color: 0x37474f, flatShading: true, roughness: 0.8 });
    const owlBody = new THREE.Mesh(owlBodyGeo, owlBodyMat);
    owlBody.scale.set(1, 1.25, 0.8);
    owlBody.castShadow = true;
    owlGroup.add(owlBody);

    const owlEyeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 8);
    const owlEyeMat = new THREE.MeshBasicMaterial({ color: 0x37474f }); // will glow yellow at night
    const eyeL = new THREE.Mesh(owlEyeGeo, owlEyeMat);
    eyeL.rotation.x = Math.PI / 2;
    eyeL.position.set(-0.14, 0.18, 0.28);
    owlGroup.add(eyeL);

    const eyeR = new THREE.Mesh(owlEyeGeo, owlEyeMat);
    eyeR.rotation.x = Math.PI / 2;
    eyeR.position.set(0.14, 0.18, 0.28);
    owlGroup.add(eyeR);

    // Nest the owl on a left branch
    owlGroup.position.set(-8.8, -7.2, -6.0);
    scene.add(owlGroup);

    // ─── Foreground Layers: Bushes, Grass, Rocks (depth = 0 to 5) ─────
    const buildRock = (x: number, y: number, z: number, scale: number) => {
      const rockGeo = new THREE.DodecahedronGeometry(1, 0); // 12-faced low poly rock
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x82909e,
        flatShading: true,
        roughness: 0.9,
        metalness: 0.2,
      });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(x, y, z);
      rock.scale.setScalar(scale);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
    };

    const buildBush = (x: number, y: number, z: number, scale: number) => {
      const bushGroup = new THREE.Group();
      const bushMat = new THREE.MeshStandardMaterial({
        color: 0x1b5e20,
        flatShading: true,
        roughness: 0.9,
      });
      const sphereGeo = new THREE.SphereGeometry(1, 5, 5);

      const center = new THREE.Mesh(sphereGeo, bushMat);
      center.castShadow = true;
      center.receiveShadow = true;
      bushGroup.add(center);

      const left = new THREE.Mesh(sphereGeo, bushMat);
      left.position.set(-0.65, -0.15, 0.15);
      left.scale.setScalar(0.75);
      left.castShadow = true;
      left.receiveShadow = true;
      bushGroup.add(left);

      const right = new THREE.Mesh(sphereGeo, bushMat);
      right.position.set(0.65, -0.15, -0.15);
      right.scale.setScalar(0.75);
      right.castShadow = true;
      right.receiveShadow = true;
      bushGroup.add(right);

      bushGroup.position.set(x, y, z);
      bushGroup.scale.setScalar(scale);
      scene.add(bushGroup);
      foliageRef.current.push(bushGroup);

      // Sway animation
      gsap.to(bushGroup.rotation, {
        z: 0.03 + Math.random() * 0.02,
        duration: 2.2 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    };

    const buildGrass = (x: number, y: number, z: number, scale: number) => {
      const grassGroup = new THREE.Group();
      const grassMat = new THREE.MeshStandardMaterial({
        color: 0x4caf50,
        flatShading: true,
        roughness: 0.9,
      });
      const bladeGeo = new THREE.ConeGeometry(0.12, 1.3, 4);

      const blade1 = new THREE.Mesh(bladeGeo, grassMat);
      blade1.rotation.z = -0.16;
      blade1.position.x = -0.12;
      blade1.castShadow = true;
      blade1.receiveShadow = true;
      grassGroup.add(blade1);

      const blade2 = new THREE.Mesh(bladeGeo, grassMat);
      blade2.position.y = 0.18;
      blade2.castShadow = true;
      blade2.receiveShadow = true;
      grassGroup.add(blade2);

      const blade3 = new THREE.Mesh(bladeGeo, grassMat);
      blade3.rotation.z = 0.16;
      blade3.position.x = 0.12;
      blade3.castShadow = true;
      blade3.receiveShadow = true;
      grassGroup.add(blade3);

      grassGroup.position.set(x, y, z);
      grassGroup.scale.setScalar(scale);
      scene.add(grassGroup);
      foliageRef.current.push(grassGroup);

      // Sway animation
      gsap.to(grassGroup.rotation, {
        z: 0.08,
        duration: 1.6 + Math.random() * 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    };

    // Place foreground items
    buildBush(-8.8, -8.3, 2.5, 1.55);
    buildBush(8.8, -8.3, 2.5, 1.55);

    buildGrass(-6.5, -8.6, 3.5, 1.05);
    buildGrass(6.5, -8.6, 3.5, 1.05);
    buildGrass(-10.5, -8.6, 1.8, 1.25);

    buildRock(-5.5, -8.9, 3.8, 0.65);
    buildRock(5.5, -8.9, 3.8, 0.65);



    // ─── Cheerful Flying Birds (3D Sparrow / Swallow Model) ──────────────────
    const buildBirdObject = () => {
      const birdGroup = new THREE.Group();

      // Detailed bird materials
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8, flatShading: true });
      const chestMat = new THREE.MeshStandardMaterial({ color: 0xffecb3, roughness: 0.8, flatShading: true });
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, side: THREE.DoubleSide, roughness: 0.7, flatShading: true });
      const beakMat = new THREE.MeshBasicMaterial({ color: 0xffb300 });

      // Streamlined Body
      const bodyGeo = new THREE.SphereGeometry(0.35, 7, 7);
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.scale.set(0.8, 0.7, 1.4);
      body.castShadow = true;
      birdGroup.add(body);

      // Chest Plumage
      const chestGeo = new THREE.SphereGeometry(0.28, 6, 6);
      const chest = new THREE.Mesh(chestGeo, chestMat);
      chest.position.set(0, -0.08, 0.1);
      chest.scale.set(0.8, 0.7, 1.1);
      birdGroup.add(chest);

      // Head
      const headGeo = new THREE.SphereGeometry(0.22, 6, 6);
      const head = new THREE.Mesh(headGeo, bodyMat);
      head.position.set(0, 0.15, 0.45);
      birdGroup.add(head);

      // Beak
      const beakGeo = new THREE.ConeGeometry(0.06, 0.18, 4);
      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.12, 0.62);
      birdGroup.add(beak);

      // Tail Feathers
      const tailGeo = new THREE.PlaneGeometry(0.3, 0.5);
      const tail = new THREE.Mesh(tailGeo, wingMat);
      tail.rotation.x = -Math.PI / 6;
      tail.position.set(0, 0.05, -0.7);
      birdGroup.add(tail);

      // Flapping Wings (Left & Right)
      const wingLGroup = new THREE.Group();
      wingLGroup.position.set(-0.25, 0.1, 0.1);
      const wingLGeo = new THREE.PlaneGeometry(0.9, 0.45);
      wingLGeo.translate(-0.45, 0, 0);
      const wingL = new THREE.Mesh(wingLGeo, wingMat);
      wingLGroup.add(wingL);
      birdGroup.add(wingLGroup);

      const wingRGroup = new THREE.Group();
      wingRGroup.position.set(0.25, 0.1, 0.1);
      const wingRGeo = new THREE.PlaneGeometry(0.9, 0.45);
      wingRGeo.translate(0.45, 0, 0);
      const wingR = new THREE.Mesh(wingRGeo, wingMat);
      wingRGroup.add(wingR);
      birdGroup.add(wingRGroup);

      // Flapping wing animation loop
      gsap.to(wingLGroup.rotation, { z: -Math.PI / 3.2, duration: 0.18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(wingRGroup.rotation, { z: Math.PI / 3.2, duration: 0.18, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      // Initial position out of screen
      birdGroup.position.set(-100, 10, -5);
      birdGroup.scale.setScalar(0.85);
      scene.add(birdGroup);
      birdsRef.current.push(birdGroup);
    };

    // Instantiate 4 cheerful birds for flock flight paths
    buildBirdObject();
    buildBirdObject();
    buildBirdObject();
    buildBirdObject();

    // ─── Wildlife: Butterflies (Day) ─────────────────────────────────
    const createButterfly = () => {
      const butterfly = new THREE.Group();
      const wingMat = new THREE.MeshStandardMaterial({
        color: [0xff4081, 0xffeb3b, 0x00e676][Math.floor(Math.random() * 3)],
        side: THREE.DoubleSide,
        roughness: 0.7,
      });

      const wingGeo = new THREE.PlaneGeometry(0.18, 0.18);
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.x = -0.09;
      butterfly.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.x = 0.09;
      butterfly.add(rightWing);

      gsap.to(leftWing.rotation, { y: Math.PI / 2.8, duration: 0.09, repeat: -1, yoyo: true });
      gsap.to(rightWing.rotation, { y: -Math.PI / 2.8, duration: 0.09, repeat: -1, yoyo: true });

      butterfly.position.set((Math.random() - 0.5) * 14, -8.6 + Math.random() * 2, 2.0);
      scene.add(butterfly);
      butterfliesRef.current.push(butterfly);

      const flutter = () => {
        gsap.to(butterfly.position, {
          x: butterfly.position.x + (Math.random() - 0.5) * 3,
          y: -8.6 + Math.random() * 3,
          z: 1.0 + Math.random() * 2.5,
          duration: 2.2 + Math.random() * 1.8,
          onComplete: flutter,
        });
      };
      flutter();
    };

    for (let i = 0; i < 3; i++) createButterfly();

    // ─── Wildlife: Fireflies (Night) ─────────────────────────────────
    const createFirefly = () => {
      const geo = new THREE.SphereGeometry(0.08, 4, 4);
      const mat = new THREE.MeshBasicMaterial({ color: 0xccff00, transparent: true, opacity: 0.85 });
      const firefly = new THREE.Mesh(geo, mat);
      firefly.position.set((Math.random() - 0.5) * 18, -8 + Math.random() * 5, -2);
      scene.add(firefly);
      firefliesRef.current.push(firefly);

      const drift = () => {
        gsap.to(firefly.position, {
          x: firefly.position.x + (Math.random() - 0.5) * 2.5,
          y: firefly.position.y + (Math.random() - 0.5) * 2,
          duration: 3 + Math.random() * 3,
          onComplete: drift,
        });
        gsap.to(mat, {
          opacity: 0.2 + Math.random() * 0.7,
          duration: 0.4 + Math.random() * 1.2,
          yoyo: true,
          repeat: 1,
        });
      };
      drift();
    };

    for (let i = 0; i < 8; i++) createFirefly();

    // ─── Scroll & Mouse Listeners ────────────────────────────────────
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollYFraction.current = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      targetCameraX.current = normX * 2.8;
      targetCameraY.current = -normY * 1.8;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);

    // ─── Ambient Ambience Check ──────────────────────────────────────
    const checkAmbience = () => {
      const currentHour = getDecimalHour();
      const isNight = currentHour < 6 || currentHour >= 18;
      soundEngine.playAmbience(isNight ? 'night' : 'day');
    };
    checkAmbience();
    const ambienceTimer = setInterval(checkAmbience, 25000);

    // ─── Dynamic Bird Flock trigger (every 20-40 seconds) ────────────
    const triggerBirdFlock = () => {
      const decimalHour = getDecimalHour();
      const isNight = decimalHour < 6 || decimalHour >= 18;
      
      if (!isNight) {
        const flockSize = 2 + Math.floor(Math.random() * 2); // 2 or 3 birds
        const startX = -28 - Math.random() * 5;
        const startY = 4 + Math.random() * 6;
        const targetX = 28 + Math.random() * 5;
        const targetY = startY + (Math.random() - 0.5) * 3;
        const duration = 14 + Math.random() * 5;

        for (let idx = 0; idx < flockSize; idx++) {
          const bird = birdsRef.current[idx];
          if (bird) {
            const offsetX = -idx * 2.5;
            const offsetY = (Math.random() - 0.5) * 1.5;
            
            bird.position.set(startX + offsetX, startY + offsetY, -5);
            
            gsap.killTweensOf(bird.position);
            gsap.to(bird.position, {
              x: targetX,
              y: targetY,
              duration: duration,
              ease: 'none',
            });
          }
        }
      }

      const nextFlockDelay = 20000 + Math.random() * 20000;
      birdFlockTimer = setTimeout(triggerBirdFlock, nextFlockDelay);
    };

    let birdFlockTimer = setTimeout(triggerBirdFlock, 5000);

    // ─── Periodic wind gusts bending foliage deeper ──────────────────
    const triggerGust = () => {
      // Wind gust timeline
      treesRef.current.forEach((tree) => {
        const leaves = tree.children[tree.children.length - 1] as THREE.Group;
        if (leaves) {
          gsap.to(leaves.rotation, {
            z: '+=0.10',
            x: '+=0.04',
            duration: 1.0,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
          });
        }
      });
      foliageRef.current.forEach((f) => {
        gsap.to(f.rotation, {
          z: '+=0.18',
          duration: 0.8,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut',
        });
      });

      const nextGust = 18000 + Math.random() * 15000;
      gustTimer = setTimeout(triggerGust, nextGust);
    };
    let gustTimer = setTimeout(triggerGust, 12000);

    // ─── Animation Loop ──────────────────────────────────────────────
    let clock = new THREE.Clock();
    let animFrameId: number;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const decimalHour = getDecimalHour();
      const theme = getInterpolatedTheme(decimalHour);
      const isNight = decimalHour < 6 || decimalHour >= 18;

      // 1. Sky Canvas gradient repaint
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, theme.skyColorTop);
        gradient.addColorStop(1, theme.skyColorBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        skyTexture.needsUpdate = true;
      }

      // 2. Light parameters & fog
      ambientLight.color.set(theme.ambientColor);
      ambientLight.intensity = theme.ambientIntensity;
      dirLight.color.set(theme.lightColor);
      dirLight.intensity = theme.lightIntensity;
      pondMat.color.set(theme.pondColor);
      scene.fog = new THREE.FogExp2(theme.fogColor, 0.012);

      // 3. Tree leaves color interpolation with visual shade multiplier
      treesRef.current.forEach((t) => {
        const leavesGroup = t.children[t.children.length - 1] as THREE.Group;
        if (leavesGroup) {
          leavesGroup.traverse((c) => {
            if ((c as THREE.Mesh).isMesh) {
              const mesh = c as THREE.Mesh;
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat && mat.color && mat.userData) {
                const mult = mat.userData.colorMultiplier || 1.0;
                const baseColor = theme.treeLeafColor;
                const r = ((baseColor >> 16) & 0xff) * mult;
                const g = ((baseColor >> 8) & 0xff) * mult;
                const b = (baseColor & 0xff) * mult;
                const finalColor = (Math.min(255, Math.round(r)) << 16) | (Math.min(255, Math.round(g)) << 8) | Math.min(255, Math.round(b));
                mat.color.set(finalColor);
              }
            }
          });
        }
      });

      // 4. Wildlife visibility
      butterfliesRef.current.forEach((b) => { b.visible = !isNight; });
      firefliesRef.current.forEach((f) => { f.visible = isNight; });
      starMat.opacity = theme.starOpacity;

      // Owl eyes glow
      owlEyeMat.color.setHex(isNight ? 0xffff00 : 0x37474f);

      // 5. Sun & Moon Revolving Position
      const isDayTime = decimalHour >= 6 && decimalHour < 18;
      const arcHour = isDayTime ? decimalHour - 6 : (decimalHour >= 18 ? decimalHour - 18 : decimalHour + 6);
      const angle = (arcHour / 12) * Math.PI;

      const radius = 24;
      const tX = Math.cos(Math.PI - angle) * radius;
      const tY = Math.sin(angle) * radius - 10;
      const tZ = -16;

      dirLight.position.set(tX + 5, tY + 8, tZ);
      sunMoonGroup.position.set(tX, tY, tZ);

      if (isDayTime) {
        sunMoonMat.color.setHex(0xffea00); // golden sun
        sunMoonGroup.scale.setScalar(1.0 + 0.03 * Math.sin(elapsedTime * 3));
        sunGlowMat.color.setHex(0xffea00);
        sunGlow.visible = true;
      } else {
        sunMoonMat.color.setHex(0xe0f7fa); // pale moon
        sunMoonGroup.scale.setScalar(0.75);
        sunGlow.visible = false;
      }

      // 6. Camera scroll & hover lerp parallax
      const scrollOffset = -scrollYFraction.current * 4.5;
      const camTargetX = targetCameraX.current;
      const camTargetY = scrollOffset + targetCameraY.current;

      camera.position.x += (camTargetX - camera.position.x) * 0.05;
      camera.position.y += (camTargetY - camera.position.y) * 0.05;

      camera.lookAt(0, scrollOffset - 1.5, 0);

      // 7. Birds altitude flutter
      birdsRef.current.forEach((b) => {
        if (b.position.x > -25 && b.position.x < 25) {
          b.position.y += Math.sin(elapsedTime * 2.5 + b.position.x) * 0.01;
        }
      });

      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(tick);
    };

    tick();

    // ─── Handle Resize ────────────────────────────────────────────────
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── Cleanup ─────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(ambienceTimer);
      clearTimeout(gustTimer);
      clearTimeout(birdFlockTimer);

      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      gsap.killTweensOf('*');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="3d-background-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        pointerEvents: 'none',
        overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,1) 60%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.8) 45%, rgba(0,0,0,1) 60%)',
      }}
    />
  );
};

export default LivingBackground;
