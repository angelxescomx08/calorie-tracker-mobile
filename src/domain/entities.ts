// ── Auth ──────────────────────────────────────────────────────────────────────
export interface User {
  id: number
  email: string
  name: string
  profile_picture: string | null
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
  expires_at: string
}

// ── Profile ───────────────────────────────────────────────────────────────────
export type Gender = 'male' | 'female'
export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active'

export interface Profile {
  id: number
  user_id: number
  birth_date: string
  gender: Gender
  height_cm: number
  activity_level: ActivityLevel
  created_at: string
  updated_at: string
}

// ── Goals ─────────────────────────────────────────────────────────────────────
export type GoalType = 'lose_weight' | 'gain_weight' | 'maintain'

export interface Goal {
  id: number
  user_id: number
  goal_type: GoalType
  target_weight_kg: number | null
  weekly_rate_kg: number | null
  daily_calorie_target: number
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ── Weight ────────────────────────────────────────────────────────────────────
export interface WeightLog {
  id: number
  user_id: number
  weight_kg: number
  logged_date: string
  notes: string | null
  created_at: string
}

// ── Measurements ──────────────────────────────────────────────────────────────
export interface Measurement {
  id: number
  user_id: number
  measured_date: string
  neck_cm: number | null
  waist_cm: number | null
  hip_cm: number | null
  body_fat_percentage: number | null
  notes: string | null
  created_at: string
}

// ── Foods ─────────────────────────────────────────────────────────────────────
export interface Food {
  id: number
  name: string
  brand: string | null
  barcode: string | null
  serving_size_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g: number | null
  sugar_g: number | null
  sodium_mg: number | null
  created_by_user_id: number | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface FoodsResponse {
  items: Food[]
  total: number
  limit: number
  offset: number
}

// ── Daily Log ─────────────────────────────────────────────────────────────────
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface MealEntry {
  id: number
  daily_log_id: number
  meal_type: MealType
  food_id: number
  quantity_g: number
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  created_at: string
  food?: Food
}

export interface DailyLog {
  id: number
  user_id: number
  log_date: string
  water_ml: number
  notes: string | null
  created_at: string
  updated_at: string
  meal_entries: MealEntry[]
}

// ── Exercises ─────────────────────────────────────────────────────────────────
export type ExerciseCategory = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other'

export interface Exercise {
  id: number
  name: string
  category: ExerciseCategory
  met_value: number
  description: string | null
  created_by_user_id: number | null
  is_verified: boolean
  created_at: string
}

export interface ExercisesResponse {
  items: Exercise[]
  total: number
  limit: number
  offset: number
}

export interface ExerciseLog {
  id: number
  user_id: number
  exercise_id: number
  log_date: string
  duration_minutes: number
  calories_burned: number
  sets: number | null
  reps: number | null
  distance_km: number | null
  avg_heart_rate: number | null
  notes: string | null
  created_at: string
  exercise?: Exercise
}
