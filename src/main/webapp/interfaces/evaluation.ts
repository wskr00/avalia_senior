export interface QuestionOption {
  label: string;
  value: number;
}

export interface EvaluationQuestion {
  title: string;
  groupTitle?: string;
  options: QuestionOption[];
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
}

export interface QuestionGroup {
  groupTitle?: string;
  isGroup: boolean;
  questions: { data: EvaluationQuestion; originalIndex: number }[];
}

export interface EvaluationBasicInfo {
  doctorName: string;
  patientName: string;
  age: number | null;
  date: Date | string;
}

export interface EvaluationRange {
  min: number;
  max?: number;
  label: string;
}

export interface ScaleDefinition {
  id: string;
  baseline: number;
  ranges: EvaluationRange[];
}

export interface EvaluationResult {
  score: number;
  interpretation: string;
}
