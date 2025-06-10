"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

interface OrbProps {
    totalImages?: number;
    totalItems?: number;
    baseWidth?: number;
    baseHeight?: number;
    sphereRadius?: number;
    backgroundColor?: string;
    className?: string;
    style?: React.CSSProperties;
}

const Orb: React.FC<OrbProps> = ({
    totalImages = 30,
    totalItems = 100,
    baseWidth = 1,
    baseHeight = 0.6,
    sphereRadius = 5,
    backgroundColor = "#3b3b3b",
    className = "",
    style = {},
}) => {
    const orbRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);

    useEffect(() => {
        if (!orbRef.current) return;

        // Initialize scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Initialize camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        cameraRef.current = camera;

        // Initialize renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
        });
        rendererRef.current = renderer;
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(backgroundColor);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        const currentOrbRef = orbRef.current;
        currentOrbRef.appendChild(renderer.domElement);

        // Initialize controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 1.2;
        controls.minDistance = 6;
        controls.maxDistance = 10;
        controls.enableZoom = true;
        controls.enablePan = false;

        const loadingManager = new THREE.LoadingManager(
            // onLoad
            () => {
                console.log('All textures loaded successfully');
                animate();
            },
            // onProgress
            (url, itemsLoaded, itemsTotal) => {
                console.log(`Loading texture: ${itemsLoaded}/${itemsTotal}`);
            },
            // onError
            (url) => {
                console.error('Error loading texture:', url);
            }
        );

        const textureLoader = new THREE.TextureLoader(loadingManager);

        const imageFiles = [
            'album_art.jpg',
            'blue.png',
            'green.png',
            'imagination.png',
            'no place.png',
            'take your time.png',
            'wind and sound.png',
            'creative_direction.png',
            'event_design.png',
        ];

        const getRandomImagePath = () => {
            const randomIndex = Math.floor(Math.random() * imageFiles.length);
            return `/images/${imageFiles[randomIndex]}`;
        };

        const createImagePlane = (texture: THREE.Texture) => {
            const imageAspect = texture.image.width / texture.image.height;
            let width = baseWidth;
            let height = baseHeight;

            if (imageAspect > 1) {
                height = width / imageAspect;
            } else {
                width = height * imageAspect;
            }

            return new THREE.PlaneGeometry(width, height);
        };

        const loadImageMesh = (phi: number, theta: number) => {
            const handleTextureLoad = (texture: THREE.Texture) => {
                    texture.generateMipmaps = false;
                    texture.magFilter = THREE.LinearFilter;
                    texture.minFilter = THREE.LinearFilter;
                    texture.colorSpace = THREE.SRGBColorSpace;

                    const geometry = createImagePlane(texture);
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                        transparent: false,
                        depthWrite: true,
                        depthTest: true,
                        //encoding: THREE.LinearEncoding,
                    });
                    const mesh = new THREE.Mesh(geometry, material);

                    mesh.position.x = sphereRadius * Math.cos(theta) * Math.sin(phi);
                    mesh.position.y = sphereRadius * Math.sin(theta) * Math.sin(phi);
                    mesh.position.z = sphereRadius * Math.cos(phi);

                    mesh.lookAt(0, 0, 0);
                    mesh.rotateY(Math.PI);

                    scene.add(mesh);

                    // Animation will be triggered by LoadingManager's onLoad callback
                };

            const handleTextureError = (error: ErrorEvent) => {
                console.error("Error loading texture:", error);
                // Try loading a different image on error
                const currentPath = getRandomImagePath();
                const remainingImages = imageFiles.filter(img => `/images/${img}` !== currentPath);
                if (remainingImages.length > 0) {
                    const fallbackPath = `/images/${remainingImages[0]}`;
                    textureLoader.load(fallbackPath, handleTextureLoad, undefined, (secondError) => {
                        console.error("Fallback texture also failed:", secondError);
                    });
                }
            };

            textureLoader.load(getRandomImagePath(), handleTextureLoad, undefined, (err: unknown) => handleTextureError(err as ErrorEvent));
        };

        const createSphere = () => {
            for (let i = 0; i < totalItems; i++) {
                const phi = Math.acos(-1 + (2 * i) / totalItems);
                const theta = Math.sqrt(totalItems * Math.PI) * phi;
                loadImageMesh(phi, theta);
            }
        };

        cameraRef.current.position.z = 10;

        let animationFrameId: number;

        const animate = () => {
            if (!controlsRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;
            
            controlsRef.current.update();
            rendererRef.current.render(sceneRef.current, cameraRef.current);
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            if (!rendererRef.current || !cameraRef.current) return;

            rendererRef.current.setSize(width, height);
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
        };

        window.addEventListener("resize", handleResize);
        createSphere();

        return () => {
            // Cancel animation frame
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);

            // Store refs in local variables to ensure they don't change during cleanup
            const scene = sceneRef.current;
            const renderer = rendererRef.current;
            const controls = controlsRef.current;
            const currentOrbRef = orbRef.current;

            // Cleanup Three.js resources
            if (scene) {
                scene.traverse((object: THREE.Object3D) => {
                    if (object instanceof THREE.Mesh) {
                        if (object.geometry) object.geometry.dispose();
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else if (object.material) {
                            object.material.dispose();
                        }
                    }
                });
            }

            if (renderer && currentOrbRef) {
                renderer.dispose();
                currentOrbRef.removeChild(renderer.domElement);
            }

            if (controls) {
                controls.dispose();
            }

            // Clear refs
            sceneRef.current = null;
            rendererRef.current = null;
            cameraRef.current = null;
            controlsRef.current = null;
        }
    }, [
        totalImages,
        totalItems,
        baseWidth,
        baseHeight,
        sphereRadius,
        backgroundColor,
    ]);

    return <div ref={orbRef} className={`orb ${className}`} style={style}></div>;
};

export default Orb;