'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Smartphone, Phone, BatteryWarning } from 'lucide-react';

interface FeatureGridProps {
  onActivate: (source: string) => void;
  isSosActive: boolean;
}

const features = [
  {
    title: 'Voice SOS',
    description: 'Activate with a voice command.',
    icon: Mic,
    source: 'Voice'
  },
  {
    title: 'Pocket Tap',
    description: 'Triple tap your phone in your pocket.',
    icon: Smartphone,
    source: 'Pocket Tap'
  },
  {
    title: 'Emergency Dial',
    description: 'Triggers when calling services.',
    icon: Phone,
    source: 'Emergency Dial'
  },
  {
    title: 'Low Battery',
    description: 'Auto-sends location on low power.',
    icon: BatteryWarning,
    source: 'Low Battery'
  },
];

export function FeatureGrid({ onActivate, isSosActive }: FeatureGridProps) {
    const handleActivation = (feature: typeof features[0]) => {
        if (feature.title === 'Emergency Dial') {
            window.location.href = 'tel:911';
        }
        onActivate(feature.source);
    }
  return (
    <div className="w-full">
        <h2 className="text-lg font-semibold text-center mb-4 text-muted-foreground">Alternative Triggers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                <CardHeader className="pb-2">
                    <CardTitle className="flex flex-col items-center gap-2 text-base">
                    <feature.icon className="h-8 w-8 text-primary" />
                    {feature.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-2">
                    <p className="text-xs text-muted-foreground h-8">{feature.description}</p>
                    <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleActivation(feature)}
                        disabled={isSosActive}
                    >
                        Simulate
                    </Button>
                </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
