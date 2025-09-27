'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Siren } from 'lucide-react';

interface SosButtonProps {
  onActivate: () => void;
  isSosActive: boolean;
  isRecording: boolean;
}

export function SosButton({ onActivate, isSosActive, isRecording }: SosButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timer | null>(null);

  const HOLD_DURATION = 1500; // 1.5 seconds

  const handleMouseDown = () => {
    if (isSosActive) return;
    setIsHolding(true);
    
    holdTimeout.current = setTimeout(() => {
        onActivate();
        setIsHolding(false);
        setProgress(0);
    }, HOLD_DURATION);

    progressInterval.current = setInterval(() => {
        setProgress(prev => {
            const next = prev + 100 / (HOLD_DURATION / 100);
            if (next >= 100) {
              clearInterval(progressInterval.current!);
              return 100;
            }
            return next;
        });
    }, 100);
  };

  const handleMouseUp = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => { // Cleanup on unmount
      if (holdTimeout.current) clearTimeout(holdTimeout.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);
  
  const getButtonText = () => {
    if (isRecording) return "RECORDING...";
    if (isSosActive) return "SOS ACTIVATED";
    if (isHolding) return "HOLDING...";
    return "HOLD FOR SOS";
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
        <Button
          variant="default"
          className="relative h-48 w-48 rounded-full bg-accent/20 text-accent shadow-2xl transition-all duration-300 ease-in-out hover:bg-accent/30 active:scale-95 disabled:opacity-75 disabled:bg-secondary"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          disabled={isSosActive}
        >
        <div 
          className="absolute inset-0 rounded-full bg-accent transition-transform duration-100 ease-linear"
          style={{ transform: `scale(${progress / 100})` }}
        ></div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <Siren className="h-16 w-16" />
            <span className="text-lg font-bold tracking-wider">{getButtonText()}</span>
        </div>
        </Button>
    </div>
  );
}
