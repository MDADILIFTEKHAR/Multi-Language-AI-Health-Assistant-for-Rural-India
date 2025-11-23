'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage, { type Message } from '@/components/chat-message';
import { Button } from '@/components/ui/button';
import { Mic, Hospital, LoaderCircle, Send } from 'lucide-react';
import type { Language } from '@/lib/languages';
import { handleSymptomCheck, handleFirstAid } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { AiIcon } from './icons';

// Mock hospital data
const mockHospitals = [
  { name: "Community Health Center", distance: "2 km", contact: "102", address: "Village Main Road, Rampur" },
  { name: "District Hospital", distance: "10 km", contact: "9876543210", address: "Civil Lines, District HQ" },
  { name: "Primary Health Sub-center", distance: "500 m", contact: "108", address: "Next to Panchayat Office, Sitapur" },
];

interface ChatAreaProps {
  selectedLanguage: Language;
}

export default function ChatArea({ selectedLanguage }: ChatAreaProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), role, content }]);
  };

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      // Clean up markdown for better speech
      const cleanText = text.replace(/(\*\*|__|\*|_|`|#+\s)/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = selectedLanguage.bcp47;
      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    } catch(e) {
      console.error("Speech synthesis failed", e);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const initialMessage = {
      id: 'init',
      role: 'assistant' as const,
      content: "Hello! I am your Swasthya AI assistant. How are you feeling today? Please tell me your symptoms by tapping the microphone.",
    };
    setMessages([initialMessage]);
    speak(initialMessage.content);
  }, [speak]);


  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      speak(messages[messages.length - 1].content);
    }
  }, [messages, speak]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')?.scrollTo({
        top: scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')?.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const processUserInput = async (text: string) => {
    if (!text.trim() || isLoading) return;

    addMessage('user', text);
    setIsLoading(true);

    const symptomResult = await handleSymptomCheck(text, selectedLanguage.name);

    if ('error' in symptomResult) {
      addMessage('assistant', symptomResult.error);
      setIsLoading(false);
      return;
    }

    let aiResponse = '';
    if (symptomResult.followUpQuestions) {
      aiResponse += symptomResult.followUpQuestions;
    }

    if (symptomResult.detectedCondition && symptomResult.detectedCondition.toLowerCase() !== 'none' && symptomResult.detectedCondition.trim() !== '') {
      aiResponse += `\n\nBased on your symptoms, it could possibly be **${symptomResult.detectedCondition}**.`;
      
      const firstAidResult = await handleFirstAid(symptomResult.detectedCondition, text, selectedLanguage.name);
      if (!('error' in firstAidResult)) {
        aiResponse += `\n\n### First-Aid Guidance\n${firstAidResult.advice}`;
      }
    } else if (!symptomResult.followUpQuestions) {
        aiResponse += `I'm sorry, I'm having trouble understanding. Could you please describe your symptoms again in a different way?`;
    }
    
    addMessage('assistant', aiResponse);
    setIsLoading(false);
  };
  
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Browser Not Supported",
        description: "Your browser does not support voice recognition.",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage.bcp47;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
        recognitionRef.current = null;
        setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      toast({
        title: "Voice Error",
        description: "Couldn't recognize voice. Please check microphone permissions and try again.",
        variant: "destructive",
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput('');
      processUserInput(transcript);
    };

    recognition.start();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processUserInput(input);
    setInput('');
  };

  return (
    <>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="container mx-auto p-4 pt-20 pb-40">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 p-4 justify-start">
               <Avatar className="w-8 h-8 border">
                <div className="bg-primary aspect-square h-full w-full flex items-center justify-center rounded-full">
                  <AiIcon className="w-5 h-5 text-primary-foreground" />
                </div>
              </Avatar>
              <div className="max-w-[75%] rounded-lg p-3 text-sm shadow-md bg-card flex items-center gap-2">
                <LoaderCircle className="w-4 h-4 text-primary animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-10">
        <div className="container mx-auto p-2 md:p-4">
          <div className="flex items-center gap-2 md:gap-4">
            <form onSubmit={handleFormSubmit} className="flex-1 flex items-center gap-2">
                <Input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type or say your symptoms..." 
                    className="flex-1"
                    disabled={isLoading}
                />
                 <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="w-5 h-5" />
                 </Button>
            </form>
            <Button
              size="icon"
              className={cn(
                "rounded-full w-12 h-12",
                isListening ? 'bg-destructive hover:bg-destructive/90 animate-pulse' : 'bg-primary hover:bg-primary/90',
              )}
              onClick={handleListen}
              disabled={isLoading}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              <Mic className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2"
              onClick={() => setShowHospitals(true)}
            >
              <Hospital className="w-5 h-5" />
              <span>Hospitals</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden"
              onClick={() => setShowHospitals(true)}
              aria-label="Find Hospitals"
            >
              <Hospital className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </footer>

      <Dialog open={showHospitals} onOpenChange={setShowHospitals}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Nearest Hospitals & PHCs</DialogTitle>
            <DialogDescription>
              This is a list of nearby medical centers. In an emergency, please call an ambulance immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {mockHospitals.map((hospital, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{hospital.name}</CardTitle>
                    <Badge variant="secondary">{hospital.distance}</Badge>
                  </div>
                  <CardDescription>{hospital.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                     <p className="text-sm font-medium">Contact: <a href={`tel:${hospital.contact}`} className="text-primary underline">{hospital.contact}</a></p>
                     <Button asChild>
                       <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + ',' + hospital.address)}`} target="_blank" rel="noopener noreferrer">
                         Directions
                       </a>
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowHospitals(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
