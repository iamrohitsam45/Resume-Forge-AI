import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button.jsx';

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-8 py-16 text-center shadow-glow sm:px-16"
      >
        <div className="absolute -left-10 -top-10 h-56 w-56 animate-blob rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-10 -bottom-10 h-56 w-56 animate-blob rounded-full bg-white/10 blur-3xl [animation-delay:3s]" />
        <h2 className="relative text-3xl font-bold text-white sm:text-4xl">Ready to build a resume that gets noticed?</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-brand-100">
          Join job seekers using AI-assisted writing and transparent ATS scoring to land more interviews.
        </p>
        <div className="relative mt-8 flex justify-center gap-3">
          <Button size="lg" variant="secondary" icon={ArrowRight} className="flex-row-reverse" onClick={() => navigate('/register')}>
            Create My Resume
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

export default CTASection;
