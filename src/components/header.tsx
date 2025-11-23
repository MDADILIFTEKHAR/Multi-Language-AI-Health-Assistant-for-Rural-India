import React from 'react';
import { Phone } from 'lucide-react';
import LanguageSelector from '@/components/language-selector';
import type { Language } from '@/lib/languages';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-headline">Swasthya AI</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
          <Button asChild variant="destructive" size="sm" className="hidden sm:flex">
            <a href="tel:102">
              <Phone className="mr-2 h-4 w-4" />
              Call Ambulance
            </a>
          </Button>
          <Button asChild variant="destructive" size="icon" className="sm:hidden">
            <a href="tel:102" aria-label="Call Ambulance">
              <Phone className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
