
import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Utensils, 
  BookOpen, 
  MessageCircle, 
  User, 
  ChevronLeft, 
  Bell, 
  Plus, 
  CheckCircle2, 
  X,
  Search,
  ArrowRight,
  ShieldAlert,
  Flame,
  Wind,
  Droplets,
  BarChart2
} from 'lucide-react';
import { ViewState, UserProfile, Dosha, Meal } from './types';
import { checkFoodCompatibility, getAIPantryMeals } from './geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Mock Data ---
const MOCK_MEALS: Meal[] = [
  { id: '1', name: 'Quinoa & Lentil Bowl', description: 'A light, protein-rich meal perfect for Vata types.', dosha: 'Vata', calories: 250, protein: '15g', fat: '5g', carbs: '35g', time: '30 min', image: 'https://picsum.photos/seed/quinoa/400/300' },
  { id: '2', name: 'Coconut Chickpea Curry', description: 'Cooling coconut milk balances the Pitta fire.', dosha: 'Pitta', calories: 350, protein: '12g', fat: '15g', carbs: '40g', time: '45 min', image: 'https://picsum.photos/seed/curry/400/300' },
  { id: '3', name: 'Spiced Vegetable Stir-Fry', description: 'Stimulating spices help activate Kapha energy.', dosha: 'Kapha', calories: 200, protein: '8g', fat: '4g', carbs: '30g', time: '20 min', image: 'https://picsum.photos/seed/stirfry/400/300' }
];

const REPORT_DATA = [
  { name: 'Mon', digestion: 70, sleep: 6.5 },
  { name: 'Tue', digestion: 85, sleep: 7.2 },
  { name: 'Wed', digestion: 60, sleep: 6.8 },
  { name: 'Thu', digestion: 90, sleep: 8.0 },
  { name: 'Fri', digestion: 75, sleep: 7.5 },
  { name: 'Sat', digestion: 80, sleep: 7.0 },
  { name: 'Sun', digestion: 85, sleep: 7.5 },
];

export default function App() {
  const [view, setView] = useState<ViewState>('splash');
  const [user, setUser] = useState<UserProfile>({
    name: 'Amelia',
    age: '28',
    gender: 'Female',
    height: '165',
    weight: '120 lbs',
    region: 'South Asia',
    sleepHours: '7.5',
    waterLiters: '2.5',
    dietPreference: 'Vegetarian',
    concerns: ['Acidity'],
    pantry: ['Rice', 'Lentils', 'Spinach', 'Ghee', 'Turmeric']
  });
  const [dosha, setDosha] = useState<Dosha>('Pitta');

  const navigate = (v: ViewState) => setView(v);

  // --- Views ---

  const Splash = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="relative mb-12">
        <div className="w-64 h-80 bg-[#f8f4f1] border border-[#e5dfd9] rounded-sm flex items-center justify-center p-4">
           <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400" alt="Ayurveda Plant" className="w-full h-full object-cover" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">AyurDiet Pro</h1>
      <p className="text-gray-500 mb-12">Personalized Ayurveda + AI.</p>
      <button 
        onClick={() => navigate('login')}
        className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-2xl shadow-lg hover:bg-green-600 transition mb-4"
      >
        Get Started
      </button>
      <button 
        onClick={() => navigate('login')}
        className="text-[#84cc16] font-semibold"
      >
        Log in
      </button>
    </div>
  );

  const Login = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <button onClick={() => navigate('splash')} className="mb-8"><ChevronLeft size={24} /></button>
      <h2 className="text-3xl font-bold mb-1">AyurDiet Pro</h2>
      <h3 className="text-2xl font-bold text-gray-800 mb-12">Welcome to AyurDiet Pro</h3>
      
      <div className="space-y-6">
        <input 
          type="text" 
          placeholder="Email / Mobile (OTP)" 
          className="w-full p-4 bg-green-50 rounded-2xl border-none focus:ring-2 focus:ring-green-400 outline-none"
        />
        
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">I'm a doctor</span>
          <div className="relative inline-block w-12 h-6 bg-gray-200 rounded-full transition-colors">
            <input type="checkbox" className="sr-only peer" />
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6"></div>
          </div>
        </div>

        <button 
          onClick={() => navigate('onboarding')}
          className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-2xl shadow-lg hover:bg-green-600 transition"
        >
          Continue
        </button>
        
        <button 
          className="w-full py-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-2"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
          Continue with Google
        </button>
      </div>

      <div className="mt-auto text-center text-xs text-gray-400">
        By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>
      </div>
    </div>
  );

  const Onboarding = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center mb-4">Your Ayurvedic Wellness Journey</h2>
      <p className="text-gray-500 text-center mb-12">Discover a balanced life with personalized guidance.</p>
      
      <div className="w-full bg-[#f8f9fa] rounded-3xl p-10 flex flex-col items-center shadow-sm relative mb-12">
        <div className="w-20 h-20 bg-[#f0f9e8] rounded-full flex items-center justify-center mb-6">
          <Utensils className="text-green-500" size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">Personalized Diet Plans</h3>
        <p className="text-gray-500 text-center">Get a diet plan tailored to your unique needs and dosha.</p>
        
        <div className="flex gap-2 mt-8">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      <button 
        onClick={() => navigate('assessment')}
        className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-2xl shadow-lg"
      >
        Continue
      </button>
    </div>
  );

  const Assessment = () => {
    const [step, setStep] = useState(1);
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate('onboarding')}><ChevronLeft size={24} /></button>
          <button className="text-green-600 font-bold">Skip</button>
        </div>
        <div className="mb-8">
          <span className="text-gray-400 text-sm">Q3 of 10</span>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
            <div className="w-1/3 h-full bg-[#84cc16]"></div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-12 leading-tight">What is your primary body type according to Ayurveda?</h2>

        <div className="space-y-4 flex-1">
          <div onClick={() => navigate('result')} className="p-6 bg-[#f7fdf0] rounded-3xl border border-transparent hover:border-green-300 cursor-pointer">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wind className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold">Vata</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">Characterized by lightness, dryness, and movement. Vata types tend to be creative, energetic, and adaptable.</p>
          </div>

          <div onClick={() => navigate('result')} className="p-6 bg-[#f7fdf0] rounded-3xl border border-transparent hover:border-green-300 cursor-pointer">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Flame className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold">Pitta</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">Associated with heat, intensity, and transformation. Pitta types are often ambitious, intelligent, and have a strong drive.</p>
          </div>

          <div onClick={() => navigate('result')} className="p-6 bg-[#f7fdf0] rounded-3xl border border-transparent hover:border-green-300 cursor-pointer">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Droplets className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold">Kapha</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">Represents stability, structure, and coolness. Kapha individuals are typically calm, compassionate, and have a steady nature.</p>
          </div>
        </div>

        <button 
          className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-full mt-8 opacity-50"
          disabled
        >
          Next
        </button>
      </div>
    );
  };

  const Result = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="flex items-center justify-center mb-8 relative">
        <button onClick={() => navigate('assessment')} className="absolute left-0"><ChevronLeft size={24} /></button>
        <h3 className="text-xl font-bold">Quiz Result</h3>
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-br from-green-200 via-green-100 to-yellow-100 p-8 rounded-[40px] text-center mb-8 shadow-sm">
          <div className="w-24 h-24 bg-white/30 rounded-full mx-auto flex items-center justify-center mb-6">
            <Flame className="text-white" size={48} />
          </div>
          <p className="text-white font-medium mb-2">Congrats — your dominant Dosha is</p>
          <h2 className="text-6xl font-black text-white mb-6">Pitta 65%</h2>
          <p className="text-white/90 text-sm leading-relaxed">
            You're a natural leader, driven and ambitious. Your fiery nature can sometimes lead to impatience, but your passion is your greatest strength.
          </p>
        </div>

        <h3 className="text-xl font-bold mb-4">Quick Tips</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Flame />, text: 'Avoid spicy foods', bg: 'bg-green-50' },
            { icon: <div className="text-2xl">❄️</div>, text: 'Stay cool', bg: 'bg-green-50' },
            { icon: <div className="text-2xl">🧘</div>, text: 'Practice mindfulness', bg: 'bg-green-50' },
          ].map((tip, i) => (
            <div key={i} className={`${tip.bg} p-4 rounded-3xl flex flex-col items-center text-center gap-2`}>
              <div className="text-green-600">{tip.icon}</div>
              <span className="text-[10px] font-bold text-gray-700 leading-tight">{tip.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => navigate('home')}
          className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-full shadow-lg"
        >
          Create Profile
        </button>
        <button 
          className="w-full py-4 bg-green-50 text-[#84cc16] font-bold rounded-full"
        >
          Share result with doctor
        </button>
      </div>
    </div>
  );

  const Home = () => (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/seed/user/100" className="w-10 h-10 rounded-full" alt="User" />
          <h2 className="text-2xl font-bold">Hi, Amelia</h2>
        </div>
        <button className="relative">
          <Bell size={24} />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        <div className="bg-green-100 text-green-700 px-6 py-3 rounded-full font-bold">Vata</div>
        <div className="bg-white border px-6 py-3 rounded-2xl flex flex-col items-center">
          <span className="text-xs text-gray-400">Weight</span>
          <span className="font-bold">120 lbs</span>
        </div>
        <div className="bg-white border px-6 py-3 rounded-2xl flex flex-col items-center">
          <span className="text-xs text-gray-400">BMI</span>
          <span className="font-bold">20.7</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border overflow-hidden bg-white shadow-sm">
          <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=600" alt="Diet Card" className="w-full h-48 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-1">Daily Diet Card</h3>
            <p className="text-sm text-gray-400 mb-4">Today's Meals: 1200 cal</p>
            <button className="w-full py-3 bg-[#84cc16] text-white font-bold rounded-2xl" onClick={() => navigate('diet')}>View</button>
          </div>
        </div>

        <div className="rounded-3xl border overflow-hidden bg-white shadow-sm">
          <img src="https://images.unsplash.com/photo-1528605248644-14dd04622971?auto=format&fit=crop&q=80&w=600" alt="Balance Wheel" className="w-full h-48 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-1">Dosha Balance Wheel</h3>
            <p className="text-sm text-gray-400 mb-4">Current vs Baseline: 70%</p>
            <button className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-2xl" onClick={() => navigate('report')}>View History</button>
          </div>
        </div>

        <div className="rounded-3xl border overflow-hidden bg-white shadow-sm">
          <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600" alt="Lifestyle" className="w-full h-48 object-cover" />
          <div className="p-6">
            <h3 className="text-xl font-bold mb-1">Lifestyle Guidance</h3>
            <p className="text-sm text-gray-400 mb-4">Dinacharya Tip of the Day</p>
            <button className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-2xl" onClick={() => navigate('learn')}>Read More</button>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mt-12 mb-6">Ayurveda Tips</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[
          { title: 'The Three Doshas', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=300' },
          { title: 'Mindful Eating', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=300' },
        ].map((tip, i) => (
          <div key={i} className="min-w-[200px] flex flex-col gap-3">
            <img src={tip.img} className="w-full h-40 object-cover rounded-3xl" alt={tip.title} />
            <span className="font-bold">{tip.title}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const DietPlan = () => (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <ChevronLeft onClick={() => navigate('home')} className="cursor-pointer" />
        <h3 className="text-xl font-bold">Recipe Builder</h3>
        <div className="w-6"></div>
      </div>

      <div className="space-y-4 mb-12">
        <input 
          placeholder="Ingredient" 
          className="w-full p-4 bg-green-50 rounded-2xl outline-none"
        />
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Quantity" className="p-4 bg-green-50 rounded-2xl outline-none" />
          <select className="p-4 bg-green-50 rounded-2xl outline-none text-gray-500">
            <option>Cooking Method</option>
            <option>Steam</option>
            <option>Sauté</option>
            <option>Boil</option>
          </select>
        </div>
        <button className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-2xl shadow-md">Add Ingredient</button>
      </div>

      <h3 className="text-xl font-bold mb-4">Nutrition Summary</h3>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Calories', value: '250' },
          { label: 'Protein', value: '15g' },
          { label: 'Carbs', value: '30g' },
          { label: 'Fat', value: '10g' },
          { label: 'Fiber', value: '5g' },
          { label: 'Sugar', value: '2g' },
        ].map((nut, i) => (
          <div key={i} className="bg-green-50 p-4 rounded-3xl text-center">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{nut.label}</p>
            <p className="text-lg font-bold">{nut.value}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mb-4">Ayurveda Tags</h3>
      <div className="flex flex-wrap gap-2 mb-12">
        <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">Vata Balancing</span>
        <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">Pitta Balancing</span>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-bold">Kapha Aggravating</span>
      </div>

      <h3 className="text-xl font-bold mb-4">Your Recipe</h3>
      <div className="bg-green-50 p-6 rounded-3xl flex justify-between items-center mb-12">
        <div>
          <h4 className="font-bold text-lg">Ghee</h4>
          <p className="text-gray-400 text-sm">1 tbsp - Sauté</p>
        </div>
        <button className="text-gray-300"><X size={20} /></button>
      </div>

      <button 
        onClick={() => navigate('food-checker')}
        className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
      >
        <ShieldAlert size={20} />
        Check Food Incompatibility
      </button>
    </div>
  );

  const FoodChecker = () => {
    const [food1, setFood1] = useState('');
    const [food2, setFood2] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
      if (!food1 || !food2) return;
      setLoading(true);
      try {
        const res = await checkFoodCompatibility(food1, food2);
        setResult(res);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-white p-6 pb-24">
        <div className="flex items-center gap-4 mb-8">
          <ChevronLeft onClick={() => navigate('diet')} className="cursor-pointer" />
          <h3 className="text-xl font-bold">Food Combination Guardian</h3>
        </div>

        <div className="space-y-4 mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              value={food1}
              onChange={(e) => setFood1(e.target.value)}
              placeholder="Enter first food item" 
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border focus:border-green-400"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              value={food2}
              onChange={(e) => setFood2(e.target.value)}
              placeholder="Enter second food item" 
              className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none border focus:border-green-400"
            />
          </div>
          <button 
            onClick={handleCheck}
            disabled={loading}
            className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-2xl disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze Compatibility'}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="relative rounded-[40px] overflow-hidden aspect-video bg-gray-100 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover brightness-50" alt="Incompatible" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                 <div className="bg-red-500 rounded-full p-2 mb-4">
                  <ShieldAlert size={32} />
                 </div>
                 <h2 className="text-3xl font-bold mb-2">{result.isCompatible ? 'Compatible' : 'Incompatible'}</h2>
                 <p className="text-xl font-medium">{food1} + {food2}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold">Explanation</h3>
            <p className="text-gray-500 leading-relaxed">{result.explanation}</p>

            <button className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-2xl flex items-center justify-center gap-2">
              View Compatible Alternatives <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const Learn = () => (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold">Learn</h3>
        <Search className="text-gray-400" size={24} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Remedies', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400' },
          { label: 'Diet', img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=400' },
          { label: 'Yoga', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400' },
          { label: 'Daily Routines', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400' },
          { label: 'Journal', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400' },
          { label: 'Challenges', img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-sm">
              <img src={item.img} className="w-full h-full object-cover" alt={item.label} />
            </div>
            <span className="text-center font-bold text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const Report = () => (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <ChevronLeft onClick={() => navigate('home')} className="cursor-pointer" />
        <h3 className="text-xl font-bold">Weekly Report</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-white border rounded-[32px] p-6 shadow-sm">
          <p className="text-gray-400 text-sm font-medium">Digestion</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black">85%</span>
          </div>
          <p className="text-green-500 text-xs font-bold mb-6">Last 7 Days</p>
          
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REPORT_DATA}>
                <defs>
                  <linearGradient id="colorDigestion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="digestion" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorDigestion)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white border rounded-[32px] p-6 shadow-sm">
          <p className="text-gray-400 text-sm font-medium">Sleep</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black">7.5 <span className="text-lg">hrs</span></span>
          </div>
          <p className="text-green-500 text-xs font-bold mb-6">Last 7 Days</p>
          
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REPORT_DATA}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="sleep" stroke="#84cc16" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white border rounded-[32px] p-6 shadow-sm">
          <p className="text-gray-400 text-sm font-medium">Dosha Trend</p>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black">Vata</span>
          </div>
          <p className="text-green-500 text-xs font-bold mb-6">Last 7 Days</p>
        </div>

        <div className="relative rounded-[32px] overflow-hidden aspect-[16/7] shadow-lg">
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover brightness-50" alt="Insight" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <h4 className="text-xl font-bold mb-1">Pitta trending down; increase cooling foods</h4>
            <p className="text-xs opacity-80 font-medium">Your AI insight</p>
          </div>
        </div>

        <h3 className="text-xl font-bold pt-4">Achievements</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[
            { label: '7-Day Streak', icon: '📝' },
            { label: 'Perfect Digestion', icon: '📥' },
            { label: 'Sleep Pro', icon: '💤' },
          ].map((ach, i) => (
            <div key={i} className="min-w-[140px] aspect-square bg-gray-50 rounded-[32px] flex flex-col items-center justify-center p-4 gap-4">
              <div className="text-4xl">{ach.icon}</div>
              <span className="text-xs font-bold text-gray-700 text-center">{ach.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Profile = () => (
    <div className="min-h-screen bg-white p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <ChevronLeft onClick={() => navigate('home')} className="cursor-pointer" />
        <h3 className="text-xl font-bold">Profile</h3>
      </div>

      <h4 className="text-lg font-bold mb-4">Basic Information</h4>
      <div className="space-y-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 px-1">Name</label>
          <input defaultValue={user.name} className="w-full p-4 bg-green-50 rounded-2xl outline-none" placeholder="Enter your name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 px-1">Age</label>
            <input defaultValue={user.age} className="w-full p-4 bg-green-50 rounded-2xl outline-none" placeholder="Your age" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 px-1">Gender</label>
            <div className="flex bg-green-50 p-1 rounded-2xl">
              <button className="flex-1 py-3 font-bold text-xs bg-white rounded-xl shadow-sm">Male</button>
              <button className="flex-1 py-3 font-bold text-xs text-gray-400">Female</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 px-1">Region</label>
          <input defaultValue={user.region} className="w-full p-4 bg-green-50 rounded-2xl outline-none" placeholder="Enter your region" />
        </div>
      </div>

      <h4 className="text-lg font-bold mb-4">Anthropometrics</h4>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 px-1">Height (cm)</label>
          <input defaultValue={user.height} className="w-full p-4 bg-green-50 rounded-2xl outline-none" placeholder="e.g., 175" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 px-1">Weight (kg)</label>
          <input defaultValue={user.weight} className="w-full p-4 bg-green-50 rounded-2xl outline-none" placeholder="e.g., 70" />
        </div>
      </div>

      <h4 className="text-lg font-bold mb-4">Lifestyle</h4>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 px-1">Sleep Hours</label>
          <input defaultValue={user.sleepHours} className="w-full p-4 bg-green-50 rounded-2xl outline-none" placeholder="e.g., 8" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 px-1">Water (liters)</label>
          <input defaultValue={user.waterLiters} className="w-full p-4 bg-green-50 rounded-2xl outline-none" placeholder="e.g., 2.5" />
        </div>
      </div>

      <button className="w-full py-4 bg-[#84cc16] text-white font-bold rounded-full mb-12 shadow-md">
        Save & Generate Diet
      </button>

      <h4 className="text-lg font-bold mb-4">Pantry</h4>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        <input 
          placeholder="Search Ingredients" 
          className="w-full p-4 pl-12 bg-green-50 rounded-2xl outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {user.pantry.map((item, i) => (
          <div key={i} className="bg-green-100 px-4 py-2 rounded-full flex items-center gap-2 text-green-700 font-bold text-sm">
            {item} <X size={14} className="cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );

  const Navbar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around items-center z-50">
      <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-green-500' : 'text-gray-400'}`}>
        <HomeIcon size={24} />
        <span className="text-[10px] font-bold">Home</span>
      </button>
      <button onClick={() => navigate('diet')} className={`flex flex-col items-center gap-1 ${view === 'diet' ? 'text-green-500' : 'text-gray-400'}`}>
        <Utensils size={24} />
        <span className="text-[10px] font-bold">Diet Plan</span>
      </button>
      <button onClick={() => navigate('learn')} className={`flex flex-col items-center gap-1 ${view === 'learn' ? 'text-green-500' : 'text-gray-400'}`}>
        <BookOpen size={24} />
        <span className="text-[10px] font-bold">Learn</span>
      </button>
      <button onClick={() => navigate('report')} className={`flex flex-col items-center gap-1 ${view === 'report' ? 'text-green-500' : 'text-gray-400'}`}>
        <BarChart2 size={24} />
        <span className="text-[10px] font-bold">Report</span>
      </button>
      <button onClick={() => navigate('profile')} className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-green-500' : 'text-gray-400'}`}>
        <User size={24} />
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </div>
  );

  const renderView = () => {
    switch (view) {
      case 'splash': return <Splash />;
      case 'login': return <Login />;
      case 'onboarding': return <Onboarding />;
      case 'assessment': return <Assessment />;
      case 'result': return <Result />;
      case 'home': return <Home />;
      case 'diet': return <DietPlan />;
      case 'learn': return <Learn />;
      case 'report': return <Report />;
      case 'profile': return <Profile />;
      case 'food-checker': return <FoodChecker />;
      default: return <Home />;
    }
  };

  const showNavbar = ['home', 'diet', 'learn', 'report', 'profile', 'food-checker'].includes(view);

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-hidden bg-white shadow-2xl">
      {renderView()}
      {showNavbar && <Navbar />}
    </div>
  );
}

