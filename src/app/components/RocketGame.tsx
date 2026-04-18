import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RocketGameProps {
  multiplier: number;
  gamePhase: 'countdown' | 'flying' | 'crashed';
  crashPoint: number;
  countdown: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function RocketGame({ multiplier, gamePhase, crashPoint, countdown }: RocketGameProps) {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5
    }));
    setStars(newStars);
  }, []);

  const rocketY = gamePhase === 'flying' ? Math.max(75 - (multiplier - 1) * 12, 15) : 75;
  const rocketRotation = gamePhase === 'flying' ? -25 : 0;

  const getMultiplierColor = () => {
    if (multiplier < 2) return 'from-green-400 to-emerald-500';
    if (multiplier < 5) return 'from-blue-400 to-cyan-500';
    if (multiplier < 10) return 'from-purple-400 to-pink-500';
    return 'from-yellow-400 via-orange-500 to-red-500';
  };

  return (
    <div className="relative h-96 overflow-hidden rounded-3xl mx-4 bg-gradient-to-b from-purple-950/40 via-blue-950/30 to-black/40 backdrop-blur-sm border border-purple-500/20 shadow-2xl">
      {/* Animated Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Countdown Display */}
      <AnimatePresence>
        {gamePhase === 'countdown' && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <motion.div
              className="text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
              animate={{
                scale: [1, 1.2, 1]
              }}
              style={{
                textShadow: '0 0 60px rgba(168, 85, 247, 0.8), 0 0 120px rgba(168, 85, 247, 0.4)',
                filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))'
              }}
              transition={{ duration: 0.5 }}
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multiplier Display */}
      {gamePhase === 'flying' && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            className={`text-7xl font-black bg-gradient-to-r ${getMultiplierColor()} bg-clip-text text-transparent`}
            animate={{
              scale: [1, 1.08, 1]
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity
            }}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))'
            }}
          >
            {multiplier.toFixed(2)}x
          </motion.div>
        </div>
      )}

      {/* Modern Rocket */}
      <motion.div
        className="absolute left-1/2 z-10"
        style={{
          top: `${rocketY}%`,
          x: '-50%'
        }}
        animate={{
          y: gamePhase === 'flying' ? [0, -8, 0] : 0,
          rotate: rocketRotation
        }}
        transition={{
          y: {
            duration: 0.6,
            repeat: gamePhase === 'flying' ? Infinity : 0,
            ease: 'easeInOut'
          },
          rotate: {
            duration: 0.4
          },
          top: {
            duration: 0.3
          }
        }}
      >
        {/* Rocket Glow */}
        {gamePhase === 'flying' && (
          <motion.div
            className="absolute inset-0 scale-150 blur-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-60"
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1.3, 1.6, 1.3]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Modern Rocket SVG */}
        <svg width="100" height="100" viewBox="0 0 100 100" className="relative drop-shadow-2xl">
          {/* Thrust/Flame */}
          {gamePhase === 'flying' && (
            <motion.g
              animate={{
                opacity: [0.8, 1, 0.8],
                scaleY: [0.9, 1.3, 0.9]
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {/* Outer flame */}
              <ellipse cx="50" cy="88" rx="16" ry="24" fill="url(#flameGrad1)" />
              {/* Middle flame */}
              <ellipse cx="50" cy="88" rx="11" ry="18" fill="url(#flameGrad2)" />
              {/* Inner flame */}
              <ellipse cx="50" cy="88" rx="6" ry="12" fill="#ffff00" opacity="0.9" />
            </motion.g>
          )}

          <defs>
            {/* Rocket gradients */}
            <linearGradient id="rocketBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id="rocketNose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <linearGradient id="flameGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b00" />
              <stop offset="100%" stopColor="#ff0000" />
            </linearGradient>

            <linearGradient id="flameGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffaa00" />
              <stop offset="100%" stopColor="#ff6b00" />
            </linearGradient>
          </defs>

          {/* Rocket Nose Cone */}
          <path d="M 50 8 L 68 38 L 32 38 Z" fill="url(#rocketNose)" />

          {/* Main Body */}
          <rect x="32" y="38" width="36" height="45" rx="4" fill="url(#rocketBody)" />

          {/* Window/Cockpit */}
          <circle cx="50" cy="55" r="10" fill="#1e1b4b" opacity="0.7" />
          <circle cx="50" cy="55" r="8" fill="url(#rocketNose)" opacity="0.4" />
          <circle cx="47" cy="52" r="3" fill="#fff" opacity="0.8" />

          {/* Side Details */}
          <rect x="34" y="42" width="4" height="36" fill="#a855f7" opacity="0.4" />
          <rect x="62" y="42" width="4" height="36" fill="#a855f7" opacity="0.4" />

          {/* Wings */}
          <path d="M 32 65 L 18 82 L 32 82 Z" fill="#ec4899" />
          <path d="M 68 65 L 82 82 L 68 82 Z" fill="#ec4899" />

          {/* Wing Details */}
          <path d="M 32 65 L 20 78 L 32 78 Z" fill="#f472b6" opacity="0.6" />
          <path d="M 68 65 L 80 78 L 68 78 Z" fill="#f472b6" opacity="0.6" />
        </svg>

        {/* Speed Trail */}
        {gamePhase === 'flying' && (
          <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-20">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-1.5 rounded-full"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 60, opacity: [0, 0.6, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.08
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Crash Effect */}
      <AnimatePresence>
        {gamePhase === 'crashed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            {/* Explosion Circle */}
            <motion.div
              className="absolute inset-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
              animate={{
                scale: [1, 2.5],
                opacity: [1, 0]
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-600 to-red-800 blur-2xl" />
            </motion.div>

            {/* Explosion Particles */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                style={{
                  left: '50%',
                  top: '50%'
                }}
                animate={{
                  x: Math.cos((i / 16) * Math.PI * 2) * 120,
                  y: Math.sin((i / 16) * Math.PI * 2) * 120,
                  opacity: [1, 0],
                  scale: [1.5, 0]
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            ))}

            {/* CRUSH Text */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.5 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: [-2, 2, -2, 2, 0]
              }}
              transition={{
                x: {
                  duration: 0.1,
                  repeat: 3
                }
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div
                className="text-6xl font-black text-red-500"
                style={{
                  textShadow: '0 0 40px rgba(239, 68, 68, 0.9), 0 0 80px rgba(239, 68, 68, 0.6), 0 0 120px rgba(239, 68, 68, 0.3)',
                  filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.8))'
                }}
              >
                CRUSH
              </div>
              <div className="text-center text-2xl font-bold text-red-300 mt-2">
                {crashPoint.toFixed(2)}x
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="border border-purple-400/30" />
          ))}
        </div>
      </div>
    </div>
  );
}
