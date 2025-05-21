// FILE: src/components/particle-grid/ParticleGrid.js

import React, { useEffect, useRef } from 'react';
import './style.css';

const ParticleGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;
    let particles = [];
    let isAnimating = true;

    // Set canvas dimensions to fill the container
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles(); // Create particles after setting canvas size
    };

    // Mouse move event
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Particle class
    class Particle {
      constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.baseColor = color;
        this.highlightColor = 'rgba(0, 199, 255, 0.8)';
        this.maxDistance = 120;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Calculate distance from mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Change color based on distance
        if (distance < this.maxDistance) {
          const intensity = 1 - (distance / this.maxDistance);
          this.color = this.highlightColor;
          this.size = 1.5 + (intensity * 2);

          // Draw connections to nearby particles
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(0, 199, 255, ${intensity * 0.2})`;
          ctx.lineWidth = intensity * 1.5;
          ctx.stroke();
        } else {
          this.color = this.baseColor;
          this.size = 1.5;
        }

        this.draw();
      }
    }

    // Create particles grid
    function createParticles() {
      particles = [];
      const spacing = 25;

      for (let y = spacing; y < canvas.height; y += spacing) {
        for (let x = spacing; x < canvas.width; x += spacing) {
          particles.push(new Particle(
            x,
            y,
            1.5,
            'rgba(255, 255, 255, 0.15)'
          ));
        }
      }
    }

    // Animation loop
    function animate() {
      // Only animate when the page is visible and animation is not paused
      if (document.hidden || !isAnimating) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
      });

      // Connect particles that are close to each other
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance/50)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    // Handle visibility change
    const handleVisibilityChange = () => {
      isAnimating = !document.hidden;
    };

    // Set up the canvas and event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize
    handleResize();
    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      isAnimating = false;
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="particle-grid-canvas"></canvas>
  );
};

export default ParticleGrid;
