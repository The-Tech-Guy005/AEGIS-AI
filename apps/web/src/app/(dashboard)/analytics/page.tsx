'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from "@/components/Sidebar";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Cpu, 
  CheckCircle, 
  Server, 
  TrendingUp, 
  Clock, 
  ArrowLeft, 
  ExternalLink, 
  ShieldAlert, 
  Network, 
  ChevronRight, 
  Search, 
  Database, 
  Eye, 
  RefreshCw, 
  AlertOctagon, 
  ArrowRight,
  Filter,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar
} from 'recharts';

// --- TYPES ---
interface IncidentActivity {
  id: string;
  time: string;
  category: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Quarantined' | 'Terminated' | 'Resolved' | 'Logged';
  ipSource: string;
  mitigationAgent: string;
  threatScore: number;
  aiReasoning: string;
}

// --- MOCK DATA ---
const metricCardsData = [
  {
    id: 'total-deflected',
    title: 'Threats Deflected',
    value: '1,248,392',
    change: '+14.2%',
    isPositive: true,
    timeframe: 'vs last 24h',
    icon: Shield,
    color: 'brand-cyan',
    glowColor: 'rgba(0, 242, 254, 0.15)',
    accentHex: '#00f2fe'
  },
  {
    id: 'active-agents',
    title: 'Neural Node Health',
    value: '100%',
    change: 'Operational',
    isPositive: true,
    timeframe: '64/64 clusters online',
    icon: Cpu,
    color: 'brand-emerald',
    glowColor: 'rgba(0, 245, 160, 0.15)',
    accentHex: '#00f5a0'
  },
  {
    id: 'avg-latency',
    title: 'Avg Deflection Speed',
    value: '0.84ms',
    change: '-12.4%',
    isPositive: true,
    timeframe: 'latency reduction',
    icon: Zap,
    color: 'brand-blue',
    glowColor: 'rgba(79, 172, 254, 0.15)',
    accentHex: '#4facfe'
  },
  {
    id: 'critical-alerts',
    title: 'Active Quarantines',
    value: '2',
    change: 'Requires Review',
    isPositive: false,
    timeframe: 'sandbox isolated',
    icon: AlertOctagon,
    color: 'brand-rose',
    glowColor: 'rgba(255, 51, 102, 0.15)',
    accentHex: '#ff3366'
  }
];

const incidentTrends = [
  { time: '00:00', total: 1200, autonomous: 1198, anomalous: 20 },
  { time: '04:00', total: 1850, autonomous: 1850, anomalous: 15 },
  { time: '08:00', total: 2900, autonomous: 2898, anomalous: 40 },
  { time: '12:00', total: 3450, autonomous: 3447, anomalous: 55 },
  { time: '16:00', total: 2600, autonomous: 2600, anomalous: 32 },
  { time: '20:00', total: 4120, autonomous: 4118, anomalous: 78 },
  { time: '24:00', total: 3100, autonomous: 3100, anomalous: 45 }
];

const categoriesData = [
  { name: 'Model Poisoning', value: 24, color: '#ff3366' },
  { name: 'Data Exfiltration', value: 18, color: '#00f2fe' },
  { name: 'DDoS Bombardment', value: 35, color: '#4facfe' },
  { name: 'Adversarial Prompts', value: 15, color: '#f5a623' },
  { name: 'Unauthorized API Abuse', value: 8, color: '#00f5a0' }
];

const severityData = [
  { name: 'Critical', value: 2, color: '#ff3366' },
  { name: 'High', value: 24, color: '#f5a623' },
  { name: 'Medium', value: 142, color: '#4facfe' },
  { name: 'Low', value: 389, color: '#00f5a0' }
];

const initialActivities: IncidentActivity[] = [
  {
    id: 'TX-9081',
    time: '00:44:21',
    category: 'Model Poisoning',
    severity: 'Critical',
    description: 'Rogue gradient vector insertion targeting AEGIS fine-tuning datasets.',
    status: 'Quarantined',
    ipSource: '194.22.108.45',
    mitigationAgent: 'AEGIS Shield Core-9',
    threatScore: 98.4,
    aiReasoning: 'Deep Tensor Inspection detected high cosine similarity (0.972) to known dataset contamination heuristics. Isolated training pipeline memory buffer to maintain core weights integrity.'
  },
  {
    id: 'TX-9080',
    time: '00:41:05',
    category: 'DDoS Bombardment',
    severity: 'High',
    description: 'Volumetric rate deflection on LLM inference endpoint /v1/chat/completions.',
    status: 'Terminated',
    ipSource: '103.88.221.19',
    mitigationAgent: 'Neural Guard v4',
    threatScore: 89.1,
    aiReasoning: 'Identified anomalous token throughput from 1,200 non-standard user agents. Automatically applied dynamic token-bucket rate limiting and routed request signatures into null-interfaces.'
  },
  {
    id: 'TX-9079',
    time: '00:32:10',
    category: 'Adversarial Prompts',
    severity: 'Medium',
    description: 'Indirect prompt injection attempt to bypass system alignment policies.',
    status: 'Resolved',
    ipSource: '45.132.89.202',
    mitigationAgent: 'Guardrail-Agent Alpha',
    threatScore: 65.5,
    aiReasoning: 'Semantic vector alignment checks triggered on user payload. Detected jailbreak keyword encryption pattern. Query scrubbed and warning response generated.'
  },
  {
    id: 'TX-9078',
    time: '00:15:43',
    category: 'Data Exfiltration',
    severity: 'Critical',
    description: 'Unauthorised system backup replication attempt identified.',
    status: 'Quarantined',
    ipSource: '89.44.11.109',
    mitigationAgent: 'DataGuard Agent',
    threatScore: 95.2,
    aiReasoning: 'Detected non-standard database extraction commands attempting to serialize active customer indices. Triggered immediate credential rotation and locked administrative session token.'
  },
  {
    id: 'TX-9077',
    time: '00:08:12',
    category: 'Unauthorized API Abuse',
    severity: 'Low',
    description: 'Continuous unauthorized token generation request scans detected.',
    status: 'Logged',
    ipSource: '185.220.101.5',
    mitigationAgent: 'Gateway Guard',
    threatScore: 32.8,
    aiReasoning: 'Detected multiple sequential 404 responses from targeted API paths. Logged source IP to defensive blacklists and enabled silent honey-pot responses.'
  },
  {
    id: 'TX-9076',
    time: '23:54:02',
    category: 'Data Exfiltration',
    severity: 'Medium',
    description: 'Suspected PII leak attempt inside exported markdown report payload.',
    status: 'Resolved',
    ipSource: '198.51.100.84',
    mitigationAgent: 'Anonymizer Agent-3',
    threatScore: 58.7,
    aiReasoning: 'Regular expression parsing combined with semantic structure mapping identified potential credit card numbers in tabular output format. Automatically masked digits.'
  }
];

const securityModules = [
  {
    name: 'AEGIS Neural Firewall',
    status: 'Fully Armed',
    metric: '99.999% uptime',
    health: 100,
    icon: Shield,
    color: '#00f2fe'
  },
  {
    name: 'LLM Guardrail Core',
    status: 'Active Defense',
    metric: '0.00% escape rate',
    health: 100,
    icon: Cpu,
    color: '#00f5a0'
  },
  {
    name: 'Data Leak Preemption',
    status: 'Monitoring',
    metric: '0 leaks detected',
    health: 100,
    icon: Database,
    color: '#4facfe'
  },
  {
    name: 'Autonomous Agent Network',
    status: 'Synchronized',
    metric: '64 nodes online',
    health: 98,
    icon: Network,
    color: '#f5a623'
  }
];

export default function AegisAnalyticsPage() {
  const [currentView, setCurrentView] = useState<'portal' | 'analytics'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedActivity, setSelectedActivity] = useState<IncidentActivity | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState<IncidentActivity[]>(initialActivities);

  const filteredActivities = useMemo(() => {
    return logs.filter(activity => {
      const matchesSearch = 
        activity.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.mitigationAgent.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSeverity = selectedSeverity === 'All' || activity.severity === selectedSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [logs, searchQuery, selectedSeverity]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIp = `185.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
      const randomTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newThreat: IncidentActivity = {
        id: `TX-${9082 + logs.length}`,
        time: randomTime,
        category: 'Adversarial Prompts',
        severity: 'High',
        description: 'New multi-stage neural prompt injection bypass deflection.',
        status: 'Quarantined',
        ipSource: randomIp,
        mitigationAgent: 'Neural Guard v4',
        threatScore: 84.7,
        aiReasoning: 'Heuristic modeling detected deep adversarial character wrapping techniques (base64 obfuscation). Re-aligned parser state to decode and neutralize payload before context window entry.'
      };
      setLogs(prev => [newThreat, ...prev]);
      setIsRefreshing(false);
    }, 800);
  };

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a]/95 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-slate-400 text-xs font-mono mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color || entry.fill }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-slate-950">
      
      {/* HEADER SECTION */}
      <header className="border-b border-[#1e293b] bg-[#0d121f]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f2fe]/20 to-[#4facfe]/20 border border-cyan-500/30">
              <Shield className="w-5 h-5 text-[#00f2fe]" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#00f5a0] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wider text-slate-400">AEGIS</span>
                <span className="px-1.5 py-0.5 text-[10px] bg-cyan-500/10 border border-cyan-400/20 text-[#00f2fe] rounded font-mono">SECURE</span>
              </div>
              <h1 className="text-md font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">AI Threat Engine</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 py-1.5 px-3 rounded-full border border-slate-800/80">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0] animate-pulse" />
              SYSTEM OVERVIEW: EXCELLENT
            </span>
            
            {currentView === 'analytics' ? (
              <button
                id="btn-back-to-dashboard"
                onClick={() => setCurrentView('portal')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
            ) : (
              <button
                id="btn-enter-analytics"
                onClick={() => setCurrentView('analytics')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-[#00f2fe] to-[#4facfe] shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:brightness-110 active:scale-95 transition duration-200"
              >
                <span>Analytics Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* VIEWS CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: SYSTEMS PORTAL */}
          {currentView === 'portal' && (
            <motion.div
              key="portal-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="relative rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#0d121f] to-[#0a0d16] p-8 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                
                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl text-center lg:text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00f2fe]/10 text-[#00f2fe] border border-cyan-500/20">
                      <Shield className="w-3.5 h-3.5" />
                      Cybersecurity AI Model Active
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                      AEGIS AI Autonomous Protection <span className="text-[#00f2fe]">Armed & Shielded</span>
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      Your neural networks, database clusters, and system fine-tuning pipelines are under full autonomous defense. The system intercepts poisoning attempts, exfiltration streams, and adversarial prompting attacks with latency profiles below 1ms.
                    </p>
                    
                    <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
                      <button
                        onClick={() => setCurrentView('analytics')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black font-extrabold hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] hover:brightness-110 active:scale-95 transition"
                      >
                        Launch Live Analytics Terminal
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 py-3 px-4 bg-slate-900/60 rounded-xl border border-slate-800">
                        <Activity className="w-4 h-4 text-[#00f5a0]" />
                        Active Agent Heartbeats: 100% Operational
                      </div>
                    </div>
                  </div>

                  <div className="relative flex-shrink-0 w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#00f2fe]/10 rounded-full animate-pulse blur-xl" />
                    <div className="absolute inset-4 bg-[#4facfe]/5 rounded-full border border-[#00f2fe]/20" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-10 border border-dashed border-[#00f5a0]/40 rounded-full"
                    />
                    <div className="relative w-36 h-36 rounded-2xl bg-[#0d121f] border border-slate-800 flex flex-col items-center justify-center shadow-inner">
                      <ShieldAlert className="w-16 h-16 text-[#00f2fe] mb-1 animate-bounce" />
                      <span className="text-[10px] font-mono tracking-widest text-[#00f5a0]">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-200 tracking-tight flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#00f5a0]" />
                  Defensive Neural Systems Status
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {securityModules.map((module, i) => (
                    <div 
                      key={i} 
                      className="rounded-xl border border-slate-800/80 bg-[#0d121f]/40 p-5 space-y-4 hover:border-[#1e293b] hover:bg-[#0d121f]/70 transition duration-300"
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80">
                          <module.icon className="w-5 h-5" style={{ color: module.color }} />
                        </div>
                        <span className="px-2.5 py-0.5 text-xs font-mono rounded bg-emerald-500/10 border border-emerald-500/20 text-[#00f5a0]">
                          {module.status}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-white text-md">{module.name}</h4>
                        <p className="text-slate-400 text-xs mt-1 font-mono">{module.metric}</p>
                      </div>

                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-500">Heuristic Match Health</span>
                          <span className="text-[#00f5a0]">{module.health}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                            style={{ width: `${module.health}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center bg-slate-900/30 p-6 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm mb-3">Looking for granular, time-series data charts, mitigation breakdowns, and threat forensic logs?</p>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className="inline-flex items-center gap-2 text-sm text-[#00f2fe] hover:text-[#4facfe] font-bold transition duration-200"
                >
                  Enter detailed analytics terminal dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* VIEW 2: ANALYTICS TERMINAL */}
          {currentView === 'analytics' && (
            <motion.div
              key="analytics-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe] mb-1">
                    <Activity className="w-4 h-4" />
                    LIVE DEFENSE METRICS ENGINE
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Security Analytics</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition duration-200 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>{isRefreshing ? 'Polling Feed...' : 'Poll Live Incidents'}</span>
                  </button>
                  
                  <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button 
                      onClick={() => setSelectedSeverity('All')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${selectedSeverity === 'All' ? 'bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setSelectedSeverity('Critical')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${selectedSeverity === 'Critical' ? 'bg-[#ff3366] text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Critical
                    </button>
                    <button 
                      onClick={() => setSelectedSeverity('High')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${selectedSeverity === 'High' ? 'bg-[#f5a623] text-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      High
                    </button>
                  </div>
                </div>
              </div>

              {/* METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricCardsData.map((card) => {
                  const CardIcon = card.icon;
                  return (
                    <motion.div
                      whileHover={{ y: -3 }}
                      key={card.id}
                      className="relative rounded-xl border border-slate-800/80 bg-[#0d121f]/50 p-6 shadow-lg overflow-hidden transition-all"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: card.accentHex }} />
                      
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-400 tracking-wider uppercase">{card.title}</p>
                          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-mono">{card.value}</h3>
                        </div>
                        
                        <div 
                          className="p-3 rounded-lg border border-slate-800 bg-slate-950/80 shadow-md"
                          style={{ boxShadow: `0 0 15px ${card.glowColor}` }}
                        >
                          <CardIcon className="w-5 h-5" style={{ color: card.accentHex }} />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                        <span className={`font-semibold flex items-center gap-1 ${card.isPositive ? 'text-[#00f5a0]' : 'text-[#ff3366]'}`}>
                          {card.isPositive ? '▲' : '●'} {card.change}
                        </span>
                        <span className="text-slate-500">{card.timeframe}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CHARTS REGION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LINE/AREA CHART */}
                <div className="lg:col-span-2 rounded-xl border border-slate-800/80 bg-[#0d121f]/50 p-6 flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-md font-bold text-white tracking-tight">Incidents Over Time</h3>
                      <p className="text-xs text-slate-400">Chronological telemetry charting attempts vs AI automatic deflections</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-[#00f2fe]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe]" /> Attempts
                      </span>
                      <span className="flex items-center gap-1.5 text-[#00f5a0]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00f5a0]" /> Deflected
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-[320px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={incidentTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAttempts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.01}/>
                          </linearGradient>
                          <linearGradient id="colorDeflected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f5a0" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#00f5a0" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false}/>
                        <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false}/>
                        <Tooltip content={renderCustomTooltip} />
                        <Area name="Attempts" type="monotone" dataKey="total" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#colorAttempts)"/>
                        <Area name="Deflected" type="monotone" dataKey="autonomous" stroke="#00f5a0" strokeWidth={2} fillOpacity={1} fill="url(#colorDeflected)"/>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* PIE CHART */}
                <div className="rounded-xl border border-slate-800/80 bg-[#0d121f]/50 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-md font-bold text-white tracking-tight">Threat Categories</h3>
                    <p className="text-xs text-slate-400">Deflected vulnerability vectors by type</p>
                  </div>

                  <div className="w-full h-[220px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoriesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={renderCustomTooltip} />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                      <span className="text-xs font-mono text-slate-500">AUTONOMOUS</span>
                      <span className="text-xl font-extrabold text-white">99.8%</span>
                      <span className="text-[10px] font-mono text-cyan-400">RATIO</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    {categoriesData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-2 text-slate-400 truncate">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </span>
                        <span className="text-white font-semibold pl-2">{category.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* BAR CHART & ACTIVITY FEED */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* BAR CHART */}
                <div className="rounded-xl border border-slate-800/80 bg-[#0d121f]/50 p-6 flex flex-col space-y-4 justify-between">
                  <div>
                    <h3 className="text-md font-bold text-white tracking-tight">Severity Distribution</h3>
                    <p className="text-xs text-slate-400">Count distribution across classified alert ratings</p>
                  </div>

                  <div className="w-full h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={severityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false}/>
                        <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} axisLine={false}/>
                        <Tooltip content={renderCustomTooltip} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {severityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-slate-950/60 rounded-lg p-3.5 border border-slate-900 flex gap-3 items-center">
                    <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Critical items prompt physical isolation protocols. Low-level activities are categorized under automatic indexing logs.
                    </p>
                  </div>
                </div>

                {/* RECENT ACTIVITY FEED */}
                <div className="lg:col-span-2 rounded-xl border border-slate-800/80 bg-[#0d121f]/50 p-6 flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-md font-bold text-white tracking-tight">Recent Deflection Logs</h3>
                      <p className="text-xs text-slate-400">Live streaming threat mitigations autonomously executed</p>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="Search IP or Agents..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-48 pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition"
                      />
                    </div>
                  </div>

                  <div className="flex-grow space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => {
                        const severityColors = {
                          Critical: 'text-[#ff3366] bg-[#ff3366]/10 border-[#ff3366]/20',
                          High: 'text-[#f5a623] bg-[#f5a623]/10 border-[#f5a623]/20',
                          Medium: 'text-[#4facfe] bg-[#4facfe]/10 border-[#4facfe]/20',
                          Low: 'text-[#00f5a0] bg-[#00f5a0]/10 border-[#00f5a0]/20'
                        };
                        const statusColors = {
                          Quarantined: 'bg-[#ff3366]/20 text-[#ff3366] border-[#ff3366]/30',
                          Terminated: 'bg-red-500/10 text-red-400 border-red-500/20',
                          Resolved: 'bg-[#00f5a0]/10 text-[#00f5a0] border-[#00f5a0]/20',
                          Logged: 'bg-slate-800 text-slate-400 border-slate-700'
                        };

                        return (
                          <div 
                            key={activity.id}
                            className="group p-3.5 rounded-lg border border-slate-800 bg-[#0d121f]/30 hover:border-slate-700/80 hover:bg-[#0d121f]/80 transition duration-150 flex items-start justify-between gap-4"
                          >
                            <div className="space-y-1.5 min-w-0 flex-grow">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-[11px] text-slate-500 font-medium">{activity.time}</span>
                                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${severityColors[activity.severity]}`}>
                                  {activity.severity}
                                </span>
                                <span className="text-[11px] font-bold text-slate-200 truncate">{activity.category}</span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-2 md:line-clamp-1">{activity.description}</p>
                              
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-slate-500 pt-0.5">
                                <span>Agent: <span className="text-slate-300">{activity.mitigationAgent}</span></span>
                                <span>Source: <span className="text-[#00f2fe]">{activity.ipSource}</span></span>
                                <span>Threat Score: <span className="text-rose-400">{activity.threatScore}%</span></span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between self-stretch gap-2 flex-shrink-0">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${statusColors[activity.status]}`}>
                                {activity.status}
                              </span>
                              <button
                                onClick={() => setSelectedActivity(activity)}
                                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#00f2fe] group-hover:translate-x-0.5 transition duration-150"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Inspect</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-slate-500 space-y-2">
                        <p className="text-sm">No incidents match search criteria.</p>
                        <button 
                          onClick={() => { setSearchQuery(''); setSelectedSeverity('All'); }}
                          className="text-xs text-[#00f2fe] hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-[#1e293b] py-6 bg-[#090d16] mt-12 text-xs font-mono text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 AEGIS AI Protection Systems. All neural nodes active.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00f5a0]" /> Secure Cloud Link
            </span>
            <span>v2.8.4-Core</span>
          </div>
        </div>
      </footer>

      {/* FORENSICS DETAILED MODAL */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-[#0d121f] p-6 md:p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <button 
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 hover:border-slate-700/80 transition duration-150 text-xs font-mono"
              >
                ✕ Close
              </button>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#00f2fe] tracking-widest">{selectedActivity.id}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{selectedActivity.time} UTC</span>
                  </div>
                  
                  <h3 className="text-lg font-black text-white">{selectedActivity.category} Forensic Deep-Dive</h3>
                  <p className="text-xs text-slate-400 leading-normal">{selectedActivity.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900/80 text-xs font-mono">
                  <div className="space-y-1">
                    <p className="text-slate-500 text-[10px] uppercase">Mitigation Status</p>
                    <p className="text-[#00f5a0] font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#00f5a0]" /> {selectedActivity.status}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500 text-[10px] uppercase">Calculated Threat Score</p>
                    <p className="text-[#ff3366] font-bold">🔥 {selectedActivity.threatScore}% Criticality</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-900">
                    <p className="text-slate-500 text-[10px] uppercase">Assigned Agent</p>
                    <p className="text-slate-300 font-bold">{selectedActivity.mitigationAgent}</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-slate-900">
                    <p className="text-slate-500 text-[10px] uppercase">Threat IP Origin</p>
                    <p className="text-[#00f2fe] font-bold">{selectedActivity.ipSource}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase font-mono">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    AI Heuristic Analysis & Action Reason
                  </h4>
                  <div className="bg-[#07090e] p-4 rounded-xl border border-slate-800 text-xs leading-relaxed text-slate-300 font-mono">
                    {selectedActivity.aiReasoning}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    AEGIS Sandbox Isolated
                  </span>
                  <button 
                    onClick={() => setSelectedActivity(null)}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#00f2fe] to-[#4facfe] text-black hover:brightness-110 transition duration-150"
                  >
                    Resolve Forensics Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </div>
  );
}