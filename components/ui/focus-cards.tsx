"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";


type Card = {
  title: string;
  src: string;
  original?: any;
};


export function FocusCards({ cards, onCardClick }: { cards: Card[]; onCardClick?: (card: Card) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      <AnimatePresence mode="popLayout">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            layoutId={card.title}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              layout: { duration: 0.5, ease: "easeInOut" }
            }}
            className="w-full group"
          >
            <Card
              card={card}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
              onClick={() => onCardClick?.(card)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onClick,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onClick?: () => void;
  }) => {
    const isHovered = hovered === index;
    const divRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return;
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
      <motion.div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={onClick}
        animate={{
          scale: isHovered ? 1.05 : 1,
          zIndex: isHovered ? 10 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "rounded-2xl relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full cursor-pointer transition-shadow",
          isHovered
            ? "shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            : "shadow-none",
          hovered !== null && !isHovered && "blur-[2px] opacity-50 scale-[0.98]"
        )}
      >
        {/* Spotlight Effect Layer */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
          style={{
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.15), transparent 40%)`,
          }}
        />

        <AnimatePresence mode="wait">
          {isHovered && card.original?.video_url ? (
            <motion.video
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={card.original.video_url}
              autoPlay
              loop
              playsInline
              onMouseOver={(e) => {
                e.currentTarget.muted = false;
                e.currentTarget.play().catch(console.error);
              }}
              onMouseOut={(e) => {
                e.currentTarget.muted = true;
              }}
              className="object-cover absolute inset-0 w-full h-full scale-105"
            />
          ) : (
            <motion.img
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={card.src}
              alt={card.title}
              className="object-cover absolute inset-0 w-full h-full"
            />
          )}
        </AnimatePresence>

        {/* Overlay con gradiente para el texto */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6 transition-opacity duration-300 z-20",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            className="w-full"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">
              {card.title}
            </h3>
            {card.original?.category && (
              <span className="text-xs font-bold uppercase tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                {card.original.category}
              </span>
            )}
          </motion.div>
        </div>

        {/* Borde sutil constante */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 dark:ring-white/10 z-20 pointer-events-none" />
      </motion.div>
    );
  }
);
