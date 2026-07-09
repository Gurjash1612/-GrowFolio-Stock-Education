import React from 'react';
import { motion } from 'motion/react';
import { User, Sparkles, Coins, Check, Lock } from 'lucide-react';
import { AvatarConfig } from '../types';
import { gameAudio } from '../utils/audio';

interface AvatarCustomizerProps {
  config: AvatarConfig;
  onChange: (newConfig: AvatarConfig) => void;
  gold: number;
  onSpendGold: (amount: number) => void;
  onCustomized: () => void;
}

// Assets Definitions with pricing
export const HAIR_OPTIONS = [
  { id: 'short', name: 'Sleek Crop', emoji: '👦', cost: 0, path: 'short' },
  { id: 'curls', name: 'Crypto Curls', emoji: '🧑‍🦱', cost: 100, path: 'curls' },
  { id: 'spiky', name: 'Spiky Mohawk', emoji: '🦹', cost: 150, path: 'spiky' },
  { id: 'afro', name: 'Afro Cloud', emoji: '👨‍🦱', cost: 200, path: 'afro' },
  { id: 'wizard', name: 'Wizard Hat', emoji: '🧙', cost: 350, path: 'wizard' },
];

export const HAIR_COLORS = [
  { id: 'black', name: 'Dark Ink', color: '#1A1D20', cost: 0 },
  { id: 'gold', name: 'Bullish Gold', color: '#F59E0B', cost: 50 },
  { id: 'pink', name: 'Cyber Pink', color: '#EC4899', cost: 100 },
  { id: 'green', name: 'Profit Green', color: '#10B981', cost: 100 },
];

export const OUTFIT_OPTIONS = [
  { id: 'tee', name: 'GrowFolio Tee', emoji: '👕', cost: 0, color: '#3B82F6' },
  { id: 'hoodie', name: 'HODL Hoodie', emoji: '🧥', cost: 150, color: '#1F2937' },
  { id: 'suit', name: 'Wall Street Suit', emoji: '👔', cost: 300, color: '#1E3A8A' },
  { id: 'astro', name: 'Astro Suit', emoji: '🚀', cost: 450, color: '#E5E7EB' },
];

export const ACCESSORY_OPTIONS = [
  { id: 'none', name: 'None', emoji: '❌', cost: 0 },
  { id: 'glasses', name: 'Trader Glasses', emoji: '👓', cost: 120 },
  { id: 'vr', name: 'VR Headset', emoji: '🥽', cost: 250 },
  { id: 'crown', name: 'Investor Crown', emoji: '👑', cost: 500 },
];

export const PET_OPTIONS = [
  { id: 'none', name: 'None', emoji: '❌', cost: 0 },
  { id: 'cat', name: 'Coin Cat', emoji: '🐱', cost: 200 },
  { id: 'dog', name: 'Bullish Pup', emoji: '🐶', cost: 250 },
  { id: 'hamster', name: 'HODL Hamster', emoji: '🐹', cost: 300 },
];

export const BACKGROUND_OPTIONS = [
  { id: 'slate', name: 'Deep Slate', color: 'from-slate-800 to-slate-950', cost: 0 },
  { id: 'emerald', name: 'Forest Emerald', color: 'from-emerald-900 to-zinc-950', cost: 100 },
  { id: 'cosmic', name: 'Cosmic Violet', color: 'from-purple-900 to-indigo-950', cost: 150 },
  { id: 'neon', name: 'Cyber Neon', color: 'from-fuchsia-950 to-cyan-950', cost: 250 },
];

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  config,
  onChange,
  gold,
  onSpendGold,
  onCustomized,
}) => {
  // State for unlocked features
  const [unlockedAssets, setUnlockedAssets] = React.useState<string[]>(() => {
    const saved = localStorage.getItem('gf_unlocked_avatar_assets');
    return saved ? JSON.parse(saved) : ['short', 'black', 'tee', 'none', 'slate'];
  });

  const saveUnlocked = (updated: string[]) => {
    setUnlockedAssets(updated);
    localStorage.setItem('gf_unlocked_avatar_assets', JSON.stringify(updated));
  };

  const handleSelectAsset = (category: keyof AvatarConfig, assetId: string, cost: number) => {
    gameAudio.playClick();
    const assetKey = `${category}-${assetId}`;
    const isUnlocked = unlockedAssets.includes(assetKey) || cost === 0;

    if (!isUnlocked) {
      if (gold >= cost) {
        onSpendGold(cost);
        const updated = [...unlockedAssets, assetKey];
        saveUnlocked(updated);
        gameAudio.playCoin();
      } else {
        alert('Insufficient Gold! Complete more quizzes or check-ins to earn Gold.');
        return;
      }
    }

    const updatedConfig = { ...config, [category]: assetId, isCustomized: true };
    onChange(updatedConfig);
    onCustomized();
  };

  // SVG Layer rendering engine for high-end avatar display
  const renderAvatarSVG = () => {
    const activeBG = BACKGROUND_OPTIONS.find(b => b.id === config.bg) || BACKGROUND_OPTIONS[0];
    const activeHair = HAIR_OPTIONS.find(h => h.id === config.hair) || HAIR_OPTIONS[0];
    const activeHairColor = HAIR_COLORS.find(c => c.id === config.hairColor) || HAIR_COLORS[0];
    const activeOutfit = OUTFIT_OPTIONS.find(o => o.id === config.outfit) || OUTFIT_OPTIONS[0];
    const activeAccessory = ACCESSORY_OPTIONS.find(a => a.id === config.accessory) || ACCESSORY_OPTIONS[0];
    const activePet = PET_OPTIONS.find(p => p.id === config.pet) || PET_OPTIONS[0];

    return (
      <div className={`w-48 h-48 rounded-[36px] bg-gradient-to-br ${activeBG.color} border-2 border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner`}>
        {/* Dynamic decorative backdrop circles */}
        <div className="absolute w-32 h-32 rounded-full bg-white/5 -top-10 -left-10 blur-xl animate-pulse"></div>
        <div className="absolute w-24 h-24 rounded-full bg-white/5 -bottom-5 -right-5 blur-xl"></div>

        <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-xl select-none">
          {/* Base Head & Neck */}
          <g id="body-base">
            <path d="M85,150 L115,150 L115,130 L85,130 Z" fill="#FDBA74" /> {/* neck */}
            <circle cx="100" cy="100" r="38" fill="#FDBA74" /> {/* face */}
          </g>

          {/* Eyes & Smile */}
          <g id="face-elements">
            <circle cx="88" cy="95" r="3.5" fill="#1F2937" />
            <circle cx="112" cy="95" r="3.5" fill="#1F2937" />
            <path d="M92,112 Q100,122 108,112" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Blushing cheeks */}
            <circle cx="82" cy="103" r="3" fill="#F87171" opacity="0.5" />
            <circle cx="118" cy="103" r="3" fill="#F87171" opacity="0.5" />
          </g>

          {/* Outfit rendering */}
          <g id="outfit">
            {activeOutfit.id === 'tee' && (
              <path d="M60,150 L140,150 L135,200 L65,200 Z" fill={activeOutfit.color} />
            )}
            {activeOutfit.id === 'hoodie' && (
              <g>
                <path d="M55,145 L145,145 L138,200 L62,200 Z" fill={activeOutfit.color} />
                <path d="M82,145 L100,175 L118,145 Z" fill="#374151" /> {/* cowl */}
              </g>
            )}
            {activeOutfit.id === 'suit' && (
              <g>
                <path d="M55,145 L145,145 L138,200 L62,200 Z" fill={activeOutfit.color} />
                <path d="M85,145 L100,170 L115,145 Z" fill="#FFFFFF" /> {/* shirt tie back */}
                <path d="M97,145 L103,145 L101,165 L99,165 Z" fill="#DC2626" /> {/* red tie */}
                <path d="M55,145 L85,180 L85,145 Z" fill="#1E1B4B" /> {/* lapel L */}
                <path d="M145,145 L115,180 L115,145 Z" fill="#1E1B4B" /> {/* lapel R */}
              </g>
            )}
            {activeOutfit.id === 'astro' && (
              <g>
                <path d="M55,145 L145,145 L138,200 L62,200 Z" fill={activeOutfit.color} />
                <circle cx="100" cy="155" r="14" fill="#3B82F6" opacity="0.3" /> {/* blue crest */}
                <rect x="80" y="148" width="40" height="3" rx="1.5" fill="#EF4444" />
              </g>
            )}
          </g>

          {/* Hair layer */}
          <g id="hair">
            {activeHair.id === 'short' && (
              <path d="M62,90 C62,55 138,55 138,90 C128,85 118,85 100,85 C82,85 72,85 62,90 Z" fill={activeHairColor.color} />
            )}
            {activeHair.id === 'curls' && (
              <g fill={activeHairColor.color}>
                <circle cx="100" cy="65" r="14" />
                <circle cx="85" cy="70" r="12" />
                <circle cx="115" cy="70" r="12" />
                <circle cx="73" cy="85" r="10" />
                <circle cx="127" cy="85" r="10" />
              </g>
            )}
            {activeHair.id === 'spiky' && (
              <path d="M62,88 L75,55 L88,70 L100,45 L112,70 L125,55 L138,88 Z" fill={activeHairColor.color} />
            )}
            {activeHair.id === 'afro' && (
              <circle cx="100" cy="78" r="32" fill={activeHairColor.color} />
            )}
            {activeHair.id === 'wizard' && (
              <g>
                {/* Blue wizards hat */}
                <path d="M50,85 L150,85 L100,20 Z" fill="#4338CA" />
                <ellipse cx="100" cy="85" rx="55" ry="6" fill="#312E81" />
                <path d="M90,55 L100,45 L110,55 Z" fill="#F59E0B" /> {/* gold star */}
              </g>
            )}
          </g>

          {/* Accessory Overlay */}
          <g id="accessories">
            {activeAccessory.id === 'glasses' && (
              <g stroke="#111827" strokeWidth="3" fill="none">
                <rect x="74" y="90" width="20" height="12" rx="3" />
                <rect x="106" y="90" width="20" height="12" rx="3" />
                <line x1="94" y1="96" x2="106" y2="96" />
              </g>
            )}
            {activeAccessory.id === 'vr' && (
              <g>
                <rect x="70" y="86" width="60" height="18" rx="5" fill="#10B981" />
                <rect x="75" y="90" width="50" height="10" rx="3" fill="#047857" />
                <line x1="75" y1="95" x2="125" y2="95" stroke="#34D399" strokeWidth="2" />
              </g>
            )}
            {activeAccessory.id === 'crown' && (
              <g>
                <path d="M70,68 L85,45 L100,58 L115,45 L130,68 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="100" cy="58" r="2.5" fill="#EF4444" />
                <circle cx="85" cy="45" r="2" fill="#3B82F6" />
                <circle cx="115" cy="45" r="2" fill="#10B981" />
              </g>
            )}
          </g>
        </svg>

        {/* Pet display overlays */}
        {activePet.id !== 'none' && (
          <motion.div 
            initial={{ scale: 0.8, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="absolute bottom-2.5 right-4 bg-black/70 border border-white/20 rounded-full w-10 h-10 flex items-center justify-center text-xl shadow"
          >
            {activePet.emoji}
          </motion.div>
        )}
      </div>
    );
  };

  const categories = [
    { key: 'hair' as keyof AvatarConfig, title: 'Hairstyle', options: HAIR_OPTIONS },
    { key: 'hairColor' as keyof AvatarConfig, title: 'Hair Color', options: HAIR_COLORS },
    { key: 'outfit' as keyof AvatarConfig, title: 'Trader Outfit', options: OUTFIT_OPTIONS },
    { key: 'accessory' as keyof AvatarConfig, title: 'Accessories', options: ACCESSORY_OPTIONS },
    { key: 'pet' as keyof AvatarConfig, title: 'Pets & Sidekicks', options: PET_OPTIONS },
    { key: 'bg' as keyof AvatarConfig, title: 'Profile Backdrop', options: BACKGROUND_OPTIONS },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1.5">
      {/* Visual Canvas Column */}
      <div className="lg:col-span-4 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
        <div className="mb-4 text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
          <User className="w-4 h-4 text-blue-400" /> Interactive Profile Avatar
        </div>
        
        {renderAvatarSVG()}

        <h4 className="mt-4 font-bold text-sm text-white">Custom GrowAvatar</h4>
        <p className="text-xs text-white/50 mt-1 max-w-xs leading-relaxed">
          Unlock cosmetic layers to personalize your presence inside the academy and community boards.
        </p>

        {/* Gold stats summary */}
        <div className="mt-5 bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-xs font-mono font-bold text-yellow-400">{gold} Gold Coins available</span>
        </div>
      </div>

      {/* Customization Options Grid */}
      <div className="lg:col-span-8 space-y-5 overflow-y-auto max-h-[480px] pr-2">
        {categories.map((cat) => {
          const currentVal = config[cat.key];

          return (
            <div key={cat.key} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> {cat.title}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {cat.options.map((option) => {
                  const assetKey = `${cat.key}-${option.id}`;
                  const isUnlocked = unlockedAssets.includes(assetKey) || option.cost === 0;
                  const isSelected = currentVal === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAsset(cat.key, option.id, option.cost)}
                      className={`p-2 rounded-xl border text-left transition-all relative flex items-center gap-2 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600/15 border-blue-500 text-blue-300' 
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-lg">
                        {'emoji' in option ? option.emoji : (
                          <div className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: option.color }} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold truncate leading-snug">{option.name}</p>
                        {isUnlocked ? (
                          <p className="text-[8px] text-white/30 font-mono flex items-center gap-0.5">
                            {isSelected ? <Check className="w-2.5 h-2.5 text-blue-400" /> : 'Owned'}
                          </p>
                        ) : (
                          <p className="text-[8px] text-yellow-400 font-bold font-mono flex items-center gap-0.5">
                            <Coins className="w-2.5 h-2.5" /> {option.cost}
                          </p>
                        )}
                      </div>

                      {!isUnlocked && (
                        <div className="absolute top-1.5 right-1.5 text-white/40">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AvatarCustomizer;
