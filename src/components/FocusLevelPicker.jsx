import { FOCUS_LEVELS } from '../utils/focusLevels';

export default function FocusLevelPicker({ value, onChange }) {
  return (
    <div className="focus-level-picker">
      {FOCUS_LEVELS.map((level) => (
        <button
          type="button"
          key={level.value}
          className={`focus-level-option ${value === level.value ? 'selected' : ''}`}
          onClick={() => onChange(level.value)}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
