'use client'
import React, { useState } from 'react';
import Header from '@/components/header';
import ChatArea from '@/components/chat-area';
import { languages, type Language } from '@/lib/languages';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
      <main className="flex-1 flex flex-col">
        <ChatArea selectedLanguage={selectedLanguage} />
      </main>
    </div>
  );
}
