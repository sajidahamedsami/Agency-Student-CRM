
import React, { useState } from 'react';
import { Settings, Plus, Trash2, Users, Target, Globe, UserRound, Palette, ImageIcon, Camera, Building2, Save, UserCheck } from 'lucide-react';

interface Props {
  referralSources: string[];
  counselors: string[];
  countries: string[];
  referralPersons: string[];
  branding: { name: string; logoUrl: string };
  setReferralSources: (sources: string[]) => void;
  setCounselors: (counselors: string[]) => void;
  setCountries: (countries: string[]) => void;
  setReferralPersons: (persons: string[]) => void;
  setBranding: (branding: { name: string; logoUrl: string }) => void;
}

const SettingsPage: React.FC<Props> = ({ 
  referralSources, counselors, countries, referralPersons, branding,
  setReferralSources, setCounselors, setCountries, setReferralPersons, setBranding 
}) => {
  const [newSource, setNewSource] = useState('');
  const [newCounselor, setNewCounselor] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newPerson, setNewPerson] = useState('');
  
  const [brandName, setBrandName] = useState(branding.name);
  const [brandLogo, setBrandLogo] = useState(branding.logoUrl);

  const add = (val: string, setter: (v: string[]) => void, list: string[], clear: (v: string) => void) => {
    if (val.trim()) {
      setter([...list, val.trim()]);
      clear('');
    }
  };

  const remove = (index: number, setter: (v: string[]) => void, list: string[]) => {
    setter(list.filter((_, i) => i !== index));
  };

  const handleSaveBranding = () => {
    setBranding({ name: brandName, logoUrl: brandLogo });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-800">
            <Settings className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Terminal Config</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5">System Core & Identity Control</p>
          </div>
        </div>
      </div>

      {/* Agency Branding Hero Section */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden group">
        <div className="h-48 bg-[#0f172a] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -bottom-16 left-12 flex items-end gap-8">
            <div className="relative group/logo">
              {brandLogo ? (
                <img src={brandLogo} alt="Logo" className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl bg-white" />
              ) : (
                <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-8 border-white shadow-2xl flex items-center justify-center text-slate-200">
                  <Building2 size={56} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-[2.5rem] opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                <Camera className="text-white" size={28} />
              </div>
            </div>
            <div className="pb-6">
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-lg">{branding.name}</h3>
              <p className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-1">Primary Agency Profile</p>
            </div>
          </div>
        </div>
        
        <div className="p-12 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Name</label>
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black uppercase focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" placeholder="AGENCY NAME" />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo URL Access</label>
            <input value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-medium focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" placeholder="https://..." />
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <button onClick={handleSaveBranding} className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95">
              <Save size={18} /> Deploy Identity
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manage Countries */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-emerald-600">
              <div className="p-3 bg-emerald-50 rounded-2xl"><Globe size={20} /></div>
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Destinations</h3>
            </div>
            <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">{countries.length} ACTIVE</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); add(newCountry, setCountries, countries, setNewCountry); }} className="flex gap-2">
            <input value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="Add country..." className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500 transition-all" />
            <button type="submit" className="bg-emerald-600 text-white p-3.5 rounded-2xl hover:shadow-xl transition-all"><Plus size={20} /></button>
          </form>
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
            {countries.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl group border border-transparent hover:border-emerald-100 transition-all">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{c}</span>
                <button onClick={() => remove(i, setCountries, countries)} className="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Counselors */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-blue-600">
              <div className="p-3 bg-blue-50 rounded-2xl"><UserRound size={20} /></div>
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Counselors</h3>
            </div>
            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">{counselors.length} STAFF</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); add(newCounselor, setCounselors, counselors, setNewCounselor); }} className="flex gap-2">
            <input value={newCounselor} onChange={(e) => setNewCounselor(e.target.value)} placeholder="Add staff..." className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 transition-all" />
            <button type="submit" className="bg-blue-600 text-white p-3.5 rounded-2xl hover:shadow-xl transition-all"><Plus size={20} /></button>
          </form>
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
            {counselors.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl group border border-transparent hover:border-blue-100 transition-all">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{c}</span>
                <button onClick={() => remove(i, setCounselors, counselors)} className="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Representatives */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-indigo-600">
              <div className="p-3 bg-indigo-50 rounded-2xl"><UserCheck size={20} /></div>
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Representatives</h3>
            </div>
            <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full">{referralPersons.length} ACTIVE</span>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); add(newPerson, setReferralPersons, referralPersons, setNewPerson); }} className="flex gap-2">
            <input value={newPerson} onChange={(e) => setNewPerson(e.target.value)} placeholder="Add representative..." className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 transition-all" />
            <button type="submit" className="bg-indigo-600 text-white p-3.5 rounded-2xl hover:shadow-xl transition-all"><Plus size={20} /></button>
          </form>
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
            {referralPersons.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl group border border-transparent hover:border-indigo-100 transition-all">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{p}</span>
                <button onClick={() => remove(i, setReferralPersons, referralPersons)} className="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
