import React from 'react';
import { View } from '../App';

interface ExploreViewProps {
  onNavigate: (view: View, tripId?: string) => void;
  tripId?: string;
}

const ExploreView: React.FC<ExploreViewProps> = ({ onNavigate, tripId }) => {
  return (
    <div className="flex flex-col h-full bg-background-light overflow-hidden">
        {/* Top Nav */}
       <nav className="bg-white border-b border-slate-200 px-6 py-3 shrink-0">
         <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
            <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <span className="material-icons-outlined text-lg">arrow_back</span>
                </div>
                <span className="text-lg font-bold tracking-tight">Back to Trips</span>
            </div>
             <div className="flex-1 max-w-2xl relative">
                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-primary/50 transition-all text-sm" type="text" placeholder="Search attractions, restaurants, activities in Tokyo..." />
             </div>
             <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="material-icons-outlined text-sm">map</span>
                    <span className="text-sm font-semibold">Map View</span>
                </button>
             </div>
         </div>
       </nav>

       <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
         {/* Main Grid */}
         <section className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">
                    <span>Japan</span>
                    <span className="material-icons-outlined text-xs">chevron_right</span>
                    <span>Tokyo</span>
                </div>
                <h1 className="text-3xl font-bold">Explore Tokyo</h1>
            </div>

            <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
                <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold whitespace-nowrap shadow-md shadow-primary/20">All Recommended</button>
                <button className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-primary transition-colors whitespace-nowrap">Sightseeing</button>
                <button className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-primary transition-colors whitespace-nowrap">Restaurants</button>
                <button className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-primary transition-colors whitespace-nowrap">Nightlife</button>
                <button className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-primary transition-colors whitespace-nowrap">Outdoors</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                {/* Card 1 */}
                <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3eYYyTdPeElv1Q1f44MYj0gAC76Jc1NtOrIiVUfKSwdHkX1ixnANnhQlc8hXf55aIF4OQFh5xcRs_nLpN4kfD-sQCUl2gG38810PpiHfMqen7Y7PBIhjgcF7z3rSjuymJhC2geoBqTMZXTCwf4AwkKk4AWxXDblBnS5ianguCKzlL1Zy1xlFcB8Iwnm6y9NQs9F6UonuXktBjKZWGHS2b7qijShkoxN8OWk_i37X-g0krRK4Usfm-h2MM2ROmhYax00UDOh8Rmho" alt="Shibuya" />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white transition-all">
                             <span className="material-icons-outlined">add</span>
                        </button>
                    </div>
                    <div className="p-5">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Must-See</span>
                            <div className="flex items-center text-amber-500">
                                <span className="material-icons-outlined text-sm">star</span>
                                <span className="text-sm font-bold ml-1">4.9</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Shibuya Crossing</h3>
                        <p className="text-slate-500 text-sm mb-4">The world's busiest pedestrian intersection, a true Tokyo icon.</p>
                         <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">access_time</span> 1-2 hours
                            </span>
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">Free</span>
                        </div>
                    </div>
                </div>

                 {/* Card 2 */}
                <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLgXE16Ng35xXVykB47S17MR1hIFSZo80le5w0NriyAwcrw_bNoRjn1aS7TOufIfxr3H3n9Q9bmXavqxidgj68PXwdX7bmYQrQy9AejVuBBbwUyHLOGk6AmqeM2cqUvGGTKWF-Wzi1cfeVbg-F4aMlM5SkZvTsul-pF3owRMn3P7vNnv_S-l3aii3Lvo0NAfxZfb4Z517-PMkfJHLQdSKkqS872Atnc1FcH45aIyLFrC96W10avPpWf2NWjkMs5EwHlN63q9gOiWk" alt="Senso-ji" />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white transition-all">
                             <span className="material-icons-outlined">add</span>
                        </button>
                    </div>
                    <div className="p-5">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Culture</span>
                            <div className="flex items-center text-amber-500">
                                <span className="material-icons-outlined text-sm">star</span>
                                <span className="text-sm font-bold ml-1">4.8</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Senso-ji Temple</h3>
                        <p className="text-slate-500 text-sm mb-4">Tokyo's oldest temple located in the heart of Asakusa district.</p>
                         <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">access_time</span> 2-3 hours
                            </span>
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">Free</span>
                        </div>
                    </div>
                </div>

                 {/* Card 3 */}
                <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0FkcWwBg_zyoYBcpzqZ8ONJkdLsm8E8-F2kM7-UZgXf1znuguTU2SBQUUV8TrtamoCm5PZukx7aL-nmK1MIRVd9Tq_L2NOmh34WhDOsA5dP3J_SF0WSh4RBy0DuSb8R9C4PiMHujoEsb5jV5LfkY-AohfYLYPCFt1EYE6_T5u6ME7hOeiGSzhVCPa_EKauayirH4AxRDQZ6gmwmFk8-jk-CM6WE1UiGdO2kSXXcqAKUKJNrGFKn10Ge5FhYQM_FwmyMVrEh0vaVo" alt="Tsukiji" />
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white transition-all">
                             <span className="material-icons-outlined">add</span>
                        </button>
                    </div>
                    <div className="p-5">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Food</span>
                            <div className="flex items-center text-amber-500">
                                <span className="material-icons-outlined text-sm">star</span>
                                <span className="text-sm font-bold ml-1">4.7</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-1">Tsukiji Outer Market</h3>
                        <p className="text-slate-500 text-sm mb-4">Explore the vibrant stalls of Tokyo's most famous seafood market.</p>
                         <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <span className="material-icons-outlined text-xs">access_time</span> 2 hours
                            </span>
                            <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded">$$</span>
                        </div>
                    </div>
                </div>
            </div>
         </section>

         {/* Right Sidebar */}
         <aside className="w-[400px] bg-white border-l border-slate-200 hidden xl:flex flex-col">
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-primary">bookmark</span>
                        <h2 className="font-bold text-lg">My Saved Places</h2>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">3 Places</span>
                </div>
                <div className="relative">
                     <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/3"></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Planning Progress: 33%</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3">
                     {/* Item 1 */}
                     <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-move group">
                        <div className="flex-shrink-0">
                            <span className="material-icons-outlined text-slate-300 group-hover:text-primary transition-colors">drag_indicator</span>
                        </div>
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABFfG2aZ-C7bVvZQfpgfoemTVyjWsxF8kt2zvWSfgbom4xt8G1a0SKvNh_pFfs4yZ8ufFLrp6_VEcRJqrbDJH22MvPKnU9xUUDJ2H-FbRztfDbrm4i-9jKO97hPuD3EbYJ8Y_qFyQnOhB0QVuOCe7QMCcqiY_ffQbvgi2Sqp9E8aOYRwvwi97IDAeVoIBtV6LYWaFibS5BLBy1w5b78SUDVgChkudXIjXWIeJzqWoeZNl7qFi5rDAihWhIsDj5uiItAutOEFEsuiU" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-sm truncate">Shibuya Crossing</h4>
                             <p className="text-xs text-slate-500">Must-See Attraction</p>
                        </div>
                        <button className="text-slate-300 hover:text-red-500 transition-colors">
                             <span className="material-icons-outlined text-xl">close</span>
                        </button>
                     </div>

                     {/* Item 2 */}
                      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-move group">
                        <div className="flex-shrink-0">
                            <span className="material-icons-outlined text-slate-300 group-hover:text-primary transition-colors">drag_indicator</span>
                        </div>
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACjIf8PI5P1FeOb4q5vh5DgIdQSc9j-B39rslmmnU5mBHH1N6mdVa6ltZwAqUPrFz4c4RTvnA2L_WGTA6g3vjG0C_1a142PuftTB0X2RMwZxhpEfSavH32D6wUARKkvkRSfrCNcdlvm6qf2xeDOO-sVmgZUGY7ssdr1I6hbjvETafhx9BI9Wt9L8IMD-LPoOW611S3ZJ8f5EmNFvwoXWNCdm4T89L_PV_7r23tODOqNaxwifirm3w46XIE8qmLmSlkYt3qiWp9qVY" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-sm truncate">Senso-ji Temple</h4>
                             <p className="text-xs text-slate-500">Culture & Religion</p>
                        </div>
                        <button className="text-slate-300 hover:text-red-500 transition-colors">
                             <span className="material-icons-outlined text-xl">close</span>
                        </button>
                     </div>

                      {/* Drop Area */}
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-60">
                        <span className="material-icons-outlined text-slate-300 text-4xl mb-2">add_location_alt</span>
                        <p className="text-xs font-medium text-slate-400 leading-relaxed">Drag places from the grid<br/>or click the plus button to save</p>
                      </div>
                </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 mt-auto">
                <button 
                  onClick={() => onNavigate('itinerary', tripId || 'tokyo')}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 mb-3"
                >
                    <span>Organize Itinerary</span>
                    <span className="material-icons-outlined">arrow_forward</span>
                </button>
            </div>
         </aside>
       </div>
    </div>
  );
};

export default ExploreView;