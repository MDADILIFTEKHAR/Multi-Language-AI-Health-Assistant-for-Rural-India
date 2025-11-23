'use client'
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { languages, type Language } from '@/lib/languages';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleValueChange = (code: string) => {
    const newLang = languages.find(lang => lang.code === code);
    if (newLang) {
      onLanguageChange(newLang);
    }
  };

  if (!isClient) {
    return <div className="w-[150px] h-10" />; // Return a placeholder on the server
  }

  return (
    <Select value={selectedLanguage.code} onValueChange={handleValueChange}>
      <SelectTrigger className="w-auto gap-2 text-sm md:w-[150px]">
        <Languages className="w-5 h-5 text-muted-foreground"/>
        <div className="hidden md:block">
            <SelectValue placeholder="Language" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
