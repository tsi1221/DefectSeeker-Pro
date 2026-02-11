
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Defect, User, DefectStatus, DefectSeverity, UserRole } from '../types';

interface DefectListProps {
  defects: Defect[];
  users: User[];
  onDelete: (id: string) => void;
  onBulkUpdateStatus?: (ids: string[], status: DefectStatus) => void;
  onBulkDelete?: (ids: string[]) => void;
  currentUser: User;
}

interface FilterSortState {
  status: string;
  severity: string;
  search: string;
  reporterId: string;
  assigneeId: string;
  startDate: string;
  endDate: string;
  sortBy: 'createdAt' | 'severity' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
}

const STORAGE_KEY = 'ds_mvp_inventory_state';

const DEFAULT_STATE: FilterSortState = {
  status: 'All',
  severity: 'All',
  search: '',
  reporterId: 'All',
  assigneeId: 'All',
  startDate: '',
  endDate: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  currentPage: 1,
  itemsPerPage: 10
};

const SEVERITY_WEIGHTS = {
  [DefectSeverity.CRITICAL]: 4,
  [DefectSeverity.HIGH]: 3,
  [DefectSeverity.MEDIUM]: 2,
  [DefectSeverity.LOW]: 1,
};

const DefectList: React.FC<DefectListProps> = ({ 
  defects, 
  users, 
  onDelete, 
  onBulkUpdateStatus, 
  onBulkDelete,
  currentUser 
}) => {
  // Load state from persistence
  const [state, setState] = useState<FilterSortState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } catch (e) { console.error("Filter Restore Failed", e); }
    }
    return DEFAULT_STATE;
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sync to persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateFilter = (updates: Partial<FilterSortState>) => {
    setState(prev => ({ ...prev, ...updates, currentPage: updates.currentPage || 1 }));
  };

  const filtered = useMemo(() => {
    return defects.filter(d => {
      const matchesStatus = state.status === 'All' || d.status === state.status;
      const matchesSeverity = state.severity === 'All' || d.severity === state.severity;
      const matchesSearch = d.title.toLowerCase().includes(state.search.toLowerCase()) || 
                            d.id.toLowerCase().includes(state.search.toLowerCase());
      const matchesReporter = state.reporterId === 'All' || d.reporterId === state.reporterId;
      const matchesAssignee = state.assigneeId === 'All' || d.assigneeId === state.assigneeId;
      
      const date = new Date(d.createdAt);
      const matchesStart = !state.startDate || date >= new Date(state.startDate);
      const matchesEnd = !state.endDate || date <= new Date(state.endDate + 'T23:59:59');

      return matchesStatus && matchesSeverity && matchesSearch && 
             matchesReporter && matchesAssignee && matchesStart && matchesEnd;
    });
  }, [defects, state]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let comp = 0;
      if (state.sortBy === 'severity') {
        comp = (SEVERITY_WEIGHTS[a.severity] || 0) - (SEVERITY_WEIGHTS[b.severity] || 0);
      } else if (state.sortBy === 'title') {
        comp = a.title.localeCompare(b.title);
      } else if (state.sortBy === 'status') {
        comp = a.status.localeCompare(b.status);
      } else {
        comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return state.sortOrder === 'desc' ? -comp : comp;
    });
  }, [filtered, state.sortBy, state.sortOrder]);

  const totalPages = Math.ceil(sorted.length / state.itemsPerPage);
  const paginated = useMemo(() => {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    return sorted.slice(start, start + state.itemsPerPage);
  }, [sorted, state.currentPage, state.itemsPerPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginated.length) setSelectedIds([]);
    else setSelectedIds(paginated.map(d => d.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkStatus = (status: DefectStatus) => {
    if (onBulkUpdateStatus) onBulkUpdateStatus(selectedIds, status);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Defect Inventory</h1>
          <p className="text-slate-500 text-sm font-medium">Manage software quality lifecycle and assignments.</p>
        </div>
        {(currentUser.role === UserRole.QA || currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER) && (
          <Link to="/defects/new" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-2">
            <i className="fa-solid fa-bug"></i> Report Defect
          </Link>
        )}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search by ID or title summary..."
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-semibold transition-all"
              value={state.search}
              onChange={(e) => updateFilter({ search: e.target.value })}
            />
          </div>
          <button 
            onClick={() => updateFilter(DEFAULT_STATE)}
            className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            Reset Application Filters
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer" value={state.status} onChange={(e) => updateFilter({ status: e.target.value })}>
              <option value="All">All Status</option>
              {Object.values(DefectStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Severity</label>
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer" value={state.severity} onChange={(e) => updateFilter({ severity: e.target.value })}>
              <option value="All">All Severity</option>
              {Object.values(DefectSeverity).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee</label>
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer" value={state.assigneeId} onChange={(e) => updateFilter({ assigneeId: e.target.value })}>
              <option value="All">Any Member</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="space-y-2 lg:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sorting Configuration</label>
            <select className="w-full px-3 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 outline-none cursor-pointer" value={`${state.sortBy}-${state.sortOrder}`} onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [any, any];
              updateFilter({ sortBy, sortOrder });
            }}>
              <option value="createdAt-desc">Newest Activity First</option>
              <option value="createdAt-asc">Oldest Records First</option>
              <option value="severity-desc">Threat Level: High to Low</option>
              <option value="severity-asc">Threat Level: Low to High</option>
              <option value="title-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Page Size</label>
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer" value={state.itemsPerPage} onChange={(e) => updateFilter({ itemsPerPage: Number(e.target.value) })}>
              <option value="10">10 Items</option>
              <option value="25">25 Items</option>
              <option value="50">50 Items</option>
            </select>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-8 py-5 rounded-[2rem] flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Selected Entities</span>
              <span className="text-sm font-bold">{selectedIds.length} records active</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex gap-2">
              <button onClick={() => handleBulkStatus(DefectStatus.RESOLVED)} className="px-4 py-2 bg-white/5 hover:bg-indigo-600 rounded-xl text-[10px] font-black uppercase transition-all">Resolve Bulk</button>
              <button onClick={() => handleBulkStatus(DefectStatus.CLOSED)} className="px-4 py-2 bg-white/5 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase transition-all">Close Bulk</button>
            </div>
          </div>
          {(currentUser.role === UserRole.MANAGER || currentUser.role === UserRole.ADMIN) && (
            <button onClick={() => { if(confirm(`Purge ${selectedIds.length} records?`)) onBulkDelete?.(selectedIds); setSelectedIds([]); }} className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-[10px] font-black uppercase transition-all">Permanent Delete</button>
          )}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 w-12 text-center">
                   <input type="checkbox" className="w-4 h-4 rounded-lg text-indigo-600 focus:ring-indigo-500" checked={selectedIds.length === paginated.length && paginated.length > 0} onChange={toggleSelectAll} />
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Profile</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary & Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Criticality</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(d => (
                <tr key={d.id} className={`hover:bg-slate-50/30 transition-colors group ${selectedIds.includes(d.id) ? 'bg-indigo-50/20' : ''}`}>
                  <td className="px-6 py-4 text-center">
                     <input type="checkbox" className="w-4 h-4 rounded-lg text-indigo-600 focus:ring-indigo-500" checked={selectedIds.includes(d.id)} onChange={() => toggleSelect(d.id)} />
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-100/50">{d.id}</span>
                       <span className={`text-[9px] font-black uppercase tracking-tight px-2 py-0.5 border rounded-md w-fit ${
                         d.status === DefectStatus.OPEN ? 'text-blue-600 border-blue-100 bg-blue-50/30' :
                         d.status === DefectStatus.IN_PROGRESS ? 'text-amber-600 border-amber-100 bg-amber-50/30' :
                         d.status === DefectStatus.RESOLVED ? 'text-green-600 border-green-100 bg-green-50/30' :
                         'text-slate-400 border-slate-100 bg-slate-50'
                       }`}>{d.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <Link to={`/defects/${d.id}`} className="block">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{d.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{d.category}</span>
                        <span className="text-[10px] text-slate-200">|</span>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(d.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                         <div className={`w-2.5 h-2.5 rounded-full ${
                           d.severity === DefectSeverity.CRITICAL ? 'bg-red-500 animate-pulse shadow-lg shadow-red-200' :
                           d.severity === DefectSeverity.HIGH ? 'bg-orange-500 shadow-md shadow-orange-100' :
                           d.severity === DefectSeverity.MEDIUM ? 'bg-amber-500' : 'bg-slate-400'
                         }`}></div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{d.severity}</span>
                       </div>
                       {d.predictedSeverity && d.predictedSeverity !== d.severity && (
                         <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100 w-fit">
                            <i className="fa-solid fa-wand-magic-sparkles text-[8px] text-indigo-500"></i>
                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter">AI Suggests: {d.predictedSeverity}</span>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Link to={`/defects/${d.id}`} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-100"><i className="fa-solid fa-eye"></i></Link>
                       {(currentUser.role === UserRole.MANAGER || currentUser.role === UserRole.ADMIN) && (
                         <button onClick={() => onDelete(d.id)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-xl hover:bg-white transition-all shadow-sm border border-transparent hover:border-slate-100"><i className="fa-solid fa-trash"></i></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-200 text-2xl">
                        <i className="fa-solid fa-folder-open"></i>
                      </div>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Empty Inventory Result</p>
                      <p className="text-xs text-slate-400 mt-2 font-medium">No records match the active session parameters.</p>
                      <button onClick={() => updateFilter(DEFAULT_STATE)} className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">Clear Filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Records <span className="text-slate-900">{(state.currentPage - 1) * state.itemsPerPage + 1} - {Math.min(state.currentPage * state.itemsPerPage, sorted.length)}</span> of <span className="text-slate-900 font-black">{sorted.length}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button disabled={state.currentPage === 1} onClick={() => updateFilter({ currentPage: state.currentPage - 1 })} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"><i className="fa-solid fa-chevron-left"></i></button>
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilter({ currentPage: i + 1 })}
                  className={`w-11 h-11 rounded-2xl text-[10px] font-black transition-all ${
                    state.currentPage === i + 1 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-indigo-600' 
                    : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200 shadow-sm'
                  }`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, state.currentPage - 3), Math.min(totalPages, state.currentPage + 2))}
            </div>
            <button disabled={state.currentPage === totalPages || totalPages === 0} onClick={() => updateFilter({ currentPage: state.currentPage + 1 })} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"><i className="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefectList;
