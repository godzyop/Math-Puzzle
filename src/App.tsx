import { adsManager } from './assets/admobConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Settings, 
  ShoppingBag, 
  Trophy, 
  Heart, 
  Timer, 
  Coins,
  ArrowLeft,
  RotateCcw,
  Home,
  Pause
} from 'lucide-react';
import { useGameLogic } from './hooks/useGameLogic';
import { GAME_MODES, THEMES } from './assets/constants';
import { useState } from 'react';

export default function App() {
  const {
    gameState,
    setGameState,
    gameMode,
    startGame,
    currentQuestion,
    handleAnswer,
    score,
    lives,
    coins,
    combo,
    timeLeft,
    stats,
    difficulty,
    setDifficulty
  } = useGameLogic();

  const [activeTheme, setActiveTheme] = useState(THEMES.DEFAULT);
  const [isPaused, setIsPaused] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [isAdLoading, setIsAdLoading] = useState(false);

  const watchAdForCoins = async () => {
    setIsAdLoading(true);
    const success = await adsManager.showRewardedAd();
    setIsAdLoading(false);
    
    if (success) {
      // Coins are automatically updated by the ads manager
      // The UI will update via the coinsUpdated event
    }
    window.location.reload(); // Refresh to update coin state
  };

  const onAnswer = (option: number) => {
    const isCorrect = handleAnswer(option);
    setLastResult(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => setLastResult(null), 500);
  };

  return (
    <div className={`min-h-screen ${activeTheme.bg} ${activeTheme.accent} font-sans transition-colors duration-500 flex flex-col items-center justify-center p-4 overflow-hidden`}>
      <AnimatePresence mode="wait">
        
        {/* MAIN MENU */}
        {gameState === 'MENU' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md flex flex-col items-center gap-8"
          >
            <div className="text-center">
              <motion.h1 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-6xl font-black mb-2 tracking-tight"
              >
                MATH<span className="text-blue-500">DASH</span>
              </motion.h1>
              <p className="text-slate-500 font-medium">Fast, Fun, Mathematical!</p>
            </div>

            <div className="flex flex-col w-full gap-4">
              <button 
                onClick={() => setGameState('MODE_SELECT')}
                className="group relative bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-bold text-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Play className="fill-current" /> PLAY NOW
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setGameState('SHOP')}
                  className="bg-white hover:bg-slate-50 p-4 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <ShoppingBag size={20} /> SHOP
                </button>
                <button 
                  onClick={() => setGameState('SETTINGS')}
                  className="bg-white hover:bg-slate-50 p-4 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Settings size={20} /> SETTINGS
                </button>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl w-full flex justify-around items-center border border-white">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Coins</span>
                <div className="flex items-center gap-1 text-xl font-black">
                  <Coins className="text-yellow-500" size={20} /> {coins}
                </div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase">Best Score</span>
                <div className="flex items-center gap-1 text-xl font-black">
                  <Trophy className="text-blue-500" size={20} /> {localStorage.getItem('math_game_best_score') || 0}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* MODE SELECTION */}
        {gameState === 'MODE_SELECT' && (
          <motion.div 
            key="mode-select"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setGameState('MENU')} className="bg-white p-3 rounded-2xl shadow-sm active:scale-90 transition-all">
                <ArrowLeft />
              </button>
              <h2 className="text-3xl font-black">Pick a Mode</h2>
            </div>

            <div className="grid gap-4">
              {Object.values(GAME_MODES).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => startGame(mode)}
                  className="bg-white p-6 rounded-3xl text-left border-2 border-transparent hover:border-blue-500 transition-all shadow-md active:scale-[0.98] group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-bold">{mode.name}</h3>
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Play size={16} fill="currentColor" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm">{mode.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* GAMEPLAY */}
        {gameState === 'PLAYING' && currentQuestion && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md h-full flex flex-col gap-6"
          >
            {/* HUD */}
            <div className="flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsPaused(true)} className="p-2 bg-slate-100 rounded-xl active:scale-90 transition-all">
                  <Pause size={20} />
                </button>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
                  <span className="text-xl font-black leading-none">{score}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {gameMode?.hasLives && (
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Heart 
                        key={i} 
                        size={18} 
                        className={i < lives ? "fill-red-500 text-red-500" : "text-slate-200"} 
                      />
                    ))}
                  </div>
                )}
                
                {(gameMode?.hasTimer || gameMode?.id === 'survival') && (
                  <div className={`flex items-center gap-2 font-black text-xl ${timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}`}>
                    <Timer size={20} /> {timeLeft}s
                  </div>
                )}
              </div>
            </div>

            {/* COMBO & FEEDBACK */}
            <div className="h-12 flex justify-center items-center">
              <AnimatePresence>
                {combo > 1 && (
                  <motion.div
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    className="bg-orange-500 text-white px-4 py-1 rounded-full font-black text-sm shadow-lg"
                  >
                    COMBO x{combo}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* QUESTION CARD */}
            <motion.div 
              className={`bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden ${
                lastResult === 'correct' ? 'ring-8 ring-green-400' : lastResult === 'wrong' ? 'ring-8 ring-red-400 animate-shake' : ''
              }`}
            >
              <div className="text-7xl font-black mb-8 tracking-tighter">
                {currentQuestion.question}
              </div>
              
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  key={currentQuestion.question}
                  transition={{ duration: timeLeft, ease: "linear" }}
                  className="h-full bg-blue-500"
                />
              </div>
            </motion.div>

            {/* OPTIONS */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={`${currentQuestion.question}-${idx}`}
                  onClick={() => onAnswer(option)}
                  className="bg-white p-8 rounded-[2rem] text-3xl font-black shadow-lg hover:bg-slate-50 active:scale-95 transition-all border-b-8 border-slate-200"
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULT SCREEN */}
        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <div className="bg-white p-8 rounded-[3rem] shadow-2xl text-center">
              <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
              <h2 className="text-4xl font-black mb-1 text-slate-900">Session Over!</h2>
              <p className="text-slate-500 mb-8 font-medium">Amazing effort today!</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-3xl">
                  <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
                  <div className="text-2xl font-black text-slate-900">{score}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl">
                  <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>
                  <div className="text-2xl font-black text-slate-900">{stats.correct}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl">
                  <span className="text-xs font-bold text-slate-400 uppercase">Best Combo</span>
                  <div className="text-2xl font-black text-slate-900">{stats.bestCombo}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl">
                  <span className="text-xs font-bold text-slate-400 uppercase">Coins</span>
                  <div className="flex items-center justify-center gap-1 text-2xl font-black text-slate-900">
                    <Coins className="text-yellow-500" size={20} /> {Math.floor(score / 10)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => startGame(gameMode!)}
                  className="bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                >
                  <RotateCcw size={20} /> TRY AGAIN
                </button>
                <button 
                  onClick={() => setGameState('MENU')}
                  className="bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Home size={20} /> HOME
                </button>
                
                <button 
                  onClick={watchAdForCoins}
                  disabled={isAdLoading}
                  className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg hover:from-yellow-500 hover:to-orange-600 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isAdLoading ? 'Loading Ad...' : (
                    <>
                      <Play className="fill-current" size={20} /> WATCH AD FOR +100 COINS
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SHOP SCREEN */}
        {gameState === 'SHOP' && (
          <motion.div 
            key="shop"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setGameState('MENU')} className="bg-white p-3 rounded-2xl shadow-sm active:scale-90 transition-all text-slate-900">
                <ArrowLeft />
              </button>
              <h2 className="text-3xl font-black text-slate-900">Theme Shop</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[60vh] pr-2">
              {Object.values(THEMES).map((theme) => (
                <div 
                  key={theme.id}
                  className={`p-6 rounded-3xl border-4 transition-all flex justify-between items-center ${
                    activeTheme.id === theme.id ? 'border-blue-500 bg-white' : 'border-transparent bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${theme.bg} border border-slate-200`} />
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{theme.name}</h3>
                      <p className="text-sm text-slate-500">Free Preview</p>
                    </div>
                  </div>
                  <button
                    disabled={activeTheme.id === theme.id}
                    onClick={() => {
                      if (activeTheme.id !== theme.id) {
                        setActiveTheme(theme);
                      }
                    }}
                    className={`px-6 py-2 rounded-xl font-bold transition-all active:scale-95 ${
                      activeTheme.id === theme.id 
                        ? 'bg-slate-100 text-slate-400 cursor-default' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {activeTheme.id === theme.id ? 'Equipped' : 'Select'}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 p-6 rounded-3xl border-2 border-yellow-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-xl text-yellow-700">
                <Coins size={24} /> {coins} Coins Available
              </div>
              <p className="text-xs font-bold text-yellow-600 uppercase">Solve more to earn!</p>
            </div>
          </motion.div>
        )}

        {/* SETTINGS SCREEN */}
        {gameState === 'SETTINGS' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-md flex flex-col gap-6"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setGameState('MENU')} className="bg-white p-3 rounded-2xl shadow-sm active:scale-90 transition-all text-slate-900">
                <ArrowLeft />
              </button>
              <h2 className="text-3xl font-black text-slate-900">Settings</h2>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-slate-900">Sound Effects</span>
                  <span className="text-sm text-slate-400">Feedback sounds</span>
                </div>
                <button className="w-14 h-8 bg-blue-600 rounded-full relative p-1 transition-all">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto" />
                </button>
              </div>

              <div className="h-[1px] bg-slate-100" />

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-slate-900">Music</span>
                  <span className="text-sm text-slate-400">Background tunes</span>
                </div>
                <button className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-all">
                  <div className="w-6 h-6 bg-white rounded-full" />
                </button>
              </div>

              <div className="h-[1px] bg-slate-100" />

              <div className="flex flex-col gap-2 text-slate-900">
                <span className="font-bold text-lg">Difficulty</span>
                <div className="grid grid-cols-2 gap-2">
                  {['EASY', 'MEDIUM', 'HARD', 'EXPERT'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-3 rounded-xl font-bold border-2 transition-all ${
                        difficulty === d 
                          ? 'bg-blue-50 border-blue-500 text-blue-600' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center text-slate-400 text-sm font-medium">
              Math Dash v1.0.0<br/>
              Ready for Unity Porting
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAUSE OVERLAY */}
      {isPaused && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-[2.5rem] w-full max-w-xs text-center"
          >
            <h2 className="text-3xl font-black mb-6">Paused</h2>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsPaused(false)}
                className="bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all"
              >
                RESUME
              </button>
              <button 
                onClick={() => { setIsPaused(false); startGame(gameMode!); }}
                className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all"
              >
                RESTART
              </button>
              <button 
                onClick={() => { setIsPaused(false); setGameState('MENU'); }}
                className="bg-red-50 text-red-500 py-4 rounded-2xl font-bold text-lg active:scale-95 transition-all"
              >
                QUIT
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* GLOBAL HUD ELEMENTS */}
      {gameState !== 'PLAYING' && (
         <div className="fixed top-6 right-6 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white">
            <div className="flex items-center gap-1.5 font-black">
              <Coins className="text-yellow-500" size={18} /> {coins}
            </div>
         </div>
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
