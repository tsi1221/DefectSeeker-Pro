
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Defect, User, DefectStatus, DefectSeverity, Comment } from '../types';

interface DefectDetailProps {
  defects: Defect[];
  users: User[];
  currentUser: User;
  onUpdate: (defect: Defect) => void;
}

const DefectDetail: React.FC<DefectDetailProps> = ({ defects, users, currentUser, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const defect = defects.find(d => d.id === id);

  const [commentText, setCommentText] = useState('');

  if (!defect) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Defect not found</h2>
        <Link to="/defects" className="text-indigo-600 mt-4 inline-block font-medium">Back to List</Link>
      </div>
    );
  }

  const reporter = users.find(u => u.id === defect.reporterId);
  const assignee = users.find(u => u.id === defect.assigneeId);

  const handleStatusChange = (newStatus: DefectStatus) => {
    onUpdate({ ...defect, status: newStatus, updatedAt: new Date().toISOString() });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: commentText,
      createdAt: new Date().toISOString()
    };

    onUpdate({
      ...defect,
      comments: [...defect.comments, newComment],
      updatedAt: new Date().toISOString()
    });
    setCommentText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 text-slate-400 text-sm">
        <Link to="/defects" className="hover:text-indigo-600 transition-colors">Defects</Link>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span className="text-slate-600 font-medium">{defect.id}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-900 leading-tight flex-1 min-w-[300px]">
                {defect.title}
              </h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  defect.severity === DefectSeverity.CRITICAL ? 'bg-red-500 text-white' :
                  defect.severity === DefectSeverity.HIGH ? 'bg-orange-500 text-white' :
                  defect.severity === DefectSeverity.MEDIUM ? 'bg-amber-500 text-white' :
                  'bg-slate-400 text-white'
                }`}>
                  {defect.severity}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase">
                  {defect.category}
                </span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Description</h3>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{defect.description}</p>
            </div>

            {defect.aiReasoning && (
              <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-sparkles text-indigo-600"></i>
                  <span className="text-sm font-bold text-indigo-900">AI Intelligence Report</span>
                </div>
                <p className="text-sm text-indigo-800 italic">"{defect.aiReasoning}"</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i className="fa-regular fa-comment-dots text-indigo-600"></i>
              Discussion ({defect.comments.length})
            </h3>

            <div className="space-y-6 mb-8">
              {defect.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 flex items-center justify-center text-slate-400 font-bold">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-slate-900">{comment.authorName}</span>
                      <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
              {defect.comments.length === 0 && (
                <p className="text-center text-slate-400 py-4 text-sm italic">No comments yet. Start the conversation!</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 shrink-0 flex items-center justify-center text-indigo-600 font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
                  placeholder="Post an update or question..."
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Status & Control</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-2">Current Status</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={defect.status}
                  onChange={(e) => handleStatusChange(e.target.value as DefectStatus)}
                >
                  {Object.values(DefectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                 <button className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-200 hover:bg-green-100 transition-all">
                   <i className="fa-solid fa-check mr-2"></i>Resolve
                 </button>
                 <button className="flex-1 py-2 bg-slate-50 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-100 transition-all">
                   <i className="fa-solid fa-clock-rotate-left mr-2"></i>History
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Personnel</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img src={reporter?.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="Reporter" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Reporter</p>
                  <p className="text-sm font-semibold text-slate-900">{reporter?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {assignee ? (
                  <>
                    <img src={assignee.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="Assignee" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Assignee</p>
                      <p className="text-sm font-semibold text-slate-900">{assignee.name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                      <i className="fa-solid fa-user-plus"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Assignee</p>
                      <p className="text-sm font-semibold text-slate-300 italic">None assigned</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm">
                 <i className="fa-solid fa-clock"></i>
               </div>
               <span className="font-bold text-sm">Temporal Data</span>
             </div>
             <div className="space-y-3">
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400">Created</span>
                 <span className="font-medium">{new Date(defect.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between text-xs">
                 <span className="text-slate-400">Last Modified</span>
                 <span className="font-medium">{new Date(defect.updatedAt).toLocaleDateString()}</span>
               </div>
               <div className="pt-3 mt-3 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 italic">All actions are logged for audit compliance.</p>
               </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DefectDetail;
