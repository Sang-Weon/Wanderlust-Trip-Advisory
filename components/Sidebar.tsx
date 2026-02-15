import React from 'react';
import { View } from '../App';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', icon: 'home', label: 'Home', view: 'dashboard' as View },
    { id: 'trips', icon: 'map', label: 'My Trips', view: 'dashboard' as View },
    { id: 'saved', icon: 'bookmark_border', label: 'Saved Places', view: 'explore' as View },
    { id: 'guides', icon: 'explore', label: 'Guides', view: 'dashboard' as View },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-full z-30 shrink-0 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 text-primary cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <span className="material-icons-outlined text-3xl">flight_takeoff</span>
          <span className="text-xl font-bold tracking-tight">Wanderlust</span>
        </div>
      </div>
      
      <nav className="flex-1 mt-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center px-6 py-3 transition-colors ${
                  (currentView === 'dashboard' && item.id === 'home') || 
                  (currentView === 'explore' && item.id === 'saved') ||
                  (currentView === 'dashboard' && item.id === 'trips') 
                    ? 'bg-primary/10 text-primary border-r-[3px] border-primary'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`material-icons-outlined mr-3 ${
                   (currentView === 'dashboard' && item.id === 'home') || 
                   (currentView === 'explore' && item.id === 'saved')
                   ? 'text-primary' : ''
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="px-6 mt-10 mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</span>
        </div>
        <ul className="space-y-1">
          <li>
            <button className="w-full flex items-center px-6 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
              <span className="material-icons-outlined mr-3">settings</span>
              <span className="font-medium">Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <img 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH51SKO6KP9c6I4iP2kZ3m8jtajPuK3IAmUfhyE_6n8eHFioTHXctVsSvfGwu8og1KPYugTNVxfOmhaUzPD44mhSpD0SfNWZ9W7gUYmB1WU_VlGlg1kJN2EumIQuOSDcdlPvxjmwOOkGBEZS1hANdt_KJbBJxebzonguAsMzG8S14FMhc6rfoLJO0zK5qqMm1n-T8Ta1dZS5sLn2qg14qAC7hjtiqvyPAlfX9bzwmyvtWQB-hpOJcszcFbBA5W94s9ihhiS09haeE"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Alex Thompson</p>
            <p className="text-xs text-slate-500 truncate italic">Explorer Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;