import React from 'react';
import { View, Trip } from '../App';
import TripHeader from '../components/TripHeader';

interface TripBudgetProps {
  onNavigate: (view: View) => void;
  trip: Trip;
}

const TripBudget: React.FC<TripBudgetProps> = ({ onNavigate, trip }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light">
      <TripHeader onNavigate={onNavigate} activeTab="budget" trip={trip} />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Budget Dashboard</h1>
                <div className="flex items-center gap-2 mt-1 text-slate-500">
                    <span className="material-icons-outlined text-sm">location_on</span>
                    <span className="text-sm">{trip.title}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <button 
                   onClick={() => alert("Export functionality would trigger here")}
                   className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium hover:bg-slate-50"
                 >
                    <span className="material-icons-outlined text-lg">file_download</span>
                    Export
                </button>
                <button 
                   onClick={() => alert("Add Expense form would appear here")}
                   className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                >
                    <span className="material-icons-outlined">add</span>
                    Add Expense
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Stat 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Budget</span>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <span className="material-icons-outlined">account_balance</span>
                    </div>
                </div>
                <div className="text-3xl font-bold mb-4">$5,000.00</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{width: "100%"}}></div>
                </div>
            </div>

             {/* Stat 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Spent</span>
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                        <span className="material-icons-outlined">shopping_cart</span>
                    </div>
                </div>
                <div className="text-3xl font-bold mb-4">$3,240.50</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{width: "65%"}}></div>
                </div>
                 <p className="text-xs text-slate-400 mt-2">65% of your total budget used</p>
            </div>

             {/* Stat 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Remaining</span>
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">savings</span>
                    </div>
                </div>
                <div className="text-3xl font-bold mb-4 text-emerald-600">$1,759.50</div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{width: "35%"}}></div>
                </div>
            </div>
        </div>

        <div className="mb-10">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Spending by Category</h2>
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                 {/* Bar 1 */}
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                            <span className="material-icons-outlined text-primary">flight</span>
                            <span className="font-semibold">Flights & Transport</span>
                         </div>
                         <span className="font-bold">$1,450.00</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                         <div className="bg-primary h-full rounded-full" style={{width: "45%"}}></div>
                    </div>
                 </div>

                 {/* Bar 2 */}
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                            <span className="material-icons-outlined text-purple-500">hotel</span>
                            <span className="font-semibold">Hotels & Stays</span>
                         </div>
                         <span className="font-bold">$1,100.00</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                         <div className="bg-purple-500 h-full rounded-full" style={{width: "34%"}}></div>
                    </div>
                 </div>

                 {/* Bar 3 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2">
                            <span className="material-icons-outlined text-orange-500">restaurant</span>
                            <span className="font-semibold">Food & Dining</span>
                         </div>
                         <span className="font-bold">$480.50</span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                         <div className="bg-orange-500 h-full rounded-full" style={{width: "15%"}}></div>
                    </div>
                 </div>
            </div>
        </div>

        <div>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
                <button className="text-primary font-semibold text-sm hover:underline">View all</button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <ul className="divide-y divide-slate-100">
                    <li className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                                <span className="material-icons-outlined">restaurant</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Le Jules Verne</h4>
                                <p className="text-sm text-slate-500">Dinner • Oct 14, 2024</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-900">-$280.00</p>
                        </div>
                    </li>
                     <li className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <span className="material-icons-outlined">train</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Metro Tickets</h4>
                                <p className="text-sm text-slate-500">Transport • Oct 13, 2024</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-900">-$35.00</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TripBudget;