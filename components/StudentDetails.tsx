
import React, { useState } from 'react';
import { Student, Transaction, UniversityApplication, UniResultStatus, Note, ProgramType, LanguageTestType } from '../types';
import { 
  ArrowLeft as ArrowIcon, 
  Check as CheckIcon, 
  X as XIcon, 
  Edit2 as EditIcon, 
  Plus as PlusIcon, 
  Trash2 as TrashIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Home as HomeIcon,
  ShieldCheck as ShieldIcon,
  Users as UsersIcon,
  Globe as GlobeIcon,
  TrendingUp as TrendIcon,
  GraduationCap as GradIcon,
  Building as BuildIcon,
  MessageCircle as NoteIcon,
  Award as AwardIcon,
  Star as StarIcon,
  CheckCircle2,
  Languages,
  CreditCard,
  MapPin,
  BookOpen,
  Calendar
} from 'lucide-react';

interface Props {
  student: Student;
  onBack: () => void;
  onUpdate: (updated: Student) => void;
}

const StudentDetails: React.FC<Props> = ({ student, onBack, onUpdate }) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editValues, setEditValues] = useState({ 
    email: student.email, 
    phone: student.phone,
    name: student.name,
    targetCountry: student.targetCountry,
    program: student.program,
    collegeName: student.collegeName || '',
    sscGpa: student.sscGpa || '',
    hscGpa: student.hscGpa || '',
    bachelorCgpa: student.bachelorCgpa || '',
    mastersGpa: student.mastersGpa || '',
    agentName: student.agentName,
    referralPerson: student.referralPerson || '',
    address: student.address || { upazila: '', district: '', division: 'Dhaka' },
    languageTest: student.languageTest || { testType: 'N/A', score: '', noBandLessThan: '' }
  });

  const received = (student.transactions || []).filter(t => t.type === 'Received').reduce((acc, t) => acc + t.amount, 0);
  const payments = (student.transactions || []).filter(t => t.type === 'Payment').reduce((acc, t) => acc + t.amount, 0);
  const refunds = (student.transactions || []).filter(t => t.type === 'Refund').reduce((acc, t) => acc + t.amount, 0);
  const balance = received - payments - refunds;

  const handleToggleStep = (stepName: string) => {
    const updatedTimeline = student.timeline.map(s => {
      if (s.step === stepName) {
        return { ...s, isCompleted: !s.isCompleted, dateCompleted: !s.isCompleted ? new Date().toISOString().split('T')[0] : undefined };
      }
      return s;
    });
    const lastCompletedStep = [...updatedTimeline].reverse().find(s => s.isCompleted);
    const newStatus = lastCompletedStep ? lastCompletedStep.step : student.timeline[0].step;
    onUpdate({ ...student, timeline: updatedTimeline, currentStatus: newStatus });
  };

  const addTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      description: formData.get('description') as string,
      amount: Number(formData.get('amount')),
      type: formData.get('type') as any,
    };
    onUpdate({ ...student, transactions: [...(student.transactions || []), newTx] });
    e.currentTarget.reset();
  };

  const addApplication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newApp: UniversityApplication = {
      id: Math.random().toString(36).substr(2, 9),
      universityName: formData.get('university') as string,
      course: formData.get('course') as string,
      status: 'Pending'
    };
    onUpdate({ ...student, applications: [...(student.applications || []), newApp] });
    e.currentTarget.reset();
  };

  const addNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      text: formData.get('note') as string,
      createdAt: new Date().toLocaleString()
    };
    onUpdate({ ...student, notes: [...(student.notes || []), newNote] });
    e.currentTarget.reset();
  };

  const updateAppStatus = (appId: string, status: UniResultStatus) => {
    const updated = (student.applications || []).map(a => a.id === appId ? { ...a, status } : a);
    onUpdate({ ...student, applications: updated });
  };

  const saveHeaderChanges = () => {
    onUpdate({ ...student, ...editValues });
    setIsEditingProfile(false);
  };

  const firstIncompleteIdx = student.timeline.findIndex(s => !s.isCompleted);

  return (
    <div className="space-y-8 animate-bounce-in pb-20">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-3 text-slate-500 hover:text-blue-600 transition-all font-bold text-[10px] uppercase tracking-[0.3em] bg-white px-8 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <ArrowIcon size={16} strokeWidth={2.5} /> Exit Portfolio
        </button>
      </div>

      {/* Hero Profile Header */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col xl:flex-row gap-12 items-start relative overflow-hidden group">
        <div className="h-40 w-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-5xl font-bold shadow-2xl z-10 group-hover:rotate-3 transition-all duration-500 relative shrink-0">
          {student.name.charAt(0)}
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-white shadow-lg">
            <CheckCircle2 size={24} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1 space-y-6 z-10 w-full">
          <div className="flex flex-col md:flex-row items-start justify-between w-full gap-6">
            <div className="space-y-4 flex-1">
              {isEditingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Candidate Name</label>
                    <input value={editValues.name} onChange={e => setEditValues({...editValues, name: e.target.value})} className="text-lg font-bold text-slate-800 border border-slate-200 outline-none w-full bg-slate-50 px-4 py-2 rounded-xl focus:border-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Institution</label>
                    <input value={editValues.collegeName} onChange={e => setEditValues({...editValues, collegeName: e.target.value})} className="text-lg font-bold text-blue-600 border border-slate-200 outline-none w-full bg-slate-50 px-4 py-2 rounded-xl focus:border-blue-500" placeholder="e.g. Dhaka College" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none break-words">{student.name}</h2>
                  <div className="flex items-center gap-2">
                    <BuildIcon size={14} className="text-blue-500" />
                    <p className="text-slate-500 font-bold text-[11px] tracking-wide uppercase truncate">{student.collegeName || 'No Institution Added'}</p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 items-center">
                <div className="inline-flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 shadow-xl shrink-0">
                  <p className="text-blue-400 font-mono text-[9px] font-bold tracking-widest uppercase">ID:</p>
                  <p className="text-white font-mono text-[10px] font-bold tracking-widest">{student.id}</p>
                </div>
                
                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shrink-0">
                  <ShieldIcon size={12} className="text-indigo-600" />
                  <p className="text-indigo-600 text-[9px] font-black uppercase tracking-widest">Counselor: {student.agentName}</p>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 shrink-0">
                  <UsersIcon size={12} className="text-amber-600" />
                  <p className="text-amber-600 text-[9px] font-black uppercase tracking-widest">Via: {student.referralPerson || student.source}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {!isEditingProfile ? (
                <button onClick={() => setIsEditingProfile(true)} className="px-6 py-3.5 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                  <EditIcon size={14} /> Update Portfolio
                </button>
              ) : (
                <>
                  <button onClick={saveHeaderChanges} className="px-6 py-3.5 text-white bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                    <CheckIcon size={14} /> Save Changes
                  </button>
                  <button onClick={() => setIsEditingProfile(false)} className="px-6 py-3.5 text-white bg-rose-500 rounded-2xl shadow-lg shadow-rose-200 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                    <XIcon size={14} /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Market Badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              <GlobeIcon size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">{student.targetCountry}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
              <TrendIcon size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{student.currentStatus}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <GradIcon size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{student.program}</span>
            </div>
          </div>

          {/* Core Info - No Overlap */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Terminal</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><PhoneIcon size={14} /></div>
                  <p className="text-[12px] font-bold text-slate-700 uppercase">{student.phone}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><MailIcon size={14} /></div>
                  <p className="text-[12px] font-bold text-slate-700 lowercase tracking-tight">{student.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Residency Logistics</h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 min-h-[104px] flex items-center">
                 <div className="flex items-start gap-4 w-full">
                   <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 mt-1 shrink-0"><HomeIcon size={16} /></div>
                   <div className="flex-1">
                     {isEditingProfile ? (
                       <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Upazila</label>
                            <input value={editValues.address.upazila} onChange={e => setEditValues({...editValues, address: {...editValues.address, upazila: e.target.value}})} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] w-full font-bold" placeholder="Upazila" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">District</label>
                            <input value={editValues.address.district} onChange={e => setEditValues({...editValues, address: {...editValues.address, district: e.target.value}})} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] w-full font-bold" placeholder="District" />
                         </div>
                         <div className="space-y-1 col-span-2">
                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Division</label>
                            <select value={editValues.address.division} onChange={e => setEditValues({...editValues, address: {...editValues.address, division: e.target.value}})} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] w-full font-bold uppercase">
                              {["Dhaka", "Chattogram", "Barisal", "Sylhet", "Khulna", "Rangpur", "Mymensingh", "Rajshahi"].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                         </div>
                       </div>
                     ) : (
                       <div className="space-y-1">
                         <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight">
                           {student.address?.upazila || 'Unknown'}, {student.address?.district || 'Unknown'}
                         </p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{student.address?.division || 'No Division'}</p>
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial magnitude */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full xl:w-[320px] flex flex-col justify-center shadow-2xl relative overflow-hidden shrink-0">
          <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.4em] mb-3">Portfolio magnitude</p>
          <div className="text-4xl font-black text-white tracking-tighter flex items-end gap-2">
             {balance.toLocaleString()} <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase mb-1.5">BDT</span>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Resource Inflow</span>
              <span className="text-emerald-400">+{received.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-500">Deployed</span>
              <span className="text-rose-400">-{ (payments + refunds).toLocaleString() }</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Academic & Proficiency Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'sscGpa', label: 'SSC GPA', value: student.sscGpa, icon: AwardIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { key: 'hscGpa', label: 'HSC GPA', value: student.hscGpa, icon: AwardIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { key: 'bachelorCgpa', label: 'Bachelor CGPA', value: student.bachelorCgpa, icon: StarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { key: 'mastersGpa', label: 'Masters GPA', value: student.mastersGpa, icon: StarIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
          { key: 'languageScore', label: `${student.languageTest?.testType || 'Test'}: ${student.languageTest?.score || 'N/A'}`, value: `Min: ${student.languageTest?.noBandLessThan || 'N/A'}`, icon: Languages, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-blue-300 transition-all">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} mb-3 group-hover:scale-110 transition-transform`}><stat.icon size={18} strokeWidth={2.5} /></div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            {isEditingProfile ? (
              <div className="space-y-2 w-full">
                 {stat.key === 'languageScore' ? (
                   <div className="flex flex-col gap-1">
                      <select value={editValues.languageTest.testType} onChange={e => setEditValues({...editValues, languageTest: {...editValues.languageTest, testType: e.target.value as LanguageTestType}})} className="w-full text-[10px] p-1 border rounded font-bold uppercase">
                        {["N/A", "IELTS", "PTE", "TOEFL", "Duolingo", "GMAT", "GRE"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input value={editValues.languageTest.score} onChange={e => setEditValues({...editValues, languageTest: {...editValues.languageTest, score: e.target.value}})} className="w-full text-center p-1 border rounded text-[10px] font-bold" placeholder="Score" />
                      <input value={editValues.languageTest.noBandLessThan} onChange={e => setEditValues({...editValues, languageTest: {...editValues.languageTest, noBandLessThan: e.target.value}})} className="w-full text-center p-1 border rounded text-[10px] font-bold" placeholder="Min" />
                   </div>
                 ) : (
                   <input 
                     value={editValues[stat.key as keyof typeof editValues] as string} 
                     onChange={e => setEditValues({...editValues, [stat.key]: e.target.value})} 
                     className="w-full text-center px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black"
                   />
                 )}
              </div>
            ) : (
              <>
                <p className={`text-xl font-black ${stat.color} tracking-tight`}>{stat.key === 'languageScore' ? '' : (stat.value || 'N/A')}</p>
                {stat.key === 'languageScore' && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{stat.value}</p>}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Applications Terminal */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
               <BuildIcon size={18} className="text-indigo-600" />
               <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Application Tracking Terminal</h3>
             </div>
             <div className="p-8">
               <form onSubmit={addApplication} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <input name="university" required className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white transition-all focus:border-indigo-400" placeholder="Target Institution" />
                  <input name="course" required className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white transition-all focus:border-indigo-400" placeholder="Major / Course" />
                  <button type="submit" className="bg-indigo-600 text-white py-3.5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                    <PlusIcon size={16} /> Deploy New App
                  </button>
               </form>
               <div className="space-y-4">
                  {(student.applications || []).map(app => (
                    <div key={app.id} className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl flex flex-col sm:flex-row justify-between items-center group hover:border-indigo-200 transition-all gap-4">
                       <div className="min-w-0 flex-1">
                         <p className="font-black text-slate-800 text-sm uppercase tracking-tight truncate">{app.universityName}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 truncate">{app.course}</p>
                       </div>
                       <div className="flex items-center gap-4 shrink-0">
                          <select 
                            value={app.status} 
                            onChange={(e) => updateAppStatus(app.id, e.target.value as UniResultStatus)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none border-2 border-transparent transition-all focus:border-indigo-300 ${
                              app.status.includes('Offer') ? 'bg-emerald-500 text-white' : 
                              app.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Offer Received (Conditional)">Offer (Cond.)</option>
                            <option value="Offer Received (Unconditional)">Offer (Uncond.)</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Waitlisted">Waitlisted</option>
                          </select>
                          <button onClick={() => onUpdate({ ...student, applications: student.applications.filter(a => a.id !== app.id)})} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"><TrashIcon size={16} /></button>
                       </div>
                    </div>
                  ))}
                  {(!student.applications || student.applications.length === 0) && (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Active Applications Found</p>
                    </div>
                  )}
               </div>
             </div>
          </div>

          {/* Compact Mission Logs */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
               <NoteIcon size={18} className="text-amber-600" />
               <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Communication & Mission Logs</h3>
             </div>
             <div className="p-8">
               <form onSubmit={addNote} className="flex gap-3 mb-8">
                  <textarea name="note" required className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-xs font-bold outline-none focus:bg-white min-h-[60px] max-h-[120px] transition-all resize-none shadow-inner" placeholder="Log mission update or observation..."></textarea>
                  <button type="submit" className="bg-amber-500 text-white px-8 rounded-3xl font-black uppercase text-[10px] hover:bg-amber-600 transition-all shadow-lg shadow-amber-100">
                    <PlusIcon size={22} strokeWidth={2.5} />
                  </button>
               </form>
               <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                  {(student.notes || []).slice().reverse().map(note => (
                    <div key={note.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group relative hover:border-amber-100 transition-all">
                       <p className="text-xs text-slate-600 font-bold leading-relaxed pr-8">{note.text}</p>
                       <div className="mt-4 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity pt-3 border-t border-slate-100">
                         <div className="flex items-center gap-2">
                            <Calendar size={10} className="text-slate-400" />
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{note.createdAt}</p>
                         </div>
                         <button onClick={() => onUpdate({ ...student, notes: student.notes.filter(n => n.id !== note.id)})} className="text-rose-300 hover:text-rose-500 transition-colors"><TrashIcon size={14} /></button>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>

          {/* Financial Intelligence */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
               <CreditCard size={18} className="text-blue-600" />
               <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Financial Intelligence Unit</h3>
             </div>
             <div className="p-8">
               <form onSubmit={addTransaction} className="flex flex-wrap gap-3 mb-8 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <input name="description" required className="flex-1 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-400" placeholder="Ledger Entry Description" />
                  <input name="amount" type="number" required className="w-32 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-center focus:border-blue-400" placeholder="Magnitude" />
                  <select name="type" className="px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none focus:border-blue-400">
                    <option value="Received">Inward Flow</option>
                    <option value="Payment">Resource Deployment</option>
                    <option value="Refund">Refund Issuance</option>
                  </select>
                  <button type="submit" className="bg-blue-600 text-white px-6 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"><PlusIcon size={20} /></button>
               </form>
               <div className="overflow-x-auto no-scrollbar border rounded-[2rem] border-slate-100">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
                      <tr><th className="p-5">Execution Date</th><th className="p-5">Reference</th><th className="p-5 text-right">Magnitude</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(student.transactions || []).map(tx => (
                        <tr key={tx.id} className="hover:bg-blue-50/30 transition-all group">
                          <td className="p-5 text-slate-400 font-bold uppercase tracking-tight">{tx.date}</td>
                          <td className="p-5 font-black text-slate-700 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{tx.description}</td>
                          <td className={`p-5 text-right font-black text-[13px] ${tx.type === 'Received' ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {tx.type === 'Refund' ? 'REF ' : ''}{tx.amount.toLocaleString()} BDT
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
             </div>
          </div>
        </div>

        {/* Spacious Lifecycle Path */}
        <div className="lg:col-span-4">
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-xl sticky top-28 overflow-hidden min-h-[600px]">
            <div className="flex items-center gap-5 mb-16">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendIcon size={22} strokeWidth={2.5} /></div>
              <div>
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Lifecycle Vector</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Operational Flow Management</p>
              </div>
            </div>
            
            <div className="space-y-0 relative ml-3">
              {/* Thicker Timeline Connector Line */}
              <div className="absolute left-[8px] top-1 bottom-16 w-[2px] bg-slate-100 rounded-full"></div>
              
              {student.timeline.map((step, idx) => {
                const isActive = idx === firstIncompleteIdx;
                // Increased spacing for a much clearer look
                return (
                  <div key={step.step} className="flex gap-12 group relative pb-14 last:pb-6 animate-in slide-in-from-right-8" style={{ animationDelay: `${idx * 0.08}s` }}>
                    <div className="flex flex-col items-center relative z-10">
                      <button 
                        onClick={() => handleToggleStep(step.step)}
                        className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                          step.isCompleted ? 'bg-emerald-500 text-white border-emerald-300 shadow-xl shadow-emerald-100 scale-110' : 
                          isActive ? 'bg-white text-blue-600 border-blue-600 ring-[12px] ring-blue-50/60 shadow-lg scale-125' : 'bg-white text-slate-200 border-slate-200 hover:border-blue-200'
                        }`}
                      >
                        {step.isCompleted && <CheckIcon size={11} strokeWidth={4} />}
                      </button>
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <h4 className={`text-[13px] font-black uppercase tracking-[0.1em] transition-all duration-500 leading-tight ${
                        step.isCompleted ? 'text-slate-900' : isActive ? 'text-blue-600 font-black tracking-[0.2em]' : 'text-slate-300'
                      }`}>
                        {step.step}
                      </h4>
                      {step.isCompleted && (
                        <div className="flex items-center gap-2 mt-2.5">
                           <div className="h-1 w-1 bg-emerald-300 rounded-full"></div>
                           <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-50/50 px-2 py-1 rounded-lg">
                             EXECUTED: {step.dateCompleted}
                           </p>
                        </div>
                      )}
                      {isActive && (
                        <div className="mt-3 flex flex-col gap-2">
                           <div className="h-1.5 w-12 bg-blue-500 rounded-full animate-pulse"></div>
                           <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest animate-pulse">
                             Current Core Priority
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
