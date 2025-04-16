import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Mesh,
  TextureLoader,
  Box3,
  Vector3,
  AnimationMixer,
  PCFSoftShadowMap,
} from "three";

function LaptopModel({ scrollY }) {
  const group = useRef(null);
  const { scene, animations } = useGLTF("/models/laptop.glb");
  const mixer = useRef(null);
  // Load the new texture for the screen. Then fix its orientation.
  const newTexture = useLoader(TextureLoader, "/models/screen.png");
  newTexture.flipY = false; // Correct the upside-down texture.
  
  const clipDuration = animations[0]?.duration || 0;
  const maxScroll = 600;

  useEffect(() => {
    if (!group.current) return;

    // Center and scale the model.
    const model = scene;
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());
    model.position.sub(center);
    const minY = new Box3().setFromObject(model).min.y;
    model.position.y -= minY;
    const scaleFactor = 6 / size;
    model.scale.setScalar(scaleFactor);

    // Traverse and swap the emissive texture for materials named "Screen".
    model.traverse((child) => {
      if (child instanceof Mesh) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          if (mat.name === "Screen") {
            // Swap the emissiveMap texture with the new texture.
            mat.emissiveMap = newTexture;
            // Lower the emissive intensity so the texture appears less bright.
            mat.emissiveIntensity = 0.5; // Adjust this value as needed.
            mat.needsUpdate = true;
            console.log(
              `Swapped emissive texture for material: ${mat.name} on mesh: ${child.name}`
            );
          }
        });
      }
    });

    group.current.add(model);

    // Initialize the animation mixer and play the animation.
    mixer.current = new AnimationMixer(model);
    const action = mixer.current.clipAction(animations[0]);
    action.reset().play();

    // Start the animation near the end of the clip.
    const fps = 24;
    const oneFrameTime = 1 / fps;
    mixer.current.setTime(clipDuration - oneFrameTime);
  }, [scene, newTexture]);

  useFrame((_, delta) => {
    if (!mixer.current || !animations.length) return;
    const currentProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
    const easedProgress = 1 - Math.pow(1 - currentProgress, 2);
    const oneFrameTime = 1 / 24;
    const adjustedDuration = clipDuration - oneFrameTime;
    const newTime = (1 - easedProgress) * adjustedDuration;
    mixer.current.setTime(newTime);
    mixer.current.update(delta);
  });

  return <group ref={group} rotation={[0, -Math.PI / 6, 0]} />;
}

export default function ThreeAnimation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0.4, 2.7, 4.7], fov: 70 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight
          intensity={5}
          position={[5, 15, 7.5]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
          shadow-normalBias={0.05}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        {[0, 2, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 3;
          return (
            <spotLight
              key={i}
              position={[4 * Math.cos(angle), 3, 4 * Math.sin(angle)]}
              intensity={5}
              angle={Math.PI / 6}
              penumbra={0.2}
              decay={2}
              distance={10}
              target-position={[0, 0, 0]}
              castShadow
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
              shadow-bias={-0.001}
              shadow-camera-near={1}
              shadow-camera-far={20}
            />
          );
        })}
        <Suspense fallback={null}>
          <LaptopModel scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  );
}
