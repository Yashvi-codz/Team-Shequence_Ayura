
export type Dosha = 'Vata' | 'Pitta' | 'Kapha';

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  region: string;
  sleepHours: string;
  waterLiters: string;
  dietPreference: 'Vegetarian' | 'Non-Vegetarian';
  concerns: string[];
  pantry: string[];
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  dosha: Dosha;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  time: string;
  image: string;
}

export type ViewState = 
  | 'splash'
  | 'login'
  | 'onboarding'
  | 'assessment'
  | 'result'
  | 'home'
  | 'diet'
  | 'learn'
  | 'report'
  | 'profile'
  | 'food-checker';
