export interface Chat {
  id: string;
  userId: string;
  question: string;
  answer: string;
  tokens: number;
  createdAt: Date;
}
