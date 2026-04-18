import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Wallet, TrendingUp, History, Settings } from 'lucide-react';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';

interface ProfileScreenProps {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
  userId: string;
}

export function ProfileScreen({ balance, setBalance, userId }: ProfileScreenProps) {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Профиль
        </h1>
        <p className="text-gray-400 text-sm">Управление вашим аккаунтом</p>
      </div>

      {/* Avatar & ID */}
      <div className="flex flex-col items-center mb-6">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-purple-500/40 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <User size={48} className="text-white" />
        </motion.div>
        <div className="text-center">
          <div className="text-lg font-bold text-white mb-1">User</div>
          <div className="text-sm text-gray-400 bg-white/5 backdrop-blur-sm px-4 py-1.5 rounded-full border border-purple-500/20">
            ID: {userId}
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6 mb-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet size={24} className="text-purple-400" />
            <span className="text-gray-300 font-bold">Баланс</span>
          </div>
          <TrendingUp size={20} className="text-green-400" />
        </div>
        <div className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
          {balance.toFixed(2)} ⭐
        </div>
        <div className="text-sm text-gray-400">Доступно для игры</div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          onClick={() => setShowDepositModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-4 rounded-xl font-bold shadow-2xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: '0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)'
          }}
        >
          <div className="text-2xl mb-1">💰</div>
          <div>Пополнить</div>
        </motion.button>

        <motion.button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 py-4 rounded-xl font-bold shadow-2xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.4), 0 0 50px rgba(239, 68, 68, 0.2)'
          }}
        >
          <div className="text-2xl mb-1">💸</div>
          <div>Вывести</div>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="space-y-3 mb-6">
        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <History size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-400">Всего игр</div>
                <div className="text-xl font-bold text-white">0</div>
              </div>
            </div>
            <div className="text-blue-400 text-sm font-bold">Скоро</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <div className="text-sm text-gray-400">Общий выигрыш</div>
                <div className="text-xl font-bold text-white">0.00 ⭐</div>
              </div>
            </div>
            <div className="text-purple-400 text-sm font-bold">+0%</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <Settings size={24} />
          </div>
          <div>
            <div className="font-bold text-white">Настройки</div>
            <div className="text-sm text-gray-400">Персонализация и безопасность</div>
          </div>
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
