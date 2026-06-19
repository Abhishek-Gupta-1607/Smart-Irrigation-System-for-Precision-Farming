import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, AlertTriangle, CloudRain, Droplets, MapPin, Loader2 } from 'lucide-react';

interface AIResult {
  disease: {
    disease_name: string;
    confidence: number;
    severity_percentage: number;
    recommended_treatment: string;
  };
  weeds: {
    weed_percentage: number;
    weed_density: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    rain_forecast: number;
    wind_speed: number;
  };
  irrigation: {
    recommendation: string;
    water_quantity_liters: number;
    duration_minutes: number;
    reasoning: string;
  };
}

export default function FieldMonitor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<AIResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus('idle');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload Image
      const uploadRes = await axios.post('/api/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const taskId = uploadRes.data.task_id;
      setStatus('processing');

      // 2. Poll for status
      pollStatus(taskId);
      
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || 'Failed to upload image.');
    }
  };

  const pollStatus = async (taskId: string) => {
    try {
      const res = await axios.get(`/api/analyze/${taskId}`);
      const data = res.data;

      if (data.status === 'completed') {
        setResult(data.result);
        setStatus('success');
      } else if (data.status === 'failed') {
        setStatus('error');
        setErrorMsg('AI processing failed.');
      } else {
        // Poll again in 2 seconds
        setTimeout(() => pollStatus(taskId), 2000);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to check status.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Upload Section */}
      <div className="glass-card p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        {!preview ? (
          <>
            <UploadCloud size={64} className="text-agri-primary mb-4 animate-bounce-slow" />
            <h2 className="text-2xl font-bold mb-2">AI Field Monitoring</h2>
            <p className="text-slate-400 max-w-md mb-6">Upload drone or smartphone images of your crops to run the full AI diagnostic pipeline (Disease, Weeds, Health, Moisture).</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              className="btn-primary" 
              onClick={() => fileInputRef.current?.click()}
            >
              Select Field Image
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-2 border-agri-primary/30 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <img src={preview} alt="Field preview" className="w-full h-full object-cover" />
              {status === 'processing' && (
                <div className="absolute inset-0 bg-agri-dark/60 flex flex-col items-center justify-center backdrop-blur-sm">
                   <Loader2 size={40} className="text-agri-primary animate-spin mb-3" />
                   <span className="text-agri-primary font-bold tracking-widest text-sm uppercase">Analyzing...</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
               <button 
                className="btn-secondary" 
                onClick={() => { setFile(null); setPreview(null); setResult(null); setStatus('idle'); }}
                disabled={status === 'uploading' || status === 'processing'}
              >
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleUpload}
                disabled={status === 'uploading' || status === 'processing'}
              >
                {status === 'idle' || status === 'error' ? 'Run AI Diagnostics' : 'Processing...'}
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-2">
            <AlertTriangle size={18} />
            {errorMsg}
          </div>
        )}
      </div>

      {/* Results Section */}
      {status === 'success' && result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Disease Result */}
          <div className="glass-card p-6 border-t-4 border-t-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><AlertTriangle size={20} /></div>
              <h3 className="text-lg font-bold text-white">Disease Detection</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Status</span>
                <span className="font-semibold text-white">{result.disease.disease_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">AI Confidence</span>
                <span className="font-semibold text-agri-primary">{(result.disease.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Severity</span>
                <span className="font-semibold text-yellow-400">{result.disease.severity_percentage.toFixed(1)}%</span>
              </div>
              <div className="pt-2">
                <span className="block text-xs text-slate-400 mb-1">Recommendation</span>
                <span className="text-sm font-medium text-slate-300">{result.disease.recommended_treatment}</span>
              </div>
            </div>
          </div>

          {/* Weed Result */}
          <div className="glass-card p-6 border-t-4 border-t-yellow-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><MapPin size={20} /></div>
              <h3 className="text-lg font-bold text-white">Weed Analysis</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Weed Infestation</span>
                <span className="font-semibold text-yellow-400">{result.weeds.weed_percentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Weather Info */}
          <div className="glass-card p-6 border-t-4 border-t-blue-500">
             <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><CloudRain size={20} /></div>
              <h3 className="text-lg font-bold text-white">Live Weather (API)</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Temperature</span>
                <span className="font-semibold text-white">{result.weather.temperature}°C</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-2">
                <span className="text-slate-400">Rain Forecast (1h)</span>
                <span className="font-semibold text-blue-400">{result.weather.rain_forecast} mm</span>
              </div>
            </div>
          </div>

          {/* Final Irrigation Plan */}
          <div className="glass-card p-6 border-t-4 border-t-agri-primary col-span-1 md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-agri-primary/10 rounded-bl-full blur-2xl"></div>
             <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-agri-primary/20 rounded-lg text-agri-primary"><Droplets size={20} /></div>
              <h3 className="text-lg font-bold text-white">Irrigation AI Verdict</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                 <p className="text-sm text-slate-400 mb-1">Action</p>
                 <p className="text-xl font-bold text-agri-primary">{result.irrigation.recommendation}</p>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                 <p className="text-sm text-slate-400 mb-1">Water Required</p>
                 <p className="text-xl font-bold text-white">{result.irrigation.water_quantity_liters.toFixed(1)} Liters</p>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                 <p className="text-sm text-slate-400 mb-1">Duration</p>
                 <p className="text-xl font-bold text-white">{result.irrigation.duration_minutes} Mins</p>
               </div>
            </div>
            <div className="mt-4 p-4 bg-agri-primary/5 border border-agri-primary/20 rounded-xl">
               <p className="text-sm text-slate-300">
                 <span className="font-semibold text-agri-primary mr-2">AI Reasoning:</span>
                 {result.irrigation.reasoning}
               </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
