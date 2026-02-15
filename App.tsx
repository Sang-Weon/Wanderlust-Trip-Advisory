import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TripItinerary from './pages/TripItinerary';
import TripBudget from './pages/TripBudget';
import TripNotes from './pages/TripNotes';
import ExploreView from './pages/ExploreView';
import TripWizard from './pages/TripWizard';

export type View = 'dashboard' | 'itinerary' | 'budget' | 'notes' | 'explore' | 'trip-wizard';

export interface ItineraryItem {
  id: number;
  day: number; // Added day property
  time: string;
  title: string;
  location: string;
  description?: string;
  type: 'activity' | 'dining' | 'hotel' | 'golf';
  image: string;
  rating?: number;
  price?: string;
  isHotPlace?: boolean;
}

export interface Trip {
  id: string;
  title: string;
  subtitle: string;
  status: 'upcoming' | 'past' | 'draft' | 'in-progress';
  image: string;
  savedPlacesCount: number;
  items: ItineraryItem[];
}

const INITIAL_TRIPS: Trip[] = [
  {
    id: 'paris',
    title: '낭만의 파리 여행 (Romantic Paris)',
    subtitle: '2024.10.12 - 10.18 • 여행자 3명',
    status: 'upcoming',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaBXtgcjhJN8bti5EFXINkTosta3W8DR29XOtxtD1OydlxK2eSBxAWMXltRKO9P8bknr9NQUEjoXHIeuEX1jARx2A0zILLO4Msw_oXrvxVhsh6wp2n8ZdILTCgIPvah-pbdRHbpMNqPfu363gXikzwp69E-cSz81UPCC6s8O3I4gN7NkRCT1h6YWX_t3JLV_b4RJeM2Osl9gm0O44Ze5g_TCtlmW2r-ApjQkVR3Z_e9sQke8UVxXBXTyJ9p08y_F3HLBnV5VzqxvY',
    savedPlacesCount: 12,
    items: [
        {
            id: 1,
            day: 1,
            time: "09:30 AM",
            title: "에펠탑 (Eiffel Tower)",
            location: "Champ de Mars, 5 Av. Anatole France",
            description: "오전 10시 입장권 예약됨. 북쪽 기둥에서 가이드 미팅.",
            type: "activity",
            rating: 4.8,
            isHotPlace: true,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaBXtgcjhJN8bti5EFXINkTosta3W8DR29XOtxtD1OydlxK2eSBxAWMXltRKO9P8bknr9NQUEjoXHIeuEX1jARx2A0zILLO4Msw_oXrvxVhsh6wp2n8ZdILTCgIPvah-pbdRHbpMNqPfu363gXikzwp69E-cSz81UPCC6s8O3I4gN7NkRCT1h6YWX_t3JLV_b4RJeM2Osl9gm0O44Ze5g_TCtlmW2r-ApjQkVR3Z_e9sQke8UVxXBXTyJ9p08y_F3HLBnV5VzqxvY"
        },
        {
            id: 2,
            day: 1,
            time: "12:45 PM",
            title: "르 쥘 베른 (Le Jules Verne)",
            location: "Fine Dining • 4.7 ★",
            description: "\"도시 전망과 함께하는 점심. 스마트 캐주얼 복장 준수.\"",
            type: "dining",
            rating: 4.7,
            price: "€135 (약 190,000원)",
            image: ""
        },
        {
            id: 3,
            day: 1,
            time: "03:30 PM",
            title: "센강 크루즈 (Seine River Cruise)",
            location: "Bateaux Parisiens Port de la Bourdonnais",
            description: "",
            type: "activity",
            rating: 4.5,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAD8vuijr2z2T-ApieQ3Y1BvW7zozfJXOYcIJIsc1nN3x8rO3-SpIB3Dn6ngi1_I2Jo1dVLWrIUYZbOJ3NUxIleT-ZhUuGKrJipOZszcSl9u5oo0c-tJokcr196Wkz0gZ6WtSMsuW1KY-wx7duUtek_L95rpyVEO43ImM1VOnOM2waXiNk26ifJYRyZSPX-9DI2JjkVH2-LJlQPEBIG0LObW-XyWzwspiRJ-OAD3TdDIMLy9sPQRlmaNolZmU0bmxd9I8Fde-A9Ks"
        }
    ]
  },
  {
    id: 'tokyo',
    title: '도쿄 네온 어드벤처 (Tokyo Neon)',
    subtitle: '2024.05.05 - 05.20 • 여행자 2명',
    status: 'in-progress',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-YI9QH3x8JrQ0UK5slzfY-s3qMllJBDiNwNxxRNOpHuLALc1IixNZcKk12ZlAInZHgB86wLh6JS9DxTHNikKEOZShCcqjEhCmu7-lP0jDasC6WN6O-aAqI52mSfj13nHHNIah3WF82CyVdCnUOrDnyQp6apL5mzcrveNNTbfAmsL9RGCHvUOGsPKd5ApNaiTmHgj-QCBe3SatToVZ5N0aER65lPjXyDFC-aA7GJa771bfivf_q3A6YK0yDgmoA8slj3YwP0hq_HQ',
    savedPlacesCount: 45,
    items: []
  },
   {
    id: 'amalfi',
    title: '아말피 해안 로드트립 (Amalfi Coast)',
    subtitle: '2023.08.10 - 08.25 • 여행자 4명',
    status: 'past',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOW8oaLHIshjm6oAa6Ca6b-D6kkIVeXLO4YA2EHaTIkfg0JDKZqlCeE503Y8rnUUONjDRDK4XDoLSwCnJebOdjU4eiox1y4OX8WIwxK7s04VLIO-0lIklKB8Mg6Wf8iqKUA74uxyIMsjP-QFXgnOB_TWi4mwez9aEIg1iu3u7OW963wx866FnqRrFuWfvjytXcF0oTDP_ekptcL5Ui0cYCshj17ZpiRBD0vq4YtYhuvFhbllTmxE5H9a8d0b16DMVy-tjMnYUR7w4',
    savedPlacesCount: 32,
    items: []
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Load trips from localStorage or use defaults
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('wanderlust_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [selectedTripId, setSelectedTripId] = useState<string>(() => {
    return localStorage.getItem('wanderlust_last_trip_id') || 'paris';
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('wanderlust_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('wanderlust_last_trip_id', selectedTripId);
  }, [selectedTripId]);

  const handleNavigate = (view: View, tripId?: string) => {
    setCurrentView(view);
    if (tripId) {
      setSelectedTripId(tripId);
    }
  };

  // Start the Wizard instead of creating an empty trip immediately
  const handleStartWizard = () => {
    setCurrentView('trip-wizard');
  };

  // Called when the wizard finishes generating a trip
  const handleTripGenerated = (newTrip: Trip) => {
    setTrips([newTrip, ...trips]);
    setSelectedTripId(newTrip.id);
    setCurrentView('itinerary');
  };

  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const getCurrentTrip = () => trips.find(t => t.id === selectedTripId) || trips[0];

  const renderContent = () => {
    const currentTrip = getCurrentTrip();

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} trips={trips} onCreateTrip={handleStartWizard} />;
      case 'trip-wizard':
        return <TripWizard onCancel={() => setCurrentView('dashboard')} onTripGenerated={handleTripGenerated} />;
      case 'itinerary':
        return <TripItinerary onNavigate={handleNavigate} trip={currentTrip} onUpdateTrip={handleUpdateTrip} />;
      case 'budget':
        return <TripBudget onNavigate={handleNavigate} trip={currentTrip} />;
      case 'notes':
        return <TripNotes onNavigate={handleNavigate} trip={currentTrip} />;
      case 'explore':
        return <ExploreView onNavigate={handleNavigate} tripId={selectedTripId} />;
      default:
        return <Dashboard onNavigate={handleNavigate} trips={trips} onCreateTrip={handleStartWizard} />;
    }
  };

  return (
    <div className="flex h-screen bg-background-light overflow-hidden font-display text-slate-900">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;