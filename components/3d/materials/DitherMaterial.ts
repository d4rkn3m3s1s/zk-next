import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const DitherMaterial = shaderMaterial(
    {
        uColor: new THREE.Color(0.2, 0.0, 0.4), // Dark Purple default
        uLightPos: new THREE.Vector3(10, 10, 10),
        uResolution: new THREE.Vector2(0, 0),
        uTime: 0,
    },
    // Vertex Shader
    `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform vec3 uColor;
    uniform vec3 uLightPos;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vPosition;

    float random(vec3 scale, float seed) {
      return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void main() {
      vec3 lightDir = normalize(uLightPos - vPosition);
      float diff = max(dot(vNormal, lightDir), 0.0);
      
      // Dither calculation
      float dither = random(vec3(1.0), uTime);
      
      // Quantize intensity with dither
      float levels = 4.0;
      float intensity = floor((diff + dither * 0.1) * levels) / levels;
      
      // Mix with base color
      vec3 finalColor = uColor * intensity;
      
      // Add a subtle rim light
      float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
      rim = smoothstep(0.6, 1.0, rim);
      finalColor += vec3(0.5, 0.2, 0.8) * rim;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ DitherMaterial });

export { DitherMaterial };
