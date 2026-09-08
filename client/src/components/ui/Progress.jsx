import { motion } from 'framer-motion';
import cn from '../../utils/cn.js';

export function Progress({ value = 0, max = 100, className, barClassName, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn('h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500', barClassName)}
        style={color ? { background: color } : undefined}
      />
    </div>
  );
}

export function CircularScore({ score = 0, size = 120, strokeWidth = 10, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#10b981' : score >= 75 ? '#3b63f5' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-slate-100 dark:text-slate-800" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{Math.round(score)}</span>
        {label && <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>}
      </div>
    </div>
  );
}

export default Progress;
