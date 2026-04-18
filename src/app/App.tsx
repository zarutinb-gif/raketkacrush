import { useState, useEffect, useCallback } from 'react';
import { Wallet, Settings, Rocket, Users, User, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RocketGame } from './components/RocketGame';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { generateBotBet, playerNames } from './utils/botGenerator';

interface Bet {
  id: string;
  playerName: string;
  avatar: string;
  amount: number;
  multiplier: number;
  winAmount: number;
  isBot: boolean;
  cashedOut: boolean;
}

type GamePhase = 'waiting' | 'flying' | 'crashed';

export default function App() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(2.5);
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting');
  const [hasActiveBet, setHasActiveBet] = useState(false);
  const [playerBetId, setPlayerBetId] = useState<string | null>(null);

  const [bets, setBets] = useState<Bet[]>([]);
  const [recentMultipliers, setRecentMultipliers] = useState<number[]>([
    1.85, 3.2, 1.15, 5.4, 2.1, 10.5, 1.42, 2.8, 1.95, 4.2
  ]);

  const [onlineCount, setOnlineCount] = useState(1250);
  const [totalBets, setTotalBets] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [activeTab, setActiveTab] = useState('crash');

  // Update online count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 20) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate bot bets
  const generateBotBets = useCallback(() => {
    const numBots = 3 + Math.floor(Math.random() * 5);
    const newBotBets: Bet[] = [];

    for (let i = 0; i < numBots; i++) {
      const botBet = generateBotBet();
      newBotBets.push({
        id: `bot-${Date.now()}-${i}`,
        playerName: botBet.name,
        avatar: botBet.avatar,
        amount: botBet.amount,
        multiplier: 0,
        winAmount: 0,
        isBot: true,
        cashedOut: false
      });
    }

    setBets(prev => [...newBotBets, ...prev].slice(0, 50));
  }, []);

  // Start new round
  const startNewRound = useCallback(() => {
    // Generate crash point (weighted random)
    const random = Math.random();
    let newCrashPoint;

    if (random < 0.5) newCrashPoint = 1.0 + Math.random() * 1.5; // 1.0-2.5x (50%)
    else if (random < 0.8) newCrashPoint = 2.5 + Math.random() * 2.5; // 2.5-5.0x (30%)
    else if (random < 0.95) newCrashPoint = 5.0 + Math.random() * 5.0; // 5.0-10.0x (15%)
    else newCrashPoint = 10.0 + Math.random() * 40.0; // 10.0-50.0x (5%)

    setCrashPoint(newCrashPoint);
    setCurrentMultiplier(1.0);
    setGamePhase('waiting');
    generateBotBets();

    // Start flying after 3 seconds
    setTimeout(() => {
      setGamePhase('flying');
    }, 3000);
  }, [generateBotBets]);

  // Initialize first round
  useEffect(() => {
    startNewRound();
  }, []);

  // Game loop - increase multiplier
  useEffect(() => {
    if (gamePhase !== 'flying') return;

    const interval = setInterval(() => {
      setCurrentMultiplier(prev => {
        const increment = prev < 2 ? 0.01 : prev < 5 ? 0.02 : 0.05;
        const newValue = prev + increment;

        // Check if we should crash
        if (newValue >= crashPoint) {
          setGamePhase('crashed');

          // Update bets with crash results
          setBets(prevBets => prevBets.map(bet => {
            if (bet.cashedOut) return bet;

            if (bet.isBot) {
              // Bots cash out at random points
              const botCashout = 1.2 + Math.random() * (crashPoint - 1.2);
              if (botCashout < crashPoint) {
                return {
                  ...bet,
                  multiplier: botCashout,
                  winAmount: bet.amount * botCashout,
                  cashedOut: true
                };
              }
            }

            return bet;
          }));

          // Add to history
          setRecentMultipliers(prev => [crashPoint, ...prev.slice(0, 9)]);

          // Reset player bet
          if (hasActiveBet && playerBetId) {
            setHasActiveBet(false);
            setPlayerBetId(null);
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
  }, [gamePhase, crashPoint, hasActiveBet, autoCashout, playerBetId]);

  const placeBet = () => {
    if (gamePhase !== 'waiting' || hasActiveBet || betAmount > balance) return;

    const newBet: Bet = {
      id: `player-${Date.now()}`,
      playerName: 'You',
      avatar: 'https://i.pravatar.cc/150?img=1',
      amount: betAmount,
      multiplier: 0,
      winAmount: 0,
      isBot: false,
      cashedOut: false
    };

    setBalance(prev => prev - betAmount);
    setHasActiveBet(true);
    setPlayerBetId(newBet.id);
    setBets(prev => [newBet, ...prev]);
    setTotalBets(prev => prev + 1);
    setTotalAmount(prev => prev + betAmount);
  };

  const handleCashout = () => {
    if (!hasActiveBet || !playerBetId) return;

    const winAmount = betAmount * currentMultiplier;

    setBets(prevBets => prevBets.map(bet =>
      bet.id === playerBetId
        ? { ...bet, multiplier: currentMultiplier, winAmount, cashedOut: true }
        : bet
    ));

    setBalance(prev => prev + winAmount);
    setHasActiveBet(false);
    setPlayerBetId(null);
  };

  const getMultiplierColor = (mult: number) => {
    if (mult < 2) return 'bg-green-500';
    if (mult < 5) return 'bg-blue-500';
    if (mult < 10) return 'bg-purple-500';
    return 'bg-gradient-to-r from-yellow-400 to-orange-500';
  };

  const averageMultiplier = recentMultipliers.reduce((a, b) => a + b, 0) / recentMultipliers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-x-hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-xs bg-black/20">
        <span>{new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-green-400">Онлайн: {onlineCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Rocket size={16} />
          </div>
          <h1 className="font-bold text-lg">Crash Game</h1>
        </div>
        <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-bold">💰 {balance.toFixed(2)}</span>
        </div>
      </div>

      {/* Recent Multipliers */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <AnimatePresence mode="popLayout">
            {recentMultipliers.map((mult, index) => (
              <motion.div
                key={`${mult}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`${getMultiplierColor(mult)} px-4 py-2 rounded-lg whitespace-nowrap text-sm font-bold shadow-lg`}
              >
                {mult.toFixed(2)}x
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Game Area */}
      <RocketGame
        multiplier={currentMultiplier}
        gamePhase={gamePhase}
        crashPoint={crashPoint}
      />

      {/* Bet Controls */}
      <div className="px-4 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Сумма ставки</label>
            <div className="relative">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                disabled={hasActiveBet}
                className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Авто вывод</label>
            <div className="relative">
              <input
                type="number"
                value={autoCashout}
                onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 2.0)}
                step="0.1"
                disabled={hasActiveBet}
                className="w-full bg-white/10 backdrop-blur-sm text-white px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                placeholder="2.00"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {[10, 25, 50, 100].map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              disabled={hasActiveBet}
              className="flex-1 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white py-2 rounded-lg text-sm transition-colors"
            >
              {amount}
            </button>
          ))}
        </div>

        {gamePhase === 'waiting' && !hasActiveBet && (
          <motion.button
            onClick={placeBet}
            disabled={betAmount <= 0 || betAmount > balance}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-green-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            СДЕЛАТЬ СТАВКУ
          </motion.button>
        )}

        {hasActiveBet && gamePhase === 'flying' && (
          <motion.button
            onClick={handleCashout}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-lg shadow-orange-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{ boxShadow: ['0 0 0 0 rgba(249, 115, 22, 0.7)', '0 0 0 15px rgba(249, 115, 22, 0)'] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ЗАБРАТЬ {(betAmount * currentMultiplier).toFixed(2)} 💰
          </motion.button>
        )}

        {(gamePhase === 'crashed' || (gamePhase === 'waiting' && hasActiveBet)) && (
          <div className="w-full bg-gray-700 text-white py-4 rounded-xl text-lg font-bold text-center">
            Ожидание...
          </div>
        )}
      </div>

      {/* Balance Management */}
      <div className="px-4 py-2 flex gap-2">
        <button
          onClick={() => setShowDepositModal(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          <Wallet size={18} />
          <span className="font-bold">Пополнить</span>
        </button>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2.5 rounded-lg transition-colors"
        >
          <Settings size={18} />
          <span className="font-bold">Вывести</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="px-4 py-3 bg-black/20 mt-2">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-gray-400">Всего ставок:</span>
            <span className="ml-2 text-white font-bold">{totalBets}</span>
          </div>
          <div>
            <span className="text-gray-400">Средний краш:</span>
            <span className="ml-2 text-purple-400 font-bold">{averageMultiplier.toFixed(2)}x</span>
          </div>
        </div>
      </div>

      {/* Bets History */}
      <div className="px-4 py-3 pb-24">
        <h3 className="text-sm text-gray-400 mb-3">Активные ставки</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {bets.slice(0, 20).map((bet) => (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={bet.avatar}
                    alt={bet.playerName}
                    className="w-10 h-10 rounded-full ring-2 ring-purple-500/30"
                  />
                  <div>
                    <div className="font-medium">{bet.playerName}</div>
                    <div className="text-xs text-gray-400">
                      💰 {bet.amount.toFixed(2)}
                      {bet.cashedOut && (
                        <span className="text-green-400 ml-1">
                          × {bet.multiplier.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {bet.cashedOut ? (
                  <div className="text-green-400 font-bold">
                    +{bet.winAmount.toFixed(2)}
                  </div>
                ) : gamePhase === 'flying' ? (
                  <div className="text-yellow-400 font-bold animate-pulse">
                    {currentMultiplier.toFixed(2)}x
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Ожидание</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0c29]/95 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around items-center py-3">
          <button
            onClick={() => setActiveTab('crash')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'crash' ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            <Rocket size={24} />
            <span className="text-xs font-bold">Играть</span>
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'referrals' ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            <Users size={24} />
            <span className="text-xs font-bold">Рефералы</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'profile' ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            <User size={24} />
            <span className="text-xs font-bold">Профиль</span>
          </button>
        </div>
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