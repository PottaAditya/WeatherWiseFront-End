import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Droplets, Eye, CloudRain, Sun, Cloud, CloudLightning } from 'lucide-react';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulasi fetch data dari API Anda
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Ganti URL ini dengan endpoint API Laravel/Backend Anda
        // const response = await fetch('YOUR_API_ENDPOINT');
        // const data = await response.json();
        
        // Simulasi delay untuk melihat skeleton loading & animasi
        setTimeout(() => {
          const mockApiResponse = {
            status: "Success",
            nama_kota: "Watermelon Park",
            weather: "thunderstorms expected around 00:00",
            visibility: 10000,
            humidity: 84,
            temp: 23,
            wind_speed: "4.1 m/s",
            icon: "https://openweathermap.org/img/wn/11d@4x.png" // Menggunakan icon petir sesuai gambar
          };
          setWeatherData(mockApiResponse);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Komponen Skeleton Loading (Placeholder saat data dimuat)
  const SkeletonLoading = () => (
    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 bg-black/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 animate-pulse">
      {/* Kiri - Utama */}
      <div className="md:col-span-7 flex flex-col justify-between min-h-[250px] md:min-h-[350px]">
        <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 bg-white/10 rounded-2xl w-24"></div>
            <div className="h-16 bg-white/10 rounded-2xl w-16"></div>
          </div>
          <div className="h-8 bg-white/10 rounded w-48 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-32"></div>
        </div>
      </div>
      {/* Kanan - Detail */}
      <div className="md:col-span-5 flex flex-col gap-4 justify-center">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 h-20 flex items-center justify-between"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-10 overflow-hidden font-sans text-white bg-[#1a2b2c]">
      {/* Background Image dengan Lapisan Kaca/Gelap */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-1000 scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200')`, // Gambar tetesan air hujan estetik
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-slate-900/60 to-black/70 z-0 backdrop-blur-[2px]" />

      {/* Konten Utama */}
      <div className="relative z-10 w-full flex justify-center items-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <SkeletonLoading />
            </motion.div>
          ) : (
            weatherData && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 bg-black/25 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl"
              >
                
                {/* Panel Kiri: Info Utama (Suhu & Kota) */}
                <div className="md:col-span-7 flex flex-col justify-between min-h-[280px] md:min-h-[380px] space-y-8 md:space-y-0">
                  <span className="text-xs font-semibold tracking-wider text-white/40 uppercase">weather.com</span>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl md:text-8xl font-light tracking-tighter"
                      >
                        {weatherData.temp}°<span className="text-4xl md:text-5xl align-super">c</span>
                      </motion.h1>
                      
                      <motion.img 
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                        src={weatherData.icon} 
                        alt={weatherData.weather}
                        className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_8px_8px_rgba(255,255,255,0.15)]"
                      />
                    </div>
                    
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl md:text-3xl font-medium tracking-wide"
                    >
                      {weatherData.nama_kota}
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-white/50 mt-1 capitalize"
                    >
                      {weatherData.weather}
                    </motion.p>
                  </div>
                </div>

                {/* Panel Kanan: Detail Informasi Tambahan (Menggunakan Data Eksisting API) */}
                <div className="md:col-span-5 flex flex-col justify-center gap-4">
                  <span className="text-xs font-semibold tracking-wider text-white/40 uppercase mb-1 block md:hidden">Details</span>
                  
                  {/* Card Wind Speed */}
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <Wind className="w-6 h-6 text-cyan-300" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Wind Speed</p>
                        <p className="text-base font-semibold">{weatherData.wind_speed}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card Humidity */}
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <Droplets className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Humidity</p>
                        <p className="text-base font-semibold">{weatherData.humidity}%</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card Visibility */}
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl">
                        <Eye className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Visibility</p>
                        <p className="text-base font-semibold">{(weatherData.visibility / 1000).toFixed(1)} km</p>
                      </div>
                    </div>
                  </motion.div>

                </div>

              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}