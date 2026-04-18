import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameScreen } from './components/GameScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ReferralsScreen } from './components/ReferralsScreen';
import { Rocket, Users, User } from 'lucide-react';

type Screen = 'game' | 'profile' | 'referrals';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('game');
  const [balance, setBalance] = useState(1000);
  const [userId] = useState('TG' + Math.floor(Math.random() * 1000000));
  const [referralCount] = useState(0);
  const [referralEarnings] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0f051d] text-white">
      {/* Main Content */}
      <div className="pb-20">
        <AnimatePresence mode="wait">
          {activeScreen === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <GameScreen balance={balance} setBalance={setBalance} />
            </motion.div>
          )}

          {activeScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileScreen
                balance={balance}
                setBalance={setBalance}
                userId={userId}
              />
            </motion.div>
          )}

          {activeScreen === 'referrals' && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ReferralsScreen
                referralCount={referralCount}
                referralEarnings={referralEarnings}
                userId={userId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0118] to-[#0a0118]/95 backdrop-blur-xl border-t border-purple-500/20">
        <div className="flex justify-around items-center py-3 px-4">
          <motion.button
            onClick={() => setActiveScreen('game')}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              activeScreen === 'game'
                ? 'text-purple-400'
                : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`relative ${activeScreen === 'game' ? 'scale-110' : ''}`}>
              <Rocket size={26} />
              {activeScreen === 'game' && (
                <motion.div
                  className="absolute -inset-2 bg-purple-500/30 rounded-full blur-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>
            <span className="text-xs font-bold">Играть</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveScreen('referrals')}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              activeScreen === 'referrals'
                ? 'text-purple-400'
                : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`relative ${activeScreen === 'referrals' ? 'scale-110' : ''}`}>
              <Users size={26} />
              {activeScreen === 'referrals' && (
                <motion.div
                  className="absolute -inset-2 bg-purple-500/30 rounded-full blur-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>
            <span className="text-xs font-bold">Рефералы</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveScreen('profile')}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              activeScreen === 'profile'
                ? 'text-purple-400'
                : 'text-gray-500'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`relative ${activeScreen === 'profile' ? 'scale-110' : ''}`}>
              <User size={26} />
              {activeScreen === 'profile' && (
                <motion.div
                  className="absolute -inset-2 bg-purple-500/30 rounded-full blur-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>
            <span className="text-xs font-bold">Профиль</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}