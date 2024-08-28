export interface PseudosPageProps {
  accuracies: string[];
  activeAccuracy: string;
  onAccuracyChange: (value: string) => void;
}
