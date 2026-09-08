import cn from '../../utils/cn.js';

export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />;
}

export default Skeleton;
