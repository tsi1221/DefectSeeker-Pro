
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

const STORAGE_KEY = 'ds_inventory_v3_state';

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
  // 1. Initial State Hydration
  const [state, setState] = useState<FilterSortState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Hydration Error", e);
      }
    }
    return DEFAULT_STATE;
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 2. Persistence Sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // 3. Reset to page 1 on filter change
  const updateFilter = (updates: Partial<FilterSortState>) => {
    setState(prev => ({ ...prev, ...updates, currentPage: updates.currentPage || 1 }));
  };

  // 4. Filtering Logic
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

  // 5. Sorting Logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (state.sortBy === 'severity') {
        comparison = (SEVERITY_WEIGHTS[a.severity] || 0) - (SEVERITY_WEIGHTS[b.severity] || 0);
      } else if (state.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (state.sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return state.sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filtered, state.sortBy, state.sortOrder]);

  // 6. Pagination Logic
  const totalPages = Math.ceil(sorted.length / state.itemsPerPage);
  const paginated = useMemo(() => {
    const start = (state.currentPage - 1) * state.itemsPerPage;
    return sorted.slice(start, start + state.itemsPerPage);
  }, [sorted, state.currentPage, state.itemsPerPage]);

  // 7. Bulk Action Helpers
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
    <div className="space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Defect Inventory</h1>
          <p className="text-slate-500 text-sm">System-wide identified software anomalies and tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/defects/new" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <i className="fa-solid fa-plus mr-2"></i>New Incident
          </Link>
        </div>
      </div>

      {/* Persistent Filter Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search ID, Title..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all"
              value={state.search}
              onChange={(e) => updateFilter({ search: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateFilter(DEFAULT_STATE)}
              className="px-4 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <select 
            className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
            value={state.status}
            onChange={(e) => updateFilter({ status: e.target.value })}
          >
            <option value="All">All Status</option>
            {Object.values(DefectStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
            value={state.severity}
            onChange={(e) => updateFilter({ severity: e.target.value })}
          >
            <option value="All">All Severity</option>
            {Object.values(DefectSeverity).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
            value={state.assigneeId}
            onChange={(e) => updateFilter({ assigneeId: e.target.value })}
          >
            <option value="All">Any Assignee</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>

          <input 
            type="date" 
            className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
            value={state.startDate}
            onChange={(e) => updateFilter({ startDate: e.target.value })}
          />

          <select 
            className="px-3 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 outline-none"
            value={`${state.sortBy}-${state.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [any, any];
              updateFilter({ sortBy, sortOrder });
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="severity-desc">Highest Severity</option>
            <option value="title-asc">Title A-Z</option>
          </select>

          <select 
            className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none"
            value={state.itemsPerPage}
            onChange={(e) => updateFilter({ itemsPerPage: Number(e.target.value) })}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Selection Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white px-8 py-4 rounded-3xl flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest">{selectedIds.length} Selected</span>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkStatus(DefectStatus.RESOLVED)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase transition-all"
              >
                Mark Resolved
              </button>
              <button 
                onClick={() => handleBulkStatus(DefectStatus.CLOSED)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase transition-all"
              >
                Mark Closed
              </button>
            </div>
          </div>
          {currentUser.role === UserRole.MANAGER && (
            <button 
              onClick={() => { if(confirm('Delete selected?')) onBulkDelete?.(selectedIds); setSelectedIds([]); }}
              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-[10px] font-black uppercase transition-all"
            >
              Bulk Delete
            </button>
          )}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 w-12">
                   <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    checked={selectedIds.length === paginated.length && paginated.length > 0}
                    onChange={toggleSelectAll}
                   />
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Defect ID & Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Summary</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map(d => (
                <tr key={d.id} className={`hover:bg-slate-50/50 transition-colors ${selectedIds.includes(d.id) ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-6 py-4">
                     <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                      checked={selectedIds.includes(d.id)}
                      onChange={() => toggleSelect(d.id)}
                     />
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1.5">
                       <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg w-fit">{d.id}</span>
                       <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 border rounded-md w-fit ${
                         d.status === DefectStatus.OPEN ? 'text-blue-600 border-blue-100 bg-blue-50/50' :
                         d.status === DefectStatus.IN_PROGRESS ? 'text-amber-600 border-amber-100 bg-amber-50/50' :
                         'text-slate-400 border-slate-100 bg-slate-50'
                       }`}>{d.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/defects/${d.id}`} className="block group">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{d.title}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(d.createdAt).toLocaleDateString()} • {d.category}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         d.severity === DefectSeverity.CRITICAL ? 'bg-red-500 animate-pulse' :
                         d.severity === DefectSeverity.HIGH ? 'bg-orange-500' :
                         d.severity === DefectSeverity.MEDIUM ? 'bg-amber-500' : 'bg-slate-400'
                       }`}></div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{d.severity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Link to={`/defects/${d.id}`} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-all shadow-sm"><i className="fa-solid fa-eye"></i></Link>
                       {currentUser.role === UserRole.MANAGER && (
                         <button onClick={() => onDelete(d.id)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-all shadow-sm"><i className="fa-solid fa-trash"></i></button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="max-w-xs mx-auto">
                      <i className="fa-solid fa-folder-open text-4xl text-slate-200 mb-4"></i>
                      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">No matching records</p>
                      <p className="text-xs text-slate-400 mt-2">Adjust your filters or try a different search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Footer */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Showing <span className="text-slate-900">{Math.min(paginated.length, sorted.length)}</span> of <span className="text-slate-900">{sorted.length}</span> Total Records
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              disabled={state.currentPage === 1}
              onClick={() => updateFilter({ currentPage: state.currentPage - 1 })}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateFilter({ currentPage: i + 1 })}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    state.currentPage === i + 1 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, state.currentPage - 3), Math.min(totalPages, state.currentPage + 2))}
            </div>
            <button 
              disabled={state.currentPage === totalPages || totalPages === 0}
              onClick={() => updateFilter({ currentPage: state.currentPage + 1 })}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefectList;
