"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, OrbitControls, Environment, Sphere, Torus, Box } from "@react-three/drei";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import "@/components/3d/materials/DitherMaterial"; // Ensure custom material is registered

// TypeScript definition for custom element
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ditherMaterial: any;
        }
    }
}

function Rig() {
    useFrame((state) => {
        state.camera.position.lerp({ x: -state.mouse.x * 2, y: -state.mouse.y * 2, z: 10 }, 0.05)
        state.camera.lookAt(0, 0, 0)
    })
    return null
}

function DitheredShape({ position, color, speed, shape }: { position: [number, number, number], color: string, speed: number, shape: 'box' | 'sphere' | 'torus' }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.005 * speed;
            meshRef.current.rotation.y += 0.005 * speed;
        }
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
        }
    });

    const Geometry = () => {
        if (shape === 'box') return <boxGeometry args={[1, 1, 1]} />;
        if (shape === 'sphere') return <sphereGeometry args={[0.7, 32, 32]} />;
        return <torusGeometry args={[0.6, 0.2, 16, 32]} />;
    }

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <Geometry />
                {/* @ts-ignore */}
                <ditherMaterial ref={materialRef} uColor={new THREE.Color(color)} />
            </mesh>
        </Float>
    )
}

import { EffectComposer, Bloom, Noise, Vignette, Scanline, Glitch } from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing'

// ... existing imports

function HeroScene() {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 10], fov: 40 }} gl={{ antialias: false }}>
                    <color attach="background" args={['#050505']} />

                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />

                    <DitheredShape position={[0, 0, 0]} color="#7c3aed" speed={1} shape="sphere" />
                    <DitheredShape position={[-3.5, 2, -2]} color="#4c1d95" speed={1.5} shape="box" />
                    <DitheredShape position={[3.5, -2, -2]} color="#e879f9" speed={0.8} shape="torus" />
                    <DitheredShape position={[-2, -3, -5]} color="#06b6d4" speed={2} shape="box" />
                    <DitheredShape position={[4, 3, -4]} color="#d946ef" speed={0.5} shape="sphere" />

                    <Rig />

                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />
                        <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        {/* <Glitch delay={[1.5, 3.5]} duration={[0.6, 1.0]} strength={[0.3, 1.0]} mode={GlitchMode.SPORADIC} active ratio={0.85} /> */}
                        <Scanline density={1.2} opacity={0.05} />
                    </EffectComposer>
                </Canvas>
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none" />

                <div className="pointer-events-auto p-4 z-30 flex flex-col items-center">
                    <div className="mb-8 relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <div className="relative px-4 py-1 bg-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center">
                            <span className="text-xs font-mono text-purple-400">
                                SYSTEM.INIT(v2.0) :: ZK.CORP
                            </span>
                        </div>
                    </div>

                    <h1 className="text-7xl md:text-[9rem] font-bold tracking-tighter text-white mb-4 mix-blend-difference leading-[0.8]" style={{ fontFamily: 'monospace' }}>
                        ZK<span className="text-purple-600">.</span>CORP
                    </h1>

                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8" />

                    <p className="text-xl md:text-2xl text-slate-400 font-light tracking-wide max-w-2xl mx-auto mb-10 mix-blend-difference">
                        <span className="text-purple-400 font-mono text-sm mr-2">[AI_REPAIR]</span>
                        Geleceği Dönüştürüyoruz.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                        <Button asChild className="pointer-events-auto bg-white hover:bg-slate-200 text-black font-mono rounded-full h-14 px-10 tracking-tight text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] transition-all">
                            <Link href="/products">
                                TRY DEMO
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" className="pointer-events-auto text-slate-400 hover:text-white font-mono rounded-full h-14 px-8 hover:bg-white/5 border border-white/5 backdrop-blur-sm transition-all">
                            <Link href="#contact">
                                CONTACT_SALES
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-10 z-20 hidden md:block">
                <div className="text-[10px] font-mono text-white/30 space-y-1">
                    <p>LAT: 34.9082 | LNG: 21.4321</p>
                    <p>SERVER: ONLINE | PING: 12ms</p>
                    <p>RENDER: WEBGL2.0</p>
                </div>
            </div>
        </div>
    )
}

export { HeroScene };
