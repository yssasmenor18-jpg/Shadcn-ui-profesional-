'use client'

import React, { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

const ROTATION_RANGE = 32.5
const HALF_ROTATION_RANGE = 32.5 / 2

export const IsasmendiTitle = () => {
    const ref = useRef<HTMLDivElement>(null)

    // Valores de movimiento del mouse
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Suavizado (Spring physics) para que el movimiento se sienta "con peso" y profesional
    const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 })

    // Transformar coordenadas del mouse en grados de rotación
    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()

        const width = rect.width
        const height = rect.height

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1
        const rY = mouseX / width - HALF_ROTATION_RANGE

        x.set(rX)
        y.set(rY)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className="relative cursor-default"
        >
            <h1
                style={{
                    transform: "translateZ(50px)",
                }}
                className="text-4xl md:text-8xl font-black text-center tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
                ISASMENDI
                <span className="block text-2xl md:text-4xl font-light tracking-[0.5em] text-neutral-400 mt-2">
                    VISIONES
                </span>
            </h1>

            {/* Capa de brillo extra dinámica */}
            <motion.div
                style={{
                    transform: "translateZ(20px)",
                    opacity: useMotionTemplate`${Math.abs(Number(xSpring)) * 0.5}`, // Brilla más al moverse
                }}
                className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10"
            />
        </motion.div>
    )
}
