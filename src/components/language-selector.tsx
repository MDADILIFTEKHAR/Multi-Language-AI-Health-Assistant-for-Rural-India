'use client'
import React from 'react';
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
  const handleValueChange = (code: string) => {
    const newLang = languages.find(lang => lang.code === code);
    if (newLang) {
      onLanguageChange(newLang);
    }
  };

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
