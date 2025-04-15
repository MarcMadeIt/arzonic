import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.innerHTML = "";

    // Scene / Camera Setup
    const scene = new THREE.Scene();
    scene.background = null;
    const { clientWidth, clientHeight } = mountRef.current;
    const camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    // Camera Position
    camera.position.set(0, 2.1, 3.5);
    camera.lookAt(0.618, 0, 0);

    //Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // three spotlights arranged 120° apart.
    const spotlightRadius = 4;
    const spotlightHeight = 3;
    const spotlightAngles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
    spotlightAngles.forEach((angle) => {
      const x = spotlightRadius * Math.cos(angle);
      const z = spotlightRadius * Math.sin(angle);
      const spotlight = new THREE.SpotLight(0xffffff, 5);
      spotlight.position.set(x, spotlightHeight, z);

      // spotlight parameters.
      spotlight.angle = Math.PI / 6; // Spotlight cone (30°)
      spotlight.penumbra = 0.2;
      spotlight.decay = 2;
      spotlight.distance = 10;

      // Target
      spotlight.target.position.set(0, 0, 0);
      scene.add(spotlight);
      scene.add(spotlight.target);
    });

    // Create a pivot group for centering the model.
    const pivot = new THREE.Group();
    pivot.rotation.y = -Math.PI / 4;
    scene.add(pivot);

    // Animation control.
    let mixer: THREE.AnimationMixer | null = null;
    let clipDuration = 0;
    const maxScroll = 600;

    // Scroll Event Handling
    const onScroll = () => {
      const scrollY = window.scrollY;
      const currentProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
      
      // Apply ease-out quadratic easing
      // easeOutQuad(t) = 1 - (1 - t)^2
      const easedProgress = 1 - Math.pow(1 - currentProgress, 2);
      
      // Calculate one frame's time at 24fps.
      const oneFrameTime = 1 / 24; // ≈0.04167 seconds
      
      // Adjust the duration so that the top state is one frame earlier.
      const adjustedDuration = clipDuration - oneFrameTime;
      const newTime = (1 - easedProgress) * adjustedDuration;
      
      if (mixer && adjustedDuration > 0) {
        mixer.setTime(newTime);
      }
    };
    

    window.addEventListener("scroll", onScroll);

    // Load the GLB Model
    const loader = new GLTFLoader();
    loader.load(
      "/models/laptop.glb",
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.updateMatrixWorld(true);
        const newBox = new THREE.Box3().setFromObject(model);
        const minY = newBox.min.y;
        model.position.y -= minY;

        // Model scale
        const desiredSize = 5;
        if (size > 0) {
          const scaleFactor = desiredSize / size;
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        }

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => {
                mat.side = THREE.DoubleSide;
                mat.needsUpdate = true;
                if (mat.map) {
                  mat.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                  mat.map.minFilter = THREE.LinearMipMapLinearFilter;
                  mat.map.magFilter = THREE.LinearFilter;
                  mat.map.encoding = THREE.sRGBEncoding;
                  mat.map.needsUpdate = true;
                }
              });
            } else if (mesh.material) {
              mesh.material.side = THREE.DoubleSide;
              mesh.material.needsUpdate = true;
              if (mesh.material.map) {
                mesh.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
                mesh.material.map.minFilter = THREE.LinearMipMapLinearFilter;
                mesh.material.map.magFilter = THREE.LinearFilter;
                mesh.material.map.encoding = THREE.sRGBEncoding;
                mesh.material.map.needsUpdate = true;
              }
            }
          }
        });

        pivot.add(model);

        // Setup animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.reset();
          action.play();
          clipDuration = gltf.animations[0].duration;
          // Calculate the time corresponding to one frame (assuming 24 fps).
          const fps = 24;
          const oneFrameTime = 1 / fps;

          // Set the animation to start at frame 109 instead of frame 110.
          mixer.setTime(clipDuration - oneFrameTime);
          onScroll();
        }
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
      }
    );

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Responsive Handling
    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default ThreeAnimation;

