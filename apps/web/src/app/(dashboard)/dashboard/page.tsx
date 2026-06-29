import React from 'react';
import { 
  AlertTriangle, 
  Users, 
  ShieldCheck, 
  Activity, 
  PlusCircle, 
  Map as MapIcon, 
  BarChart3, 
  Clock,
  MoreVertical,
  Search
} from 'lucide-react';

// Types for our data
interface Incident {
  id: string;
  type: string;
  location: string;
  status: 'Critical' | 'Pending' | 'Resolved';
  time: string;
  severity: 'High' | 'Medium' | 'Low';
}

const recentIncidents: Incident[] = [
  { id: 'INC-8291', type: 'Flash Flood', location: 'Sector 4, Downtown', status: 'Critical', time: '4 mins ago', severity: 'High' },
  { id: 'INC-8290', type: 'Structure Fire', location: 'Industrial Zone B', status: 'Pending', time: '12 mins ago', severity: 'High' },
  { id: 'INC-8289', type: 'Power Outage', location: 'North Ridge', status: 'Pending', time: '28 mins ago', severity: 'Medium' },
  { id: 'INC-8288', type: 'Medical Emergency', location: 'East Campus', status: 'Resolved', time: '1 hour ago', severity: 'Low' },
];

export default function AegisDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="text-blue-500 w-8 h-8" />
            AEGIS <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-slate-400 mt-1">Emergency Response & Disaster Management Command</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* Quick Actions - Floating / Top */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-red-900/20">
            <PlusCircle size={20} />
            Report Incident
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 transition-all">
            <MapIcon size={20} />
            Open Live Map
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-xl border border-slate-700 transition-all">
            <BarChart3 size={20} />
            Analytics View
          </button>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Incidents" value="1,284" icon={<Activity className="text-blue-500" />} trend="+12% from yesterday" />
          <StatCard title="High Risk" value="14" icon={<AlertTriangle className="text-red-500" />} trend="3 unresolved" highlight />
          <StatCard title="Active Responders" value="86" icon={<Users className="text-emerald-500" />} trend="92% deployment" />
          <StatCard title="Safe Zones" value="24" icon={<ShieldCheck className="text-purple-500" />} trend="All operational" />
        </section>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Incidents Table */}
          <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-bottom border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Recent Incidents</h2>
              <button className="text-sm text-blue-400 hover:underline">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Incident ID</th>
                    <th className="px-6 py-3 font-medium">Type / Location</th>
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-400">{incident.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{incident.type}</div>
                        <div className="text-xs text-slate-500">{incident.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          incident.severity === 'High' ? 'bg-red-500/10 text-red-500' : 
                          incident.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`w-2 h-2 rounded-full ${
                            incident.status === 'Critical' ? 'bg-red-500 animate-pulse' : 
                            incident.status === 'Pending' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          {incident.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {incident.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-500 hover:text-white">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white shadow-xl">
              <h3 className="font-bold text-xl mb-2">AI Insights</h3>
              <p className="text-blue-100 text-sm mb-4">
                Probability of flooding in Sector 4 has increased by 35% due to upstream sensor data.
              </p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2 px-4 rounded-lg transition-all">
                Review Prediction
              </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-semibold mb-4 text-slate-200">Active Resources</h3>
              <div className="space-y-4">
                <ResourceItem label="Fire Units" active={12} total={15} color="bg-red-500" />
                <ResourceItem label="Medical Teams" active={24} total={30} color="bg-emerald-500" />
                <ResourceItem label="Drones" active={8} total={10} color="bg-blue-500" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Sub-components for cleaner structure
function StatCard({ title, value, icon, trend, highlight = false }: { 
  title: string, value: string, icon: React.ReactNode, trend: string, highlight?: boolean 
}) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-800 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight">{value}</h3>
        <p className={`text-xs mt-2 ${highlight ? 'text-red-400' : 'text-slate-500'}`}>{trend}</p>
      </div>
    </div>
  );
}

function ResourceItem({ label, active, total, color }: { label: string, active: number, total: number, color: string }) {
  const percentage = (active / total) * 100;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-400">{label}</span>
        <span>{active}/{total}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
