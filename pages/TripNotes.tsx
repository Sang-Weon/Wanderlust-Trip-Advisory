import React from 'react';
import { View, Trip } from '../App';
import TripHeader from '../components/TripHeader';

interface TripNotesProps {
  onNavigate: (view: View) => void;
  trip: Trip;
}

const TripNotes: React.FC<TripNotesProps> = ({ onNavigate, trip }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light">
      <TripHeader onNavigate={onNavigate} activeTab="notes" trip={trip} />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Packing List */}
            <aside className="w-full lg:w-[380px] space-y-8 shrink-0">
                <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit shadow-sm">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <span className="material-icons-outlined text-primary">inventory_2</span>
                            Packing List
                        </h2>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium">12/32 Done</span>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Essentials</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox" />
                                <span className="text-sm text-slate-500 line-through decoration-slate-400">Passport & Visa copies</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox" />
                                <span className="text-sm text-slate-500 line-through decoration-slate-400">Travel Insurance</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox" />
                                <span className="text-sm font-medium text-slate-700">International Driver's Permit</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Electronics</h3>
                         <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <input defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox" />
                                <span className="text-sm text-slate-500 line-through decoration-slate-400">Power adapter (Type C)</span>
                            </li>
                             <li className="flex items-center gap-3">
                                <input className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" type="checkbox" />
                                <span className="text-sm font-medium text-slate-700">Power bank (20,000mAh)</span>
                            </li>
                        </ul>
                    </div>
                     <button 
                       onClick={() => alert("Add Item dialog would open here")}
                       className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:text-primary hover:border-primary/50 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                     >
                        <span className="material-icons-outlined text-base">add</span>
                        Add Item
                    </button>
                </div>

                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-primary/20">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <span className="material-icons-outlined">tips_and_updates</span>
                        {trip.title} Tips
                    </h3>
                    <ul className="text-sm space-y-3 text-blue-50">
                        <li className="flex gap-2"><span className="font-bold">•</span> Watch out for pickpockets at major sights.</li>
                        <li className="flex gap-2"><span className="font-bold">•</span> Most museums are closed on Tuesdays.</li>
                        <li className="flex gap-2"><span className="font-bold">•</span> 'Bonjour' is mandatory when entering shops.</li>
                    </ul>
                </div>
            </aside>

            {/* Main Content: Notes */}
            <section className="flex-1 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                     {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50">
                        <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><span className="material-icons-outlined text-lg">format_bold</span></button>
                        <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><span className="material-icons-outlined text-lg">format_italic</span></button>
                        <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><span className="material-icons-outlined text-lg">format_list_bulleted</span></button>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <button className="p-1.5 hover:bg-slate-200 rounded text-slate-600"><span className="material-icons-outlined text-lg">link</span></button>
                        <div className="flex-1"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Last saved 5m ago</span>
                    </div>

                    <div className="p-8 flex-1 outline-none">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Trip Coordination Notes</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Flight details and hotel information for the group. We need to decide on the train times to Amalfi.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                        <span className="material-icons-outlined">flight_takeoff</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Flight: AF007</h4>
                                        <p className="text-xs text-slate-500">Alex & Mark</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><span className="material-icons-outlined text-sm">edit</span></button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Departure</p>
                                    <p className="text-sm font-semibold">JFK · 07:30 PM</p>
                                </div>
                                 <div className="p-3 bg-white rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Arrival</p>
                                    <p className="text-sm font-semibold">CDG · 08:45 AM</p>
                                    <p className="text-[10px] text-slate-500">+1 Day</p>
                                </div>
                            </div>
                        </div>

                         <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <span className="material-icons-outlined">hotel</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">Hotel Le Six</h4>
                                        <p className="text-xs text-slate-500">Main Stay · 4 Nights</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><span className="material-icons-outlined text-sm">edit</span></button>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-600 px-1">
                                <div className="flex items-center gap-1">
                                    <span className="material-icons-outlined text-base">location_on</span>
                                    <span>14 Rue Stanislas, Paris</span>
                                </div>
                                 <div className="flex items-center gap-1">
                                    <span className="material-icons-outlined text-base">confirmation_number</span>
                                    <span>Conf: #PAR-7721</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                 {/* Chat Section */}
                 <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-bold text-sm mb-4">Recent Collaboration</h3>
                    <div className="space-y-4">
                         <div className="flex gap-3">
                            <img alt="Sarah" className="w-8 h-8 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoPreO-U2zLY5Sty2zmVzBXkOKGvmR2Se9fPJhuISJhxXHmY7jZ75Wb5lACtL7-6Has4mXXR9gyMu1X6gxrKkaEalxIBhvWKHYqNHHhn65DuXWo_apurtfPErT0NZQ_DTGm4VtwUh8SZjS4HW9gcJ8Fi7GXzKsCM2HI-GRf3xnsHlDEtTZ5WH3TyPlnpRVT7UoRztri-xkG89JJZbdMmJklYvDrjlHc16WgGVSRl44slMpz7LWzWCQTVzFs269kpGsA7f-AAGW1LU"/>
                            <div className="flex-1 bg-slate-50 p-3 rounded-lg rounded-tl-none">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-bold">Sarah Miller</span>
                                    <span className="text-[10px] text-slate-400">10:45 AM</span>
                                </div>
                                <p className="text-sm text-slate-600">I added the hotel booking details. Can someone check if breakfast is included?</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <input className="flex-1 bg-slate-100 border-none rounded-lg text-sm px-4 py-2 focus:ring-1 focus:ring-primary" type="text" placeholder="Add a comment..." />
                        <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"><span className="material-icons-outlined text-sm">send</span></button>
                    </div>
                 </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default TripNotes;