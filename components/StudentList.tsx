
import React, { useState } from 'react';
import { 
  Search,
  ChevronRight,
  Filter,
  Users,
  MapPin,
  Target,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Student } from '../types';

interface Props {
  students: Student[];
  onSelect: (student: Student) => void;
  onDelete: (id: string) => void;
  countries: string[];
  counselors: string[];
}

const StudentList: React.FC<Props> = ({ students, onSelect, onDelete, countries, counselors }) => {
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterCounselor, setFilterCounselor] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredStudents = students.filter(s => {
    const matchesCountry = filterCountry === 'All' || s.targetCountry === filterCountry;
    const matchesCounselor = filterCounselor === 'All' || s.agentName === filterCounselor;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesCounselor && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    if (status === 'Depart') return 'bg-slate-900 text-white shadow-lg shadow-slate-200';
    if (status === 'Visa') return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20';
    return 'bg-blue-50 text-blue-600 border border-blue-100';
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      onDelete(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000); // Reset after 3 seconds
    }
  };

  return (
    <div className="space-y-8 animate-bounce-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Processing Matrix</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Lifecycle Management Console</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Query terminal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-400 outline-none text-sm font-semibold transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="bg-transparent text-slate-600 text-[11px] font-bold uppercase outline-none cursor-pointer"
            >
              <option value="All">All Markets</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
            <Target size={14} className="text-slate-400" />
            <select 
              value={filterCounselor}
              onChange={(e) => setFilterCounselor(e.target.value)}
              className="bg-transparent text-slate-600 text-[11px] font-bold uppercase outline-none cursor-pointer"
            >
              <option value="All">All Staff</option>
              {counselors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] border-b border-slate-100">
                <th className="px-10 py-6">Candidate Profile</th>
                <th className="px-10 py-6">Market</th>
                <th className="px-10 py-6">Lifecycle Status</th>
                <th className="px-10 py-6">Mission Lead</th>
                <th className="px-10 py-6 text-center">Action Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="group hover:bg-blue-50/30 transition-all cursor-pointer" 
                  onClick={() => onSelect(student)}
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 border border-slate-200 flex items-center justify-center font-bold text-lg transition-all group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20 group-hover:-rotate-3">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[15px] tracking-tight">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 group-hover:text-blue-500 transition-colors">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 font-bold text-slate-600 text-[12px] uppercase">
                      <MapPin size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      {student.targetCountry}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] ${getStatusStyle(student.currentStatus)}`}>
                      {student.currentStatus}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-slate-500 font-bold text-[11px] uppercase tracking-wider">{student.agentName}</td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={(e) => handleDelete(e, student.id)}
                        className={`p-3 rounded-2xl transition-all flex items-center gap-2 ${
                          deleteConfirmId === student.id 
                            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-200' 
                            : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'
                        }`}
                        title={deleteConfirmId === student.id ? "Click again to confirm" : "Delete Student"}
                      >
                        {deleteConfirmId === student.id ? (
                          <><AlertTriangle size={18} /><span className="text-[10px] font-bold uppercase">Confirm?</span></>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                      <div className="p-2.5 rounded-xl text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all group-hover:translate-x-1">
                        <ChevronRight size={22} strokeWidth={2.5} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Users size={64} strokeWidth={1} />
                      <p className="font-bold text-slate-800 text-sm uppercase tracking-[0.4em]">Empty Protocol</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
