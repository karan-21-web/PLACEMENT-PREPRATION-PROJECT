import React from 'react';
import { Trash2, Building2, User, BookOpen } from 'lucide-react';

const QuestionCard = ({ question, onDelete }) => {
  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'HR': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'Technical': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'DSA': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'OOPs': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'DBMS': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'OS': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'CN': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      case 'Projects': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getDifficultyStyle = (diff) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400';
      case 'Medium': return 'text-amber-400';
      case 'Hard': return 'text-rose-400';
      default: return 'text-slate-400';
    }
  };

  const getSourceStyle = (src) => {
    switch (src) {
      case 'AI Generated': return 'text-purple-400';
      case 'Community': return 'text-blue-400';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 group hover:border-brand-500/30 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {/* Question Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {question.question}
          </p>

          <div className="flex items-center gap-3 flex-wrap text-xs">
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getCategoryStyle(question.category)}`}>
              {question.category}
            </span>
            <span className={`font-semibold ${getDifficultyStyle(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Building2 className="w-3 h-3" />
              {question.company}
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <User className="w-3 h-3" />
              {question.role}
            </span>
            <span className={`flex items-center gap-1 ${getSourceStyle(question.source)}`}>
              <BookOpen className="w-3 h-3" />
              {question.source}
            </span>
          </div>
        </div>

        {/* Delete Action */}
        {onDelete && (
          <button
            onClick={() => onDelete(question._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            title="Remove Question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
