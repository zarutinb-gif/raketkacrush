import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Trophy } from 'lucide-react';

interface GameHistoryProps {
  multipliers: number[];
}

export function GameHistory({ multipliers }: GameHistoryProps) {
  const getMultiplierColor = (mult: number) => {
    if (mult < 2) return 'from-green-500 to-green-600';
    if (mult < 5) return 'from-blue-500 to-blue-600';
    if (mult < 10) return 'from-purple-500 to-purple-600';
    return 'from-yellow-400 to-orange-500';
  };

  const getIcon = (mult: number) => {
    if (mult >= 10) return <Trophy size={14} className="text-yellow-400" />;
    if (mult >= 5) return <TrendingUp size={14} className="text-purple-400" />;
    return <TrendingDown size={14} className="text-blue-400" />;
  };

  const averageMultiplier = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;
  const highestMultiplier = Math.max(...multipliers);

  return (
    <div className="px-4 py-4 bg-black/20 backdrop-blur-sm rounded-xl mx-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-300">История игр</h3>
        <div className="flex gap-4 text-xs">
          <div className="text-gray-400">
            Средний: <span className="text-purple-400 font-bold">{averageMultiplier.toFixed(2)}x</span>
          </div>
          <div className="text-gray-400">
            Макс: <span className="text-yellow-400 font-bold">{highestMultiplier.toFixed(2)}x</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
        {multipliers.map((mult, index) => (
          <motion.div
            key={`${mult}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`min-w-[60px] h-12 bg-gradient-to-br ${getMultiplierColor(mult)} rounded-lg flex flex-col items-center justify-center shadow-lg`}
          >
            <div className="flex items-center gap-1">
              {getIcon(mult)}
            </div>
            <div className="text-white font-bold text-sm">{mult.toFixed(2)}x</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
