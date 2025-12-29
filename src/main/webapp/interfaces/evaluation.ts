export interface QuestionOption {
  label: string;
  value: number;
}

export interface EvaluationQuestion {
  title: string;
  options: QuestionOption[];
}

export interface EvaluationRange {
  min: number;
  max: number;
  label: string;
}

export interface ScaleDefinition {
  id: string;
  baseline: number;
  ranges: EvaluationRange[];
}
