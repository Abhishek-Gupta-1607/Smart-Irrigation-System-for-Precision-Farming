import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, AlertTriangle, CloudRain, Droplets, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants: any = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
      const uploadRes = await axios.post('/api/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const taskId = uploadRes.data.task_id;
      setStatus('processing');
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
        setTimeout(() => pollStatus(taskId), 2000);
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to check status.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      
      {/* Upload Section */}
      <motion.div 
        layout
        className="glass-card p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-2xl relative overflow-hidden group"
      >
        {/* Animated Background Blob */}
        <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-agri-primary/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-agri-primary/10 transition-colors duration-700"></div>

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div 
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center z-10"
            >
              <UploadCloud size={64} className="text-agri-primary mb-4 animate-bounce-slow" />
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">AI Field Monitoring</h2>
              <p className="text-slate-400 max-w-md mb-6 text-sm md:text-base">Upload drone or smartphone images of your crops to run the full AI diagnostic pipeline (Disease, Weeds, Health, Moisture).</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2" 
                onClick={() => fileInputRef.current?.click()}
              >
                Select Field Image
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              key="image-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center w-full z-10"
            >
              <motion.div 
                layoutId="preview-image"
                className="relative w-full max-w-md h-48 md:h-64 rounded-xl overflow-hidden border-2 border-agri-primary/30 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
              >
                <img src={preview} alt="Field preview" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                {status === 'processing' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-agri-dark/60 flex flex-col items-center justify-center backdrop-blur-sm"
                  >
                     <Loader2 size={40} className="text-agri-primary animate-spin mb-3" />
                     <span className="text-agri-primary font-bold tracking-widest text-sm uppercase">Analyzing...</span>
                  </motion.div>
                )}
              </motion.div>
              
              <div className="flex gap-4">
                 <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-all" 
                  onClick={() => { setFile(null); setPreview(null); setResult(null); setStatus('idle'); }}
                  disabled={status === 'uploading' || status === 'processing'}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary py-2 px-6" 
                  onClick={handleUpload}
                  disabled={status === 'uploading' || status === 'processing'}
                >
                  {status === 'idle' || status === 'error' ? 'Run AI Diagnostics' : 'Processing...'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-2 z-10 w-full max-w-md"
          >
            <AlertTriangle size={18} />
            {errorMsg}
          </motion.div>
        )}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {status === 'success' && result && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {/* Disease Result */}
            <motion.div variants={cardVariants} className="glass-card p-6 border-t-4 border-t-red-500 hover:border-red-400 transition-colors shadow-lg">
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
            </motion.div>

            {/* Weed Result */}
            <motion.div variants={cardVariants} className="glass-card p-6 border-t-4 border-t-yellow-500 hover:border-yellow-400 transition-colors shadow-lg">
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
            </motion.div>

            {/* Weather Info */}
            <motion.div variants={cardVariants} className="glass-card p-6 border-t-4 border-t-blue-500 hover:border-blue-400 transition-colors shadow-lg">
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
            </motion.div>

            {/* Final Irrigation Plan */}
            <motion.div variants={cardVariants} className="glass-card p-6 border-t-4 border-t-agri-primary col-span-1 md:col-span-2 relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-agri-primary/10 rounded-bl-full blur-2xl group-hover:bg-agri-primary/20 transition-colors duration-500"></div>
               <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-agri-primary/20 rounded-lg text-agri-primary"><Droplets size={20} /></div>
                <h3 className="text-xl font-bold text-white">Irrigation AI Verdict</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 relative z-10">
                 <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                   <p className="text-sm text-slate-400 mb-1">Action</p>
                   <p className="text-xl font-bold text-agri-primary">{result.irrigation.recommendation}</p>
                 </motion.div>
                 <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                   <p className="text-sm text-slate-400 mb-1">Water Required</p>
                   <p className="text-xl font-bold text-white">{result.irrigation.water_quantity_liters.toFixed(1)} Liters</p>
                 </motion.div>
                 <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
                   <p className="text-sm text-slate-400 mb-1">Duration</p>
                   <p className="text-xl font-bold text-white">{result.irrigation.duration_minutes} Mins</p>
                 </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-agri-primary/10 border border-agri-primary/30 rounded-xl relative z-10"
              >
                 <p className="text-sm text-slate-300">
                   <span className="font-bold text-agri-primary mr-2 uppercase tracking-wide">AI Reasoning:</span>
                   {result.irrigation.reasoning}
                 </p>
              </motion.div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
