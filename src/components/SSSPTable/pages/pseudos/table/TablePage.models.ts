export interface TablePageProps {
  accuracies: string[];
  activeAccuracy: string;
  onAccuracyToggle: (value: string) => void;
}
