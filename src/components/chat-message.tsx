import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { AiIcon } from './icons';
import ReactMarkdown from 'react-markdown';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="w-8 h-8 border border-primary/20">
          <div className="bg-primary aspect-square h-full w-full flex items-center justify-center rounded-full">
            <AiIcon className="w-5 h-5 text-primary-foreground" />
          </div>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3 text-sm shadow-md',
          isUser
            ? 'bg-accent text-accent-foreground'
            : 'bg-card'
        )}
      >
        <ReactMarkdown
          className="prose prose-sm dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1"
          components={{
            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            h3: ({ node, ...props }) => <h3 className="font-bold mb-2 text-base font-headline" {...props} />,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <Avatar className="w-8 h-8 border border-accent/20">
          <AvatarFallback className="bg-accent text-accent-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
