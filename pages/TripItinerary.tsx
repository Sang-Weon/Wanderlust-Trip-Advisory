import React, { useState, useEffect } from 'react';
import { View, Trip, ItineraryItem } from '../App';
import TripHeader from '../components/TripHeader';
import { GoogleGenAI, Type } from "@google/genai";

interface TripItineraryProps {
  onNavigate: (view: View) => void;
  trip: Trip;
  onUpdateTrip: (trip: Trip) => void;
}

interface RecommendationItem {
  name: string;
  originalName: string;
  description: string;
  type: 'activity' | 'dining';
  rating: number;
  isHotPlace: boolean;
  price: string;
  menu: string[];
  location: string;
}

const TripItinerary: React.FC<TripItineraryProps> = ({ onNavigate, trip, onUpdateTrip }) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State for replacing an item
  const [replacementTarget, setReplacementTarget] = useState<ItineraryItem | null>(null);

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Filter items by current Day. Items without a day (old data) default to day 1.
  const allItems = trip.items || [];
  const currentItems = allItems.filter(item => (item.day || 1) === currentDay).sort((a,b) => a.time.localeCompare(b.time));
  
  // Determine total days based on items
  const maxDay = allItems.length > 0 ? Math.max(...allItems.map(i => i.day || 1)) : 1;
  const daysArray = Array.from({ length: maxDay }, (_, i) => i + 1);

  // Helper for image generation (consistent with TripWizard)
  const getContextualImage = (query: string, type: string) => {
    const cleanQuery = query.replace(/\(.*\)/, '').trim(); 
    const prompt = `${cleanQuery} ${type}, travel photography, 4k, cinematic lighting, scenic view`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
  };

  const handleNextDay = () => {
    if (currentDay < maxDay) setCurrentDay(prev => prev + 1);
  };

  const handleOpenSearch = (targetItem?: ItineraryItem) => {
      setRecommendations([]);
      setSelectedIndices(new Set());
      setSearchQuery("");
      
      if (targetItem) {
          setReplacementTarget(targetItem);
          // Pre-fill query for replacement
          setSearchQuery(`${targetItem.title} 대신 갈만한 ${targetItem.type === 'dining' ? '맛집' : '여행지'}`);
          // Auto trigger search for replacement
          handleSearch(`${targetItem.title} 대신 갈만한 주변의 ${targetItem.type === 'dining' ? '비슷한 가격대 맛집' : '다른 매력의 여행지'} 추천해줘.`);
      } else {
          setReplacementTarget(null);
      }
      setIsModalOpen(true);
  };

  const handleSearch = async (overrideQuery?: string) => {
    const query = overrideQuery || searchQuery;
    if (!query.trim()) return;
    
    setLoading(true);
    setRecommendations([]);
    setSelectedIndices(new Set());

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const prompt = `
        사용자가 여행 계획 중이며 다음을 요청했습니다: "${query}".
        이 요청에 맞는 구체적인 장소나 활동 3곳을 추천해주세요.
        
        다음 규칙을 반드시 지켜주세요:
        1. 모든 장소 이름은 "한글 (원어)" 형식으로 표기하세요.
        2. 가격은 해당 국가 통화를 기본으로 하고 괄호 안에 원화(KRW) 환산액을 병기하세요.
        3. SNS에서 인기 있는 곳이라면 isHotPlace를 true로 설정하세요.
        4. 맛집(dining)인 경우 대표 메뉴 2~3가지를 menu 배열에 담으세요.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                originalName: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["activity", "dining"] },
                rating: { type: Type.NUMBER },
                isHotPlace: { type: Type.BOOLEAN },
                price: { type: Type.STRING },
                menu: { type: Type.ARRAY, items: { type: Type.STRING } },
                location: { type: Type.STRING }
              },
              required: ["name", "originalName", "type", "rating", "isHotPlace", "price", "location"]
            }
          }
        },
      });

      if (response.text) {
        const data = JSON.parse(response.text) as RecommendationItem[];
        setRecommendations(data);
      }

    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("추천 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (index: number) => {
    // If replacing, only allow single selection
    if (replacementTarget) {
        const newSelection = new Set();
        if (selectedIndices.has(index)) {
             // deselect
        } else {
            newSelection.add(index);
        }
        setSelectedIndices(newSelection as Set<number>);
        return;
    }

    const newSelection = new Set(selectedIndices);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedIndices(newSelection);
  };

  const handleConfirmItems = () => {
    // Generate new Itinerary Items from selections
    const newItemsData: ItineraryItem[] = [];
    
    selectedIndices.forEach(index => {
      const rec = recommendations[index];
      newItemsData.push({
        id: Date.now() + index,
        day: currentDay, // Assign to current day
        time: replacementTarget ? replacementTarget.time : "시간 미정", // Keep original time if replacing
        title: `${rec.name} (${rec.originalName})`,
        location: rec.location,
        description: rec.description,
        type: rec.type,
        rating: rec.rating,
        price: rec.price,
        isHotPlace: rec.isHotPlace,
        image: getContextualImage(rec.name, rec.type)
      });
    });

    let updatedTripItems = [...trip.items];

    if (replacementTarget) {
        // Replacement Mode: Swap the item
        if (newItemsData.length > 0) {
            const newItem = newItemsData[0];
            updatedTripItems = updatedTripItems.map(item => 
                item.id === replacementTarget.id ? { ...newItem, id: item.id } : item
            );
        }
    } else {
        // Add Mode: Append new items
        updatedTripItems = [...updatedTripItems, ...newItemsData];
    }

    onUpdateTrip({
        ...trip,
        items: updatedTripItems,
        savedPlacesCount: updatedTripItems.length
    });

    setIsModalOpen(false);
    setSearchQuery("");
    setRecommendations([]);
    setSelectedIndices(new Set());
    setReplacementTarget(null);
  };

  const openGoogleMaps = (location: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(url, '_blank', 'width=800,height=600');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <TripHeader onNavigate={onNavigate} activeTab="itinerary" trip={trip} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Day Selector */}
        <aside className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-4 overflow-y-auto no-scrollbar hidden md:flex shrink-0">
          {daysArray.map((day) => (
            <button 
              key={day} 
              onClick={() => setCurrentDay(day)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                currentDay === day 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-bold uppercase">DAY</span>
              <span className="text-xl font-bold">{day}</span>
            </button>
          ))}
          <div className="h-px w-8 bg-slate-200 my-2"></div>
          <button 
            onClick={() => {
                // Add new day if needed or just add item to current day
                 handleOpenSearch();
            }}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
            title="일정 추가"
          >
            <span className="material-icons-outlined">add</span>
          </button>
        </aside>

        {/* Middle: Timeline */}
        <div id="itinerary-container" className="flex-1 lg:flex-[0.45] xl:flex-[0.4] bg-white overflow-y-auto z-20 shadow-xl border-r border-slate-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur z-20 py-2 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold">Day {currentDay}</h2>
                <p className="text-slate-500 text-sm flex items-center gap-1">
                   <span className="material-icons-outlined text-sm">event</span>
                   여행 {currentDay}일차 일정
                </p>
              </div>
              <button 
                onClick={() => handleOpenSearch()}
                className="p-2 text-primary hover:bg-primary/5 rounded-full transition-colors flex items-center gap-1 text-sm font-semibold"
              >
                <span className="material-icons-outlined">add</span>
                추가
              </button>
            </div>

            <div className="relative flex flex-col gap-8 pb-10">
               {/* Dotted Line */}
               <div className="absolute left-[27px] top-4 bottom-0 w-0.5 border-l-2 border-dashed border-slate-200 z-0"></div>

              {currentItems.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mx-4">
                      <span className="material-icons-outlined text-4xl mb-2 text-slate-300">calendar_today</span>
                      <p className="font-medium">이 날은 아직 일정이 없습니다.</p>
                      <button onClick={() => handleOpenSearch()} className="text-primary hover:underline mt-2 font-semibold">
                          + 일정 추가하기
                      </button>
                  </div>
              ) : (
                currentItems.map((item, index) => (
                    <div key={item.id} className="relative flex gap-6 group">
                        {/* Timeline Node */}
                        <div className="z-10 flex flex-col items-center shrink-0">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-lg border-4 border-white transition-transform group-hover:scale-110 ${index === 0 ? 'bg-primary text-white' : 'bg-white text-slate-600 shadow-md'}`}>
                            {index + 1}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight bg-white px-1 py-0.5 rounded border border-slate-100">{item.time}</span>
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer relative group/card">
                            {/* Replace Button (Visible on Hover) */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenSearch(item);
                                }}
                                className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur text-slate-500 p-1.5 rounded-full shadow-md opacity-0 group-hover/card:opacity-100 hover:text-primary hover:bg-white transition-all transform hover:scale-110"
                                title="다른 장소로 변경 추천받기"
                            >
                                <span className="material-icons-outlined text-lg">cached</span>
                            </button>

                            {item.image && (
                            <div className="relative h-40 overflow-hidden">
                                <img alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" src={item.image}/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                {item.isHotPlace && (
                                    <div className="absolute top-3 left-3 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                        <span className="material-icons-outlined text-[10px]">local_fire_department</span>
                                        HOT
                                    </div>
                                )}
                            </div>
                            )}
                            
                            <div className="p-4">
                                <h4 className="font-bold text-lg leading-tight mb-2 text-slate-800">{item.title}</h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <p className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                                        <span className="material-icons-outlined text-sm">
                                            {item.type === 'dining' ? 'restaurant' : item.type === 'hotel' ? 'hotel' : 'location_on'}
                                        </span>
                                        <span className="truncate max-w-[150px]">{item.location}</span>
                                    </p>
                                    {item.rating && (
                                        <div className="flex items-center text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-md">
                                            <span className="material-icons-outlined text-sm mr-0.5">star</span>
                                            {item.rating}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    {item.price && (
                                        <div className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                            <span className="material-icons-outlined text-sm text-slate-400">payments</span>
                                            {item.price}
                                        </div>
                                    )}
                                    {item.description && (
                                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openGoogleMaps(item.location);
                                    }}
                                    className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <span className="material-icons-outlined text-sm">map</span>
                                    지도에서 위치 확인
                                </button>
                            </div>
                        </div>
                    </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div className="hidden lg:block lg:flex-1 relative bg-slate-100">
            <div className="absolute inset-0 overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center grayscale-[0.2]"
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwEJT-SlSE-YjDNklUp7E3Qt0AX6cbv96eifpyivRZfwphd0xCvsxQ7SsXajtPoAfOso8ntdOJQfpMN57b6kc4o84_6DoOjiMtMl9xLFR-Mqcv9rzDsPqiw1ikvhhbGaQC8UfOavQcSpfP5EtogH8IQ1n1XNQ8EQwqwtdJdHr-pqxrT49u66dc-8P-QzNhBpuQkP1ZndJ7kr_ORPcY8SzqzbC0GS18hBAvRotY3kiqRzLM33lJ8FCmEnBjN3uSu40Hy4XuCwR5aEE')`}}
                ></div>
                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

                {/* Markers for Current Day */}
                {currentItems.map((item, index) => (
                   <div key={item.id} className="absolute group cursor-pointer hover:z-50" style={{ top: `${30 + (index * 8) + (Math.random() * 5)}%`, left: `${40 + (index * 4) + (Math.random() * 10)}%` }}>
                        <div className="flex flex-col items-center">
                            <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-xl border-2 transition-transform hover:scale-125 ${index === 0 ? 'bg-primary text-white border-white' : 'bg-white text-slate-800 border-primary'}`}>
                                {index + 1}
                            </div>
                            <div className="mt-2 px-3 py-1.5 bg-white rounded-lg shadow-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-slate-800 border border-slate-100">
                                {item.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Search / Replace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                    {replacementTarget ? (
                        <>
                            <span className="material-icons-outlined text-orange-500">swap_horiz</span>
                            <span>일정 변경 (Alternative Recommendation)</span>
                        </>
                    ) : (
                        <>
                            <span className="material-icons-outlined text-primary">add_location_alt</span>
                            <span>일정 추가 (Add Activity)</span>
                        </>
                    )}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    {replacementTarget 
                        ? `'${replacementTarget.title}' 대신 갈만한 곳을 추천해드립니다.` 
                        : '원하는 활동이나 맛집을 검색하여 일정에 추가해보세요.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-hidden flex flex-col">
              <div className="flex gap-2 mb-6 shrink-0">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="예: 조용한 카페, 야경 명소, 현지인 맛집..."
                  className="flex-1 border-slate-200 rounded-xl focus:ring-primary focus:border-primary px-4 py-3"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span className="material-icons-outlined">auto_awesome</span>
                      <span>AI 추천</span>
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                            추천 결과 ({recommendations.length})
                        </h4>
                        <span className="text-xs text-slate-500">
                            {replacementTarget ? '하나만 선택 가능' : '여러 개 선택 가능'}
                        </span>
                     </div>
                     
                     <div className="grid grid-cols-1 gap-4">
                        {recommendations.map((rec, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => toggleSelection(idx)}
                             className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${selectedIndices.has(idx) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 bg-white hover:border-primary/30'}`}
                           >
                              <div className="absolute top-4 right-4 z-10">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedIndices.has(idx) ? 'bg-primary border-primary scale-110' : 'border-slate-300 bg-white'}`}>
                                      {selectedIndices.has(idx) && <span className="material-icons-outlined text-white text-sm">check</span>}
                                  </div>
                              </div>

                              <div className="flex gap-4">
                                  <div className="w-24 h-24 bg-slate-100 rounded-lg shrink-0 overflow-hidden relative">
                                      <img className="w-full h-full object-cover" src={getContextualImage(rec.name, rec.type)} alt="place" />
                                      {rec.isHotPlace && (
                                          <div className="absolute bottom-0 left-0 right-0 bg-pink-500/90 text-white text-[10px] text-center font-bold py-0.5">SNS 🔥</div>
                                      )}
                                  </div>

                                  <div className="flex-1 min-w-0 pr-8">
                                      <div className="flex items-center gap-2 mb-1">
                                          <h5 className="font-bold text-lg text-slate-900 truncate">{rec.name}</h5>
                                      </div>
                                      <p className="text-xs text-slate-500 mb-2 truncate">{rec.originalName}</p>
                                      
                                      <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
                                          <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                              <span className="material-icons-outlined text-sm mr-0.5">star</span>
                                              {rec.rating}
                                          </div>
                                          <div className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                                              {rec.price}
                                          </div>
                                          <div className="text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                              {rec.type === 'dining' ? '음식점' : '활동'}
                                          </div>
                                      </div>

                                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">{rec.description}</p>
                                      
                                      {rec.type === 'dining' && rec.menu && rec.menu.length > 0 && (
                                          <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 mb-2 border border-slate-100">
                                              <span className="font-bold mr-1">🍽 추천 메뉴:</span>
                                              {rec.menu.join(', ')}
                                          </div>
                                      )}

                                      <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openGoogleMaps(rec.location);
                                        }}
                                        className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 mt-1"
                                      >
                                          <span className="material-icons-outlined text-sm">map</span>
                                          위치 확인
                                      </button>
                                  </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                ) : (
                   !loading && (
                    <div className="text-center py-20 text-slate-400">
                      <span className="material-icons-outlined text-5xl mb-3 text-slate-300">travel_explore</span>
                      <p className="text-lg font-medium text-slate-500">
                          {replacementTarget 
                           ? "AI가 대체할 만한 장소를 찾고 있습니다..." 
                           : "검색어를 입력하여 AI 추천을 받아보세요."}
                      </p>
                    </div>
                   )
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">
                    {selectedIndices.size}개 장소 선택됨
                </span>
                <button 
                    onClick={handleConfirmItems}
                    disabled={selectedIndices.size === 0}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                    {replacementTarget ? '변경사항 적용하기' : '선택한 장소 추가하기'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripItinerary;