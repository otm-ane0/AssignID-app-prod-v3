declare module 'framer-motion' {
  import * as React from 'react';
  
  export const AnimatePresence: React.FC<{
    initial?: boolean;
    custom?: any;
    exitBeforeEnter?: boolean;
    mode?: 'sync' | 'popLayout' | 'wait';
    onExitComplete?: () => void;
    children?: React.ReactNode;
  }>;
  
  export const motion: any;
  export const useAnimation: any;
  export const useMotionValue: any;
  export const useTransform: any;
  export const useSpring: any;
  export const useScroll: any;
  export const useInView: any;
  export const LayoutGroup: any;
  export const LazyMotion: any;
  export const domAnimation: any;
  export const m: any;
}
