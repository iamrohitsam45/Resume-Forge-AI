import { motion } from 'framer-motion';
import cn from '../../utils/cn.js';

export function Card({ className, children, hover = false, ...props }) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover
    ? { whileHover: { y: -4, boxShadow: '0 20px 40px -20px rgba(15,23,42,0.25)' }, transition: { type: 'spring', stiffness: 300, damping: 24 } }
    : {};
  return (
    <Component className={cn('card-surface p-5', className)} {...hoverProps} {...props}>
      {children}
    </Component>
  );
}

export default Card;
