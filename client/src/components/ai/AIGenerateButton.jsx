import { Sparkles } from 'lucide-react';
import Dropdown from '../ui/Dropdown.jsx';
import Button from '../ui/Button.jsx';

/**
 * A "✨ Generate With Claude" button. If a single action is provided it fires
 * immediately; if multiple actions are provided it opens a small menu
 * (Generate / Improve / Shorten / Make More ATS Friendly, etc).
 */
export function AIGenerateButton({ label = 'Generate With Claude', actions, onSelect, loading, size = 'sm' }) {
  if (!actions || actions.length <= 1) {
    return (
      <Button variant="ai" size={size} icon={Sparkles} loading={loading} onClick={() => onSelect(actions?.[0]?.value || 'generate')}>
        {label}
      </Button>
    );
  }

  return (
    <Dropdown
      trigger={
        <Button variant="ai" size={size} icon={Sparkles} loading={loading} type="button">
          {label}
        </Button>
      }
      items={actions.map((a) => ({ label: a.label, onClick: () => onSelect(a.value) }))}
    />
  );
}

export default AIGenerateButton;
