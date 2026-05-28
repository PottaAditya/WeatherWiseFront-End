import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Wind, Droplets, Eye, Compass, AlertTriangle, X, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';

export default function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState('');
  // Set default utama aplikasi langsung ke Tokyo
  const [city, setCity] = useState('Tokyo'); 
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showDetails, setShowDetails] = useState(false);
  const [showAlertTooltip, setShowAlertTooltip] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Nembak API Laravel membawa parameter query ?city=
        const response = await fetch(`http://localhost:8000/api/weather?city=${city}`);
        const data = await response.json();
        
        if (data && data.status === "Success") {
          setWeatherData(data);
        } else {
          // Jika status error / 404, paksa panggil mock data (Otomatis Tokyo)
          setWeatherData(getMockData());
        }
      } catch (error) {
        setWeatherData(getMockData());
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchWeather();
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Kalau kolom search dihapus total / kosong terus di-enter, langsung balik ke Tokyo!
    if (!searchQuery.trim()) {
      setCity('Tokyo');
      return;
    }

    setCity(searchQuery.trim());
    setSearchQuery(''); // Bersihkan form setelah disubmit
  };

  const toCelsius = (value) => {
    if (!value && value !== 0) return 0;
    // Jika nilai di atas 150 artinya itu data Kelvin murni, dikurangi 273.15. 
    // Jika di bawah 150 artinya itu sudah data Celsius dari API Laravel kita.
    return value > 150 ? Math.round(value - 273.15) : Math.round(value);
  };

  const getDaysArray = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const result = [];
    const todayIndex = new Date().getDay();
    for (let i = 0; i < 6; i++) {
      result.push(days[(todayIndex + i) % 7]);
    }
    return result;
  };

  // Mock data fallback dipaksa murni mengarah ke Tokyo jika kota tidak ditemukan / API mati
  const getMockData = () => {
    return {
      name: 'Tokyo',
      visibility: 10000,
      wind: { speed: 2.5 },
      main: { 
        temp: 19, 
        temp_max: 22, 
        temp_min: 16, 
        humidity: 60 
      },
      weather: [{ main: "Clouds", description: "partly cloudy", icon: "02d" }]
    };
  };

  const renderWeeklyIcon = (index) => {
    const icons = [
      <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />,
      <Cloud className="w-5 h-5 text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.4)]" />,
      <CloudRain className="w-5 h-5 text-blue-400 drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]" />,
      <CloudLightning className="w-5 h-5 text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.5)]" />,
      <Cloud className="w-5 h-5 text-slate-400" />,
      <Sun className="w-5 h-5 text-orange-400" />
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-[#0a0f14] font-sans text-white selection:bg-white/20">
      
      {/* BACKGROUND LOKASI PREMIUM */}
      <div className="absolute inset-0 bg-cover bg-center scale-105 z-0" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600')` }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0d131a]/95 via-[#161f28]/80 to-[#0a0f14]/95 z-0" />

      {/* AMBIENT SHIMMER EFFECT */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-screen">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '9s' }} />
      </div>

      {/* HEADER CONTROLS */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-between mb-6 px-2">
        <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent">WeatherWise</div>
        <form onSubmit={handleSearch} className="flex items-center bg-black/30 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md focus-within:border-white/30 transition-all">
          <input type="text" placeholder="Search location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none text-sm w-36 sm:w-52 placeholder:text-white/30 text-white" />
          <button type="submit"><Search className="w-4 h-4 text-white/50 hover:text-white" /></button>
        </form>
      </div>

      {/* DASHBOARD UTAMA */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="col-span-12 rounded-[32px] bg-black/40 border border-white/5 h-[500px] flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-t-white/80 border-r-transparent border-b-white/20 border-l-transparent animate-spin" />
            </motion.div>
          ) : weatherData && (
            <motion.div key="main" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="col-span-12 rounded-[32px] bg-gradient-to-b from-white/[0.03] to-black/50 border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-[0_32px_64px_rgba(0,0,0,0.7)] backdrop-blur-3xl">
              
              {/* === PANEL KIRI === */}
              <div className="col-span-12 lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-white/[0.01] border-b lg:border-b-0 lg:border-r border-white/10">
                <div>
                  <div className="text-xs tracking-widest text-white/30 uppercase mb-3">Status</div>
                  
                  <div className="relative bg-black/40 border border-white/5 rounded-2xl p-5 overflow-hidden h-40 flex flex-col justify-between group">
                    <div className="flex justify-between items-center z-10">
                      <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-400/10 px-2.5 py-0.5 rounded-full">↑ {weatherData.main?.humidity}%</span>
                      
                      <button 
                        type="button"
                        onClick={() => setShowAlertTooltip(!showAlertTooltip)}
                        className="text-white/40 hover:text-amber-400 transition-colors text-xs flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 z-20"
                      >
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> Info
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAlertTooltip && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute top-12 right-4 left-4 bg-red-950/90 border border-red-500/30 p-2.5 rounded-xl text-[11px] text-red-200 z-30 shadow-2xl backdrop-blur-md">
                          <p className="font-bold mb-0.5">⚠️ Weather Alert System</p>
                          {weatherData.weather?.[0]?.main === 'Rain' ? 'Dangerous: High risk of slippery roads.' : 'Stable: General metrics within nominal bounds.'}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <svg className="absolute bottom-0 left-0 w-full h-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <motion.path 
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                        d="M0,80 Q35,65 65,30 T100,15" fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" 
                      />
                      <circle cx="65" cy="30" r="3" fill="#fff" />
                      <circle cx="65" cy="30" r="8" fill="rgba(6,182,212,0.4)" className="animate-ping" />
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#38b6ff" /><stop offset="100%" stopColor="#ffde59" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <button type="button" onClick={() => setShowDetails(true)} className="text-[11px] text-white/40 hover:text-white transition-colors text-left mt-auto z-10 cursor-pointer">
                      See Moredetails ›
                    </button>
                  </div>
                </div>

                {/* PARAMETERS HOVER CARDS */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="relative bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center group/wind overflow-hidden cursor-pointer h-24 transition-all hover:bg-white/[0.04] hover:border-white/20">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/wind:opacity-100 transition-all duration-300 scale-75 group-hover/wind:scale-110 pointer-events-none">
                      <svg className="w-16 h-16 text-cyan-400/30 animate-spin" style={{ animationDuration: '1.5s' }} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 12" fill="none" />
                      </svg>
                    </div>
                    <Wind className="w-5 h-5 text-slate-400 mb-1 group-hover/wind:text-cyan-400 transition-transform z-10" />
                    <span className="text-[10px] text-white/30 block z-10">Wind Speed</span>
                    <span className="text-xs font-semibold mt-0.5 text-white/90 z-10">{weatherData.wind?.speed} m/s</span>
                  </div>

                  <div className="relative bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center group/hum overflow-hidden cursor-pointer h-24 transition-all hover:bg-white/[0.04] hover:border-white/20">
                    <div className="absolute w-2 h-2 bg-blue-400/20 rounded-full opacity-0 group-hover/hum:opacity-100 group-hover/hum:scale-[15] transition-all duration-700 ease-out pointer-events-none" />
                    <Droplets className="w-5 h-5 text-blue-400 mb-1 group-hover/hum:animate-bounce z-10" />
                    <span className="text-[10px] text-white/30 block z-10">Humidity</span>
                    <span className="text-xs font-semibold mt-0.5 text-white/90 z-10">{weatherData.main?.humidity}%</span>
                  </div>

                  <div className="relative bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center group/vis overflow-hidden cursor-pointer h-24 transition-all hover:bg-white/[0.04] hover:border-white/20">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400/30 group-hover/vis:animate-[scan_1.5s_infinite_linear] pointer-events-none" />
                    <Eye className="w-5 h-5 text-emerald-400 mb-1 z-10" />
                    <span className="text-[10px] text-white/30 block z-10">Visibility</span>
                    <span className="text-xs font-semibold mt-0.5 text-white/90 z-10">{weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : '10.0'} km</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-light">
                  <div className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> {weatherData.name}, AppData</div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* === PANEL KANAN === */}
              <div className="col-span-12 lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between relative min-h-[400px]">
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-white/70 font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" /> 
                      {weatherData.name}
                    </div>
                    
                    <div className="flex items-baseline mt-1">
                      <h1 className="text-7xl sm:text-8xl font-extralight tracking-tighter leading-none">{toCelsius(weatherData.main?.temp)}</h1>
                      <span className="text-2xl font-light text-white/40 ml-0.5 -translate-y-6">°</span>
                      <div className="ml-5 flex flex-col text-[11px] text-white/30 bg-black/20 border border-white/5 px-2.5 py-1 rounded-xl">
                        <span>H: {toCelsius(weatherData.main?.temp_max)}°</span>
                        <span>L: {toCelsius(weatherData.main?.temp_min)}°</span>
                      </div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-light tracking-wide mt-3 capitalize text-white/90">
                      {weatherData.weather?.[0]?.description || 'Clear Sky'}
                    </h2>
                  </div>
                  
                  <div className="max-w-xs md:text-right text-xs text-white/30 font-light leading-relaxed">
                    With real time data and advanced technology, we provide reliable forecasts for any location around the world.
                  </div>
                </div>

                {/* WEEKLY FORECAST COMPONENT */}
                <div className="mt-10">
                  <div className="grid grid-cols-6 text-center text-xs font-light text-white/40 mb-3 border-b border-white/5 pb-2">
                    {getDaysArray().map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 group">
                        <span className={idx === 3 ? 'text-white font-medium' : ''}>{day.substring(0, 3)}</span>
                        <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">
                          {renderWeeklyIcon(idx)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SVG Ombak Sinusoidal Graph */}
                  <div className="relative w-full h-20 mt-2">
                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 100">
                      <path d="M 0,70 C 100,70 100,50 200,50 C 300,50 300,65 400,25 C 500,-15 500,55 600,55" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="400" cy="25" r="4" fill="#fff" />
                      <circle cx="400" cy="25" r="10" fill="rgba(255,255,255,0.15)" className="animate-ping" />
                      <line x1="400" y1="25" x2="400" y2="100" stroke="rgba(255,255,255,0.15)" strokeDasharray="3,3" />
                    </svg>

                    <div className="absolute bottom-0 w-full grid grid-cols-6 text-center text-sm font-light text-white/30">
                      <span>{toCelsius(weatherData.main?.temp_min) + 2}°</span>
                      <span>{toCelsius(weatherData.main?.temp_min) - 1}°</span>
                      <span>{toCelsius(weatherData.main?.temp_min) + 1}°</span>
                      <span className="text-white text-base font-normal -translate-y-0.5">{toCelsius(weatherData.main?.temp)}°</span>
                      <span>{toCelsius(weatherData.main?.temp_max) + 1}°</span>
                      <span>{toCelsius(weatherData.main?.temp_max) - 2}°</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* POPUP ANALYTICS DETAILS */}
      <AnimatePresence>
        {showDetails && weatherData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-[#111823] border border-white/10 rounded-2xl p-6 relative shadow-2xl">
              <button type="button" onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              
              <h3 className="text-lg font-semibold border-b border-white/10 pb-3 mb-4">Complete Weather Analytics</h3>
              
              <div className="flex flex-col gap-3 text-sm font-light">
                <div className="flex justify-between bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-white/40">Atmospheric Temperature</span>
                  <span className="font-semibold text-cyan-400">{toCelsius(weatherData.main?.temp)} °C</span>
                </div>
                <div className="flex justify-between bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-white/40">Air Humidity Saturation</span>
                  <span className="font-semibold">{weatherData.main?.humidity} %</span>
                </div>
                <div className="flex justify-between bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-white/40">Wind Vector Kinematics</span>
                  <span className="font-semibold">{weatherData.wind?.speed} meters/sec</span>
                </div>
                <div className="flex justify-between bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                  <span className="text-white/40">Horizontal Horizon Visibility</span>
                  <span className="font-semibold">{weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : '10.0'} Kilometers</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}