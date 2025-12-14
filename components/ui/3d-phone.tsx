"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    useGLTF,
    PresentationControls,
    Environment,
    ContactShadows,
    Html,
    Float,
    PerspectiveCamera,
    useProgress,
    MeshTransmissionMaterial
} from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white font-bold text-lg tracking-wider">YÜKLENİYOR</p>
                <p className="text-primary text-sm font-mono mt-1">IPHONE 17 PRO MAX</p>
                <div className="w-32 h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </Html>
    );
}

// Procedural Phone Model to avoid external dependency breakage
function ProceduralPhone(props: any) {
    const mesh = useRef<THREE.Group>(null);

    // Animate floating gently
    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, Math.cos(t / 2) / 10 + 0.1, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, Math.sin(t / 4) / 10 + 0.1, 0.1); // Gentle idle rotation
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, (-2 + Math.sin(t / 1.5)) / 10, 0.1);
    });

    return (
        <group ref={mesh} {...props} dispose={null}>
            {/* Titanium Frame */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3.2, 6.8, 0.35]} />
                <meshStandardMaterial
                    color="#5a5a5a"
                    metalness={1}
                    roughness={0.2}
                    envMapIntensity={1.5}
                />
            </mesh>

            {/* Screen (Black Glass) */}
            <mesh position={[0, 0, 0.18]}>
                <planeGeometry args={[3.05, 6.65]} />
                <meshPhysicalMaterial
                    color="#000000"
                    metalness={0.5}
                    roughness={0}
                    clearcoat={1}
                    clearcoatRoughness={0}
                />
            </mesh>

            {/* Screen Content (Simulated Dynamic Island & UI) */}
            <mesh position={[0, 2.8, 0.181]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
                <meshBasicMaterial color="black" />
            </mesh>

            {/* Dynamic Island Glow */}
            <mesh position={[0, 2.8, 0.1805]}>
                <planeGeometry args={[0.8, 0.3]} />
                <meshBasicMaterial color="#000" />
            </mesh>

            {/* Screen Wallpaper Glow - subtle gradient */}
            <mesh position={[0, -0.5, 0.179]}>
                <planeGeometry args={[3.0, 5.5]} />
                <meshBasicMaterial color="#1a1a1a" transparent opacity={0.9} />
            </mesh>

            {/* Back Glass (Frosted) */}
            <mesh position={[0, 0, -0.18]}>
                <boxGeometry args={[3.15, 6.75, 0.05]} />
                <meshPhysicalMaterial
                    color="#1d1d1f" // Dark Titanium color
                    metalness={0.4}
                    roughness={0.7}
                    clearcoat={0.5}
                    clearcoatRoughness={0.1}
                />
            </mesh>

            {/* Camera Bump Base */}
            <mesh position={[0.9, 2.3, -0.22]}>
                <boxGeometry args={[1.2, 1.2, 0.1]} />
                <meshStandardMaterial color="#2d2d2f" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Lenses */}
            {[0, 1, 2].map((i) => {
                const pos = [
                    [0.7, 2.6, -0.28], // Top Left
                    [0.7, 2.0, -0.28], // Bottom Left
                    [1.2, 2.3, -0.28]  // Right Center
                ][i] as [number, number, number];

                return (
                    <group key={i} position={pos}>
                        {/* Ring */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
                            <meshStandardMaterial color="#4a4a4a" metalness={1} roughness={0.1} />
                        </mesh>
                        {/* Lens Glass */}
                        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                            <cylinderGeometry args={[0.18, 0.18, 0.02, 32]} />
                            <meshPhysicalMaterial
                                color="#111"
                                metalness={0}
                                roughness={0}
                                transmission={0.5}
                                thickness={0.5}
                            />
                        </mesh>
                        {/* Inner Lens Reflection */}
                        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
                            <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
                            <meshBasicMaterial color="#132c4a" opacity={0.5} transparent />
                        </mesh>
                    </group>
                )
            })}

            {/* Side Buttons */}
            <mesh position={[1.61, 1.5, 0]}>
                <boxGeometry args={[0.05, 0.8, 0.05]} />
                <meshStandardMaterial color="#444" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[-1.61, 1.5, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.05]} />
                <meshStandardMaterial color="#444" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[-1.61, 0.8, 0]}>
                <boxGeometry args={[0.05, 0.4, 0.05]} />
                <meshStandardMaterial color="#444" metalness={1} roughness={0.2} />
            </mesh>

        </group>
    );
}

export default function PhoneExperience() {
    return (
        <div className="w-full h-[600px] md:h-[700px] flex items-center justify-center relative z-20">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
                <fog attach="fog" args={['#050505', 10, 20]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />

                {/* Colorful cinematic lights */}
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#3b82f6" /> {/* Blue rim light */}
                <pointLight position={[10, 10, -10]} intensity={1.5} color="#a855f7" />   {/* Purple rim light */}
                <pointLight position={[0, 5, 5]} intensity={1} color="#ffffff" />          {/* Key light */}

                <PresentationControls
                    global

                    snap={{ mass: 4, tension: 1500 } as any}
                    rotation={[0, 0.3, 0]}
                    polar={[-Math.PI / 4, Math.PI / 4]}
                    azimuth={[-Math.PI / 4, Math.PI / 4]}
                >
                    <Float rotationIntensity={0.4}>
                        <React.Suspense fallback={<Loader />}>
                            <ProceduralPhone rotation={[0, -0.2, 0]} />
                        </React.Suspense>
                    </Float>
                </PresentationControls>

                <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
                <Environment preset="city" />
            </Canvas>

            {/* Decorative Overlays */}
            <div className="absolute bottom-10 right-10 pointer-events-none animate-pulse-slow">
                <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-white/50">
                    INTERACTIVE 3D VIEW
                </div>
            </div>
        </div>
    );
}
