"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Stars } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
import { Color } from "three";

function ParticleSphere(props: any) {
    const ref = useRef<any>();
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#06b6d4" // Cyan-500
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

function GridFloor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20, 20, 20]} />
            <meshStandardMaterial color="#0f172a" wireframe opacity={0.2} transparent />
        </mesh>
    );
}

export default function Scene() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 2]}>
                <fog attach="fog" args={['#000', 1.5, 6]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <ParticleSphere />
                </Float>
                <GridFloor />
            </Canvas>
        </div>
    );
}
