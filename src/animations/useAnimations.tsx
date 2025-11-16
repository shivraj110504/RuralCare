
import { useEffect, useState, RefObject } from 'react';

export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  }
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

export function useAnimateOnScroll(
  ref: RefObject<Element>, 
  animation: string = 'animate-fade-in-up', 
  delay: number = 0
): string {
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });
  const [className, setClassName] = useState('opacity-0 transform translate-y-8');

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setClassName(`${animation} opacity-100 transform translate-y-0`);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, animation, delay]);

  return className;
}

export function useStaggeredAnimation(
  count: number, 
  baseDelay: number = 100,
  animation: string = 'animate-fade-in-up'
): { 
  getAnimationProps: (index: number) => { className: string; style: { animationDelay: string } }
} {
  return {
    getAnimationProps: (index: number) => ({
      className: `opacity-0 ${animation}`,
      style: { 
        animationDelay: `${index * baseDelay}ms`,
        animationFillMode: 'forwards'
      }
    })
  };
}

export function useCursorPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      document.documentElement.classList.add('has-custom-cursor');
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      document.documentElement.classList.remove('has-custom-cursor');
      setIsHovering(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        const isButton = 
          e.target.tagName === 'BUTTON' || 
          e.target.tagName === 'A' || 
          e.target.getAttribute('role') === 'button' ||
          e.target.closest('button') !== null ||
          e.target.closest('a') !== null;
        
        setIsHovering(isButton);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return { position, isHovering };
}
