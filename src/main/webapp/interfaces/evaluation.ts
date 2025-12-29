export interface QuestionOption {
  label: string;
  value: number;
}

export interface EvaluationQuestion {
  title: string;
  options: QuestionOption[];
}
