export interface EntryPayload {
  mealCount: number;
  skippedMeal: boolean;
  nightEating: boolean;
  bingeEating: boolean;
  emotionalEating: boolean;
  stressLevel: number;
  mood: 'good' | 'normal' | 'bad';
}

export interface Entry extends EntryPayload {
  id: string;
  userId: string;
  date: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}
