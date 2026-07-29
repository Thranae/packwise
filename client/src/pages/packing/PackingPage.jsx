import React, { useState, useEffect } from 'react';
import { Package, Plus, CheckCircle2, Circle, MoreVertical, Sparkles, Clock, CloudRain, Sun, Thermometer, Scale, FileText, AlertTriangle, Briefcase, Home, Power, ShoppingCart, MessageSquare, X, Send, Bot, Scan, Users, Bell, Smartphone, MapPin, Shuffle, Wand2, Shirt, Camera, Umbrella, Glasses, Headphones, Footprints, GripVertical, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import axios from 'axios';
import { PageTransition } from '@/components/common/PageTransition';
import { Button } from '@/components/ui/Button';
import { useTripContext } from '@/context/TripContext';
import { useToast } from '@/hooks/useToast';

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: 'Clothing',
    items: [
      { id: 101, text: 'T-Shirts (x5)', packed: true },
      { id: 102, text: 'Jeans (x2)', packed: true },
      { id: 103, text: 'Light Jacket', packed: false },
      { id: 104, text: 'Walking Shoes', packed: false },
      { id: 105, text: 'Underwear (x7)', packed: false },
      { id: 106, text: 'Socks (x7)', packed: false },
      { id: 107, text: 'Sleepwear', packed: false },
      { id: 108, text: 'Sunglasses', packed: false },
      { id: 109, text: 'Hat / Cap', packed: false },
      { id: 110, text: 'Swimwear', packed: false },
      { id: 111, text: 'Shorts (x3)', packed: false },
      { id: 112, text: 'Formal Wear', packed: false },
      { id: 113, text: 'Sweater / Fleece', packed: false },
      { id: 114, text: 'Belt & Accessories', packed: false },
      { id: 115, text: 'Raincoat', packed: false },
      { id: 116, text: 'Scarf & Gloves', packed: false },
    ]
  },
  {
    id: 2,
    name: 'Electronics',
    items: [
      { id: 201, text: 'Universal Adapter', packed: true },
      { id: 202, text: 'Power Bank', packed: false },
      { id: 203, text: 'Camera + Charger', packed: false },
      { id: 204, text: 'Laptop & Charger', packed: false },
      { id: 205, text: 'Noise-cancelling Headphones', packed: false },
      { id: 206, text: 'E-Reader', packed: false },
      { id: 207, text: 'Smartwatch Charger', packed: false },
      { id: 208, text: 'Portable Speaker', packed: false },
      { id: 209, text: 'Travel Router', packed: false },
      { id: 210, text: 'Cable Organizer', packed: false },
      { id: 211, text: 'Extra SD Cards', packed: false },
      { id: 212, text: 'Multi-port USB Hub', packed: false },
      { id: 213, text: 'Tablet & Stylus', packed: false },
      { id: 214, text: 'Gimbal / Tripod', packed: false },
    ]
  },
  {
    id: 3,
    name: 'Toiletries',
    items: [
      { id: 301, text: 'Toothbrush & Paste', packed: true },
      { id: 302, text: 'Deodorant', packed: true },
      { id: 303, text: 'Sunscreen', packed: false },
    ]
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const generateDateOptions = (startDateStr) => {
   const options = [];
   const today = new Date();
   today.setHours(0,0,0,0);
   
   const end = startDateStr ? new Date(startDateStr) : new Date();
   end.setDate(end.getDate() + 14);
   
   let current = new Date(today);
   let count = 0;
   while (current <= end && count < 60) {
     let label = current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
     const diffTime = current.getTime() - today.getTime();
     const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
     if (diffDays === 0) label = "Today";
     else if (diffDays === 1) label = "Tomorrow";
     
     const tzOffset = current.getTimezoneOffset() * 60000;
     const localISOTime = (new Date(current.getTime() - tzOffset)).toISOString().split('T')[0];
     
     options.push({ label, value: localISOTime });
     current.setDate(current.getDate() + 1);
     count++;
   }
   return options;
};

const DestinationImageWidget = React.memo(({ currentTrip }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const dest = currentTrip?.destination?.split('&')[0] || "Tokyo";
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await axios.get(`${API_URL}/images/search`, { params: { query: `${dest} landscape` } });
        if (response.data.success && response.data.data.imageUrl) {
          setImageUrl(response.data.data.imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch dest image", error);
      }
    };
    fetchImage();
  }, [currentTrip]);

  if (!imageUrl) return (
    <div className="ios-glass-card rounded-[32px] h-64 mt-4 animate-pulse bg-white/5 border border-white/10" />
  );

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="ios-glass-card rounded-[32px] overflow-hidden relative h-64 border border-white/10 shadow-lg group mt-6">
      <img 
        src={imageUrl} 
        alt="Destination vibe" 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />
      <div className="absolute bottom-5 left-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
          <MapPin className="w-5 h-5 text-blue-300 drop-shadow-md" />
        </div>
        <div>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">Destination</p>
          <h4 className="text-white font-bold tracking-wide drop-shadow-md">{currentTrip?.destination?.split('&')[0] || 'Destination'}</h4>
        </div>
      </div>
    </motion.div>
  );
});

const SpatialCard = React.memo(({ src, rot, onClick, gender }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const isMen = gender === 'men';

  return (
    <div className={`flex-grow basis-[200px] md:basis-[250px] h-[300px] md:h-[400px] ${rot} hover:rotate-0 transition-transform duration-500 ease-out hover:z-50 group`}>
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative cursor-pointer transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-3 rounded-[26px] p-[3px] bg-white/5 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.4)] hover:bg-white/10 hover:border-white/40 hover:shadow-[-8px_24px_40px_rgba(0,0,0,0.6),inset_2px_4px_8px_rgba(255,255,255,0.5),inset_-2px_-4px_8px_rgba(0,0,0,0.3)] backdrop-blur-3xl saturate-150 transform-gpu"
      >
        {/* Push-pin */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 shadow-[0_4px_8px_rgba(0,0,0,0.8),inset_0_-2px_4px_rgba(0,0,0,0.3)] z-30 border border-rose-700">
           <div className="w-1 h-1 bg-white/80 rounded-full absolute top-0.5 left-1 shadow-sm" />
        </div>

        {/* Gender badge */}
        <div className={`absolute top-3 right-3 z-30 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border backdrop-blur-md shadow-lg ${
          isMen
            ? 'bg-blue-500/30 border-blue-400/50 text-blue-200'
            : 'bg-pink-500/30 border-pink-400/50 text-pink-200'
        }`}>
          {isMen ? '♂ Men' : '♀ Women'}
        </div>

        <div className="w-full h-full relative rounded-[24px] overflow-hidden shadow-inner">
          <img src={src} alt={`${gender} outfit inspiration`} className="w-full h-full object-cover transform group-hover:scale-[1.12] transition-transform duration-[1500ms] ease-out" loading="lazy" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-20">
            <button onClick={onClick} className="ios-liquid-button bg-white/[0.15] hover:bg-white/[0.25] backdrop-blur-[24px] border border-white/30 border-t-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] text-white font-bold py-3 px-4 rounded-[16px] flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> Save Style Idea
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});


// Track visited trips globally so we don't repeat the animation during a session
const visitedTrips = new Set();

export default function PackingPage() {
  const { currentTrip } = useTripContext();
  const { addToast } = useToast();
  const [activeView, setActiveView] = useState('list'); // 'list' | 'moodboard'
  console.log("PackingPage rendering...");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [shoppingItems, setShoppingItems] = useState([
    { id: 1, text: 'Travel Adapter', packed: false },
    { id: 2, text: 'Sunscreen (SPF 50)', packed: false }
  ]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: `Hi! I see you're packing for ${currentTrip?.destination?.split('&')[0] || 'your destination'}. Do you need help figuring out what to buy before you leave?` }
  ]);
  const [chatInput, setChatInput] = useState("");

  const [activeAiCategory, setActiveAiCategory] = useState(null);
  const [categoryChatHistory, setCategoryChatHistory] = useState([]);
  const [categoryChatInput, setCategoryChatInput] = useState("");

  // SMS Reminder State
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [reminderPhone, setReminderPhone] = useState("+91");
  const [reminderSet, setReminderSet] = useState(false);
  const [isSettingReminder, setIsSettingReminder] = useState(false);
  const [customSchedule, setCustomSchedule] = useState("");
  const [showCustomTimePicker, setShowCustomTimePicker] = useState(false);
  const [reminderError, setReminderError] = useState("");
  
  // Mood Board State
  const [activeTab, setActiveTab] = useState('checklist');
  const [moodboardImages, setMoodboardImages] = useState([]);
  const [isFetchingMoodboard, setIsFetchingMoodboard] = useState(false);
  const [moodboardPage, setMoodboardPage] = useState(1);

  // AI & Weather State (Silent Loading)
  const [weatherData, setWeatherData] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Magic Pack State
  const [isMagicPacking, setIsMagicPacking] = useState(false);

  const handleMagicPack = () => {
    if (isMagicPacking) return;
    setIsMagicPacking(true);
    
    // Simulate AI thinking and analyzing weather/destination
    setTimeout(() => {
      setCategories(prev => {
        const newCats = [...prev];
        const condition = weatherData?.current?.condition?.toLowerCase() || "";
        
        // Contextual Suggestions
        const suggestions = [];
        if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
          suggestions.push({ catId: 1, text: 'Heavy Duty Umbrella' });
          suggestions.push({ catId: 1, text: 'Waterproof Boots' });
        } else if (condition.includes('sun') || condition.includes('clear') || (weatherData?.current?.temp > 25)) {
          suggestions.push({ catId: 3, text: 'Aloe Vera Gel' });
          suggestions.push({ catId: 1, text: 'Extra Swimwear' });
        } else if (weatherData?.current?.temp < 10) {
          suggestions.push({ catId: 1, text: 'Thermal Base Layers' });
          suggestions.push({ catId: 1, text: 'Hand Warmers' });
        } else {
          suggestions.push({ catId: 2, text: 'Portable Wi-Fi Hotspot' });
          suggestions.push({ catId: 3, text: 'Hydration Tablets' });
        }
        
        suggestions.forEach(s => {
          const catIndex = newCats.findIndex(c => c.id === s.catId);
          if (catIndex >= 0 && !newCats[catIndex].items.some(i => i.text === s.text)) {
             newCats[catIndex].items.unshift({ id: Date.now() + Math.random(), text: s.text + ' ✨', packed: false });
          }
        });
        
        return newCats;
      });
      setIsMagicPacking(false);
    }, 1500);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchAIAndWeather = async () => {
      if (!currentTrip?.destination) return;
      const destinationStr = currentTrip.destination.split('&')[0];
      
      const isFirstVisit = !visitedTrips.has(currentTrip._id);
      visitedTrips.add(currentTrip._id);
      
      setIsAiLoading(true);
      const startTime = Date.now();
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        
        // 1. Fetch Weather
        const weatherRes = await axios.get(`${API_URL}/weather/${encodeURIComponent(destinationStr)}`);
        const weather = weatherRes.data;
        if (isMounted) setWeatherData(weather);

        // 2. Fetch AI Packing List
        const packingRes = await axios.post(`${API_URL}/ai/packing`, {
          destination: destinationStr,
          weather: weather.current || {},
          duration: currentTrip.duration
        });
        
        if (isMounted && packingRes.data && packingRes.data.categories) {
          setCategories(prev => {
            // Merge AI categories with our base category structure
            return prev.map(baseCat => {
              const aiCat = packingRes.data.categories.find(c => c.name.toLowerCase() === baseCat.name.toLowerCase());
              if (aiCat && aiCat.items && aiCat.items.length > 0) {
                return {
                  ...baseCat,
                  items: aiCat.items.map((item, j) => {
                    const text = item.name || item.text;
                    return {
                      id: text,
                      text: text,
                      packed: !!item.packed
                    };
                  })
                };
              }
              return baseCat;
            });
          });
        }
      } catch (error) {
        console.error("Failed to fetch weather and AI packing list", error);
      } finally {
        const elapsed = Date.now() - startTime;
        // Only apply the 40s delay if it's the first time viewing this trip
        const remaining = isFirstVisit ? Math.max(0, 40000 - elapsed) : 0;
        
        setTimeout(() => {
          if (isMounted) setIsAiLoading(false);
        }, remaining);
      }
    };

    if (currentTrip?._id) {
      fetchAIAndWeather();
    }
    
    return () => { isMounted = false; };
  }, [currentTrip?._id]);

  // Mood Board logic — place-specific, 50/50 men/women, show whatever is found
  const fetchMoodboard = async (pageToFetch = moodboardPage) => {
    if (isFetchingMoodboard) return;
    setIsFetchingMoodboard(true);
    setMoodboardImages([]);
    try {
      // Use the FULL destination string for geographic context
      const fullDest = currentTrip?.destination?.split('&')[0].trim() || 'Tokyo';
      const cityPart   = fullDest.split(',')[0].trim();
      const regionPart = fullDest.includes(',') ? fullDest.split(',').slice(1).join(',').trim() : fullDest;

      const API_URL = '/api';
      const MAX_PAIRS = 10; // up to 10 women + 10 men = 20 images

      /**
       * Fetch images for ONE query from the backend.
       * Returns [] if query returned no relevant images.
       */
      const fetchFor = async (query) => {
        try {
          const r = await axios.get(`${API_URL}/images/moodboard`, { params: { query, page: pageToFetch } });
          // Accept any results — hasResults=true means the API found something relevant
          if (r.data?.success && r.data?.data?.hasResults) {
            return r.data.data.images || [];
          }
          return [];
        } catch { return []; }
      };

      /**
       * Run ALL queries for a gender IN PARALLEL and accumulate every
       * image found. Deduplicates across all results.
       * Shows whatever was found — even if it's just 2-4 images.
       * Only returns empty if truly 0 images found across all queries.
       */
      const fetchGenderImages = async (gender) => {
        const g = gender === 'men' ? 'men' : 'women';

        // All queries run simultaneously — geographically anchored at every level
        const queries = [
          `${g} traditional clothing ${cityPart}`,
          `${g} traditional clothing ${fullDest}`,
          `${g} traditional clothing ${regionPart}`,
          `${g} local fashion ${regionPart}`,
          `${g} casual street style ${regionPart}`,
          `${g} outdoor lifestyle ${regionPart}`,
        ];

        // Fire ALL queries in parallel for speed
        const results = await Promise.allSettled(queries.map(q => fetchFor(q)));

        // Accumulate and deduplicate ALL images found across every query
        const seen = new Set();
        const accumulated = [];
        for (const res of results) {
          if (res.status === 'fulfilled') {
            for (const url of res.value) {
              if (!seen.has(url)) {
                seen.add(url);
                accumulated.push(url);
              }
            }
          }
        }

        console.log(`[Moodboard] ${g} for "${fullDest}": ${accumulated.length} total images found`);
        return accumulated; // Return ALL found — even if just 2 or 4
      };

      // Fetch both genders simultaneously
      const [menImages, womenImages] = await Promise.all([
        fetchGenderImages('men'),
        fetchGenderImages('women'),
      ]);

      // Build interleaved [{url, gender}] array, strictly alternating ♀ ♂
      const interleaved = [];
      const seenUrls = new Set();
      let mIdx = 0, wIdx = 0, pairs = 0;

      while (pairs < MAX_PAIRS) {
        while (wIdx < womenImages.length && seenUrls.has(womenImages[wIdx])) wIdx++;
        while (mIdx < menImages.length && (seenUrls.has(menImages[mIdx]) || menImages[mIdx] === womenImages[wIdx])) mIdx++;

        const wImg = womenImages[wIdx];
        const mImg = menImages[mIdx];

        if (wImg) { interleaved.push({ url: wImg, gender: 'women' }); seenUrls.add(wImg); wIdx++; }
        if (mImg) { interleaved.push({ url: mImg, gender: 'men' }); seenUrls.add(mImg); mIdx++; }

        if (!wImg && !mImg) break; // Both pools exhausted — show what we have
        pairs++;
      }

      // Display whatever was found — 2, 6, 10, or 20 images
      setMoodboardImages(interleaved);
    } catch (error) {
      console.error('Moodboard fetch error:', error);
    } finally {
      setIsFetchingMoodboard(false);
    }
  };




  const dateOptions = generateDateOptions(currentTrip?.startDate);
  const [pickerDate, setPickerDate] = useState(dateOptions[0]?.value || new Date().toISOString().split('T')[0]);
  
  const [pickerHour, setPickerHour] = useState("12");
  const [pickerMinute, setPickerMinute] = useState("00");
  const [pickerAmPm, setPickerAmPm] = useState("PM");
  const [beforeYouLeaveItems, setBeforeYouLeaveItems] = useState([
    { id: 1, text: 'Lock doors & windows', checked: false },
    { id: 2, text: 'Unplug appliances', checked: false },
    { id: 3, text: 'Empty the trash', checked: false },
    { id: 4, text: 'Turn off AC/Heater', checked: false },
    { id: 5, text: 'Turn off gas', checked: false }
  ]);

  useEffect(() => {
    let timeoutId;
    if (typeof reminderSet === 'string') {
      const scheduledTime = new Date(reminderSet).getTime();
      const now = Date.now();
      const delay = scheduledTime - now;
      
      if (delay > 0) {
        // Only set timeout if the time is strictly in the future.
        // We cap the delay at a 24-hour max to avoid 32-bit signed integer overflow in setTimeout
        // for dates set very far in the future (though standard timeouts support up to ~24.8 days)
        const safeDelay = Math.min(delay, 2147483647);
        timeoutId = setTimeout(() => {
          setReminderSet(true);
        }, safeDelay);
      } else {
        // If it's already past, just set it to true immediately
        setReminderSet(true);
      }
    } else if (reminderSet === true) {
      // Once it reaches the 'true' (Sent/Acknowledged) state, reset after 10 seconds
      timeoutId = setTimeout(() => {
        setReminderSet(false);
        setShowReminderInput(false);
        setCustomSchedule("");
      }, 10000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reminderSet]);

  const handleSetReminder = async () => {
    if (!reminderPhone.trim()) return;
    if (!currentTrip?.startDate) {
      setReminderError("No departure date set for this trip!");
      return;
    }
    
    setReminderError("");
    setIsSettingReminder(true);
    try {
      let finalSchedule = undefined;
      if (customSchedule) {
         finalSchedule = new Date(customSchedule).toISOString();
      }

      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await axios.post(`${API_URL}/sms/remind`, { 
        phoneNumber: reminderPhone,
        departureTime: currentTrip.startDate,
        customScheduledTime: finalSchedule
      });
      if (response.data.success) {
        setReminderSet(response.data.scheduledTime || true);
      } else {
        setReminderError(response.data.message || "Failed to set SMS reminder.");
      }
    } catch (error) {
      console.error("Failed to set reminder:", error);
      setReminderError(error.response?.data?.message || "Failed to set SMS reminder. Check backend logs.");
    } finally {
      setIsSettingReminder(false);
    }
  };

  const handleCancelReminder = async () => {
    if (!reminderPhone.trim()) return;
    
    setIsSettingReminder(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      await axios.post(`${API_URL}/sms/cancel`, { phoneNumber: reminderPhone });
      setReminderSet(false);
      setShowReminderInput(false);
      setCustomSchedule("");
      setReminderError("");
    } catch (error) {
      console.error("Failed to cancel reminder:", error);
      setReminderError("Failed to cancel SMS reminder.");
    } finally {
      setIsSettingReminder(false);
    }
  };

  const toggleShoppingItem = (itemId) => {
    setShoppingItems(shoppingItems.map(item => 
      item.id === itemId ? { ...item, packed: !item.packed } : item
    ));
  };

  const handleAddShoppingItem = (text) => {
    setShoppingItems([...shoppingItems, { id: Date.now(), text, packed: false }]);
  };

  const toggleBeforeYouLeaveItem = (itemId) => {
    setBeforeYouLeaveItems(beforeYouLeaveItems.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const newHistory = [...chatHistory, { role: 'user', content: chatInput }];
    setChatHistory(newHistory);
    setChatInput("");
    
    // Simulate AI response with a product suggestion
    setTimeout(() => {
      setChatHistory([...newHistory, { 
        role: 'assistant', 
        content: `Great point. Depending on your devices, you might need a Universal Adapter for ${currentTrip?.destination?.split('&')[0] || 'your destination'}.`,
        suggestion: "Universal Type-A Adapter"
      }]);
    }, 800);
  };

  const openCategoryAi = (catId, catName) => {
    setActiveAiCategory(catId);
    setCategoryChatHistory([
      { role: 'assistant', content: `Need help packing for ${catName}? Ask me for suggestions based on the weather and activities in ${currentTrip?.destination?.split('&')[0] || 'your destination'}.` }
    ]);
    setCategoryChatInput("");
  };

  const handleCategorySendMessage = async (catId) => {
    if (!categoryChatInput.trim()) return;
    
    const newHistory = [...categoryChatHistory, { role: 'user', content: categoryChatInput }];
    setCategoryChatHistory(newHistory);
    const userMessage = categoryChatInput;
    setCategoryChatInput("");
    
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const cat = categories.find(c => c.id === catId);
    const context = {
      destination: currentTrip?.destination?.split('&')[0] || "Unknown",
      category: cat?.name || "Packing",
      weather: weatherData?.current || {}
    };

    try {
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: userMessage,
        context: context
      });
      
      const aiReply = response.data.reply;
      
      // Simple regex to pull out a suggested item if the AI uses quotes or bolding
      // Alternatively, we just provide a default suggestion if applicable
      let suggestion = null;
      if (aiReply.toLowerCase().includes("adapter") || aiReply.toLowerCase().includes("plug")) suggestion = "Universal Adapter";
      else if (aiReply.toLowerCase().includes("power bank")) suggestion = "10000mAh Power Bank";
      else if (aiReply.toLowerCase().includes("jacket") || aiReply.toLowerCase().includes("coat")) suggestion = "Warm Jacket";
      else if (aiReply.toLowerCase().includes("rain")) suggestion = "Light Raincoat";

      setCategoryChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: aiReply,
        suggestion: suggestion
      }]);
    } catch (error) {
      console.error("Failed to get AI chat response", error);
      setCategoryChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my AI core right now. Please try again in a moment.",
      }]);
    }
  };

  const { togglePackedItem, packedItems } = useTripContext();

  const handleAddCategoryItem = (catId, text) => {
    setCategories(categories.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: [...cat.items, { id: text, text, packed: false }]
      };
    }));
  };

  const toggleItem = (categoryId, itemId) => {
    togglePackedItem(itemId);
  };

  const deleteItem = (catId, itemId) => {
    setCategories(categories.map(cat => 
      cat.id === catId ? { ...cat, items: cat.items.filter(i => i.id !== itemId) } : cat
    ));
  };

  const handleAiSwap = async (categoryId, item) => {
    try {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, items: cat.items.map(i => i.id === item.id ? { ...i, text: 'Finding alternative...' } : i) }
          : cat
      ));

      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const res = await axios.post(`${API_URL}/ai/packing/alternative`, {
        destination: currentTrip?.destination,
        item: item.text
      });

      const alternative = res.data.alternative || "Generic Item";

      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, items: cat.items.map(i => i.id === item.id ? { ...i, id: alternative, text: alternative } : i) }
          : cat
      ));
    } catch (err) {
      console.error(err);
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, items: cat.items.map(i => i.id === item.id ? { ...i, text: item.text } : i) }
          : cat
      ));
    }
  };

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const totalPacked = categories.reduce((acc, cat) => acc + cat.items.filter(i => packedItems.has(i.id)).length, 0);
  const progressPercent = totalItems === 0 ? 0 : Math.round((totalPacked / totalItems) * 100);

  // SVG circular progress calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const renderCategoryCard = (cat, index) => {
    const isComplete = cat.items.every(i => packedItems.has(i.id)) && cat.items.length > 0;
    const colors = [
      'from-pink-500 to-rose-400',
      'from-blue-500 to-indigo-500',
      'from-emerald-500 to-teal-400',
    ];
    const gradient = colors[index % colors.length];

    return (
      <motion.div layout key={cat.id} variants={fadeUp} className={`ios-glass-card overflow-hidden rounded-[32px] relative flex flex-col ${cat.id === 3 ? 'h-full' : ''}`}>
        {/* Glowing Accent Line */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-50`} />





        <div className="p-5 sm:p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className={`ios-3d-icon w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${gradient} shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.2)]`}>
              {index === 0 ? <Briefcase className="w-5 h-5 text-white drop-shadow-md" /> : <Package className="w-5 h-5 text-white drop-shadow-md" />}
            </div>
            <div className="ios-3d-element">
              <h3 className="text-xl font-bold text-white drop-shadow-sm">{cat.name}</h3>
              <span className="text-xs font-semibold text-white/50 tracking-wide">
                {cat.items.filter(i => packedItems.has(i.id)).length} OF {cat.items.length} PACKED
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid flex-1 relative">
              {/* AI Scanner Overlay - Compact PWA Widget Theme */}
              {isAiLoading && cat.id === 1 && (
                <div className="absolute inset-0 z-50 rounded-b-[32px] overflow-hidden bg-slate-900/90 backdrop-blur-xl border-t border-white/10 flex flex-col items-center justify-center">
                  
                  {/* Minimalist Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />

                  {/* The Animated Checklist Container - Compact */}
                  <div className="relative w-[220px] h-[150px] bg-[#020617]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_16px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-10 mb-4 scale-100">
                    
                    {/* Header */}
                    <div className="w-full h-8 bg-white/5 border-b border-white/10 flex items-center justify-center px-4 z-30">
                       <span className="text-[9px] font-bold tracking-[0.25em] text-white/50">TRIP MANIFEST</span>
                    </div>

                    {/* Scrolling List Area */}
                    <div className="flex-1 relative w-full overflow-hidden bg-transparent">
                      
                      {/* Selection Highlight Box (Static in center) */}
                      <div className="absolute left-2.5 right-2.5 h-[42px] bg-emerald-500/10 border border-emerald-500/30 rounded-xl pointer-events-none z-20 shadow-[inset_0_0_12px_rgba(52,211,153,0.15)]" style={{ top: '34px' }} />

                      {/* Top and Bottom Fade Gradients */}
                      <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#020617] to-transparent z-30 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#020617] to-transparent z-30 pointer-events-none" />

                      {/* The Scrolling Content */}
                      <motion.div 
                        className="w-[calc(100%-20px)] flex flex-col gap-2 z-10 absolute left-2.5"
                        style={{ top: '34px' }}
                        animate={{ y: [0, 0, -50, -50, -100, -100, -150, -150, -200, -200, -250, -250, -300, -300] }}
                        transition={{ 
                          duration: 4.5, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          times: [0, 0.11, 0.16, 0.27, 0.32, 0.43, 0.48, 0.59, 0.64, 0.75, 0.80, 0.91, 0.96, 1] 
                        }}
                      >
                         {[
                          { id: 1, label: "SHIRTS & TOPS", icon: Shirt, color: "text-blue-400 bg-blue-500/20 border-blue-500/30" },
                          { id: 2, label: "ELECTRONICS", icon: Headphones, color: "text-purple-400 bg-purple-500/20 border-purple-500/30" },
                          { id: 3, label: "FOOTWEAR", icon: Footprints, color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30" },
                          { id: 4, label: "PHOTOGRAPHY", icon: Camera, color: "text-rose-400 bg-rose-500/20 border-rose-500/30" },
                          { id: 5, label: "RAIN GEAR", icon: Umbrella, color: "text-amber-400 bg-amber-500/20 border-amber-500/30" },
                          { id: 6, label: "ACCESSORIES", icon: Glasses, color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30" },
                          { id: 7, label: "SHIRTS & TOPS", icon: Shirt, color: "text-blue-400 bg-blue-500/20 border-blue-500/30" }, // Duplicate for seamless loop
                         ].map((item, index) => (
                           <div key={`list-item-${index}`} className="w-full h-[42px] bg-white/5 rounded-xl flex items-center px-2.5 shadow-sm border border-white/5 flex-shrink-0">
                             {/* Item Icon */}
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color}`}>
                               <item.icon className="w-4 h-4 drop-shadow-sm" strokeWidth={2.5} />
                             </div>
                             
                             {/* Item Text */}
                             <div className="flex flex-col ml-2.5 justify-center">
                                <span className="text-[10px] font-bold text-white tracking-wider drop-shadow-sm truncate max-w-[90px]">{item.label}</span>
                                <span className="text-[8px] text-white/50 mt-0 font-medium">Auto-sorting...</span>
                             </div>

                             {/* The Furious Checkmark! */}
                             <motion.div
                               className="ml-auto text-emerald-400"
                               animate={index === 0 ? { scale: 1, opacity: 1 } : { scale: [0, 0, 1.4, 1], opacity: [0, 0, 1, 1] }}
                               transition={
                                 index === 0 
                                 ? { duration: 0 }
                                 : {
                                     duration: 4.5,
                                     repeat: Infinity,
                                     ease: ["linear", "linear", "backOut", "linear"],
                                     times: [
                                       0,
                                       index * 0.16,
                                       Math.min(0.99, index * 0.16 + 0.04),
                                       1
                                     ]
                                   }
                               }
                             >
                                <CheckCircle2 className="w-5 h-5 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" strokeWidth={3} />
                             </motion.div>
                           </div>
                         ))}
                      </motion.div>
                    </div>
                  </div>

                  {/* Gamified Typography */}
                  <div className="absolute bottom-5 flex flex-col items-center z-30">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                      AUTO-PACKING
                    </span>
                    
                    {/* Progress Bar */}
                    <div className="mt-1.5 w-20 h-1 bg-white/10 rounded-full overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                       <motion.div 
                         animate={{ x: ['-100%', '200%'] }} 
                         transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                         className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#34d399]" 
                       />
                    </div>
                  </div>
                </div>
              )}
          <AnimatePresence>
            {activeAiCategory === cat.id ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="col-start-1 row-start-1 flex flex-col bg-black/20 p-4 min-h-[450px]"
              >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-bold text-white">Ask AI for {cat.name}</span>
                </div>
                <button onClick={() => setActiveAiCategory(null)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4 max-h-[250px] custom-scrollbar pr-2">
                {categoryChatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                    <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)]' : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5'}`}>
                      <p className="text-[13px] leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.suggestion && (
                      <button onClick={() => { handleAddCategoryItem(cat.id, msg.suggestion); setActiveAiCategory(null); }} className="ios-liquid-button mt-2 self-start flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors group">
                        <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                        Add to {cat.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="relative flex items-center mt-auto">
                <input type="text" value={categoryChatInput} onChange={(e) => setCategoryChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCategorySendMessage(cat.id)} placeholder="Ask for suggestions..." className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-4 pr-10 text-[13px] text-white placeholder-white/40 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all" />
                <button onClick={() => handleCategorySendMessage(cat.id)} disabled={!categoryChatInput.trim()} className="ios-liquid-button absolute right-1 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-400 transition-colors disabled:opacity-50">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className={`col-start-1 row-start-1 p-3 sm:p-4 overflow-y-auto max-h-[300px] md:max-h-[400px] custom-scrollbar ${cat.id === 1 || cat.id === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1' : 'flex flex-col gap-1'}`}
            >
              {cat.items.map(item => {
                const isPacked = packedItems.has(item.id);
                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center gap-2.5 py-1.5 px-3 rounded-xl cursor-pointer transition-all duration-300 group relative ios-3d-element print:break-inside-avoid print:bg-white print:border-b print:border-gray-200 print:text-black print:p-2 ${isPacked ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                  >
                    <GripVertical className="w-4 h-4 text-white/20 group-hover:text-white/50 cursor-grab active:cursor-grabbing shrink-0 print:hidden" />
                    
                    <button 
                      onClick={() => toggleItem(cat.id, item.id)}
                      className={`shrink-0 relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isPacked ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-white/60'
                      }`}
                    >
                      {isPacked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                    </button>
                    
                    <span className={`text-[14px] font-medium transition-all duration-500 flex-1 ${isPacked ? 'text-white/40 line-through print:text-gray-500' : 'text-white/90 print:text-black'}`}>
                      {item.text}
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isPacked && (
                        <button 
                          onClick={() => handleAiSwap(cat.id, item)}
                          title="AI Suggest Alternative"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 text-white/40 hover:text-white transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteItem(cat.id, item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              <div className="col-span-full p-3 mt-1 flex flex-wrap gap-3 justify-center sm:justify-start">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToast('info', '✨ Feature coming soon!'); }} className="ios-liquid-button px-4 rounded-xl flex items-center gap-2 text-[14px] font-bold text-white/60 hover:text-white transition-colors py-2 group">
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} /> 
                  Add Item
                </button>
                {(cat.id === 1 || cat.id === 2) && (
                  <button onClick={() => openCategoryAi(cat.id, cat.name)} className="ios-liquid-button px-4 rounded-xl flex items-center gap-2 text-[14px] font-bold text-blue-300 hover:text-blue-100 transition-colors py-2 group">
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> 
                    Ask AI
                  </button>
                )}
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <PageTransition className="col-span-12">
      <div className="w-full pt-8 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 z-20 relative">
          <div className="flex flex-col items-start">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md mb-2"
            >
              Packing List
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg font-medium text-white/60 tracking-wide"
            >
              {currentTrip?.destination?.split('&')[0] || 'Your Destination'} Explorer
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button 
              onClick={handleMagicPack}
              disabled={isMagicPacking || isAiLoading}
              className="h-12 px-6 rounded-[20px] ios-liquid-button bg-gradient-to-tr from-blue-500 to-indigo-500 border border-white/40 hover:from-blue-400 hover:to-indigo-400 flex items-center gap-2 text-white font-bold tracking-wide transition-all duration-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_8px_16px_rgba(59,130,246,0.5)] hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_12px_24px_rgba(59,130,246,0.6)] hover:-translate-y-[2px] active:translate-y-0 group disabled:opacity-50 disabled:pointer-events-none"
            >
              <Wand2 className={`w-5 h-5 drop-shadow-md transition-transform duration-300 ${isMagicPacking ? 'animate-bounce text-yellow-300' : 'group-hover:rotate-12 group-hover:scale-110'}`} strokeWidth={2.5} />
              {isMagicPacking ? 'Analyzing...' : 'Magic Pack'}
            </button>
          </motion.div>
        </div>

        {/* Horizontal Widget Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 z-20 relative">
          
          {/* Trip Countdown */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="ios-glass-card p-5 flex items-center gap-5 rounded-3xl">
            <div className="ios-3d-icon w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.2)]">
              <Clock className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/50 tracking-wide uppercase mb-0.5">Time Until Trip</p>
              <h3 className="ios-3d-element text-2xl font-bold text-white drop-shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>5 Days</h3>
            </div>
          </motion.div>

          {/* Destination Weather */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="ios-glass-card p-5 flex justify-between items-center rounded-3xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
            <div>
              <p className="text-sm font-semibold text-white/50 tracking-wide uppercase mb-0.5 flex items-center gap-2">
                {weatherData?.location || currentTrip?.destination?.split('&')[0] || 'Unknown'}
                {isAiLoading && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              </p>
              <div className="flex items-center gap-2 ios-3d-element">
                <Thermometer className="w-5 h-5 text-blue-400" />
                <h3 className="text-2xl font-bold text-white drop-shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {weatherData?.current?.temp ? `${Math.round(weatherData.current.temp)}°C` : '--°C'}
                </h3>
              </div>
            </div>
            <div className="flex gap-2 ios-3d-icon">
              {weatherData?.forecast?.slice(0, 2).map((day, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-2xl bg-white/5 border border-white/10">
                  {day.condition.toLowerCase().includes('rain') ? (
                    <CloudRain className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  )}
                  <span className="text-[10px] font-bold text-white/70">
                    {day.day}
                  </span>
                </div>
              ))}
              {!weatherData && !isAiLoading && (
                <>
                  <div className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-2xl bg-white/5 border border-white/10">
                    <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                    <span className="text-[10px] font-bold text-white/70">Fri</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20">
                    <CloudRain className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                    <span className="text-[10px] font-bold text-white/70">Sat</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Luggage Weight Limit */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="ios-glass-card p-5 flex flex-col justify-center rounded-3xl">
            <div className="flex justify-between items-end mb-3 ios-3d-element">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                <span className="text-sm font-semibold text-white/50 tracking-wide uppercase">Luggage Est.</span>
              </div>
              <h3 className="text-xl font-bold text-white drop-shadow-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>18<span className="text-sm text-white/50">/23kg</span></h3>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden shadow-inner border border-white/5">
              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full w-[78%] relative">
                <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)', backgroundSize: '0.8rem 0.8rem' }} />
              </div>
            </div>
          </motion.div>

        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-8 z-20 relative">
          <div className="ios-glass-card p-1.5 flex gap-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
            <button 
              onClick={() => setActiveTab('checklist')}
              className={`px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${activeTab === 'checklist' ? 'bg-white/20 border border-white/30 text-white shadow-[0_4px_16px_rgba(255,255,255,0.1)] scale-[1.02]' : 'text-white/50 hover:text-white/90 hover:bg-white/5 border border-transparent'}`}
            >
              Packing List
            </button>
            <button 
              onClick={() => { setActiveTab('moodboard'); fetchMoodboard(); }}
              className={`px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 ${activeTab === 'moodboard' ? 'bg-gradient-to-r from-blue-500/30 to-indigo-500/30 border border-blue-400/40 text-white shadow-[0_4px_16px_rgba(59,130,246,0.2)] scale-[1.02]' : 'text-white/50 hover:text-white/90 hover:bg-white/5 border border-transparent'}`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'moodboard' ? 'text-blue-300' : 'text-white/50'}`} /> Outfit Mood Board
            </button>
          </div>
        </div>

        {activeTab === 'checklist' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Progress & Widgets */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Main Progress Widget */}
            <div className="ios-glass-card p-6 rounded-[32px]">
              <div className="flex flex-col items-center justify-center py-4 relative">
                <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">
                  <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <motion.circle cx="50" cy="50" r={radius} stroke="url(#progressGradient)" strokeWidth="8" fill="none" strokeLinecap="round" initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut" }} style={{ strokeDasharray: circumference }} />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center ios-3d-element">
                  <span className="text-3xl font-extrabold text-white drop-shadow-md" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {progressPercent}%
                  </span>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Ready for takeoff</h2>
                <p className="text-sm font-medium text-white/50">{totalPacked} of {totalItems} items packed</p>
              </div>

              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToast('info', '✨ Feature coming soon!'); }} className="ios-liquid-button w-full h-12 rounded-[20px] text-white font-bold text-[14px] tracking-wide flex items-center justify-center gap-2 group">
                <Plus className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                Add Category
              </button>
            </div>

            {/* Essential Documents Widget */}
            <div className="ios-glass-card p-6 rounded-[32px] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 opacity-50" />
              <div className="flex items-center gap-3 mb-4 ios-3d-element">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]" />
                </div>
                <h3 className="text-lg font-bold text-white">Essentials</h3>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-2xl border border-red-500/10 cursor-pointer hover:bg-red-500/10 transition-colors">
                  <Circle className="w-5 h-5 text-red-400/50" />
                  <span className="text-[15px] font-medium text-red-100">Passports</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-500/5 rounded-2xl border border-red-500/10 cursor-pointer hover:bg-red-500/10 transition-colors">
                  <Circle className="w-5 h-5 text-red-400/50" />
                  <span className="text-[15px] font-medium text-red-100">Flight Tickets</span>
                </div>
              </div>
            </div>

            {/* AI Insights Widget */}
            <div className="ios-glass-card p-6 bg-gradient-to-br from-indigo-900/40 to-blue-900/40 rounded-[32px]">
              <div className="flex gap-4 ios-3d-element">
                <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
                  <Sparkles className="w-5 h-5 text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.8)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">AI Packing Insight</h3>
                  <p className="text-sm font-medium text-blue-100/70 leading-relaxed pr-4">
                    Based on the forecast in {currentTrip?.destination?.split('&')[0] || 'your destination'}, don't forget to pack a compact umbrella and comfortable walking shoes!
                  </p>
                </div>
              </div>
            </div>

            {/* Shopping List Widget (Inline AI Chat) */}
            <div className="flex-1 flex flex-col ios-glass-card rounded-[32px] overflow-hidden relative group/card">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-yellow-400 opacity-50 z-10" />
              
              <AnimatePresence>
                {!isAiModalOpen ? (
                  <motion.div 
                    key="list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 flex flex-col p-6 w-full h-full"
                  >
                    <div className="flex items-center gap-3 mb-4 ios-3d-element">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                      </div>
                      <h3 className="text-lg font-bold text-white">To Buy</h3>
                    </div>
                    
                    <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      {shoppingItems.map(item => (
                        <div key={item.id} onClick={() => toggleShoppingItem(item.id)} className="flex items-center gap-3 p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 cursor-pointer hover:bg-amber-500/10 transition-colors group shrink-0">
                          {item.packed ? (
                            <CheckCircle2 className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-amber-400/50 group-hover:text-amber-400/80 transition-colors shrink-0" />
                          )}
                          <span className={`text-[15px] font-medium transition-colors ${item.packed ? 'text-amber-100/50 line-through' : 'text-amber-100'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-6 shrink-0">
                      <button onClick={() => setIsAiModalOpen(true)} className="ios-liquid-button w-full h-12 rounded-[20px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-100 font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group/btn relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        <Sparkles className="w-5 h-5 text-amber-300 group-hover/btn:scale-110 transition-transform" />
                        Ask AI what to buy...
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 flex flex-col w-full h-full bg-[rgba(20,20,30,0.5)] z-20"
                  >
                    <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/[0.02] shrink-0">
                      <button onClick={() => setIsAiModalOpen(false)} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]">
                        <Bot className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Shopping Assistant</h3>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                          <div className={`p-3 rounded-2xl ${
                            msg.role === 'user' 
                              ? 'bg-amber-500 text-white rounded-br-sm shadow-[0_4px_12px_rgba(245,158,11,0.3)]' 
                              : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5'
                          }`}>
                            <p className="text-[14px] leading-relaxed">{msg.content}</p>
                          </div>
                          {msg.suggestion && (
                            <button 
                              onClick={() => { handleAddShoppingItem(msg.suggestion); setIsAiModalOpen(false); }}
                              className="ios-liquid-button mt-2 self-start flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-colors group"
                            >
                              <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                              Add to List
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t border-white/10 bg-black/20 shrink-0">
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask AI..."
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-4 pr-10 text-[14px] text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                        />
                        <button 
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim()}
                          className="ios-liquid-button absolute right-1 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:hover:bg-amber-500"
                        >
                          <Send className="w-4 h-4 ml-0.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Column: Checklists (Clothing & Electronics) */}
          <div className="lg:col-span-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-6">
              {categories.filter(cat => cat.id !== 3).map((cat, index) => renderCategoryCard(cat, index))}
            </motion.div>
          </div>

          {/* Bottom Left Row: WOW Widget */}
          <div className="lg:col-span-4 lg:col-start-1 h-full">
             <div className="ios-glass-card p-6 rounded-[32px] overflow-hidden relative group h-full flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20" />
                
                <div className="relative z-20 flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-lg font-bold text-white tracking-wide">Before You Leave</h3>
                    </div>
                    <p className="text-[12px] font-medium text-emerald-100/60">Home security & tasks</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  </div>
                </div>

                <div className="relative z-20 flex flex-col gap-2 flex-1 overflow-hidden pr-2">
                  <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-2 relative pr-1">
                    <AnimatePresence>
                      {showCustomTimePicker && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-emerald-500/30 p-4 flex flex-col shadow-2xl"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-bold text-white">Select Time</h4>
                            <button onClick={() => setShowCustomTimePicker(false)}>
                              <X className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-center gap-1 flex-1">
                            <div className="flex flex-col gap-1 w-24 h-28 overflow-y-auto custom-scrollbar snap-y snap-mandatory bg-black/40 rounded-xl border border-white/5 p-1">
                              {dateOptions.map(opt => (
                                <div 
                                  key={opt.value} 
                                  onClick={() => setPickerDate(opt.value)}
                                  className={`flex-shrink-0 h-8 flex items-center justify-center text-xs rounded-lg cursor-pointer snap-center transition-colors ${pickerDate === opt.value ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-white/50 hover:text-white/80'}`}
                                >
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-col gap-1 w-12 h-28 overflow-y-auto custom-scrollbar snap-y snap-mandatory bg-black/40 rounded-xl border border-white/5 p-1">
                              {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => (
                                <div 
                                  key={h} 
                                  onClick={() => setPickerHour(h)}
                                  className={`flex-shrink-0 h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer snap-center transition-colors ${pickerHour === h ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-white/50 hover:text-white/80'}`}
                                >
                                  {h}
                                </div>
                              ))}
                            </div>
                            <span className="text-white/50 font-bold">:</span>
                            <div className="flex flex-col gap-1 w-12 h-28 overflow-y-auto custom-scrollbar snap-y snap-mandatory bg-black/40 rounded-xl border border-white/5 p-1">
                              {Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0')).map(m => (
                                <div 
                                  key={m} 
                                  onClick={() => setPickerMinute(m)}
                                  className={`flex-shrink-0 h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer snap-center transition-colors ${pickerMinute === m ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-white/50 hover:text-white/80'}`}
                                >
                                  {m}
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-col gap-1 w-12 h-28 overflow-y-auto custom-scrollbar snap-y snap-mandatory bg-black/40 rounded-xl border border-white/5 p-1">
                              {['AM','PM'].map(a => (
                                <div 
                                  key={a} 
                                  onClick={() => setPickerAmPm(a)}
                                  className={`flex-shrink-0 h-[42px] flex items-center justify-center text-sm rounded-lg cursor-pointer snap-center transition-colors ${pickerAmPm === a ? 'bg-emerald-500/30 text-emerald-300 font-bold' : 'text-white/50 hover:text-white/80'}`}
                                >
                                  {a}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => {
                              let h = parseInt(pickerHour, 10);
                              if (pickerAmPm === 'PM' && h !== 12) h += 12;
                              if (pickerAmPm === 'AM' && h === 12) h = 0;
                              const hStr = h.toString().padStart(2, '0');
                              setCustomSchedule(`${pickerDate}T${hStr}:${pickerMinute}`);
                              setShowCustomTimePicker(false);
                            }}
                            className="mt-3 w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-wider transition-colors"
                          >
                            Confirm
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {beforeYouLeaveItems.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleBeforeYouLeaveItem(item.id)}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      {item.checked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/30 shrink-0" />
                      )}
                      <span className={`text-[14px] font-medium transition-colors ${item.checked ? 'text-white/50 line-through' : 'text-white/90'}`}>
                        {item.text}
                      </span>
                    </div>
                    ))}
                  </div>
                </div>

                {/* AI Reminder Section */}
                <div className="mt-4 pt-4 border-t border-emerald-500/20 relative z-20 shrink-0">
                  {!showReminderInput && !reminderSet ? (
                    <button onClick={() => setShowReminderInput(true)} className="ios-liquid-button w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                      <Bell className="w-4 h-4" />
                      Set AI SMS Reminder
                    </button>
                  ) : showReminderInput && !reminderSet ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center h-10 bg-black/20 border border-emerald-500/20 rounded-xl px-3 transition-colors focus-within:border-emerald-400/50">
                          <Smartphone className="w-4 h-4 text-emerald-400/50 shrink-0" />
                          <input 
                            type="tel" 
                            placeholder="+91 (000) 000-0000" 
                            className="w-full h-full bg-transparent pl-2 text-sm text-white placeholder-white/30 focus:outline-none" 
                            value={reminderPhone} 
                            onChange={(e) => setReminderPhone(e.target.value)} 
                            disabled={isSettingReminder}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          onClick={() => !isSettingReminder && setShowCustomTimePicker(true)}
                          className="flex-1 flex items-center h-10 bg-black/20 border border-emerald-500/20 rounded-xl px-3 transition-colors hover:border-emerald-400/50 cursor-pointer"
                        >
                          <Clock className="w-4 h-4 text-emerald-400/50 shrink-0" />
                          <span className={`pl-2 text-sm ${customSchedule ? 'text-white' : 'text-white/30'}`}>
                            {customSchedule ? (() => {
                              const d = new Date(customSchedule);
                              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                              const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                              return `${dateStr}, ${timeStr}`;
                            })() : "Select Date & Time"}
                          </span>
                        </div>
                        <button onClick={handleSetReminder} disabled={isSettingReminder || !reminderPhone.trim()} className="ios-liquid-button px-4 h-10 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50">
                          {isSettingReminder ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-medium text-emerald-200 truncate">
                          {typeof reminderSet === 'string' 
                            ? `Scheduled for ${new Date(reminderSet).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                            : 'Message Sent Successfully!'}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setReminderSet(false); setShowReminderInput(true); setReminderError(""); }} className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors">
                          Edit
                        </button>
                        <button onClick={handleCancelReminder} disabled={isSettingReminder} className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider transition-colors disabled:opacity-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {reminderError && (
                    <div className="mt-2 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{reminderError}</span>
                    </div>
                  )}
                </div>
              </div>
          </div>

          {/* Bottom Right Row: Toiletries */}
          <div className="lg:col-span-8 lg:col-start-5 h-full">
             <motion.div variants={staggerContainer} initial="hidden" animate="show" className="h-full">
               {categories.filter(cat => cat.id === 3).map((cat) => renderCategoryCard(cat, 2))}
             </motion.div>
          </div>
        </div>
        ) : (
          <div className="flex flex-col gap-6 pb-20 px-2 md:px-4">
            
            {/* Header and Refresh Button */}
            <div className="flex justify-between items-center w-full px-2 mt-4 mb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center gap-2 drop-shadow-md">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> {currentTrip?.destination?.split('&')[0]} Street Style
                </h2>
                {!isFetchingMoodboard && moodboardImages.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 border border-white/20 text-white/60 tracking-wider">
                    {moodboardImages.length} styles
                  </span>
                )}
              </div>

              <button 
                onClick={() => {
                  const nextPage = moodboardPage + 1;
                  setMoodboardPage(nextPage);
                  fetchMoodboard(nextPage);
                }}
                disabled={isFetchingMoodboard}
                className="relative z-0 group px-6 py-2.5 rounded-full bg-black/20 backdrop-blur-2xl border border-white/10 transition-all duration-500 hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden cursor-pointer"
              >
                {/* Outer Holographic Glow */}
                <div className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 opacity-40 group-hover:opacity-100 blur-md transition-opacity duration-700 -z-10" />
                
                {/* Glass Surface & Top Reflection */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent border-t border-white/60 -z-10" />
                
                {/* Shimmer Light Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out -z-10" />
                
                <div className="relative flex items-center gap-2 text-white font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <Shuffle className={`w-4 h-4 ${isFetchingMoodboard ? 'animate-[spin_0.5s_linear_infinite]' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                  <span className="hidden md:inline">Shuffle Styles</span>
                  <span className="md:hidden">Shuffle</span>
                </div>
              </button>
            </div>

            <div className="flex flex-wrap justify-start gap-6 md:gap-8">
              {isFetchingMoodboard ? (
              [...Array(20)].map((_, i) => (
                <div key={i} className="flex-grow basis-[250px] h-[350px] ios-glass-card bg-white/5 animate-pulse rounded-[24px] border border-white/10" />
              ))
            ) : moodboardImages.length > 0 ? (
              moodboardImages.map((item, i) => {
                const rotations = ['rotate-[-2deg]', 'rotate-[2deg]', 'rotate-[-1deg]', 'rotate-[1deg]', 'rotate-[-3deg]', 'rotate-[3deg]'];
                const rot = rotations[i % rotations.length];
                // Support both legacy string format and new {url, gender} object format
                const src = typeof item === 'string' ? item : item.url;
                const gender = typeof item === 'object' ? item.gender : (i % 2 === 0 ? 'women' : 'men');
                return (
                  <SpatialCard
                    key={i}
                    src={src}
                    rot={rot}
                    gender={gender}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategories(prev => {
                        const newCats = [...prev];
                        newCats[0].items.unshift({ id: Date.now(), text: 'New Item Suggestion', packed: false });
                        return newCats;
                      });
                    }}
                  />
                );
              })
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center py-24 w-full ios-glass-card rounded-[32px] gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                  <Shirt className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-white/70 text-lg font-semibold tracking-wide text-center">
                  No local outfit images found for this destination
                </p>
                <p className="text-white/40 text-sm text-center max-w-sm leading-relaxed">
                  Stock photo libraries may not have enough local style photos for <span className="text-white/60 font-medium">{currentTrip?.destination?.split('&')[0]}</span>. This is intentional — we only show images that truly match your destination.
                </p>
                <button
                  onClick={() => { setMoodboardPage(1); fetchMoodboard(1); }}
                  className="mt-2 px-6 py-2.5 rounded-full text-sm font-bold bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </PageTransition>
  );
}

