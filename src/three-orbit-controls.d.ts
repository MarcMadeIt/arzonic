declare module 'three/examples/jsm/controls/OrbitControls' {
    import * as THREE from 'three';
  
    export class OrbitControls extends THREE.EventDispatcher {
      constructor(object: THREE.Camera, domElement?: HTMLElement);
      object: THREE.Camera;
      domElement: HTMLElement | Document;
      enabled: boolean;
      target: THREE.Vector3;
      minDistance: number;
      maxDistance: number;
      minZoom: number;
      maxZoom: number;
      minPolarAngle: number;
      maxPolarAngle: number;
      minAzimuthAngle: number;
      maxAzimuthAngle: number;
      enableDamping: boolean;
      dampingFactor: number;
      enableZoom: boolean;
      zoomSpeed: number;
      enableRotate: boolean;
      rotateSpeed: number;
      enablePan: boolean;
      panSpeed: number;
      screenSpacePanning: boolean;
      keyPanSpeed: number;
      autoRotate: boolean;
      autoRotateSpeed: number;
      update(): void;
      reset(): void;
      dispose(): void;
    }
  }
  