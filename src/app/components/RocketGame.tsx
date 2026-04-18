import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RocketGameProps {
  multiplier: number;
  gamePhase: 'waiting' | 'flying' | 'crashed';
  crashPoint: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

export function RocketGame({ multiplier, gamePhase, crashPoint }: RocketGameProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [coins, setCoins] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 1
    }));
    setStars(newStars);

    const newCoins = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setCoins(newCoins);
  }, []);

  const rocketY = gamePhase === 'flying' ? Math.max(80 - (multiplier - 1) * 15, 10) : 80;
  const rocketRotation = gamePhase === 'flying' ? -20 : 0;

  const getMultiplierColor = () => {
    if (multiplier < 2) return 'text-green-400';
    if (multiplier < 5) return 'text-blue-400';
    if (multiplier < 10) return 'text-purple-400';
    return 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500';
  };

  return (
    <div className="relative h-80 overflow-hidden rounded-2xl mx-4 bg-gradient-to-b from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-white/10">
      {/* Animated Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: star.speed,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Falling Coins */}
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-40"
          style={{ left: `${coin.x}%` }}
          animate={{
            y: ['-10%', '110%'],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: coin.delay,
            ease: 'linear'
          }}
        />
      ))}

      {/* Multiplier Display */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          className={`text-6xl font-bold ${getMultiplierColor()} drop-shadow-2xl`}
          animate={gamePhase === 'flying' ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 0.3,
            repeat: gamePhase === 'flying' ? Infinity : 0
          }}
        >
          {multiplier.toFixed(2)}x
        </motion.div>
      </div>

      {/* Waiting Phase */}
      {gamePhase === 'waiting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-20"
        >
          <div className="text-gray-400 text-lg mb-2">Следующий раунд через</div>
          <motion.div
            className="text-4xl font-bold text-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-75" />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-150" />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Rocket */}
      <motion.div
        className="absolute left-1/2 z-10"
        style={{
          top: `${rocketY}%`,
          x: '-50%'
        }}
        animate={{
          y: gamePhase === 'flying' ? [0, -5, 0] : 0,
          rotate: rocketRotation
        }}
        transition={{
          y: {
            duration: 0.5,
            repeat: gamePhase === 'flying' ? Infinity : 0,
            ease: 'easeInOut'
          },
          rotate: {
            duration: 0.3
          }
        }}
      >
        {/* Rocket Body */}
        <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-2xl">
          {/* Flame */}
          {gamePhase === 'flying' && (
            <motion.g
              animate={{
                opacity: [0.7, 1, 0.7],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <ellipse cx="50" cy="85" rx="12" ry="20" fill="#ff6b00" opacity="0.8" />
              <ellipse cx="50" cy="85" rx="8" ry="15" fill="#ffaa00" />
              <ellipse cx="50" cy="85" rx="4" ry="10" fill="#ffff00" />
            </motion.g>
          )}

          {/* Main Rocket */}
          <defs>
            <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Rocket Cone */}
          <path d="M 50 10 L 65 35 L 35 35 Z" fill="#f59e0b" />

          {/* Rocket Body */}
          <rect x="35" y="35" width="30" height="40" rx="5" fill="url(#rocketGrad)" />

          {/* Window */}
          <circle cx="50" cy="50" r="8" fill="#1e293b" opacity="0.6" />
          <circle cx="50" cy="50" r="6" fill="#38bdf8" opacity="0.8" />

          {/* Wings */}
          <path d="M 35 60 L 25 75 L 35 75 Z" fill="#ec4899" />
          <path d="M 65 60 L 75 75 L 65 75 Z" fill="#ec4899" />

          {/* Details */}
          <rect x="38" y="40" width="3" height="25" fill="#ffffff" opacity="0.3" />
          <rect x="59" y="40" width="3" height="25" fill="#ffffff" opacity="0.3" />
        </svg>

        {/* Speed Lines */}
        {gamePhase === 'flying' && (
          <div className="absolute -left-20 top-1/2 -translate-y-1/2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="h-0.5 bg-gradient-to-r from-transparent to-purple-500 mb-2"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 40, opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.1
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
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            {/* Explosion */}
            <motion.div
              className="relative w-32 h-32"
              animate={{
                scale: [1, 2, 2.5],
                opacity: [1, 0.5, 0]
              }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600 blur-xl" />
            </motion.div>

            {/* Explosion Particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%'
                }}
                animate={{
                  x: Math.cos((i / 12) * Math.PI * 2) * 100,
                  y: Math.sin((i / 12) * Math.PI * 2) * 100,
                  opacity: [1, 0],
                  scale: [1, 0]
                }}
                transition={{ duration: 0.6 }}
              />
            ))}

            {/* Crash Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-500 drop-shadow-2xl whitespace-nowrap"
            >
              КРАШ {crashPoint.toFixed(2)}x
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-10 grid-rows-10 h-full w-full">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>
      </div>
    </div>
  );
}
