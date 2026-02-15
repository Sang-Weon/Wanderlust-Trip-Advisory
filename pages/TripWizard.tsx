import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Trip, ItineraryItem } from '../App';

interface TripWizardProps {
  onCancel: () => void;
  onTripGenerated: (trip: Trip) => void;
}

// Data types for the wizard
interface TripPreferences {
  destinationQuery: string;
  duration: string;
  travelers: string;
  budget: 'Budget' | 'Standard' | 'Luxury';
  hotelTier: '3성급 (실속형)' | '4성급 (표준형)' | '5성급 (고급형)'; // Added Hotel Tier
  interests: string[];
  isGolf: boolean;
  isRentalCar: boolean;
}

interface SuggestedDestination {
  id: number;
  name: string;
  country: string;
  description: string;
  matchReason: string;
  theme: string;
}

const INTERESTS_OPTIONS = [
  "미식 (Food)", "힐링/휴양 (Relaxing)", "액티비티 (Activity)", 
  "문화/예술 (Culture)", "쇼핑 (Shopping)", "자연/풍경 (Nature)", "사진 (Photo)"
];

const TripWizard: React.FC<TripWizardProps> = ({ onCancel, onTripGenerated }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  const [preferences, setPreferences] = useState<TripPreferences>({
    destinationQuery: '',
    duration: '5박 6일',
    travelers: '2명',
    budget: 'Standard',
    hotelTier: '4성급 (표준형)', // Default value
    interests: [],
    isGolf: false,
    isRentalCar: true, // Default to true as per request context implication
  });

  const [suggestions, setSuggestions] = useState<SuggestedDestination[]>([]);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<Set<number>>(new Set());

  const toggleInterest = (interest: string) => {
    setPreferences(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      }
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const toggleDestination = (id: number) => {
    setSelectedDestinationIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Improved Image Generation using Pollinations AI
  const getContextualImage = (query: string, type: string) => {
    const cleanQuery = query.replace(/\(.*\)/, '').trim(); 
    // Add specific visual descriptors for better travel photos
    const prompt = `${cleanQuery} ${type}, travel photography, 4k, cinematic lighting, scenic view`;
    // Using simple URL encoding without random seed to be deterministic per item or adding a small random component
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    setLoadingMessage("여행 취향을 분석하고 최적의 장소를 찾고 있습니다...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const prompt = `
        사용자 여행 선호도:
        - 희망 지역: ${preferences.destinationQuery || "전세계 어디든 (추천 필요)"}
        - 기간: ${preferences.duration}
        - 인원: ${preferences.travelers}
        - 예산: ${preferences.budget}
        - 테마: ${preferences.interests.join(', ')}
        - 골프: ${preferences.isGolf ? "YES" : "NO"}
        
        위 조건에 맞는 추천 여행지를 **5~6곳** 제안해주세요.
        각 장소의 '테마(theme)'를 명시해주세요.
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
                country: { type: Type.STRING },
                description: { type: Type.STRING },
                matchReason: { type: Type.STRING },
                theme: { type: Type.STRING }
              },
              required: ["name", "country", "description", "matchReason", "theme"]
            }
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text) as Omit<SuggestedDestination, 'id'>[];
        setSuggestions(data.map((item, idx) => ({ ...item, id: idx })));
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      alert("여행지를 추천받는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateItinerary = async () => {
    const selectedDestinations = suggestions.filter(s => selectedDestinationIds.has(s.id));
    if (selectedDestinations.length === 0) return;

    setLoading(true);
    setLoadingMessage("최적의 동선과 시간 배분을 계산하여 일정을 생성 중입니다...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const destinationNames = selectedDestinations.map(d => `${d.name}(${d.country})`).join(', ');

      const prompt = `
        [여행 계획 생성 요청]
        여행지 목록: ${destinationNames}
        전체 기간: ${preferences.duration}
        여행자: ${preferences.travelers}
        예산: ${preferences.budget}
        관심사: ${preferences.interests.join(', ')}
        골프: ${preferences.isGolf}
        렌트카 여부: ${preferences.isRentalCar ? "이용 함 (이동 시간 고려)" : "대중교통/택시"}
        선호 호텔 등급: ${preferences.hotelTier}
        
        선택된 여행지들을 포함하는 통합 여행 일정을 만들어주세요.
        **매우 중요: 각 일정 항목이 '몇 일차(day)'인지 정수형 숫자로 명시해야 합니다.**
        
        [필수 시간 배분 및 동선 규칙]
        1. **일정 시작**: 매일 오전 09:00~09:30 사이에 첫 일정을 시작하세요. (오후 늦게 시작 금지)
        2. **식사 시간**: 
           - 점심: 12:00~13:30 사이 시작, 식사 시간 1시간 소요.
           - 저녁: 18:00~19:30 사이 시작, 식사 시간 2시간 소요.
        3. **이동 시간**: 렌트카 이용을 전제로 장소 간 실제 이동 시간을 현실적으로 고려하여 일정 간격을 두세요.
        4. **숙소(호텔)**: 
           - 사용자가 선택한 '${preferences.hotelTier}'에 맞는 실제 호텔을 추천하세요.
           - 여행 동선에 맞춰 해당 지역의 적절한 호텔을 일정에 포함하세요. (주로 체크인은 오후 늦게 또는 저녁 식사 전후)
        5. **구성**: 하루 최소 3개 스팟(식사 제외) 방문.
        6. **핫플레이스**: isHotPlace=true 적절히 배분.
        7. **Day 필드**: day는 1부터 시작하는 숫자입니다.

        Response JSON Schema: Array of ItineraryItem.
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
                day: { type: Type.INTEGER, description: "Day number (1, 2, 3...)" },
                time: { type: Type.STRING, description: "e.g. 09:00 AM" },
                title: { type: Type.STRING },
                location: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['activity', 'dining', 'hotel', 'golf'] },
                rating: { type: Type.NUMBER },
                price: { type: Type.STRING },
                isHotPlace: { type: Type.BOOLEAN },
              },
              required: ["day", "time", "title", "location", "type"]
            }
          }
        }
      });

      if (response.text) {
        const items = JSON.parse(response.text) as any[];
        
        const processedItems: ItineraryItem[] = items.map((item, index) => ({
            id: Date.now() + index,
            day: item.day,
            time: item.time,
            title: item.title,
            location: item.location,
            description: item.description,
            type: item.type,
            rating: item.rating || 4.5,
            price: item.price,
            isHotPlace: item.isHotPlace,
            image: getContextualImage(item.title, item.type)
        }));

        const mainTitle = selectedDestinations.length > 1 
            ? `${selectedDestinations[0].name} 외 ${selectedDestinations.length - 1}곳 여행`
            : `${selectedDestinations[0].name} 여행`;

        const newTrip: Trip = {
            id: `trip-${Date.now()}`,
            title: mainTitle,
            subtitle: `${preferences.duration} • ${preferences.travelers} • ${preferences.budget} • ${preferences.hotelTier}`,
            status: 'upcoming', 
            image: getContextualImage(selectedDestinations[0].name, 'landscape'),
            savedPlacesCount: processedItems.length,
            items: processedItems
        };

        onTripGenerated(newTrip);
      }

    } catch (error) {
        console.error(error);
        alert("일정을 생성하는 중 오류가 발생했습니다.");
        setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">AI 여행 플래너</h1>
                <p className="text-slate-500 mt-2">여행 취향을 선택하면 최적의 코스를 설계해드립니다.</p>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                <span className="material-icons-outlined">close</span>
            </button>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full mb-10 overflow-hidden">
            <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${(step / 3) * 100}%` }}
            ></div>
        </div>

        {loading && (
             <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-bold text-slate-800 animate-pulse">{loadingMessage}</h3>
                <p className="text-slate-500 mt-2">잠시만 기다려주세요...</p>
            </div>
        )}

        {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-in">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                    기본 설정 및 취향 분석
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">어디로 떠나고 싶으신가요?</label>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border-slate-200 focus:ring-primary focus:border-primary py-3 px-4 text-lg"
                            placeholder="예: 유럽 일주, 동남아 휴양, 일본 맛집 투어 (비워두면 AI 추천)"
                            value={preferences.destinationQuery}
                            onChange={(e) => setPreferences({...preferences, destinationQuery: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">여행 기간</label>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border-slate-200 focus:ring-primary focus:border-primary py-3 px-4"
                            placeholder="예: 3박 4일, 2주일"
                            value={preferences.duration}
                            onChange={(e) => setPreferences({...preferences, duration: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">여행 인원</label>
                        <input 
                            type="text" 
                            className="w-full rounded-xl border-slate-200 focus:ring-primary focus:border-primary py-3 px-4"
                            placeholder="예: 커플, 가족 4인"
                            value={preferences.travelers}
                            onChange={(e) => setPreferences({...preferences, travelers: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">예산 범위</label>
                        <select 
                            className="w-full rounded-xl border-slate-200 focus:ring-primary focus:border-primary py-3 px-4"
                            value={preferences.budget}
                            onChange={(e) => setPreferences({...preferences, budget: e.target.value as any})}
                        >
                            <option value="Budget">알뜰하게 (Budget)</option>
                            <option value="Standard">적당하게 (Standard)</option>
                            <option value="Luxury">럭셔리하게 (Luxury)</option>
                        </select>
                    </div>
                    {/* Hotel Tier Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">선호 호텔 등급</label>
                        <select 
                            className="w-full rounded-xl border-slate-200 focus:ring-primary focus:border-primary py-3 px-4"
                            value={preferences.hotelTier}
                            onChange={(e) => setPreferences({...preferences, hotelTier: e.target.value as any})}
                        >
                            <option value="3성급 (실속형)">3성급 (실속형)</option>
                            <option value="4성급 (표준형)">4성급 (표준형)</option>
                            <option value="5성급 (고급형)">5성급 (고급형)</option>
                        </select>
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">관심사 / 테마 (여러 개 선택 가능)</label>
                    <div className="flex flex-wrap gap-3">
                        {INTERESTS_OPTIONS.map((interest) => (
                            <button 
                                key={interest}
                                onClick={() => toggleInterest(interest)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                    preferences.interests.includes(interest) 
                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                                }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-6 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${preferences.isGolf ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}>
                            {preferences.isGolf && <span className="material-icons-outlined text-white text-xs">check</span>}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden"
                            checked={preferences.isGolf}
                            onChange={(e) => setPreferences({...preferences, isGolf: e.target.checked})}
                        />
                        <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">⛳️ 골프 라운딩 포함</span>
                    </label>
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${preferences.isRentalCar ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}>
                            {preferences.isRentalCar && <span className="material-icons-outlined text-white text-xs">check</span>}
                        </div>
                         <input 
                            type="checkbox" 
                            className="hidden"
                            checked={preferences.isRentalCar}
                            onChange={(e) => setPreferences({...preferences, isRentalCar: e.target.checked})}
                        />
                        <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">🚗 렌트카 이용 (이동 시간 반영)</span>
                    </label>
                </div>

                <div className="flex justify-end">
                    <button 
                        onClick={handleGetRecommendations}
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        다음: 추천 여행지 보기
                        <span className="material-icons-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="animate-fade-in flex flex-col h-full">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                            여행지 선택 ({selectedDestinationIds.size}곳 선택됨)
                        </h2>
                        <p className="text-slate-500 mt-1">방문하고 싶은 곳을 모두 선택해주세요. AI가 최적의 동선으로 연결해드립니다.</p>
                    </div>
                    <button 
                        onClick={() => setStep(1)}
                        className="text-slate-500 font-semibold hover:text-slate-800 flex items-center gap-2 px-4 py-2"
                    >
                        <span className="material-icons-outlined">arrow_back</span>
                        조건 변경
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 pb-20">
                    {suggestions.map((dest) => {
                        const isSelected = selectedDestinationIds.has(dest.id);
                        return (
                            <div 
                                key={dest.id} 
                                onClick={() => toggleDestination(dest.id)}
                                className={`relative rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 group ${
                                    isSelected 
                                    ? 'border-primary shadow-xl scale-[1.02] ring-4 ring-primary/10' 
                                    : 'border-slate-200 hover:border-primary/50 hover:shadow-lg'
                                }`}
                            >
                                <div className="h-48 bg-slate-200 relative overflow-hidden">
                                    <img 
                                        src={getContextualImage(dest.name, 'travel landmark')} 
                                        alt={dest.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-primary text-white' : 'bg-white/30 backdrop-blur text-white hover:bg-white/50'}`}>
                                            <span className="material-icons-outlined">{isSelected ? 'check' : 'add'}</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 left-4 text-white">
                                        <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wider mb-2 border border-white/30">
                                            {dest.theme}
                                        </span>
                                        <h3 className="text-2xl font-bold leading-tight">{dest.name}</h3>
                                        <p className="text-sm font-medium opacity-90 flex items-center gap-1">
                                            <span className="material-icons-outlined text-sm">place</span>
                                            {dest.country}
                                        </p>
                                    </div>
                                </div>
                                <div className={`p-5 transition-colors ${isSelected ? 'bg-primary/5' : 'bg-white'}`}>
                                    <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">{dest.description}</p>
                                    <div className="flex items-start gap-2">
                                        <span className="material-icons-outlined text-primary text-sm mt-0.5">tips_and_updates</span>
                                        <p className="text-xs text-slate-600 font-medium">{dest.matchReason}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-200 flex justify-center z-40 md:static md:bg-transparent md:border-0 md:p-0">
                    <button 
                        onClick={handleGenerateItinerary}
                        disabled={selectedDestinationIds.size === 0}
                        className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                    >
                        <span className="material-icons-outlined">auto_awesome</span>
                        {selectedDestinationIds.size}개 장소로 일정 생성하기
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TripWizard;