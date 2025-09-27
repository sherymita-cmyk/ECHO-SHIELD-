'use client';

import { useState, useEffect, useRef } from 'react';
import type { Contact } from '@/lib/types';
import useLocalStorage from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { getSosMessage } from '@/app/actions';

import { Header } from './header';
import { SosButton } from './sos-button';
import { EmergencyContacts } from './emergency-contacts';
import { FeatureGrid } from './feature-grid';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react';

export function Dashboard() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('emergency-contacts', []);
  const [isSosActive, setIsSosActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startVideoRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({
            title: "Video Recording Started",
            description: "Your device is now recording video and audio.",
            variant: "default",
        });

        // For demonstration, stop recording after 30 seconds
        setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop();
                stream.getTracks().forEach(track => track.stop());
                setIsRecording(false);
                setIsSosActive(false); // Reset SOS state
                 toast({
                    title: "Recording Stopped",
                    description: "SOS sequence complete. Stay safe.",
                });
            }
        }, 30000);

    } catch (err) {
        console.error("Error starting video recording:", err);
        toast({
            title: "Recording Error",
            description: "Could not start video recording. Please check permissions.",
            variant: "destructive",
        });
        setIsSosActive(false); // Reset SOS state if recording fails
    }
  };

  const handleSos = async (source: string = 'SOS Button') => {
    if (isSosActive) return;

    if (contacts.length === 0) {
      toast({
        title: 'No Emergency Contacts',
        description: 'Please add at least one emergency contact before activating SOS.',
        variant: 'destructive',
      });
      return;
    }

    setIsSosActive(true);
    toast({
      title: 'SOS Activated!',
      description: `Triggered via ${source}. Contacting emergency contacts.`,
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const phoneNumbers = contacts.map(c => c.phone);
        
        const aiResponse = await getSosMessage({ latitude, longitude, emergencyContacts: phoneNumbers });

        contacts.forEach((contact) => {
          toast({
            title: `Message Sent to ${contact.name}`,
            description: (
                <div className="w-full">
                    <p className="font-mono text-xs bg-muted p-2 rounded-md">{aiResponse.message}</p>
                </div>
            ),
          });
        });

        setTimeout(startVideoRecording, 3000);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: 'Location Error',
          description: 'Could not get your location. SOS may not include location data.',
          variant: 'destructive',
        });
        setIsSosActive(false); // Reset SOS state on error
      }
    );
  };
  
    useEffect(() => {
        // Clean up media streams on component unmount
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center gap-12">
        <SosButton onActivate={() => handleSos()} isSosActive={isSosActive} isRecording={isRecording} />
        <div className="w-full max-w-4xl space-y-8">
            <FeatureGrid onActivate={(source) => handleSos(source)} isSosActive={isSosActive} />
            <EmergencyContacts contacts={contacts} setContacts={setContacts} />
             {isSosActive && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>SOS Procedure Active</AlertTitle>
                <AlertDescription>
                  Emergency contacts have been notified. {isRecording ? "Video recording is in progress." : "Starting video recording soon..."} Please stay as safe as possible.
                </AlertDescription>
              </Alert>
            )}
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EchoShield. All rights reserved.</p>
      </footer>
    </div>
  );
}
