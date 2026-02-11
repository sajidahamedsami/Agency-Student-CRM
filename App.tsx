
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardOverview from './components/DashboardOverview';
import StudentList from './components/StudentList';
import StudentDetails from './components/StudentDetails';
import LeadsPage from './components/LeadsPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import { Student, Lead, ProgramType, Address, LanguageTestType } from './types';
import { INITIAL_STUDENTS, INITIAL_LEADS, PROCESS_STEPS, INITIAL_COUNTRIES } from './constants';
import { X, CheckCircle, Mail, Phone, User, Globe, Loader2, GraduationCap, MapPin, Briefcase, Award, BookOpen, Map as MapIcon, ChevronRight } from 'lucide-react';
import { supabase } from './lib/supabase';

const DIVISIONS = ["Dhaka", "Chattogram", "Barisal", "Sylhet", "Khulna", "Rangpur", "Mymensingh", "Rajshahi"];

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'leads' | 'settings'>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);
  const [enrollForm, setEnrollForm] = useState<Partial<Student>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [branding, setBranding] = useState({ name: 'Cholo Abroad', logoUrl: '' });
  const [counselors, setCounselors] = useState<string[]>(['Admin', 'Tanvir Hossain', 'Zeba Tabassum']);
  const [referralSources, setReferralSources] = useState<string[]>(['Facebook Ad', 'Website Form', 'Referral', 'Direct Walk-in']);
  const [countries, setCountries] = useState<string[]>(INITIAL_COUNTRIES);
  const [referralPersons, setReferralPersons] = useState<string[]>(['Karim Ullah', 'Rahman Mia']);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: sData } = await supabase.from('students').select('*');
        if (sData) setStudents(sData);

        const { data: lData } = await supabase.from('leads').select('*');
        if (lData) setLeads(lData);

        const { data: settingsData } = await supabase.from('settings').select('*');
        if (settingsData) {
          const config = settingsData.reduce((acc: any, curr) => { acc[curr.key] = curr.value; return acc; }, {});
          if (config.counselors) setCounselors(config.counselors);
          if (config.sources) setReferralSources(config.sources);
          if (config.countries) setCountries(config.countries);
          if (config.persons) setReferralPersons(config.persons);
          if (config.branding) setBranding(config.branding);
        }
      } finally { setLoading(false); }
    };
    fetchData();
  }, [session]);

  const syncSettings = async (key: string, value: any) => {
    await supabase.from('settings').upsert({ key, value });
  };

  const generateID = (program: string, country: string) => {
    const programCode = { 'Masters': 'MA', 'Bachelor': 'BA', 'PhD': 'PH' }[program] || 'OT';
    const countryCode = (country || 'OT').slice(0, 2).toUpperCase();
    const yearCode = new Date().getFullYear().toString().slice(-2);
    const serial = (students.length + 1).toString().padStart(3, '0');
    return `CA-${programCode}-${countryCode}-${yearCode}-${serial}`;
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selectedStudent?.id === id) setSelectedStudent(null);
    } catch (err: any) {
      alert("Error deleting student: " + err.message);
    }
  };

  const handleEnrollClick = (lead: Lead) => {
    setConvertingLead(lead);
    setEnrollForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      targetCountry: lead.targetCountry,
      program: lead.program,
      sscGpa: lead.sscGpa,
      hscGpa: lead.hscGpa,
      bachelorCgpa: lead.bachelorCgpa,
      mastersGpa: lead.mastersGpa,
      collegeName: lead.collegeName,
      languageTest: lead.languageTest || { testType: 'N/A' },
      agentName: counselors[0] || 'Admin',
      address: { upazila: '', district: '', division: 'Dhaka' },
      source: lead.source,
      referralPerson: lead.referralPerson
    });
  };

  const finalizeEnrollment = async () => {
    if (!enrollForm.email) return alert("Email is mandatory for student portfolio creation.");
    setIsSubmitting(true);
    
    const newStudent: Student = {
      ...enrollForm as Student,
      id: generateID(enrollForm.program || 'Bachelor', enrollForm.targetCountry || 'OT'),
      enrollmentDate: new Date().toISOString().split('T')[0],
      currentStatus: PROCESS_STEPS[0],
      applications: [],
      transactions: [],
      notes: [],
      timeline: PROCESS_STEPS.map((step, idx) => ({
        step,
        isCompleted: idx === 0,
        dateCompleted: idx === 0 ? new Date().toISOString().split('T')[0] : undefined
      }))
    };

    try {
      const { error: insError } = await supabase.from('students').insert(newStudent);
      if (insError) throw insError;
      if (convertingLead) await supabase.from('leads').delete().eq('id', convertingLead.id);
      
      setStudents(prev => [...prev, newStudent]);
      setLeads(prev => prev.filter(l => l.id !== convertingLead?.id));
      setConvertingLead(null);
      setActiveTab('students');
    } catch (err: any) {
      alert("Terminal Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return <LoginPage />;
  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="text-blue-500 animate-pulse" size={24} />
        </div>
      </div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.4em]">Booting Dashboard...</p>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setSelectedStudent(null); }} branding={branding}>
      {activeTab === 'overview' && <DashboardOverview students={students} leads={leads} />}
      {activeTab === 'students' && !selectedStudent && (
        <StudentList 
          students={students} 
          onSelect={setSelectedStudent} 
          onDelete={handleDeleteStudent}
          countries={countries} 
          counselors={counselors} 
        />
      )}
      {activeTab === 'students' && selectedStudent && (
        <StudentDetails student={selectedStudent} onBack={() => setSelectedStudent(null)} onUpdate={async (s) => {
          setStudents(prev => prev.map(old => old.id === s.id ? s : old));
          setSelectedStudent(s);
          await supabase.from('students').upsert(s);
        }} />
      )}
      {activeTab === 'leads' && (
        <LeadsPage 
          leads={leads} 
          onAdd={async (l) => { await supabase.from('leads').insert(l); setLeads([...leads, l]); }} 
          onUpdateStatus={async (id, status) => {
            if (status === 'Converted to Student') {
              const lead = leads.find(l => l.id === id);
              if (lead) handleEnrollClick(lead);
            } else {
              setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
              await supabase.from('leads').update({ status }).eq('id', id);
            }
          }} 
          onDelete={async (id) => { await supabase.from('leads').delete().eq('id', id); setLeads(leads.filter(l => l.id !== id)); }}
          referralSources={referralSources} 
          referralPersons={referralPersons} 
          countries={countries} 
        />
      )}
      {activeTab === 'settings' && (
        <SettingsPage 
          referralSources={referralSources} 
          counselors={counselors} 
          countries={countries} 
          referralPersons={referralPersons} 
          branding={branding}
          setReferralSources={(v) => { setReferralSources(v); syncSettings('sources', v); }} 
          setCounselors={(v) => { setCounselors(v); syncSettings('counselors', v); }} 
          setCountries={(v) => { setCountries(v); syncSettings('countries', v); }} 
          setReferralPersons={(v) => { setReferralPersons(v); syncSettings('persons', v); }} 
          setBranding={(v) => { setBranding(v); syncSettings('branding', v); }}
        />
      )}

      {/* Colorful & High-Interaction Enrollment Modal */}
      {convertingLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl animate-bounce-in overflow-hidden border border-slate-200 my-8">
             <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl shadow-blue-500/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 text-white rounded-2xl shadow-inner"><User size={24} strokeWidth={2.5} /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Full Portfolio Enrollment</h3>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mt-1">Review and Edit Data Integrity</p>
                  </div>
                </div>
                <button onClick={() => setConvertingLead(null)} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"><X size={24} /></button>
             </div>
             
             <div className="p-10 space-y-12 max-h-[70vh] overflow-y-auto no-scrollbar bg-slate-50/30">
                {/* 1. Identity & Contact */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-blue-600">
                    <User size={18} strokeWidth={2.5} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Primary Profile (Editable)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input value={enrollForm.name} onChange={e => setEnrollForm({...enrollForm, name: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.2rem] font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-sm" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Access</label>
                        <input value={enrollForm.phone} onChange={e => setEnrollForm({...enrollForm, phone: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.2rem] font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-sm" />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest ml-1">Official Student Email (Mandatory)</label>
                        <input value={enrollForm.email} onChange={e => setEnrollForm({...enrollForm, email: e.target.value})} className="w-full px-6 py-4 bg-white border border-indigo-200 rounded-[1.2rem] font-bold text-indigo-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all shadow-sm" placeholder="student@university.com" />
                     </div>
                  </div>
                </div>

                {/* 2. Academic Portfolio Review */}
                <div className="space-y-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <BookOpen size={18} strokeWidth={2.5} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Academic Vector Review</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SSC GPA</label>
                        <input value={enrollForm.sscGpa} onChange={e => setEnrollForm({...enrollForm, sscGpa: e.target.value})} className="w-full px-6 py-3.5 bg-white border border-slate-200 rounded-[1.1rem] font-black text-center text-emerald-600" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">HSC GPA</label>
                        <input value={enrollForm.hscGpa} onChange={e => setEnrollForm({...enrollForm, hscGpa: e.target.value})} className="w-full px-6 py-3.5 bg-white border border-slate-200 rounded-[1.1rem] font-black text-center text-emerald-600" />
                     </div>
                     
                     {/* Dynamic Logic Restoration */}
                     {(enrollForm.program === 'Masters' || enrollForm.program === 'PhD') && (
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Bachelor CGPA</label>
                           <input value={enrollForm.bachelorCgpa} onChange={e => setEnrollForm({...enrollForm, bachelorCgpa: e.target.value})} className="w-full px-6 py-3.5 bg-white border border-slate-200 rounded-[1.1rem] font-black text-center text-emerald-600" />
                        </div>
                     )}
                     {enrollForm.program === 'PhD' && (
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Masters CGPA</label>
                           <input value={enrollForm.mastersGpa} onChange={e => setEnrollForm({...enrollForm, mastersGpa: e.target.value})} className="w-full px-6 py-3.5 bg-white border border-slate-200 rounded-[1.1rem] font-black text-center text-emerald-600" />
                        </div>
                     )}
                  </div>
                  
                  {/* Proficiency Score Terminal */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Language Test Type</label>
                        <select value={enrollForm.languageTest?.testType} onChange={e => setEnrollForm({...enrollForm, languageTest: {...enrollForm.languageTest!, testType: e.target.value as LanguageTestType}})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-black uppercase text-xs text-blue-600">
                          <option value="N/A">None/Pending</option>
                          <option value="IELTS">IELTS</option>
                          <option value="PTE">PTE</option>
                          <option value="Duolingo">Duolingo</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Overall Band</label>
                        <input value={enrollForm.languageTest?.score} onChange={e => setEnrollForm({...enrollForm, languageTest: {...enrollForm.languageTest!, score: e.target.value}})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-black text-center text-blue-600" placeholder="0.0" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Minimum Band</label>
                        <input value={enrollForm.languageTest?.noBandLessThan} onChange={e => setEnrollForm({...enrollForm, languageTest: {...enrollForm.languageTest!, noBandLessThan: e.target.value}})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-black text-center text-rose-500" placeholder="0.0" />
                     </div>
                  </div>
                </div>

                {/* 3. Residency Logistics */}
                <div className="space-y-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3 text-violet-600">
                    <MapIcon size={18} strokeWidth={2.5} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Residency Logic Matrix</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Division</label>
                        <select value={enrollForm.address?.division} onChange={e => setEnrollForm({...enrollForm, address: {...enrollForm.address!, division: e.target.value}})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-black uppercase text-[11px]">
                          {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">District</label>
                        <input value={enrollForm.address?.district} onChange={e => setEnrollForm({...enrollForm, address: {...enrollForm.address!, district: e.target.value}})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-bold text-slate-800" placeholder="District" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Upazila</label>
                        <input value={enrollForm.address?.upazila} onChange={e => setEnrollForm({...enrollForm, address: {...enrollForm.address!, upazila: e.target.value}})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-bold text-slate-800" placeholder="Upazila" />
                     </div>
                  </div>
                </div>

                {/* 4. Strategic Assignment */}
                <div className="space-y-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3 text-orange-600">
                    <Briefcase size={18} strokeWidth={2.5} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Mission Assignment</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Market</label>
                        <select value={enrollForm.targetCountry} onChange={e => setEnrollForm({...enrollForm, targetCountry: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-black uppercase text-xs text-orange-600">
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Scale</label>
                        <select value={enrollForm.program} onChange={e => setEnrollForm({...enrollForm, program: e.target.value as ProgramType})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-black uppercase text-xs text-orange-600">
                          <option value="Bachelor">Bachelor Degree</option>
                          <option value="Masters">Masters Degree</option>
                          <option value="PhD">PhD Program</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assigned Mission Lead</label>
                        <select value={enrollForm.agentName} onChange={e => setEnrollForm({...enrollForm, agentName: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.1rem] font-black uppercase text-xs text-orange-600">
                          {counselors.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                  </div>
                </div>

                <div className="pt-8 pb-10">
                  <button 
                    onClick={finalizeEnrollment} 
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl shadow-blue-500/30 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={22} strokeWidth={3} /> Finalize Mission Deployment</>}
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
