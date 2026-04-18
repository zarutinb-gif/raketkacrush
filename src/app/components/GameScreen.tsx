import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RocketGame } from './RocketGame';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';
import { UserCircle2 } from 'lucide-react';

type GamePhase = 'countdown' | 'flying' | 'crashed';

interface GameScreenProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
}

export function GameScreen({ balance, setBalance }: GameScreenProps) {
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(2.5);
  const [gamePhase, setGamePhase] = useState<GamePhase>('countdown');
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [onlineCount] = useState(0);

  const [recentMultipliers, setRecentMultipliers] = useState<number[]>([]);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Start new round
  const startNewRound = useCallback(() => {
    // Generate crash point (weighted random)
    const random = Math.random();
    let newCrashPoint;

    if (random < 0.5) newCrashPoint = 1.0 + Math.random() * 1.5;
    else if (random < 0.8) newCrashPoint = 2.5 + Math.random() * 2.5;
    else if (random < 0.95) newCrashPoint = 5.0 + Math.random() * 5.0;
    else newCrashPoint = 10.0 + Math.random() * 40.0;

    setCrashPoint(newCrashPoint);
    setCurrentMultiplier(1.0);
    setGamePhase('countdown');
    setCountdown(5);
  }, []);

  // Initialize first round
  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Countdown timer
  useEffect(() => {
    if (gamePhase !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGamePhase('flying');
    }
  }, [countdown, gamePhase]);

  // Game loop - increase multiplier
  useEffect(() => {
    if (gamePhase !== 'flying') return;

    const interval = setInterval(() => {
      setCurrentMultiplier(prev => {
        const increment = prev < 2 ? 0.01 : prev < 5 ? 0.02 : 0.05;
        const newValue = prev + increment;

        if (newValue >= crashPoint) {
          setGamePhase('crashed');

          // Add to history
          setRecentMultipliers(prev => [crashPoint, ...prev.slice(0, 9)]);

          // Reset player bet
          if (hasActiveBet) {
            setHasActiveBet(false);
          }

          // Start new round after 2 seconds
          setTimeout(() => {
            startNewRound();
          }, 2000);

          return crashPoint;
        }

        // Auto cashout for player
        if (hasActiveBet && newValue >= autoCashout) {
          handleCashout();
        }

        return newValue;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gamePhase, crashPoint, hasActiveBet, autoCashout, startNewRound]);

  const placeBet = () => {
    if (gamePhase !== 'countdown' || hasActiveBet || betAmount > balance || betAmount <= 0) return;

    setBalance(prev => prev - betAmount);
    setHasActiveBet(true);
  };

  const handleCashout = () => {
    if (!hasActiveBet) return;

    const winAmount = betAmount * currentMultiplier;
    setBalance(prev => prev + winAmount);
    setHasActiveBet(false);
  };

  const getMultiplierColor = (mult: number) => {
    if (mult < 2) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (mult < 5) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    if (mult < 10) return 'bg-gradient-to-r from-purple-400 to-purple-600';
    return 'bg-gradient-to-r from-yellow-400 to-orange-500';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              🚀
            </motion.div>
          </div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Crash Game
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-purple-500/20 px-3 py-1.5 rounded-full">
          <UserCircle2 size={16} className="text-purple-400" />
          <span className="text-purple-300 font-bold text-sm">{onlineCount}</span>
        </div>
      </div>

      {/* Balance Display */}
      <div className="px-4 py-3">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4">
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-1">Ваш баланс</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {balance.toFixed(2)} ⭐
            </div>
          </div>
        </div>
      </div>

      {/* Recent Multipliers */}
      {recentMultipliers.length > 0 && (
        <div className="px-4 py-3">
          <div className="text-xs text-gray-400 mb-2">Последние раунды</div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <AnimatePresence mode="popLayout">
              {recentMultipliers.map((mult, index) => (
                <motion.div
                  key={`${mult}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`${getMultiplierColor(mult)} px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold shadow-lg`}
                >
                  {mult.toFixed(2)}x
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <RocketGame
        multiplier={currentMultiplier}
        gamePhase={gamePhase}
        crashPoint={crashPoint}
        countdown={countdown}
      />

      {/* Bet Controls */}
      <div className="px-4 py-4 space-y-4">
        {/* Bet Amount Selection */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Сумма ставки</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[10, 25, 50, 100, 250, 500].map((amount) => (
              <motion.button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={hasActiveBet}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  betAmount === amount
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-purple-500/20 text-gray-300 hover:bg-white/10'
                } disabled:opacity-50`}
                whileTap={{ scale: 0.95 }}
              >
                {amount} ⭐
              </motion.button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="relative">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              disabled={hasActiveBet}
              className="w-full bg-white/5 backdrop-blur-sm border border-purple-500/20 text-white text-lg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              placeholder="Введите сумму"
            />
          </div>
        </div>

        {/* Auto Cashout */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Авто вывод при</label>
          <input
            type="number"
            value={autoCashout}
            onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 2.0)}
            step="0.1"
            min="1.1"
            disabled={hasActiveBet}
            className="w-full bg-white/5 backdrop-blur-sm border border-purple-500/20 text-white text-lg px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            placeholder="2.00"
          />
        </div>

        {/* Action Buttons */}
        {gamePhase === 'countdown' && !hasActiveBet && (
          <motion.button
            onClick={placeBet}
            disabled={betAmount <= 0 || betAmount > balance}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:from-gray-700 disabled:to-gray-800 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-2xl shadow-green-500/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.2)'
            }}
          >
            СДЕЛАТЬ СТАВКУ
          </motion.button>
        )}

        {hasActiveBet && gamePhase === 'flying' && (
          <motion.button
            onClick={handleCashout}
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-2xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)',
                '0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.4)',
                '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ЗАБРАТЬ {(betAmount * currentMultiplier).toFixed(2)} ⭐
          </motion.button>
        )}

        {(gamePhase === 'crashed' || (gamePhase === 'countdown' && hasActiveBet)) && (
          <div className="w-full bg-gray-700/50 backdrop-blur-sm text-white py-4 rounded-xl text-lg font-bold text-center border border-gray-600/30">
            Ожидание...
          </div>
        )}
      </div>

      {/* Balance Management */}
      <div className="px-4 py-2 flex gap-3">
        <motion.button
          onClick={() => setShowDepositModal(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-3 rounded-xl transition-all shadow-2xl font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: '0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)'
          }}
        >
          💰 Пополнить
        </motion.button>
        <motion.button
          onClick={() => setShowWithdrawModal(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 px-4 py-3 rounded-xl transition-all shadow-2xl font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.4), 0 0 50px rgba(239, 68, 68, 0.2)'
          }}
        >
          💸 Вывести
        </motion.button>
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={(amount) => {
          setBalance(prev => prev + amount);
          setShowDepositModal(false);
        }}
      />
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        balance={balance}
        onWithdraw={(amount) => {
          setBalance(prev => prev - amount);
          setShowWithdrawModal(false);
        }}
      />
    </div>
  );
}
