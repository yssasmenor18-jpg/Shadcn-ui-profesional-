"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { IsasmendiTitle } from "@/components/ui/isasmendi-title";

export default function WelcomePage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-[100dvh] bg-[#020202] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative selection:bg-white/10">
      {/* Sistema de Nebulosa de Fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] bg-indigo-900/20 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-blue-900/15 blur-[160px] rounded-full"
        />
        <div className="absolute top-[20%] right-[30%] w-1 h-1 bg-white/40 blur-[100px] scale-[100]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-12 cursor-default">
          <IsasmendiTitle />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="w-full bg-white/[0.03] border border-white/5 backdrop-blur-[40px] rounded-[2.5rem] p-10 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="space-y-10 text-center md:text-left">
            <motion.h1 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-light tracking-tight leading-tight"
            >
              BIENVENIDO A <br/>
              <span className="font-bold tracking-[0.2em] text-white/90">ISASMENDI VISIONES</span>
            </motion.h1>

            <div className="space-y-6">
              <motion.p variants={itemVariants} className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                Estimado/a,
              </motion.p>
              
              <motion.p variants={itemVariants} className="text-white/80 text-base md:text-lg leading-relaxed italic">
                Es un honor darle la bienvenida a Isasmendi Visiones, donde no hay sets de grabación ni equipos pesados; solo la pureza de la visión del director traducida a motores de renderizado avanzado para lograr expresar las IDEAS que <span className="text-white font-bold tracking-widest uppercase">"ABREN UN NUEVO CAMINO"</span>.
              </motion.p>

              <motion.div variants={itemVariants} className="py-4 border-y border-white/5">
                <p className="text-white/40 text-xs tracking-[0.5em] uppercase font-bold text-center">
                  La imaginación y la inteligencia artificial
                </p>
              </motion.div>

              <motion.p variants={itemVariants} className="text-white/60 text-sm md:text-base leading-relaxed tracking-wide">
                Lo que está a punto de ver no fue grabado con cámaras, ni iluminado con focos físicos. Es el resultado de someter la Inteligencia Artificial a la más estricta dirección de fotografía. Cada fotograma, cada lente emulado y cada atmósfera ha sido esculpido mediante precisión léxica y comandos técnicos que desafían los límites de la realidad. Prepárese para explorar la anatomía exacta detrás de cada creación.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="pt-8 flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] mb-1">
                  Firma
                </p>
                <p className="text-white/80 text-sm font-medium tracking-widest uppercase italic border-b border-white/10 pb-1">
                  Isasmendi Ecosystem
                </p>
              </div>

              <Link href="/" className="w-full">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,1)", color: "#000", boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black py-5 rounded-2xl font-bold tracking-[0.15em] uppercase text-sm transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  Acceder al Portal Exclusivo
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 opacity-30 flex flex-col items-center gap-2">
          <p className="text-[10px] tracking-[0.3em] uppercase">MÉTODO CINEMÁTICO VIRTUAL</p>
          <div className="flex gap-4">
              <span className="text-[10px] tracking-widest text-indigo-400">VEO 3.1</span>
              <span className="text-[10px] tracking-widest">•</span>
              <span className="text-[10px] tracking-widest text-blue-400">NANOBANANA</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
