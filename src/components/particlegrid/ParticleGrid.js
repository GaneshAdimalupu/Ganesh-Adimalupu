// FILE: src/components/particlegrid/ParticleGrid.js

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './style.css';

const ParticleGrid = ({
  enabled = true,
  density = 'medium', // 'low', 'medium', 'high'
  maxParticles = 150
}) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const fpsRef = useRef(60);

  const [isVisible, setIsVisible] = useState(true);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    isLowPerformance: false,
    supportsWebGL: false,
    devicePixelRatio: 1
  });

  // Detect device capabilities
  const detectDeviceCapabilities = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
                     (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
                     window.innerWidth <= 768;

    // Detect low-performance devices
    const isLowPerformance = isMobile ||
                            navigator.hardwareConcurrency <= 2 ||
                            window.innerWidth <= 480 ||
                            (navigator.connection && navigator.connection.effectiveType &&
                             ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType));

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const supportsWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance

    return {
      isMobile,
      isLowPerformance,
      supportsWebGL,
      devicePixelRatio
    };
  }, []);

  // Get optimized settings based on device capabilities
  const getOptimizedSettings = useCallback(() => {
    const capabilities = deviceCapabilities;

    // Don't render on very small screens or low-performance devices
    if (window.innerWidth <= 480 || capabilities.isLowPerformance) {
      return { enabled: false };
    }

    // Mobile settings
    if (capabilities.isMobile) {
      return {
        enabled: true,
        spacing: 50,
        maxParticles: 50,
        connectionDistance: 80,
        particleSize: 2,
        fps: 30,
        mouseEffect: false,
        animations: false
      };
    }

    // Tablet settings
    if (window.innerWidth <= 991) {
      return {
        enabled: true,
        spacing: 40,
        maxParticles: 80,
        connectionDistance: 100,
        particleSize: 1.5,
        fps: 45,
        mouseEffect: true,
        animations: true
      };
    }

    // Desktop settings
    const densitySettings = {
      low: { spacing: 60, maxParticles: 80, connectionDistance: 120 },
      medium: { spacing: 35, maxParticles: 150, connectionDistance: 100 },
      high: { spacing: 25, maxParticles: 200, connectionDistance: 80 }
    };

    return {
      enabled: true,
      ...densitySettings[density],
      particleSize: 1.5,
      fps: 60,
      mouseEffect: true,
      animations: true
    };
  }, [deviceCapabilities, density]);

  // Optimized Particle class
  class Particle {
    constructor(x, y, settings) {
      this.x = x;
      this.y = y;
      this.originalX = x;
      this.originalY = y;
      this.size = settings.particleSize;
      this.baseColor = 'rgba(255, 255, 255, 0.15)';
      this.highlightColor = 'rgba(0, 199, 255, 0.8)';
      this.maxDistance = settings.connectionDistance;
      this.mouseEffect = settings.mouseEffect;
      this.velocity = { x: 0, y: 0 };
      this.returnSpeed = 0.02;

      // Pre-calculate color components for performance
      this.colorComponents = {
        base: [255, 255, 255, 0.15],
        highlight: [0, 199, 255, 0.8]
      };
    }

    update(ctx, mouseX, mouseY, settings) {
      let distanceFromMouse = Infinity;
      let intensity = 0;

      if (this.mouseEffect) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        distanceFromMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceFromMouse < this.maxDistance) {
          intensity = 1 - (distanceFromMouse / this.maxDistance);

          // Mouse repulsion effect
          const force = intensity * 2;
          this.velocity.x += (this.x - mouseX) * force * 0.001;
          this.velocity.y += (this.y - mouseY) * force * 0.001;
        }
      }

      // Return to original position
      this.velocity.x += (this.originalX - this.x) * this.returnSpeed;
      this.velocity.y += (this.originalY - this.y) * this.returnSpeed;

      // Apply velocity with damping
      this.velocity.x *= 0.95;
      this.velocity.y *= 0.95;

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Draw particle
      this.draw(ctx, intensity);

      return { x: this.x, y: this.y, intensity };
    }

    draw(ctx, intensity) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + (intensity * 2), 0, Math.PI * 2);

      if (intensity > 0) {
        const [r, g, b] = this.colorComponents.highlight;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;
      } else {
        const [r, g, b, a] = this.colorComponents.base;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      }

      ctx.fill();
    }
  }

  // Optimized particle creation
  const createParticles = useCallback((canvas, settings) => {
    const particles = [];
    const { spacing, maxParticles } = settings;
    let count = 0;

    for (let y = spacing; y < canvas.height && count < maxParticles; y += spacing) {
      for (let x = spacing; x < canvas.width && count < maxParticles; x += spacing) {
        particles.push(new Particle(x, y, settings));
        count++;
      }
    }

    return particles;
  }, []);

  // Optimized connection drawing
  const drawConnections = useCallback((ctx, particles, settings) => {
    const { connectionDistance } = settings;
    const maxConnections = deviceCapabilities.isMobile ? 5 : 10;
    let connectionCount = 0;

    for (let i = 0; i < particles.length && connectionCount < maxConnections; i++) {
      const particle1 = particles[i];

      for (let j = i + 1; j < particles.length && connectionCount < maxConnections; j++) {
        const particle2 = particles[j];

        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.1;

          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          connectionCount++;
        }
      }
    }
  }, [deviceCapabilities.isMobile]);

  // FPS monitoring and throttling
  const shouldSkipFrame = useCallback((currentTime) => {
    const targetFps = fpsRef.current;
    const targetFrameTime = 1000 / targetFps;

    if (currentTime - lastTimeRef.current < targetFrameTime) {
      return true;
    }

    lastTimeRef.current = currentTime;
    return false;
  }, []);

  // Simple performance monitoring without PerformanceObserver
  const monitorPerformanceSimple = useCallback(() => {
    let frameCount = 0;
    let lastCheck = performance.now();

    const checkPerformance = () => {
      frameCount++;
      const now = performance.now();

      // Check every 60 frames (roughly 1 second at 60fps)
      if (frameCount >= 60) {
        const elapsed = now - lastCheck;
        const actualFps = (frameCount / elapsed) * 1000;

        // If actual FPS is significantly lower than target, reduce quality
        if (actualFps < fpsRef.current * 0.7 && !deviceCapabilities.isLowPerformance) {
          console.log('Performance degradation detected, switching to low performance mode');
          setDeviceCapabilities(prev => ({ ...prev, isLowPerformance: true }));
          fpsRef.current = Math.max(fpsRef.current - 15, 15);
        }

        frameCount = 0;
        lastCheck = now;
      }
    };

    return checkPerformance;
  }, [deviceCapabilities.isLowPerformance]);

  // Main animation loop
  const animate = useCallback((currentTime) => {
    if (!isVisible || !enabled) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    // Skip frame if FPS throttling is active
    if (shouldSkipFrame(currentTime)) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext('2d');
    const settings = getOptimizedSettings();

    if (!settings.enabled) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const { x: mouseX, y: mouseY } = mouseRef.current;

    // Update and draw particles
    const particleData = particles.map(particle =>
      particle.update(ctx, mouseX, mouseY, settings)
    );

    // Draw connections (throttled on mobile)
    if (!deviceCapabilities.isMobile || Math.random() > 0.5) {
      drawConnections(ctx, particleData, settings);
    }

    // Simple performance monitoring
    if (window.performance && typeof monitorPerformanceSimple === 'function') {
      monitorPerformanceSimple();
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isVisible, enabled, shouldSkipFrame, getOptimizedSettings, drawConnections, deviceCapabilities.isMobile, monitorPerformanceSimple]);

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pixelRatio = deviceCapabilities.devicePixelRatio;

    // Set actual size
    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;

    // Scale context
    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);

    // Set CSS size
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Recreate particles
    const settings = getOptimizedSettings();
    if (settings.enabled) {
      particlesRef.current = createParticles(canvas, settings);
    }
  }, [deviceCapabilities.devicePixelRatio, getOptimizedSettings, createParticles]);

  // Handle mouse movement (throttled)
  const handleMouseMove = useCallback((e) => {
    const settings = getOptimizedSettings();
    if (!settings.mouseEffect) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, [getOptimizedSettings]);

  // Visibility change handler
  const handleVisibilityChange = useCallback(() => {
    setIsVisible(!document.hidden);

    // Adjust FPS based on visibility
    if (document.hidden) {
      fpsRef.current = 15; // Lower FPS when hidden
    } else {
      fpsRef.current = deviceCapabilities.isMobile ? 30 : 60;
    }
  }, [deviceCapabilities.isMobile]);

  // Initialize
  useEffect(() => {
    const capabilities = detectDeviceCapabilities();
    setDeviceCapabilities(capabilities);
  }, [detectDeviceCapabilities]);

  // Setup event listeners and animation
  useEffect(() => {
    const settings = getOptimizedSettings();

    // Don't render if disabled
    if (!settings.enabled || !enabled) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    enabled,
    handleResize,
    handleMouseMove,
    handleVisibilityChange,
    animate,
    getOptimizedSettings
  ]);

  // Don't render on unsupported devices
  const settings = getOptimizedSettings();
  if (!settings.enabled || !enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="particle-grid-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      aria-hidden="true"
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(ParticleGrid);
