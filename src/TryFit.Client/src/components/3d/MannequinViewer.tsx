import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { ClothingItem, ClothingCategory } from '../../types';
import { 
  RotateCw, 
  Eye, 
  Sparkles, 
  UserCheck,
  Ruler,
  Layers
} from 'lucide-react';

interface MannequinViewerProps {
  heightCm: number;
  weightKg: number;
  outfitItems: ClothingItem[];
  skinTone?: string;
  onSelectItem?: (category: ClothingCategory) => void;
  customMeasurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
  };
}

export const MannequinViewer: React.FC<MannequinViewerProps> = ({
  heightCm,
  weightKg,
  outfitItems,
  customMeasurements,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const mannequinModelRef = useRef<THREE.Object3D | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const lengthGuideRef = useRef<THREE.Group | null>(null);

  // Controls
  const [autoRotate, setAutoRotate] = useState(false);
  const [activeView, setActiveView] = useState<'front' | 'angle45' | 'side' | 'back'>('front');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showRings, setShowRings] = useState(true);
  const [showLengthGuide, setShowLengthGuide] = useState(true);
  const [mannequinSource, setMannequinSource] = useState<string>('/models/mannequin.glb');
  const [hasMorphTargets, setHasMorphTargets] = useState(false);

  // Derived anthropometric measurements
  const estimatedChest = customMeasurements?.chest || Math.round(heightCm * 0.52 + (weightKg - 50) * 0.7);
  const estimatedWaist = customMeasurements?.waist || Math.round(heightCm * 0.40 + (weightKg - 50) * 0.6);
  const estimatedHips = customMeasurements?.hips || Math.round(heightCm * 0.56 + (weightKg - 50) * 0.8);

  // Active garment for length guide
  const activeGarment = outfitItems[0] || null;

  // 1. Setup Three.js Scene, Camera, High-End Renderer & Poly Haven HDRI
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070b16');

    // Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.30, 3.8);

    // Renderer (ACESFilmic + SRGBColorSpace)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.replaceChildren(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.02;
    controls.minDistance = 1.2;
    controls.maxDistance = 5.0;
    controls.target.set(0, 0.95, 0);
    controlsRef.current = controls;

    // Poly Haven HDRI Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      '/textures/studio.hdr',
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
      },
      undefined,
      () => {
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1a2035, 1.5);
        scene.add(hemiLight);
      }
    );

    // Studio Directional Light with Soft Shadows
    const dirLight = new THREE.DirectionalLight('#fffaf0', 2.6);
    dirLight.position.set(2.4, 4.2, 2.8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    dirLight.shadow.radius = 3.5;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight('#f27a1a', 1.8);
    rimLight.position.set(-2.5, 3.0, -2.5);
    scene.add(rimLight);

    // Luxury Runway Podium
    const podiumGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.05, 64);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: '#0e1628',
      roughness: 0.25,
      metalness: 0.8,
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = 0.025;
    podium.receiveShadow = true;
    scene.add(podium);

    const goldRingGeo = new THREE.TorusGeometry(0.86, 0.012, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      metalness: 0.88,
      roughness: 0.2,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = 0.05;
    scene.add(goldRing);

    // Mannequin Parent Group
    const mannequinGroup = new THREE.Group();
    mannequinGroup.position.y = 0.05;
    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    // Measurement Rings Group
    const ringsGroup = new THREE.Group();
    mannequinGroup.add(ringsGroup);
    ringsGroupRef.current = ringsGroup;

    // Length Guide Group
    const lengthGuideGroup = new THREE.Group();
    mannequinGroup.add(lengthGuideGroup);
    lengthGuideRef.current = lengthGuideGroup;

    // Build 3D Measurement Rings (Chest, Waist, Hips)
    buildMeasurementRings(ringsGroup);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (autoRotate && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 2.0;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Helper to construct anatomical 3D measurement rings
  const buildMeasurementRings = (parent: THREE.Group) => {
    parent.clear();

    const ringMatChest = new THREE.MeshBasicMaterial({
      color: '#f97316',
      transparent: true,
      opacity: 0.75,
      wireframe: true,
    });
    const ringMatWaist = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.75,
      wireframe: true,
    });
    const ringMatHips = new THREE.MeshBasicMaterial({
      color: '#10b981',
      transparent: true,
      opacity: 0.75,
      wireframe: true,
    });

    // Göğüs Çizgisi (Y ~ 1.24)
    const chestRing = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.005, 12, 48), ringMatChest);
    chestRing.rotation.x = Math.PI / 2;
    chestRing.position.y = 1.24;
    chestRing.name = 'ring_chest';
    parent.add(chestRing);

    // Bel Çizgisi (Y ~ 1.02)
    const waistRing = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.005, 12, 48), ringMatWaist);
    waistRing.rotation.x = Math.PI / 2;
    waistRing.position.y = 1.02;
    waistRing.name = 'ring_waist';
    parent.add(waistRing);

    // Kalça Çizgisi (Y ~ 0.88)
    const hipsRing = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.005, 12, 48), ringMatHips);
    hipsRing.rotation.x = Math.PI / 2;
    hipsRing.position.y = 0.88;
    hipsRing.name = 'ring_hips';
    parent.add(hipsRing);
  };

  // Toggle Visibility of Measurement Rings
  useEffect(() => {
    if (ringsGroupRef.current) {
      ringsGroupRef.current.visible = showRings;
    }
  }, [showRings]);

  // Update Length Guide Marker based on Active Garment
  useEffect(() => {
    if (!lengthGuideRef.current) return;
    const group = lengthGuideRef.current;
    group.clear();

    if (!showLengthGuide || !activeGarment) return;

    // Calculate height marker position based on garment category / type
    let guideY = 0.90; // Default hip level
    let guideColor = '#fb923c';

    const t = activeGarment.title.toLowerCase();
    if (activeGarment.category === 'Outerwear' || t.includes('trençkot') || t.includes('kaban')) {
      guideY = 0.50; // Knee / below knee
      guideColor = '#fbbf24';
    } else if (activeGarment.category === 'Dress') {
      guideY = t.includes('mini') ? 0.65 : 0.45;
      guideColor = '#f43f5e';
    } else if (activeGarment.category === 'Bottom' || t.includes('jean') || t.includes('pantolon')) {
      guideY = 0.12; // Ankle
      guideColor = '#60a5fa';
    } else if (t.includes('crop')) {
      guideY = 1.08; // Upper waist
      guideColor = '#a855f7';
    }

    const ringGeo = new THREE.RingGeometry(0.32, 0.33, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: guideColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const guideMesh = new THREE.Mesh(ringGeo, ringMat);
    guideMesh.rotation.x = Math.PI / 2;
    guideMesh.position.y = guideY;
    group.add(guideMesh);
  }, [activeGarment, showLengthGuide]);

  // 2. Load GLTF 3D Human/Mannequin Model
  useEffect(() => {
    if (!mannequinGroupRef.current) return;
    const group = mannequinGroupRef.current;

    if (mannequinModelRef.current) {
      group.remove(mannequinModelRef.current);
      mannequinModelRef.current = null;
    }

    setIsLoaded(false);

    const loader = new GLTFLoader();
    loader.load(
      mannequinSource,
      (gltf) => {
        const model = gltf.scene;

        const bbox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        if (size.y > 0) {
          const targetHeight = 1.70;
          const scale = targetHeight / size.y;
          model.scale.set(scale, scale, scale);
        }

        const updatedBbox = new THREE.Box3().setFromObject(model);
        model.position.y = -updatedBbox.min.y;
        model.position.x = -(updatedBbox.min.x + updatedBbox.max.x) / 2;
        model.position.z = -(updatedBbox.min.z + updatedBbox.max.z) / 2;

        let morphFound = false;
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.morphTargetDictionary && Object.keys(mesh.morphTargetDictionary).length > 0) {
              morphFound = true;
            }
          }
        });

        setHasMorphTargets(morphFound);
        group.add(model);
        mannequinModelRef.current = model;
        setIsLoaded(true);
      },
      undefined,
      (err) => {
        console.warn('Mannequin GLB yüklenirken alternatif deneniyor:', err);
        if (mannequinSource !== '/models/readyplayer.me.glb') {
          setMannequinSource('/models/readyplayer.me.glb');
        }
      }
    );
  }, [mannequinSource]);

  // 3. Slider Binding: Boy & Kilo (Morph Targets or Y / X-Z Scaling)
  useEffect(() => {
    if (!mannequinGroupRef.current || !mannequinModelRef.current) return;

    const baseHeight = 168.0;
    const baseWeight = 58.0;
    const baseBmi = baseWeight / ((baseHeight / 100) * (baseHeight / 100));

    const currentHeight = Math.max(140, Math.min(210, heightCm));
    const currentWeight = Math.max(40, Math.min(130, weightKg));
    const currentBmi = currentWeight / ((currentHeight / 100) * (currentHeight / 100));

    if (hasMorphTargets) {
      mannequinModelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            for (const key of Object.keys(mesh.morphTargetDictionary)) {
              const idx = mesh.morphTargetDictionary[key];
              const lower = key.toLowerCase();
              if (lower.includes('weight') || lower.includes('fat') || lower.includes('heavy')) {
                mesh.morphTargetInfluences[idx] = Math.max(0, Math.min(1, (currentWeight - 45) / 50));
              } else if (lower.includes('thin') || lower.includes('slim')) {
                mesh.morphTargetInfluences[idx] = Math.max(0, Math.min(1, (65 - currentWeight) / 25));
              } else if (lower.includes('height') || lower.includes('tall')) {
                mesh.morphTargetInfluences[idx] = Math.max(0, Math.min(1, (currentHeight - 160) / 30));
              }
            }
          }
        }
      });
    }

    const scaleY = currentHeight / baseHeight;
    const bmiFactor = currentBmi / baseBmi;
    const scaleX = Math.pow(bmiFactor, 0.45);
    const scaleZ = Math.pow(bmiFactor, 0.40);

    mannequinGroupRef.current.scale.set(scaleX, scaleY, scaleZ);
  }, [heightCm, weightKg, hasMorphTargets, isLoaded]);

  const setCameraAngle = (angle: 'front' | 'angle45' | 'side' | 'back') => {
    if (!controlsRef.current) return;
    setActiveView(angle);
    if (angle === 'front') {
      controlsRef.current.object.position.set(0, 1.30, 3.8);
    } else if (angle === 'angle45') {
      controlsRef.current.object.position.set(2.6, 1.30, 2.6);
    } else if (angle === 'side') {
      controlsRef.current.object.position.set(3.8, 1.30, 0);
    } else if (angle === 'back') {
      controlsRef.current.object.position.set(0, 1.30, -3.8);
    }
    controlsRef.current.target.set(0, 0.95, 0);
    controlsRef.current.update();
  };

  const resetCamera = () => {
    setCameraAngle('front');
  };

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a101f] to-slate-950 border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Top Left: Model & Lighting Status Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-700/70 shadow-xl">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>3D Beden Simülatörü</span>
          </div>
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-bold">
            Studio HDRI
          </span>
        </div>

        {/* Anatomical Measurements Floating Pill */}
        {showRings && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl text-[11px] shadow-xl space-y-1 animate-in fade-in">
            <div className="flex items-center justify-between gap-4 text-orange-400 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Göğüs
              </span>
              <span className="font-mono font-bold text-white">{estimatedChest} cm</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sky-400 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Bel
              </span>
              <span className="font-mono font-bold text-white">{estimatedWaist} cm</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Kalça
              </span>
              <span className="font-mono font-bold text-white">{estimatedHips} cm</span>
            </div>
          </div>
        )}
      </div>

      {/* Top Right: Camera Angles (Ön / 45° / Yan / Arka) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/70 shadow-xl">
        <button
          onClick={() => setCameraAngle('front')}
          className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
            activeView === 'front' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Ön
        </button>
        <button
          onClick={() => setCameraAngle('angle45')}
          className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
            activeView === 'angle45' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          45°
        </button>
        <button
          onClick={() => setCameraAngle('side')}
          className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
            activeView === 'side' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Yan
        </button>
        <button
          onClick={() => setCameraAngle('back')}
          className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
            activeView === 'back' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Arka
        </button>
      </div>

      {/* Layer Toggles: 3D Mezura Halkaları & Uzunluk Kılavuz Çizgisi */}
      <div className="absolute top-20 right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setShowRings(!showRings)}
          className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
            showRings
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>3D Mezura ({showRings ? 'Açık' : 'Kapalı'})</span>
        </button>

        <button
          onClick={() => setShowLengthGuide(!showLengthGuide)}
          className={`px-3 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg backdrop-blur-md ${
            showLengthGuide
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Boy Kılavuzu ({showLengthGuide ? 'Açık' : 'Kapalı'})</span>
        </button>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/70 shadow-2xl">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            autoRotate
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="360 Derece Otomatik Döndür"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>{autoRotate ? 'Durdur' : '360° Döndür'}</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        <button
          onClick={resetCamera}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          title="Kamerayı Sıfırla"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Sıfırla</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        <div className="text-xs text-slate-300 font-mono font-bold px-2 py-1 bg-slate-800/80 rounded-lg flex items-center gap-1">
          <span>{heightCm} cm</span>
          <span className="text-slate-500">•</span>
          <span>{weightKg} kg</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-xl backdrop-blur-md border border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-orange-400" />
        <span>Gerçek insan oranları</span>
      </div>
    </div>
  );
};
export default MannequinViewer;
