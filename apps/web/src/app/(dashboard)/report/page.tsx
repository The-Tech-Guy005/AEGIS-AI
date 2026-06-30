"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Sidebar from "@/components/Sidebar";
import { 
  AlertOctagon, 
  ArrowLeft, 
  UploadCloud, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Camera,
  X
} from 'lucide-react';

type IncidentType = 'Fire' | 'Flood' | 'Medical' | 'Earthquake' | 'Power Outage' | 'Other';
type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

interface FormData {
  title: string;
  type: IncidentType;
  severity: Severity;
  description: string;
  location: string;
}

export default function ReportIncidentPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: 'Fire',
    severity: 'Medium',
    description: '',
    location: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate AI Processing & API Call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Incident Reported</h2>
          <p className="text-slate-400 mb-8">
            AEGIS AI has prioritized your report and dispatched nearby emergency responders. Reference: <span className="text-blue-400 font-mono">#INC-{(Math.random() * 10000).toFixed(0)}</span>
          </p>
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertOctagon className="text-red-500" size={28} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Report Incident</h1>
          </div>
          <p className="text-slate-400">
            Provide details below. AEGIS AI will automatically categorize and alert relevant authorities.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">Incident Title</label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Structural collapse near North Bridge"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-white placeholder:text-slate-600"
              />
            </div>

            {/* Type Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Incident Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-white appearance-none cursor-pointer"
              >
                <option value="Fire">🔥 Fire</option>
                <option value="Flood">🌊 Flood</option>
                <option value="Medical">🚑 Medical</option>
                <option value="Earthquake">🫨 Earthquake</option>
                <option value="Power Outage">🔌 Power Outage</option>
                <option value="Other">❓ Other</option>
              </select>
            </div>

            {/* Severity Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Severity Level</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:outline-none transition-all appearance-none cursor-pointer font-bold ${
                  formData.severity === 'Critical' ? 'text-red-500' : 
                  formData.severity === 'High' ? 'text-orange-500' : 'text-blue-500'
                }`}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Critical">Critical / Immediate Action</option>
              </select>
            </div>

            {/* Location */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  required
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Street address or coordinates"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-white placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea
                required
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the situation in detail..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-white placeholder:text-slate-600 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">Visual Evidence (Optional)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                  previewImage ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900'
                }`}
              >
                {previewImage ? (
                  <div className="relative w-full max-h-64 rounded-xl overflow-hidden">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                      <Camera className="text-slate-400" size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG or WEBP (max. 10MB)</p>
                    </div>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Incident...
                </>
              ) : (
                'Transmit Emergency Report'
              )}
            </button>
            <Link
              href="/"
              className="sm:w-32 flex items-center justify-center px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* AI Disclaimer Footer */}
        <footer className="mt-12 py-6 border-t border-slate-900 text-center">
          <p className="text-xs text-slate-600 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            AEGIS AI is actively monitoring this report. False reporting is a punishable offense.
          </p>
        </footer>
      </div>
    </div>
    </div>
  );
}