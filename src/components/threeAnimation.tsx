// components/ThreeAnimation.tsx
import { useEffect, useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function LaptopModel({ scrollY }: { scrollY: number }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/laptop.glb");
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const clipDuration = animations[0]?.duration || 0;
  const maxScroll = 600;

  useEffect(() => {
    if (!group.current) return;

    const model = scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const minY = new THREE.Box3().setFromObject(model).min.y;
    model.position.y -= minY;

    const scaleFactor = 6 / size;
    model.scale.setScalar(scaleFactor);

    group.current.add(model);

    mixer.current = new THREE.AnimationMixer(model);
    const action = mixer.current.clipAction(animations[0]);
    action.reset().play();

    // Start animation fra frame 109
    const fps = 24;
    const oneFrameTime = 1 / fps;
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
        camera={{ position: [0, 2.1, 3.5], fov: 75 }}
        gl={{ alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={1} />
        <directionalLight intensity={1} position={[5, 15, 7.5]} />
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
