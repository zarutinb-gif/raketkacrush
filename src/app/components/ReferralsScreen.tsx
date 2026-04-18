import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Copy, Check, Gift, TrendingUp, Star } from 'lucide-react';

interface ReferralsScreenProps {
  referralCount: number;
  referralEarnings: number;
  userId: string;
}

export function ReferralsScreen({ referralCount, referralEarnings, userId }: ReferralsScreenProps) {
  const [copied, setCopied] = useState(false);

  const referralLink = `https://t.me/crashgamebot?start=${userId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🎁</div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Рефералы
        </h1>
        <p className="text-gray-400 text-sm">Приглашай друзей и получай бонусы</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-purple-400" />
            <span className="text-sm text-gray-400">Приглашено</span>
          </div>
          <div className="text-3xl font-black text-white">{referralCount}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star size={20} className="text-yellow-400" />
            <span className="text-sm text-gray-400">Заработано</span>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {referralEarnings} ⭐
          </div>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 mb-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Users size={20} />
          </div>
          <span className="font-bold text-white">Твоя реферальная ссылка</span>
        </div>

        <div className="bg-black/30 rounded-xl p-3 mb-3 border border-purple-500/20">
          <div className="text-sm text-gray-300 break-all font-mono">
            {referralLink}
          </div>
        </div>

        <motion.button
          onClick={copyToClipboard}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <>
              <Check size={20} />
              <span>Скопировано!</span>
            </>
          ) : (
            <>
              <Copy size={20} />
              <span>Копировать ссылку</span>
            </>
          )}
        </motion.button>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Gift size={24} className="text-blue-400" />
          Как это работает?
        </h2>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-white mb-1">Поделись ссылкой</div>
              <div className="text-sm text-gray-400">Отправь свою реферальную ссылку друзьям в Telegram</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-white mb-1">Друзья регистрируются</div>
              <div className="text-sm text-gray-400">Когда они начнут играть, ты получишь бонус</div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-white mb-1">Получай звёзды</div>
              <div className="text-sm text-gray-400">10% от каждой игры твоих друзей идёт тебе</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bonuses */}
      <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 backdrop-blur-sm border border-yellow-500/20 rounded-3xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-yellow-400" />
          Бонусы
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-yellow-500/20">
            <div>
              <div className="font-bold text-white">5 друзей</div>
              <div className="text-xs text-gray-400">Пригласи 5 друзей</div>
            </div>
            <div className="text-xl font-bold text-yellow-400">+50 ⭐</div>
          </div>

          <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-yellow-500/20">
            <div>
              <div className="font-bold text-white">10 друзей</div>
              <div className="text-xs text-gray-400">Пригласи 10 друзей</div>
            </div>
            <div className="text-xl font-bold text-yellow-400">+150 ⭐</div>
          </div>

          <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-yellow-500/20">
            <div>
              <div className="font-bold text-white">25 друзей</div>
              <div className="text-xs text-gray-400">Пригласи 25 друзей</div>
            </div>
            <div className="text-xl font-bold text-yellow-400">+500 ⭐</div>
          </div>
        </div>
      </div>
    </div>
  );
}
