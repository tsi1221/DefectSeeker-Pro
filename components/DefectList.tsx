
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Defect, User, DefectStatus, DefectSeverity } from '../types';

interface DefectListProps {
  defects: Defect[];
  users: User[];
  onDelete: (id: string) => void;
}

interface FilterState {
  status: string;
  severity: string;
  search: string;
  reporterId: string;
  assigneeId: string;
  startDate: string;
  endDate: string;
}

const STORAGE_KEY = 'ds_defect_filters';

const DefectList: React.FC<DefectListProps> = ({ defects, users, onDelete }) => {
  // Initialize filter state from local storage or defaults
  const [filter, setFilter] = useState<FilterState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved filters", e);
      }
    }
    return {
      status: 'All',
      severity: 'All',
      search: '',
      reporterId: 'All',
      assigneeId: 'All',
      startDate: '',
      endDate: ''
    };
  });

  // Persist filters to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filter));
  }, [filter]);

  const filteredDefects = useMemo(() => {
    return defects.filter(d => {
      const matchesStatus = filter.status === 'All' || d.status === filter.status;
      const matchesSeverity = filter.severity === 'All' || d.severity === filter.severity;
      const matchesSearch = d.title.toLowerCase().includes(filter.search.toLowerCase()) || 
                            d.id.toLowerCase().includes(filter.search.toLowerCase());
      const matchesReporter = filter.reporterId === 'All' || d.reporterId === filter.reporterId;
      const matchesAssignee = filter.assigneeId === 'All' || d.assigneeId === filter.assigneeId;
      
      const defectDate = new Date(d.createdAt);
      const matchesStartDate = !filter.startDate || defectDate >= new Date(filter.startDate);
      const matchesEndDate = !filter.endDate || defectDate <= new Date(filter.endDate + 'T23:59:59');

      return matchesStatus && matchesSeverity && matchesSearch && 
             matchesReporter && matchesAssignee && matchesStartDate && matchesEndDate;
    });
  }, [defects, filter]);

  const getSeverityStyle = (severity: DefectSeverity) => {
    switch (severity) {
      case DefectSeverity.CRITICAL: return 'bg-red-500 text-white';
      case DefectSeverity.HIGH: return 'bg-orange-500 text-white';
      case DefectSeverity.MEDIUM: return 'bg-amber-500 text-white';
      case DefectSeverity.LOW: return 'bg-slate-400 text-white';
    }
  };

  const getStatusStyle = (status: DefectStatus) => {
    switch (status) {
      case DefectStatus.OPEN: return 'text-blue-600 border-blue-200 bg-blue-50';
      case DefectStatus.IN_PROGRESS: return 'text-amber-600 border-amber-200 bg-amber-50';
      case DefectStatus.RESOLVED: return 'text-green-600 border-green-200 bg-green-50';
      case DefectStatus.CLOSED: return 'text-slate-600 border-slate-200 bg-slate-50';
      default: return 'text-slate-600 border-slate-200 bg-slate-50';
    }
  };

  const clearFilters = () => {
    setFilter({
      status: 'All',
      severity: 'All',
      search: '',
      reporterId: 'All',
      assigneeId: 'All',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Defect Inventory</h1>
          <p className="text-slate-500">Manage and track all identified software issues with advanced filtering.</p>
        </div>
        <Link to="/defects/new" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
          <i className="fa-solid fa-plus"></i>
          Report Issue
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search title, description or defect ID..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <button 
            onClick={clearFilters}
            className="px-4 py-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-filter-circle-xmark"></i>
            Reset Filters
          </button>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="All">All Statuses</option>
              {Object.values(DefectStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Severity</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
              value={filter.severity}
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
            >
              <option value="All">All Severities</option>
              {Object.values(DefectSeverity).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Reporter</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
              value={filter.reporterId}
              onChange={(e) => setFilter(prev => ({ ...prev, reporterId: e.target.value }))}
            >
              <option value="All">Any Reporter</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Assignee</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
              value={filter.assigneeId}
              onChange={(e) => setFilter(prev => ({ ...prev, assigneeId: e.target.value }))}
            >
              <option value="All">Any Assignee</option>
              <option value="unassigned">Unassigned</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">From Date</label>
            <input 
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
              value={filter.startDate}
              onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">To Date</label>
            <input 
              type="date"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50"
              value={filter.endDate}
              onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID & Title</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Personnel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefects.map((defect) => {
                const assignee = users.find(u => u.id === defect.assigneeId);
                const reporter = users.find(u => u.id === defect.reporterId);
                return (
                  <tr key={defect.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <Link to={`/defects/${defect.id}`} className="block max-w-xs md:max-w-md">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">{defect.id}</span>
                        <p className="text-sm font-bold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors truncate">{defect.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-medium">{defect.category}</span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 font-medium">{new Date(defect.createdAt).toLocaleDateString()}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${getSeverityStyle(defect.severity)}`}>
                        {defect.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border whitespace-nowrap ${getStatusStyle(defect.status)}`}>
                        {defect.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase w-10">Assigned:</span>
                          {assignee ? (
                            <div className="flex items-center gap-1.5">
                              <img src={assignee.avatar} alt={assignee.name} className="w-5 h-5 rounded-full bg-slate-200" />
                              <span className="text-xs text-slate-600 font-medium">{assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase w-10">Reporter:</span>
                          <div className="flex items-center gap-1.5">
                            <img src={reporter?.avatar} alt={reporter?.name} className="w-5 h-5 rounded-full bg-slate-200" />
                            <span className="text-xs text-slate-600 font-medium">{reporter?.name}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/defects/${defect.id}`} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                        <button 
                          onClick={() => { if(confirm('Permanently delete this defect record?')) onDelete(defect.id); }}
                          className="text-slate-300 hover:text-red-500 transition-colors p-2"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDefects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="max-w-xs mx-auto text-slate-400">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-filter text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">No matches found</h3>
                      <p className="text-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
                      <button 
                        onClick={clearFilters}
                        className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-700">{filteredDefects.length}</span> of <span className="font-bold text-slate-700">{defects.length}</span> total defects
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefectList;
