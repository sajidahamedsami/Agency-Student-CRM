
import React, { useState } from 'react';
import { Target, UserPlus, Phone, Globe, GraduationCap, Trash2, Filter, Languages, UserCheck, BookOpen, Layers, Users, Award, MapPin, Search, CheckCircle2, MessageSquare } from 'lucide-react';
import { Lead, ProgramType, LanguageTestType } from '../types';

interface Props {
  leads: Lead[];
  onAdd: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: any) => void;
  onDelete: (leadId: string) => void;
  referralSources: string[];
  referralPersons: string[];
  countries: string[];
}

const LeadsPage: React.FC<Props> = ({ leads, onAdd, onUpdateStatus, onDelete, referralSources, referralPersons, countries }) => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>('Bachelor');
  const [filterRep, setFilterRep] = useState('All');
  const [selectedTest, setSelectedTest] = useState<LanguageTestType>('N/A');
  const [selectedSource, setSelectedSource] = useState('Facebook Ad');
  
  const activeLeads = leads.filter(l => {
    const isNotConverted = l.status !== 'Converted to Student';
    const matchesRep = filterRep === 'All' || l.referralPerson === filterRep;
    return isNotConverted && matchesRep;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newLead: Lead = {
      id: 'l' + Math.random().toString(36).substr(2, 5),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string || '', 
      targetCountry: formData.get('country') as string,
      course: formData.get('course') as string || '',
      program: selectedProgram,
      source: selectedSource,
      referralPerson: formData.get('referralPerson') as string,
      sscGpa: formData.get('sscGpa') as string,
      hscGpa: formData.get('hscGpa') as string,
      bachelorCgpa: formData.get('bachelorCgpa') as string,
      mastersGpa: formData.get('mastersGpa') as string,
      collegeName: formData.get('collegeName') as string,
      languageTest: {
        testType: selectedTest,
        score: formData.get('testScore') as string,
        noBandLessThan: formData.get('noBandLess') as string,
      },
      status: 'New',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAdd(newLead);
    e.currentTarget.reset();
    setSelectedTest('N/A');
    setSelectedProgram('Bachelor');
  };

  return (
    <div className="space-y-8 animate-bounce-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Leads Pipeline</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Acquisition Terminal</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
             <Filter size={16} className="text-blue-500" />
             <select value={filterRep} onChange={(e) => setFilterRep(e.target.value)} className="bg-transparent border-none text-slate-600 text-[11px] font-bold uppercase outline-none cursor-pointer">
               <option value="All">All Representatives</option>
               {referralPersons.map(p => <option key={p} value={p}>{p}</option>)}
             </select>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Colorful Input Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-28 space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200"><UserPlus size={20} /></div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Prospect</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Lead Ingestion</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <input name="name" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all" placeholder="Full Name" />
                <input name="phone" required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-semibold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all" placeholder="Phone Number" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value as ProgramType)} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold uppercase outline-none focus:border-blue-500">
                  <option value="Bachelor">Bachelor</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
                <select name="country" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold uppercase outline-none focus:border-blue-500">
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="p-5 bg-blue-50/30 rounded-[1.5rem] border border-blue-100 space-y-4">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2"><Award size={14} /> Academic Record</p>
                <div className="grid grid-cols-2 gap-3">
                  <input name="sscGpa" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center" placeholder="SSC GPA" />
                  <input name="hscGpa" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center" placeholder="HSC GPA" />
                  {(selectedProgram === 'Masters' || selectedProgram === 'PhD') && (
                    <input name="bachelorCgpa" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center col-span-2" placeholder="Bachelor CGPA" />
                  )}
                  {selectedProgram === 'PhD' && (
                    <input name="mastersGpa" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center col-span-2" placeholder="Masters CGPA" />
                  )}
                </div>
              </div>

              <div className="p-5 bg-emerald-50/30 rounded-[1.5rem] border border-emerald-100 space-y-4">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2"><Languages size={14} /> Language Test</p>
                <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value as LanguageTestType)} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase">
                  <option value="N/A">None</option>
                  <option value="IELTS">IELTS</option>
                  <option value="PTE">PTE</option>
                  <option value="Duolingo">Duolingo</option>
                </select>
                {selectedTest !== 'N/A' && (
                  <div className="grid grid-cols-2 gap-3">
                    <input name="testScore" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center" placeholder="Score" />
                    <input name="noBandLess" className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center" placeholder="Min Band" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold uppercase outline-none">
                  {referralSources.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {selectedSource === 'Referral' && (
                  <select name="referralPerson" className="w-full px-5 py-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-[11px] font-bold uppercase text-indigo-600">
                    <option value="">Select Representative</option>
                    {referralPersons.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                )}
              </div>

              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-blue-600 active:scale-95 transition-all">
                Create Terminal Lead
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Pipeline List */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100"><Layers size={18} /></div>
                 <h3 className="text-xs font-bold text-slate-800 uppercase tracking-[0.2em]">Active Acquisition Pipeline</h3>
               </div>
               <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">{activeLeads.length} Profiles</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {activeLeads.map(lead => (
                <div key={lead.id} className="p-8 hover:bg-blue-50/20 transition-all group relative">
                  <div className="flex flex-col xl:flex-row justify-between gap-8">
                    <div className="flex gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 border border-slate-200 flex items-center justify-center font-bold text-xl group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:rotate-3 transition-all duration-500">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <h4 className="font-bold text-slate-800 text-lg tracking-tight uppercase">{lead.name}</h4>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] ${lead.status === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                            {lead.status}
                          </span>
                        </div>
                        
                        {/* Detail Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-3 gap-x-8">
                           <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wide">
                              <Phone size={14} className="text-blue-500" /> {lead.phone}
                           </div>
                           <div className="flex items-center gap-3 text-xs font-bold text-slate-600 uppercase tracking-wide">
                              <MapPin size={14} className="text-rose-500" /> {lead.targetCountry}
                           </div>
                           <div className="flex items-center gap-3 text-xs font-bold text-slate-600 uppercase tracking-wide">
                              <GraduationCap size={14} className="text-indigo-500" /> {lead.program}
                           </div>
                           <div className="flex items-center gap-3 text-xs font-bold text-emerald-600 uppercase">
                              <Award size={14} className="text-emerald-500" /> SSC: {lead.sscGpa || '-'} | HSC: {lead.hscGpa || '-'}
                           </div>
                           {lead.languageTest?.testType !== 'N/A' && (
                             <div className="flex items-center gap-3 text-xs font-bold text-blue-600 uppercase">
                                <Languages size={14} className="text-blue-500" /> {lead.languageTest?.testType}: {lead.languageTest?.score} ({lead.languageTest?.noBandLessThan})
                             </div>
                           )}
                           <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                              <Users size={14} className="text-slate-300" /> {lead.source}
                           </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Hub */}
                    <div className="flex xl:flex-col items-center justify-end gap-3 self-end xl:self-center">
                      <button 
                        onClick={() => onUpdateStatus(lead.id, 'Contacted')} 
                        className={`p-3 rounded-2xl transition-all shadow-md ${lead.status === 'Contacted' ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-200'}`}
                        title="Mark as Contacted"
                      >
                        <MessageSquare size={20} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(lead.id, 'Converted to Student')} 
                        className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        Enroll File
                      </button>
                      <button onClick={() => onDelete(lead.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {activeLeads.length === 0 && (
                <div className="flex flex-col items-center justify-center py-40 opacity-20">
                   <Target size={80} strokeWidth={1} className="text-slate-400 mb-6" />
                   <p className="font-bold text-slate-800 text-sm uppercase tracking-[0.5em]">No Pipeline Activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;
