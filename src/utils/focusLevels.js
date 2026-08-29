export const FOCUS_LEVELS = [
  { value: 1, label: 'Unable to focus' },
  { value: 2, label: 'Distracted' },
  { value: 3, label: 'Somewhat distracted' },
  { value: 4, label: 'Focused' },
  { value: 5, label: 'Very focused' },
];

export function focusLabel(value) {
  return FOCUS_LEVELS.find((f) => f.value === value)?.label ?? '';
}
