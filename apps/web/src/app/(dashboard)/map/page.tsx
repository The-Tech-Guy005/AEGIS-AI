"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Sidebar from "@/components/Sidebar";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  MapPin,
  ShieldAlert
} from 'lucide-react';

// Dynamically import Leaflet components (No SSR)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Leaflet CSS needs to be imported manually in your globals.css or here
import 'leaflet/dist/leaflet.css';

// Types
type Severity = 'Low' | 'Medium' | 'High';

interface Incident {
  id: string;
  title: string;
  severity: Severity;
  location: string;
  coordinates: [number, number];
  time: string;
}

const MOCK_INCIDENTS: Incident[] = [
  { id: '1', title: 'Flash Flood Warning', severity: 'High', location: 'Connaught Place', coordinates: [28.6315, 77.2167], time: '10m ago' },
  { id: '2', title: 'Wildfire Outreach', severity: 'Medium', location: 'India Gate', coordinates: [28.6129, 77.2295], time: '25m ago' },
  { id: '3', title: 'Power Grid Failure', severity: 'High', location: 'Karol Bagh', coordinates: [28.6519, 77.1909], time: '2m ago' },
  { id: '4', title: 'Road Blockage', severity: 'Low', location: 'Lajpat Nagar', coordinates: [28.5677, 77.2413], time: '1h ago' },
  { id: '5', title: 'Gas Leak', severity: 'High', location: 'Dwarka', coordinates: [28.5921, 77.0460], time: '5m ago' },
];

export default function MapPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Severity | 'All'>('All');

  // Load Leaflet icons only on client side
  const [L, setL] = useState<any>(null);
  React.useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  const filteredIncidents = useMemo(() => {
    return MOCK_INCIDENTS.filter(inc => {
      const matchesSearch = inc.title.toLowerCase().includes(search.toLowerCase()) || 
                            inc.location.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || inc.severity === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const getMarkerIcon = (severity: Severity) => {
    if (!L) return null;
    
    const color = severity === 'High' ? '#ef4444' : severity === 'Medium' ? '#f97316' : '#3b82f6';
    
    return L.divIcon({
      className: 'custom-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full opacity-30 animate-ping" style="background-color: ${color}"></div>
          <div class="relative w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="relative h-screen w-full bg-slate-950 overflow-hidden">
      {/* UI Overlay: Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          
          {/* Branding & Back button */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <Link 
              href="/" 
              className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl text-white hover:bg-slate-800 transition-all shadow-xl"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl shadow-xl">
              <h1 className="font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-blue-500" size={18} />
                LIVE OPS <span className="text-slate-500 font-medium hidden sm:inline">| AEGIS AI</span>
              </h1>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-1 items-center gap-2 pointer-events-auto max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search location or incident..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xl"
              />
            </div>
            
            <div className="relative group">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-4 py-2.5 rounded-xl text-white shadow-xl cursor-pointer">
                <Filter size={18} className="text-slate-400" />
                <select 
                  className="bg-transparent appearance-none outline-none cursor-pointer text-sm font-medium pr-4"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="All">All Severities</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Implementation */}
      
        <MapContainer 
          center={[28.6139, 77.2090]} 
          zoom={13} 
          className="h-full w-full z-0"
          zoomControl={false}
        >
          {/* Dark Mode Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <p className="absolute top-24 left-4 z-[1000] bg-red-500 text-white p-2 rounded">
            Total Incidents: {filteredIncidents.length}
          </p>
          {L && filteredIncidents.map((incident) => (
            <Marker 
              key={incident.id} 
              position={incident.coordinates}
              icon={getMarkerIcon(incident.severity)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px] text-slate-900">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base leading-tight">{incident.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      incident.severity === 'High' ? 'bg-red-100 text-red-600' : 
                      incident.severity === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      {incident.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      {incident.time}
                    </div>
                  </div>

                  <button className="w-full mt-3 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">
                    View Deployment Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      

      {/* Stats Overlay: Bottom Left */}
      <div className="absolute bottom-8 left-8 z-[1000] hidden lg:block">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-2xl w-64">
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={18} />
            Regional Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Active</span>
              <span className="text-white font-mono">{filteredIncidents.length}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-red-500" style={{ width: '40%' }}></div>
              <div className="h-full bg-orange-500" style={{ width: '35%' }}></div>
              <div className="h-full bg-blue-500" style={{ width: '25%' }}></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-center font-bold">
              <div className="text-red-500 uppercase tracking-tighter">High</div>
              <div className="text-orange-500 uppercase tracking-tighter">Med</div>
              <div className="text-blue-500 uppercase tracking-tighter">Low</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Overrides for Leaflet Popups */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(8px);
          border-radius: 16px !important;
          padding: 4px;
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95) !important;
        }
        .leaflet-container {
          background: #020617 !important;
        }
      `}</style>
    </div>
    </div>
  );
}

        
      
    


