'use client';

/**
 * Home page — wires together:
 *   - WebGL slider (full screen base layer)
 *   - Nav (persistent left rail on desktop, bottom bar on mobile)
 *   - InfoPanel (slide-in drawer triggered by nav)
 *
 * Your existing section components (AboutMe, ExperienceSec, Contact)
 * drop straight into InfoPanel as children — no changes needed to them.
 *
 * Add this to your layout or _app if not already present:
 *   <link rel="preconnect" href="https://fonts.googleapis.com" />
 *   <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet" />
 */

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import Nav from './components/navigation';
//import InfoPanel from './components/info-panel';
import AboutMe from './components/about-me';
import ExperienceSec from './components/experience-sec';
import Contact from './components/contact';

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = 'about' | 'experience' | 'contact';

// ─── Slide data ───────────────────────────────────────────────────────────────

const slides = [
  { name: 'Contour',        img: '/images/orb/album_art.jpg' },
  { name: 'Velum Drift',    img: '/images/orb/blue.png' },
  { name: 'Quiet Exchange', img: '/images/orb/butterfly.png' },
  { name: 'Earth Routine',  img: '/images/orb/creative_direction.png' },
  { name: 'Metal Echo',     img: '/images/orb/event_design.png' },
  { name: 'Tanned Edge',    img: '/images/orb/green.png' },
  { name: 'Humidity',       img: '/images/orb/imagination.png' },
  { name: 'Limestone Air',  img: '/images/orb/no place.png' },
  { name: 'Warm Surface',   img: '/images/orb/take your time.png' },
  { name: 'Dust & Craft',   img: '/images/orb/wind and sound.png' },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const config = {
  minHeight:           1,
  maxHeight:           1.5,
  aspectRatio:         1.5,
  gap:                 0.05,
  smoothing:           0.05,
  distortionStrength:  2.5,
  distortionSmoothing: 0.1,
  momentumFriction:    0.95,
  momentumThreshold:   0.001,
  wheelSpeed:          0.01,
  wheelMax:            150,
  dragSpeed:           0.01,
  dragMomentum:        0.01,
  touchSpeed:          0.01,
  touchMomentum:       0.1,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const wrap    = (value: number, range: number) => ((value % range) + range) % range;
//const zeroPad = (n: number) => String(n).padStart(2, '0');

// ─── Pre-compute slide layout ─────────────────────────────────────────────────

const totalSlides  = slides.length;

const slideHeights = Array.from(
  { length: totalSlides },
  () => config.minHeight + Math.random() * (config.maxHeight - config.minHeight),
);

const slideOffsets: number[] = [];
{
  let cursor = 0;
  for (let i = 0; i < totalSlides; i++) {
    const halfH = slideHeights[i] / 2;
    slideOffsets.push(cursor + halfH);
    cursor += slideHeights[i] + config.gap;
  }
}

const loopLength = slideOffsets[totalSlides - 1]
  + slideHeights[totalSlides - 1] / 2
  + config.gap
  + slideHeights[0] / 2;
const halfLoop = loopLength / 2;

// ─── Distortion ───────────────────────────────────────────────────────────────

function applyDistortion(
  mesh:      THREE.Mesh,
  original:  number[],
  positionY: number,
  strength:  number,
) {
  const positions = mesh.geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < positions.count; i++) {
    const x        = original[i * 3];
    const y        = original[i * 3 + 1];
    const distance = Math.sqrt(x * x + (positionY + y) ** 2);
    const falloff  = Math.max(0, 1 - distance / 2);
    const bend     = Math.pow(Math.sin((falloff * Math.PI) / 2), 1.5);
    positions.setZ(i, bend * strength);
  }
  positions.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rendererRef  = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef     = useRef<THREE.Scene | null>(null);
  const cameraRef    = useRef<THREE.PerspectiveCamera | null>(null);

  //const [setActiveIndex]  = useState(0);
  const [activePanel,  setActivePanel]  = useState<Section | null>(null);

  // Add at the top of your component
  const [isMobile, setIsMobile] = useState(false);


  // ── Three.js setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let isIdle = false;
    let idleTimeout: ReturnType<typeof setTimeout> | null = null;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Meshes
    const meshes: THREE.Mesh[] = [];
    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < totalSlides; i++) {
      const height   = slideHeights[i];
      const width    = height * config.aspectRatio;
      const geometry = new THREE.PlaneGeometry(width, height, 32, 16);
      const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0x999999 });
      const mesh     = new THREE.Mesh(geometry, material);

      mesh.userData = {
        originalVertices: [...geometry.attributes.position.array],
        offset:           slideOffsets[i],
        name:             slides[i].name,
        index:            i,
      };

      textureLoader.load(slides[i].img, (texture) => {
        texture.colorSpace   = THREE.SRGBColorSpace;
        material.map         = texture;
        material.color.set(0xffffff);
        material.needsUpdate = true;
        const imageAspect    = texture.image.width / texture.image.height;
        const planeAspect    = width / height;
        const ratio          = imageAspect / planeAspect;
        if (ratio > 1) mesh.scale.y = 1 / ratio;
        else           mesh.scale.x = ratio;
      });

      scene.add(mesh);
      meshes.push(mesh);
    }

    // Scroll state
    let scrollPosition   = 0;
    let scrollTarget     = 0;
    let scrollMomentum   = 0;
    let isScrolling      = false;
    let lastFrameTime    = 0;
    let distortionAmount = 0;
    let distortionTarget = 0;
    let velocityPeak     = 0;
    let scrollDirection  = 0;
    let directionTarget  = 0;
    const velocityHistory = [0, 0, 0, 0, 0];
    let isDragging   = false;
    let dragStartY   = 0;
    let dragDelta    = 0;
    let touchLastY   = 0;
    let touchStartY  = 0;
    let activeSlideIndex = -1;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const addDistortionBurst = (amount: number) => {
      distortionTarget = Math.min(1, distortionTarget + amount);
    };

    // Event listeners
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // run once on mount
    window.addEventListener('resize', checkMobile);
    
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const clamped = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), config.wheelMax);
      addDistortionBurst(Math.abs(clamped) * 0.001);
      scrollTarget  += clamped * config.wheelSpeed;
      isScrolling    = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout  = setTimeout(() => { isScrolling = false; }, 150);
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartY    = e.touches[0].clientY;
      const deltaY   = e.touches[0].clientY - touchLastY;
      touchLastY     = e.touches[0].clientY;
      addDistortionBurst(Math.abs(deltaY) * 0.02);
      scrollTarget  -= deltaY * config.touchSpeed;
      isScrolling    = true;
    };

    const onTouchEnd = () => {
      const swipeVelocity = (touchLastY - touchStartY) * 0.005;
      if (Math.abs(swipeVelocity) > 0.5) {
        scrollMomentum = -swipeVelocity * config.touchMomentum;
        addDistortionBurst(Math.abs(swipeVelocity) * 0.45);
        isScrolling    = true;
        setTimeout(() => { isScrolling = false; }, 800);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging     = true;
      dragStartY     = e.clientY;
      dragDelta      = 0;
      scrollMomentum = 0;
      canvas.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY   = e.clientY - dragStartY;
      dragStartY     = e.clientY;
      dragDelta      = deltaY;
      addDistortionBurst(Math.abs(deltaY) * 0.02);
      scrollTarget  -= deltaY * config.dragSpeed;
      isScrolling    = true;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging     = false;
      canvas.style.cursor = 'grab';
      if (Math.abs(dragDelta) > 2) {
        scrollMomentum = -dragDelta * config.dragMomentum;
        addDistortionBurst(Math.abs(dragDelta) * 0.005);
        isScrolling    = true;
        setTimeout(() => { isScrolling = false; }, 800);
      }
    };

    const onResize = () => {
      const width  = canvas.clientWidth;
      const height = canvas.clientHeight;
      // camera.aspect = width / height;
      // camera.updateProjectionMatrix();
      // renderer.setSize(width, height);

      if (width === 0 || height === 0) return; // guard against collapsed state
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false); // false = don't set canvas CSS size, only buffer
    };

    canvas.style.cursor = 'grab';
    //window.addEventListener('wheel',      onWheel,      { passive: false });
    //only the canvas listens for wheel events
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchend',   onTouchEnd);
    window.addEventListener('mousedown',  onMouseDown);
    window.addEventListener('mousemove',  onMouseMove);
    window.addEventListener('mouseup',    onMouseUp);
    // window.addEventListener('resize',     onResize);
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(canvas); 

    // Animation loop
    function animate(time: number) {
      animationFrameId = requestAnimationFrame(animate);

      const deltaTime      = lastFrameTime ? (time - lastFrameTime) / 1000 : 0.016;
      lastFrameTime        = time;
      const previousScroll = scrollPosition;

      if (isScrolling) {
        scrollTarget   += scrollMomentum;
        scrollMomentum *= config.momentumFriction;
        if (Math.abs(scrollMomentum) < config.momentumThreshold) scrollMomentum = 0;
      }

      scrollPosition += (scrollTarget - scrollPosition) * config.smoothing;

      const frameDelta = scrollPosition - previousScroll;
       // If nothing is moving, skip the render entirely
      const isMoving = Math.abs(frameDelta) > 0.00001 || Math.abs(distortionAmount) > 0.0001;

      if (!isMoving && !isScrolling) {
        if (!isIdle) {
          // Give it a moment to fully settle before going idle
          if (!idleTimeout) {
            idleTimeout = setTimeout(() => {
              isIdle      = true;
              idleTimeout = null;
            }, 150);
          }
        }
        if (isIdle) return; // skip render — nothing to update
      } else {
        // Something is moving — wake up
        isIdle = true;
        if (idleTimeout) {
          clearTimeout(idleTimeout);
          idleTimeout = null;
        }
        isIdle = false;
      }

      if (Math.abs(frameDelta) > 0.00001) directionTarget = frameDelta > 0 ? 1 : -1;
      scrollDirection += (directionTarget - scrollDirection) * 0.08;

      const velocity = Math.abs(frameDelta) / deltaTime;
      velocityHistory.push(velocity);
      velocityHistory.shift();
      const avgVelocity = velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;

      if (avgVelocity > velocityPeak) velocityPeak = avgVelocity;
      const isDecelerating = avgVelocity / (velocityPeak + 0.001) < 0.7 && velocityPeak > 0.5;
      velocityPeak *= 0.99;

      if (velocity > 0.05)
        distortionTarget = Math.max(distortionTarget, Math.min(1, velocity * 0.1));
      if (isDecelerating || avgVelocity < 0.2)
        distortionTarget *= isDecelerating ? 0.95 : 0.855;

      distortionAmount += (distortionTarget - distortionAmount) * config.distortionSmoothing;
      const signedDistortion = distortionAmount * scrollDirection;

      let closestDistance = Infinity;
      let closestIndex    = 0;

      meshes.forEach((mesh) => {
        const { offset } = mesh.userData;
        let y = -(offset - wrap(scrollPosition, loopLength));
        y     = wrap(y + halfLoop, loopLength) - halfLoop;
        mesh.position.y = y;

        if (Math.abs(y) < closestDistance) {
          closestDistance = Math.abs(y);
          closestIndex    = mesh.userData.index;
        }

        if (Math.abs(y) < halfLoop * config.maxHeight) {
          applyDistortion(mesh, mesh.userData.originalVertices, y, config.distortionStrength * signedDistortion);
        }
      });

      if (closestIndex !== activeSlideIndex) {
        activeSlideIndex = closestIndex;
        //setActiveIndex(closestIndex); // drives React state
      }

      renderer.render(scene, camera);
    }

    animate(0);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId); 

      canvas.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
      window.removeEventListener('mousedown',  onMouseDown);
      window.removeEventListener('mousemove',  onMouseMove);
      window.removeEventListener('mouseup',    onMouseUp);
      window.removeEventListener('resize', checkMobile);
      //window.removeEventListener('resize',     onResize);
      resizeObserver.disconnect();
      
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scene.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material?.dispose();
        }
      });

      renderer.dispose();
      sceneRef.current   = null;
      rendererRef.current = null;
      cameraRef.current  = null;
    };
  }, []);

  return (
    <>
      {/* Font import — move to layout.tsx if preferred */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
      `}</style>
       
      <main style={{ 
        display:  'flex', 
        width:    '100vw', 
        height:   '100vh',
        overflow: 'hidden' 
      }}>

        {/* Slider — shrinks when panel opens, hidden on mobile */}
        <section 
          className={isMobile && activePanel ? 'hidden' : 'block'}
          style={{ 
            flex:       1,
            transition: 'flex 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            position:   'relative',
            minWidth:   0, // important — prevents flex blowout
            overflow:   'hidden',
          }}
        >
          <canvas 
            ref={canvasRef} 
            style={{ 
              display:  'block',  // ← removes inline-block gap
              width: '100%', 
              height: '100%' 
            }} 
          />
        </section>

        {/* Layer 2 — Persistent nav */}
        <Nav activePanel={activePanel} onSelect={setActivePanel} />

        {/* Info panel — grows in from the right */}
        <aside
          style={{
            width:      activePanel ? (isMobile ? '100vw' : '480px') : '0px',
            minWidth:   0,
            height:     '100dvh',
            maxHeight:  '100dvh',
            overflowY:  'auto',
            overflowX:  'hidden',
            transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            background: '#fafaf8',
            borderLeft: activePanel ? '1px solid rgba(0,0,0,0.06)' : 'none',
            flexShrink: 0, // prevents it from being squeezed by the slider
          }}
        >
          {/* Delay content render until panel is open to avoid flash */}
          {activePanel && (
            <div style={{ padding: '3rem 2.5rem' }}>
              {activePanel === 'about'      && <AboutMe />}
              {activePanel === 'experience' && <ExperienceSec />}
              {activePanel === 'contact'    && <Contact />}
            </div>
          )}
        </aside>

      </main>
    </>
  );
}