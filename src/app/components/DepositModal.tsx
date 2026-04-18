import { useState } from 'react';
import { X, Wallet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export function DepositModal({ isOpen, onClose, onDeposit }: DepositModalProps) {
  const [amount, setAmount] = useState('');

  const quickAmounts = [10, 50, 100, 500, 1000];

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      onDeposit(depositAmount);
      setAmount('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 bottom-0 -translate-x-1/2 w-full max-w-md bg-gradient-to-br from-[#1a1333] via-[#2d1b69] to-[#1a1333] rounded-t-3xl p-6 z-50 shadow-2xl border-t-2 border-purple-500/30"
          >
            {/* Handle Bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Wallet className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Пополнение</h2>
                  <p className="text-xs text-gray-400">Мгновенное зачисление</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-400" />
                  Сумма пополнения
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 backdrop-blur-sm border border-purple-500/30 text-white text-2xl px-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">💰</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Быстрый выбор</label>
                <div className="grid grid-cols-5 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <motion.button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 text-white py-3 rounded-lg transition-all text-sm font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {quickAmount}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex items-start gap-2">
                <Sparkles size={16} className="text-blue-400 mt-0.5" />
                <div className="text-xs text-blue-300">
                  <div className="font-bold mb-1">Бонус за пополнение!</div>
                  <div>+10% к сумме при пополнении от 100 💎</div>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  onClick={handleDeposit}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Пополнить баланс
                </motion.button>
              </div>

              <div className="text-center text-xs text-gray-500">
                🔒 Безопасные платежи • Минимум: 10.00
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
