import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/**
 * Wrapper that reveals children with a fade-up animation when scrolled into view.
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to reveal
 * @param {number} [props.delay=0] - Delay in seconds before animation starts
 * @param {string} [props.className] - Additional CSS classes
 */
export default function RevealOnScroll({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
