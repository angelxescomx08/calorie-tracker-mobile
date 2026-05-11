import { apiClient } from '@/infrastructure/api/client'
import { AuthRepositoryImpl } from '@/infrastructure/repositories/AuthRepositoryImpl'
import { DailyLogRepositoryImpl } from '@/infrastructure/repositories/DailyLogRepositoryImpl'
import { ExerciseLogRepositoryImpl } from '@/infrastructure/repositories/ExerciseLogRepositoryImpl'
import { ExerciseRepositoryImpl } from '@/infrastructure/repositories/ExerciseRepositoryImpl'
import { FoodRepositoryImpl } from '@/infrastructure/repositories/FoodRepositoryImpl'
import { GoalsRepositoryImpl } from '@/infrastructure/repositories/GoalsRepositoryImpl'
import { MeasurementRepositoryImpl } from '@/infrastructure/repositories/MeasurementRepositoryImpl'
import { ProfileRepositoryImpl } from '@/infrastructure/repositories/ProfileRepositoryImpl'
import { WeightRepositoryImpl } from '@/infrastructure/repositories/WeightRepositoryImpl'

import { LoginUseCase } from '@/application/auth/LoginUseCase'
import { LogoutUseCase } from '@/application/auth/LogoutUseCase'
import { RegisterUseCase } from '@/application/auth/RegisterUseCase'
import { CreateGoalUseCase } from '@/application/goals/CreateGoalUseCase'
import { GetActiveGoalUseCase } from '@/application/goals/GetActiveGoalUseCase'
import { UpdateGoalUseCase } from '@/application/goals/UpdateGoalUseCase'
import { AddMealEntryUseCase } from '@/application/daily-log/AddMealEntryUseCase'
import { DeleteMealEntryUseCase } from '@/application/daily-log/DeleteMealEntryUseCase'
import { GetDailyLogUseCase } from '@/application/daily-log/GetDailyLogUseCase'
import { UpdateDailyLogUseCase } from '@/application/daily-log/UpdateDailyLogUseCase'
import { SearchFoodsUseCase } from '@/application/food/SearchFoodsUseCase'
import { GetProfileUseCase } from '@/application/profile/GetProfileUseCase'
import { UpdateProfileUseCase } from '@/application/profile/UpdateProfileUseCase'
import { CreateWeightLogUseCase } from '@/application/weight/CreateWeightLogUseCase'
import { DeleteWeightLogUseCase } from '@/application/weight/DeleteWeightLogUseCase'
import { GetWeightLogsUseCase } from '@/application/weight/GetWeightLogsUseCase'
import { CreateMeasurementUseCase } from '@/application/measurement/CreateMeasurementUseCase'
import { DeleteMeasurementUseCase } from '@/application/measurement/DeleteMeasurementUseCase'
import { GetMeasurementsUseCase } from '@/application/measurement/GetMeasurementsUseCase'
import { SearchExercisesUseCase } from '@/application/exercise/SearchExercisesUseCase'
import { CreateExerciseLogUseCase } from '@/application/exercise-log/CreateExerciseLogUseCase'
import { DeleteExerciseLogUseCase } from '@/application/exercise-log/DeleteExerciseLogUseCase'
import { GetExerciseLogsUseCase } from '@/application/exercise-log/GetExerciseLogsUseCase'

// ── Repositories ──────────────────────────────────────────────────────────────
const authRepository = new AuthRepositoryImpl(apiClient)
const profileRepository = new ProfileRepositoryImpl(apiClient)
const goalsRepository = new GoalsRepositoryImpl(apiClient)
const weightRepository = new WeightRepositoryImpl(apiClient)
const measurementRepository = new MeasurementRepositoryImpl(apiClient)
const foodRepository = new FoodRepositoryImpl(apiClient)
const dailyLogRepository = new DailyLogRepositoryImpl(apiClient)
const exerciseRepository = new ExerciseRepositoryImpl(apiClient)
const exerciseLogRepository = new ExerciseLogRepositoryImpl(apiClient)

// ── DI Container ──────────────────────────────────────────────────────────────
export const container = {
  // Repositories (exposed for direct access in AuthContext)
  authRepository,
  profileRepository,

  // Auth
  loginUseCase: new LoginUseCase(authRepository),
  registerUseCase: new RegisterUseCase(authRepository),
  logoutUseCase: new LogoutUseCase(authRepository),

  // Profile
  getProfileUseCase: new GetProfileUseCase(profileRepository),
  updateProfileUseCase: new UpdateProfileUseCase(profileRepository),

  // Goals
  getActiveGoalUseCase: new GetActiveGoalUseCase(goalsRepository),
  createGoalUseCase: new CreateGoalUseCase(goalsRepository),
  updateGoalUseCase: new UpdateGoalUseCase(goalsRepository),

  // Weight
  getWeightLogsUseCase: new GetWeightLogsUseCase(weightRepository),
  createWeightLogUseCase: new CreateWeightLogUseCase(weightRepository),
  deleteWeightLogUseCase: new DeleteWeightLogUseCase(weightRepository),

  // Measurements
  getMeasurementsUseCase: new GetMeasurementsUseCase(measurementRepository),
  createMeasurementUseCase: new CreateMeasurementUseCase(measurementRepository),
  deleteMeasurementUseCase: new DeleteMeasurementUseCase(measurementRepository),

  // Foods
  searchFoodsUseCase: new SearchFoodsUseCase(foodRepository),

  // Daily Log
  getDailyLogUseCase: new GetDailyLogUseCase(dailyLogRepository),
  updateDailyLogUseCase: new UpdateDailyLogUseCase(dailyLogRepository),
  addMealEntryUseCase: new AddMealEntryUseCase(dailyLogRepository),
  deleteMealEntryUseCase: new DeleteMealEntryUseCase(dailyLogRepository),

  // Exercises
  searchExercisesUseCase: new SearchExercisesUseCase(exerciseRepository),

  // Exercise Logs
  getExerciseLogsUseCase: new GetExerciseLogsUseCase(exerciseLogRepository),
  createExerciseLogUseCase: new CreateExerciseLogUseCase(exerciseLogRepository),
  deleteExerciseLogUseCase: new DeleteExerciseLogUseCase(exerciseLogRepository),
} as const
