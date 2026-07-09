import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Search, Trash2, Bookmark, FileText, Info, HelpCircle } from 'lucide-react';
import { NoteItem, SavedBookmark } from '../types';
import { gameAudio } from '../utils/audio';

interface NotesAndBookmarksProps {
  notes: NoteItem[];
  onAddNote: (lessonNum: number, lessonTitle: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  bookmarks: SavedBookmark[];
  onToggleBookmark: (lessonNum: number, title: string) => void;
  onJumpToLesson: (lessonNum: number) => void;
}

const FINANCE_GLOSSARY = [
  { term: 'Compound Interest', def: 'The addition of interest to the principal sum of a loan or deposit, or interest on interest. Over decades, this creates massive exponential wealth gains!' },
  { term: 'Technical Analysis', def: 'A trading discipline employed to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.' },
  { term: 'Fundamental Analysis', def: 'Evaluating a security by attempting to measure its intrinsic value, by examining related economic, financial, and other qualitative and quantitative factors.' },
  { term: 'Dividend Yield', def: 'A financial ratio that shows how much a company pays out in dividends each year relative to its stock price. It acts as a passive cash flow stream.' },
  { term: 'Bull & Bear Markets', def: 'A bull market is a market that is on the rise and where the economy is sound; while a bear market exists in an economy that is receding and where most stocks are declining in value.' },
  { term: 'Support & Resistance', def: 'Support is the price level at which demand is strong enough to prevent the price from declining further. Resistance is the price level at which selling pressure prevents the price from rising higher.' },
  { term: 'Order Book', def: 'The list of buy and sell orders for a specific security or financial instrument, organized by price level.' },
  { term: 'Volatility', def: 'A statistical measure of the dispersion of returns for a given security or market index. Higher volatility represents greater trading risk but higher potential swing profits.' },
];

export const NotesAndBookmarks: React.FC<NotesAndBookmarksProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  bookmarks,
  onToggleBookmark,
  onJumpToLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'bookmarks' | 'glossary'>('notes');
  const [noteInput, setNoteInput] = useState<string>('');
  const [selectedLessonNum, setSelectedLessonNum] = useState<number>(1);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('Introduction to Investing');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    gameAudio.playClick();
    onAddNote(selectedLessonNum, selectedLessonTitle, noteInput.trim());
    setNoteInput('');
  };

  const filteredGlossary = FINANCE_GLOSSARY.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.def.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
      {/* Tab Selectors */}
      <div className="flex gap-2 border-b border-white/5 pb-4 mb-5">
        <button
          onClick={() => { gameAudio.playClick(); setActiveTab('notes'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'notes' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          <FileText className="w-4 h-4" /> My Study Notes ({notes.length})
        </button>
        <button
          onClick={() => { gameAudio.playClick(); setActiveTab('bookmarks'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'bookmarks' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          <Bookmark className="w-4 h-4" /> Bookmarked Lessons ({bookmarks.length})
        </button>
        <button
          onClick={() => { gameAudio.playClick(); setActiveTab('glossary'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'glossary' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Financial Glossary
        </button>
      </div>

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-5">
          {/* Create custom study note inline */}
          <form onSubmit={handleCreateNote} className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <h5 className="text-[11px] font-extrabold uppercase tracking-widest text-white/40">Quick Study Scratchpad</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-white/30 font-mono">Reference Lesson Level #</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={selectedLessonNum}
                  onChange={(e) => setSelectedLessonNum(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-white/30 font-mono">Topic Title Description</label>
                <input
                  type="text"
                  value={selectedLessonTitle}
                  onChange={(e) => setSelectedLessonTitle(e.target.value)}
                  placeholder="e.g. Price Action Trading"
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none placeholder-white/20"
                />
              </div>
            </div>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Jot down notes, formulas, or strategies to remember..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none h-16 resize-none placeholder-white/20"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!noteInput.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-40"
              >
                Save Study Note
              </button>
            </div>
          </form>

          {/* Notes display list */}
          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2">
            {notes.length === 0 ? (
              <div className="text-center py-6 text-xs text-white/30 italic">
                No study notes saved. Create one above to keep track of formulas and trading definitions!
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold bg-blue-600/25 border border-blue-500/20 px-2 py-0.5 rounded text-blue-400">
                        Level {note.lessonNum}
                      </span>
                      <h6 className="font-bold text-[11px] text-white">{note.lessonTitle}</h6>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed font-medium">{note.content}</p>
                    <p className="text-[9px] text-white/30 font-mono">{note.timestamp}</p>
                  </div>
                  
                  <button
                    onClick={() => { gameAudio.playClick(); onDeleteNote(note.id); }}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 text-xs text-white/30 italic">
              No bookmarked lessons yet. Click the bookmark icon inside active lessons to save them here for rapid review!
            </div>
          ) : (
            bookmarks.map((b) => (
              <div key={b.lessonNum} className="flex justify-between items-center bg-white/5 border border-white/10 p-3.5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-yellow-400"># Level {b.lessonNum}</span>
                  <span className="text-xs text-white/80 font-bold">{b.title}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onJumpToLesson(b.lessonNum)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-bold cursor-pointer"
                  >
                    Jump to Lesson
                  </button>
                  <button
                    onClick={() => onToggleBookmark(b.lessonNum, b.title)}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-yellow-400 rounded-xl cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: GLOSSARY */}
      {activeTab === 'glossary' && (
        <div className="space-y-4">
          {/* Glossary Search Field */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <Search className="w-4 h-4 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search financial terms, indices, indicators..."
              className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder-white/20"
            />
          </div>

          {/* Dictionary Display List */}
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1 hover:border-white/10 transition-all">
                <h6 className="font-bold text-xs text-blue-400">{item.term}</h6>
                <p className="text-[11px] text-white/60 leading-relaxed font-medium">{item.def}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotesAndBookmarks;
