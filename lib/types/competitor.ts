export interface Competitor {
  _id?: string;
  name: string;
  reason: string;
  image?: string;
  points: number;
  completedChallenges: string[];
  createdAt?: Date;
}
