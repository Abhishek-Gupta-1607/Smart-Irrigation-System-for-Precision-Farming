import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Droplets, Activity, AlertTriangle, Bug } from 'lucide-react';

const mockChartData = [
  { name: 'Mon', moisture: 45, waterSaved: 120 },
  { name: 'Tue', moisture: 42, waterSaved: 150 },
  { name: 'Wed', moisture: 38, waterSaved: 90 },
  { name: 'Thu', moisture: 32, waterSaved: 180 },
  { name: 'Fri', moisture: 48, waterSaved: 200 },
  { name: 'Sat', moisture: 44, waterSaved: 110 },
  { name: 'Sun', moisture: 40, waterSaved: 140 },
];

const StatCard = ({ title, value, icon, color, trend }: any) => (
  <div className="glass-card p-6 flex items-start justify-between group hover:border-slate-500 transition-colors">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      {trend && <p className="text-xs mt-2 text-agri-primary">{trend}</p>}
    </div>
    <div className={`p-3 rounded-xl bg-opacity-20 flex-shrink-0`} style={{ backgroundColor: `${color}33`, color }}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [data] = useState({
    water_saved_liters: 12500,
    disease_alerts: 2,
    active_zones: 4
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Farm Digital Twin Overview</h1>
          <p className="text-slate-400">AI predictions and real-time field analytics.</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 transition flex items-center gap-2">
          <Droplets size={16} className="text-agri-secondary" />
          Generate Irrigation Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Water Saved (This Month)" value={`${(data.water_saved_liters/1000).toFixed(1)}k L`} icon={<Droplets size={24} />} color="#3b82f6" trend="+15% vs last month" />
        <StatCard title="Avg Soil Moisture" value="42%" icon={<Activity size={24} />} color="#10b981" trend="Optimal level" />
        <StatCard title="Disease Alerts" value={data.disease_alerts} icon={<AlertTriangle size={24} />} color="#ef4444" trend="Wheat Rust detected" />
        <StatCard title="Weed Density" value="12%" icon={<Bug size={24} />} color="#f59e0b" trend="-5% after treatment" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Soil Moisture vs Water Saved</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="moisture" stroke="#10b981" fillOpacity={1} fill="url(#colorMoisture)" name="Moisture (%)" />
                <Area type="monotone" dataKey="waterSaved" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" name="Water Saved (L)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Irrigation Recommendations</h3>
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-agri-primary">North Wheat Field</span>
                <span className="text-xs bg-agri-primary/20 text-agri-primary px-2 py-1 rounded-full border border-agri-primary/30">Irrigate Now</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Apply 450L over 22 mins.</p>
              <p className="text-xs text-slate-500">Reason: Moisture at 28%. Booting stage.</p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-slate-300">East Rice Paddy</span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">Wait</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">No action needed.</p>
              <p className="text-xs text-slate-500">Reason: Rain forecast 15mm tomorrow.</p>
            </div>
            
            <button className="mt-auto w-full py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition text-sm font-medium">
              View All Zones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
