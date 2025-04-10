import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const ThreeAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene / Camera Setup
    const scene = new THREE.Scene();
    const { clientWidth, clientHeight } = mountRef.current;

    // Camera control
    const camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(clientWidth, clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    let laptop: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    // Load the FBX Model
    const loader = new FBXLoader();
    loader.load(
      "/models/laptop.fbx",
      (fbx) => {
        // bounding box size
        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3()).length();
        // const center = box.getCenter(new THREE.Vector3());

        // Scale
        const desiredSize = 5;
        if (size > 0) {
          const scaleFactor = desiredSize / size;
          fbx.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }

        // Recompute bounding box and center the model horizontally
        const scaledBox = new THREE.Box3().setFromObject(fbx);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        fbx.position.sub(scaledCenter);

        // Shift upward so the bottom sits near y=0
        const minY = scaledBox.min.y;
        fbx.position.y -= minY;

        // Store a reference to rotate the laptop later
        laptop = fbx;
        scene.add(fbx);

        // If the model has animations, set them up
        if (fbx.animations && fbx.animations.length > 0) {
          mixer = new THREE.AnimationMixer(fbx);
          const action = mixer.clipAction(fbx.animations[0]);
          action.play();
        }
      },
      undefined, // omit progress callback
      (error) => {
        console.error("Error loading FBX model:", error);
      }
    );

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      if (laptop) {
        laptop.rotation.y += 0.005; // Speed
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeAnimation;
