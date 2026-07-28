import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      class="fixed top-0 left-0 right-0 h-[3px] bg-rose-gold origin-left z-50"
      style={{ scaleX }}
    />
  );
};
export default ScrollProgress;
