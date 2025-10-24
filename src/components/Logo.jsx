import React from 'react';
import logoImage from '../assets/logo.png';

export function Logo({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'h-8',
    medium: 'h-12',
    large: 'h-16',
    xlarge: 'h-24'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="Quick and Easy Tech" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
}

export function LogoText({ className = '' }) {
  return (
    <div className={`brand-logo ${className}`}>
      <span className="text-brand-black">Quick and Easy </span>
      <span className="tech-highlight">Tech</span>
    </div>
  );
}

