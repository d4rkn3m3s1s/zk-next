"use client";

import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles, Environment, Icosahedron, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "@/components/3d/materials/DitherMaterial";

// --- Original Dithered Shapes Component ---
function Rig() {
    useFrame((state) => {
        state.camera.position.lerp({ x: -state.mouse.x * 2, y: -state.mouse.y * 2, z: 10 }, 0.05)
        state.camera.lookAt(0, 0, 0)
    })
    return null
}

function DitheredShape({ position, color, speed, shape }: { position: [number, number, number], color: string, speed: number, shape: 'box' | 'sphere' | 'torus' | 'octahedron' }) {
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
        if (shape === 'octahedron') return <octahedronGeometry args={[0.8, 0]} />;
        return <torusGeometry args={[0.6, 0.2, 16, 32]} />;
    }

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <Geometry />
                {/* @ts-ignore */}
                <ditherMaterial ref={materialRef} uColor={new THREE.Color(color)} uTime={0} />
            </mesh>
        </Float>
    )
}

// --- Gravity Stars (Animate UI) ---
function GravityStarsBackground({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<any[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            starsRef.current = Array.from({ length: 150 }).map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.7 + 0.1,
                baseOpacity: Math.random() * 0.5 + 0.2,
            }));
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const color = "#a855f7"; // Brand purple

            starsRef.current.forEach(p => {
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    p.vx += (dx / dist) * force * 0.02;
                    p.vy += (dy / dist) * force * 0.02;
                    p.opacity = Math.min(1, p.baseOpacity + force * 0.5);
                } else {
                    p.opacity = Math.max(p.baseOpacity, p.opacity - 0.01);
                }

                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.99;
                p.vy *= 0.99;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.save();
                ctx.shadowColor = color;
                ctx.shadowBlur = 10 * p.opacity;
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            requestAnimationFrame(animate);
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouseMove);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className={cn("absolute inset-0 z-0", className)} />;
}

function HeroScene({ type = "dither" }: { type?: string }) {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden select-none">
            {/* Background Content */}
            <div className="absolute inset-0 z-0">
                {type === "dither" && (
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
                        <EffectComposer>
                            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.4} />
                            <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
                            <Vignette eskil={false} offset={0.1} darkness={1.1} />
                        </EffectComposer>
                    </Canvas>
                )}

                {(type === "stars" || type === "hex") && (
                    <div className="absolute inset-0">
                        <GravityStarsBackground />
                        <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
                            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                            <Sparkles count={30} scale={10} size={2} speed={0.5} color="#a855f7" />
                            <Environment preset="night" />
                        </Canvas>
                    </div>
                )}

                {type === "glass" && (
                    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
                        <color attach="background" args={['#020205']} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} />
                        <Float speed={2} floatIntensity={2}>
                            <Sphere args={[2, 64, 64]}>
                                <MeshDistortMaterial color="#7c3aed" speed={5} distort={0.4} metalness={0.9} roughness={0.1} />
                            </Sphere>
                        </Float>
                        <Environment preset="city" />
                        <EffectComposer>
                            <Bloom intensity={1.5} luminanceThreshold={0.1} />
                            <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
                        </EffectComposer>
                    </Canvas>
                )}
            </div>

            {/* Overlay UI */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,20,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none" />

                <div className="pointer-events-auto p-4 z-30 flex flex-col items-center">
                    <div className="mb-8 relative group cursor-pointer">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <div className="relative px-4 py-1 bg-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center">
                            <span className="text-xs font-mono text-purple-400">
                                SYSTEM.READY :: NEXT_GEN_REPAIR
                            </span>
                        </div>
                    </div>

                    <h1 className="text-7xl md:text-[9rem] font-bold tracking-tighter text-white mb-4 mix-blend-difference leading-[0.8]" style={{ fontFamily: 'monospace' }}>
                        ZK<span className="text-purple-600">.</span>İLETİŞİM
                    </h1>

                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8" />

                    <p className="text-xl md:text-2xl text-slate-400 font-light tracking-wide max-w-2xl mx-auto mb-10 mix-blend-difference">
                        <span className="text-purple-400 font-mono text-sm mr-2">[PREMIUM_SERVICE]</span>
                        Zahmetsiz Çözüm, Kusursuz Hizmet.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                        <Button asChild className="pointer-events-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-mono rounded-full h-14 px-10 tracking-tight text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] transition-all">
                            <Link href="/appointments">RANDEVU AL</Link>
                        </Button>
                        <Button asChild className="pointer-events-auto bg-white hover:bg-slate-200 text-black font-mono rounded-full h-14 px-10 tracking-tight text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] transition-all">
                            <Link href="/shop">MAĞAZAYI KEŞFET</Link>
                        </Button>
                        <Button asChild variant="ghost" className="pointer-events-auto text-slate-400 hover:text-white font-mono rounded-full h-14 px-8 hover:bg-white/5 border border-white/5 backdrop-blur-sm transition-all">
                            <Link href="/contact">İLETİŞİME GEÇ</Link>
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
    );
}

export { HeroScene };
