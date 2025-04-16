import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function LaptopModel({ scrollY }: { scrollY: number }) {
  const { scene, animations } = useGLTF("/models/laptop.glb");
  const modelRef = useRef<THREE.Group>(null);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const clipDuration = animations[0]?.duration || 0;
  const maxScroll = 600;

  useEffect(() => {
    if (!modelRef.current) return;

    const model = modelRef.current;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const minY = new THREE.Box3().setFromObject(model).min.y;
    model.position.y -= minY;

    const scaleFactor = 3 / size;
    model.scale.setScalar(scaleFactor);

    mixer.current = new THREE.AnimationMixer(model);
    const action = mixer.current.clipAction(animations[0]);
    action.reset().play();

    const oneFrameTime = 1 / 24;
    mixer.current.setTime(clipDuration - oneFrameTime);
  }, [scene]);

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

  return (
    <primitive object={scene} ref={modelRef} rotation={[0, -Math.PI / 6, 0]} />
  );
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
        camera={{ position: [0.4, 2, 4.7], fov: 70 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        gl={{
          antialias: true,
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <ambientLight intensity={1} />

        <directionalLight
          intensity={3}
          position={[3, 50, 8]}
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
              intensity={7}
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
