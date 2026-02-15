import React from 'react';
import { View, Trip } from '../App';

interface DashboardProps {
  onNavigate: (view: View, tripId?: string) => void;
  trips: Trip[];
  onCreateTrip: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, trips, onCreateTrip }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 lg:p-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">나의 여행 (My Trips)</h1>
          <p className="text-slate-500 mt-1">다음 모험을 계획하고 추억을 정리해보세요.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <span className="material-icons-outlined">search</span>
          </button>
          <button 
            onClick={onCreateTrip}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <span className="material-icons-outlined text-xl">add</span>
            새 여행 시작 (New Trip)
          </button>
        </div>
      </header>

      <div className="mb-10 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4">
        <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">전체 (All)</button>
        <button className="px-4 py-2 hover:bg-white text-slate-600 rounded-full text-sm font-medium transition-colors">추천 여행 (Recommend)</button>
        <button className="px-4 py-2 hover:bg-white text-slate-600 rounded-full text-sm font-medium transition-colors">지난 여행</button>
        <button className="px-4 py-2 hover:bg-white text-slate-600 rounded-full text-sm font-medium transition-colors">작성 중</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        
        {trips.map((trip) => (
            <div 
              key={trip.id}
              onClick={() => onNavigate('itinerary', trip.id)}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-48 shrink-0">
                <img 
                  alt={trip.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={trip.image}
                />
                <div className="absolute top-4 left-4">
                  <span className={`text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                      trip.status === 'upcoming' ? 'bg-primary' :
                      trip.status === 'in-progress' ? 'bg-emerald-500' :
                      trip.status === 'past' ? 'bg-slate-500' : 'bg-amber-500'
                  }`}>
                      {trip.status === 'upcoming' ? 'RECOMMEND FOR YOU' : trip.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">{trip.title}</h3>
                <div className="flex items-center text-slate-500 text-sm mb-4">
                  <span className="material-icons-outlined text-sm mr-1">calendar_today</span>
                  {trip.subtitle}
                </div>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2">
                     {/* Mock Avatars based on ID for visual variety */}
                    <img className="w-7 h-7 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoPreO-U2zLY5Sty2zmVzBXkOKGvmR2Se9fPJhuISJhxXHmY7jZ75Wb5lACtL7-6Has4mXXR9gyMu1X6gxrKkaEalxIBhvWKHYqNHHhn65DuXWo_apurtfPErT0NZQ_DTGm4VtwUh8SZjS4HW9gcJ8Fi7GXzKsCM2HI-GRf3xnsHlDEtTZ5WH3TyPlnpRVT7UoRztri-xkG89JJZbdMmJklYvDrjlHc16WgGVSRl44slMpz7LWzWCQTVzFs269kpGsA7f-AAGW1LU" alt="" />
                    {trip.id !== 'tokyo' && (
                        <img className="w-7 h-7 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYSjg4LMB4J1CuMweNsN4O_eNQB8gSfh6effQM4kAVhiauH1zlvzULwZslxKQcZQFtuMxTgXsh4pZPf9g4E9Qn1oPktTNAJDFlKR8_fdN20qahGDNVFFSoz2jSpXWjHgminqKb27ZdycZphfBVOp-_QI8-ZRTF1I25-vwtansS8hePTl2JisH2W2EzNT5q2tsDhxl_c97gnfJbCajCHPzur1IuglGPX0CPwMtuGBiD5qo6sighYa2yqW3EFr0euCkZZ27qhdImXxM" alt="" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{trip.savedPlacesCount} places saved</span>
                </div>
              </div>
            </div>
        ))}

        {/* Start Planning Card */}
        <div 
          onClick={onCreateTrip}
          className="group border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-8 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer min-h-[380px]"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-icons-outlined text-primary text-3xl">add</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">여행 계획하기</h3>
          <p className="text-slate-500 text-sm text-center mt-2 px-4">새로운 일정을 만들고<br/>세계를 탐험하세요.</p>
        </div>
      </div>

      <section className="mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">추천 여행지 (Suggested)</h2>
          <button 
            onClick={() => onNavigate('explore', 'tokyo')}
            className="text-primary font-semibold text-sm hover:underline"
          >
            모두 보기
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
          <div 
            onClick={() => onNavigate('explore', 'iceland')}
            className="min-w-[280px] bg-white rounded-lg p-4 border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <img alt="Iceland" className="w-16 h-16 rounded-md object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe7AeD-8R6st55GqHIFOnmHIBOlUQJVVAya2h_w7NOexoeftqiV6YW3ker0SIeOckES4qu-5JZQWu4M49P8OyFJMWjF6B14qlKEAEdmAeoZ2hf_CEOKiKxby557Ns-qRFVkw5yKLjPCVneGEXJpDnrR6hapklhVj-kfeav63dZw-NxKiTxmnd9qE7qRhgcmLayHsRO_LFXNSmMzSrqDUSmMs8nSznrTVcvmxr14JsRrqwSd-TL7Enxji1DmOYXo57OVk6zppO0lJ4"/>
            <div>
              <h4 className="font-bold">아이슬란드 (Iceland)</h4>
              <p className="text-xs text-slate-500">자연 & 어드벤처</p>
            </div>
          </div>
          <div 
            onClick={() => onNavigate('explore', 'italy')}
            className="min-w-[280px] bg-white rounded-lg p-4 border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <img alt="Italy" className="w-16 h-16 rounded-md object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUXrq03R3of4hgZH7fNT2UElEqUk93yaOJpL9r26xd1yyA6w9tNw7ZDJx_ZubeZRDQ4vpTsJwtd4dgG35H8BRLFL_XSy1ucWfA5z4rJfibprZSYf1mX2fyl_kRw7SzLuB6HckgebruunCCSyifv58AlRdoqqFTsya35UPP9YL_H9eOAiokuv301BOTsKhPSMowAaDqL-fWtjk7hclEhEMl7XgBt1ayl2iDB1o7hmzwVd-5aqzuvEOMAtER2W4om5FeRBAu4UNqVhU"/>
            <div>
              <h4 className="font-bold">이탈리아 (Italy)</h4>
              <p className="text-xs text-slate-500">음식 & 문화</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;