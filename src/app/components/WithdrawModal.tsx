import { useState } from 'react';
import { X, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onWithdraw: (amount: number) => void;
}

export function WithdrawModal({ isOpen, onClose, balance, onWithdraw }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError('Введите корректную сумму');
      return;
    }

    if (withdrawAmount > balance) {
      setError('Недостаточно средств');
      return;
    }

    if (withdrawAmount < 10) {
      setError('Минимальная сумма вывода: 10.00');
      return;
    }

    onWithdraw(withdrawAmount);
    setAmount('');
    setError('');
  };

  const setMaxAmount = () => {
    setAmount(balance.toString());
    setError('');
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
            className="fixed left-1/2 bottom-0 -translate-x-1/2 w-full max-w-md bg-gradient-to-br from-[#1a1333] via-[#2d1b69] to-[#1a1333] rounded-t-3xl p-6 z-50 shadow-2xl border-t-2 border-orange-500/30"
          >
            {/* Handle Bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <TrendingDown className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Вывод средств</h2>
                  <p className="text-xs text-gray-400">Мгновенная обработка</p>
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
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="text-green-400" size={20} />
                <div className="text-sm text-green-300">
                  Доступно: <span className="font-bold">💰 {balance.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Сумма вывода</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError('');
                    }}
                    placeholder="0.00"
                    className="w-full bg-white/5 backdrop-blur-sm border border-orange-500/30 text-white text-2xl px-4 py-4 pr-20 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  <button
                    onClick={setMaxAmount}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                  >
                    МАКС
                  </button>
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-red-400 text-sm flex items-center gap-1 bg-red-500/10 border border-red-500/30 rounded-lg p-2"
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Сумма вывода</span>
                  <span className="text-white font-bold">
                    {amount ? parseFloat(amount).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Комиссия</span>
                  <span className="text-green-400 font-bold">0%</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                <div className="flex justify-between text-base">
                  <span className="text-gray-400">Вы получите</span>
                  <span className="text-white font-bold text-lg">
                    💰 {amount ? parseFloat(amount).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  onClick={handleWithdraw}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-700 disabled:to-gray-800 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Вывести средства
                </motion.button>
              </div>

              <div className="text-center text-xs text-gray-500">
                ⚡ Моментальный вывод • Минимум: 10.00
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
