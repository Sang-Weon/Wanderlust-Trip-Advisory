import React from 'react';
import { View, Trip } from '../App';

interface TripHeaderProps {
  onNavigate: (view: View) => void;
  activeTab: 'itinerary' | 'budget' | 'notes';
  trip?: Trip;
}

const TripHeader: React.FC<TripHeaderProps> = ({ onNavigate, activeTab, trip }) => {
  
  const title = trip ? trip.title : 'Loading Trip...';
  const subtitle = trip ? trip.subtitle : '';

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <span className="material-icons-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold">{title}</h1>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-lg mr-4">
                <button 
                    onClick={() => onNavigate('itinerary')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'itinerary' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Itinerary
                </button>
                <button 
                    onClick={() => onNavigate('budget')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'budget' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Budget
                </button>
                <button 
                    onClick={() => onNavigate('notes')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'notes' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Notes
                </button>
            </div>
            <div className="flex -space-x-2 mr-2">
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH51SKO6KP9c6I4iP2kZ3m8jtajPuK3IAmUfhyE_6n8eHFioTHXctVsSvfGwu8og1KPYugTNVxfOmhaUzPD44mhSpD0SfNWZ9W7gUYmB1WU_VlGlg1kJN2EumIQuOSDcdlPvxjmwOOkGBEZS1hANdt_KJbBJxebzonguAsMzG8S14FMhc6rfoLJO0zK5qqMm1n-T8Ta1dZS5sLn2qg14qAC7hjtiqvyPAlfX9bzwmyvtWQB-hpOJcszcFbBA5W94s9ihhiS09haeE" />
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoPreO-U2zLY5Sty2zmVzBXkOKGvmR2Se9fPJhuISJhxXHmY7jZ75Wb5lACtL7-6Has4mXXR9gyMu1X6gxrKkaEalxIBhvWKHYqNHHhn65DuXWo_apurtfPErT0NZQ_DTGm4VtwUh8SZjS4HW9gcJ8Fi7GXzKsCM2HI-GRf3xnsHlDEtTZ5WH3TyPlnpRVT7UoRztri-xkG89JJZbdMmJklYvDrjlHc16WgGVSRl44slMpz7LWzWCQTVzFs269kpGsA7f-AAGW1LU" />
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">+1</div>
            </div>
            <button 
              onClick={() => alert("Share dialog would open here!")}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
            >
                <span className="material-icons-outlined text-lg">share</span>
                <span className="hidden sm:inline">Share</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default TripHeader;