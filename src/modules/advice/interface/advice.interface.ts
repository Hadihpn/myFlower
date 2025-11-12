interface AdviceItem {
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'temperature' | 'moisture' | 'light' | 'general' | 'care';
  message: string;
  priority: number;
  actionRequired?: boolean;
}
