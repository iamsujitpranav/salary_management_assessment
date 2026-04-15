import { motion } from 'framer-motion';

type Props = {
  label: string;
  value: number | string;
  prefix?: string;
  accent: 'violet' | 'cyan' | 'emerald' | 'amber' | 'fuchsia';
};

const accentClasses = {
  violet: 'from-violet-500/20 to-violet-500/5 border-violet-400/20',
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-400/20',
  emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-400/20',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-400/20',
  fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-400/20',
};

export function StatCard({ label, value, prefix = '', accent }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border bg-gradient-to-br p-5 shadow-glow ${accentClasses[accent]}`}
    >
      <p className="text-sm text-slate-300">{label}</p>
      <div className="mt-3 text-3xl font-semibold text-white">
        {typeof value === 'number' ? `${prefix}${value.toLocaleString()}` : value}
      </div>
    </motion.div>
  );
}
