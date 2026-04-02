'use client'

import React, { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

const ROTATION_RANGE = 32.5
const HALF_ROTATION_RANGE = 32.5 / 2

export const IsasmendiTitle = () => {
    const ref = useRef<HTMLDivElement>(null)

    // Valores de rotación por el mouse (rebautizados para no chocar con x,y del drag)
    const mouseRotationX = useMotionValue(0)
    const mouseRotationY = useMotionValue(0)
    
    const xSpring = useSpring(mouseRotationX, { stiffness: 300, damping: 30 })
    const ySpring = useSpring(mouseRotationY, { stiffness: 300, damping: 30 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE
        const rX = (mouseY / rect.height - HALF_ROTATION_RANGE) * -1
        const rY = mouseX / rect.width - HALF_ROTATION_RANGE
        mouseRotationX.set(rX)
        mouseRotationY.set(rY)
    }

    const handleMouseLeave = () => {
        mouseRotationX.set(0)
        mouseRotationY.set(0)
    }

    return (
        <motion.div
            ref={ref}
            drag
            dragSnapToOrigin={false}
            dragElastic={0.1}
            dragMomentum={false}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX: xSpring,
                rotateY: ySpring,
            }}
            className="relative cursor-grab active:cursor-grabbing select-none"
        >
            <div
                style={{
                    transform: "translateZ(50px)",
                }}
                className="flex flex-col items-center"
            >
                <h1
                    style={{
                        WebkitTextStroke: "1px black",
                    }}
                    className="text-5xl md:text-[7.5rem] font-black text-center tracking-tighter text-white drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] transition-all duration-300 selection:bg-white selection:text-black leading-none"
                >
                    ISASMENDI
                </h1>
                
                <div className="flex items-center justify-center gap-3 md:gap-5 mt-2 md:mt-4 w-full px-4">
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "3rem", opacity: 0.4 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-[1px] bg-gradient-to-r from-transparent to-white hidden md:block" 
                    />
                    <span className="text-[10px] md:text-sm font-light tracking-[1.5em] text-white/70 uppercase pl-[1.5em] whitespace-nowrap">
                        V I S I O N E S
                    </span>
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "3rem", opacity: 0.4 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-[1px] bg-gradient-to-l from-transparent to-white hidden md:block" 
                    />
                </div>
            </div>

            {/* Capa de brillo extra dinámica */}
            <motion.div
                style={{
                    transform: "translateZ(20px)",
                    opacity: xSpring, // Usando xSpring directamente como control de brillo sutil
                }}
                className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10"
            />
        </motion.div>
    )
}
