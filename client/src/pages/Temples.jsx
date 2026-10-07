import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import SearchBar from '../components/SearchBar';
import TempleCard from '../components/TempleCard';
import Loader from '../components/Loader';

export default function Temples() {
  const [allTemples, setAllTemples] = useState([]); 
  const [displayedTemples, setDisplayedTemples] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [urlParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoading(true);
        const response = await API.get('/temple');
        const data = response.data.temples || response.data;
        
        let initialData = [];
        if (data && Array.isArray(data) && data.length > 0) {
          initialData = data;
        } else {
          throw new Error("Empty DB stream");
        }

        setAllTemples(initialData);
        processInitialSearch(initialData);

      } catch (err) {
        console.warn("Backend offline. Engaging fallback database vault.");
        const fallbackData = [
          { _id: '60c72b2f9b1d8b2badcd1111', name: 'Kedarnath Temple', state: 'Uttarakhand', location: 'Rudraprayag, Uttarakhand', rating: '4.9', description: 'One of the holiest Hindu temples dedicated to Lord Shiva, located in the Himalayas.' },
          { _id: '60c72b2f9b1d8b2badcd2222', name: 'Tirupati Balaji Temple', state: 'Andhra Pradesh', location: 'Tirumala, Andhra Pradesh', rating: '4.8', description: 'Famous Vedic temple of Lord Venkateswara, known for its spiritual grandeur.' },
          { _id: '60c72b2f9b1d8b2badcd3333', name: 'Kashi Vishwanath Temple', state: 'Uttar Pradesh', location: 'Varanasi, Uttar Pradesh', rating: '4.9', description: 'Located on the western bank of holy river Ganga, one of the twelve Jyotirlingas.' }
        ];
        setAllTemples(fallbackData);
        processInitialSearch(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchTemples();
  }, [urlParams]); // 🌟 URL पैरामीटर बदलते ही दोबारा चेक करेगा

  // 🌟 होम पेज से आए हुए सर्च टेक्स्ट को कैच और फ़िल्टर करने का मैकेनिज्म
  const processInitialSearch = (masterData) => {
    const queryParam = urlParams.get('query');
    if (queryParam) {
      setSearchInput(queryParam);
      const filtered = masterData.filter(temple => 
        temple.name ? temple.name.toLowerCase().includes(queryParam.toLowerCase().trim()) : false
      );
      setDisplayedTemples(filtered);
    } else {
      setDisplayedTemples(masterData);
    }
  };

  const handleSearchExecute = () => {
    const filtered = allTemples.filter(temple => {
      const nameMatch = temple.name ? temple.name.toLowerCase().includes(searchInput.toLowerCase().trim()) : false;
      const stateMatch = selectedState === '' || (temple.state && temple.state.toLowerCase() === selectedState.toLowerCase().trim());
      return nameMatch && stateMatch;
    });
    setDisplayedTemples(filtered);
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center py-20 px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide">Explore Divine Destinations</h1>
        <p className="text-orange-100 mt-2 text-sm md:text-base">Discover sacred temples, check available slots, and book your hassle-free darshan.</p>
      </div>

      <div className="px-4 -mt-10">
        <SearchBar 
          searchInput={searchInput} 
          setSearchInput={setSearchInput} 
          selectedState={selectedState} 
          setSelectedState={setSelectedState} 
          onSearchClick={handleSearchExecute} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {displayedTemples.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-xl max-w-2xl mx-auto p-8">
            <div className="text-6xl mb-4 text-red-500 animate-pulse">⛩️</div>
            <h3 className="text-2xl font-black text-gray-800">Temple Does Not Exist</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              The temple you searched for is currently not registered on <span className="text-orange-600 font-bold">DarshanEase</span> platform. Please check the spelling or select a different state filter.
            </p>
            <button 
              onClick={() => { setSearchInput(''); setSelectedState(''); setDisplayedTemples(allTemples); }}
              className="mt-6 bg-orange-100 text-orange-700 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 hover:text-white transition-all text-xs uppercase"
            >
              🔄 Reset Directory List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedTemples.map((temple) => (
              <TempleCard key={temple._id} temple={temple} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

