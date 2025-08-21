'use client';

import React from 'react';

interface TextDisplayProps {
  children: React.ReactNode;
  className?: string;
  useEmojiFont?: boolean;
  fallbackText?: string;
}

export function TextDisplay({ 
  children, 
  className = '', 
  useEmojiFont = false,
  fallbackText 
}: TextDisplayProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Check if the text contains emojis and if they render properly
    const text = typeof children === 'string' ? children : '';
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text);
    
    if (hasEmojis) {
      console.log('🔍 [TextDisplay] Texto contiene emojis:', text);
    }
  }, [children]);

  const fontFamily = useEmojiFont 
    ? 'Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji, Android Emoji, EmojiSymbols, EmojiOne Mozilla, Twemoji Mozilla, Segoe UI Emoji, Noto Emoji, sans-serif'
    : undefined;

  if (hasError && fallbackText) {
    return (
      <span className={`${className} text-gray-500`} style={{ fontFamily }}>
        {fallbackText}
      </span>
    );
  }

  return (
    <span 
      className={className} 
      style={{ fontFamily }}
      onError={() => setHasError(true)}
    >
      {children}
    </span>
  );
}

// Specialized components for different types of text
export function EmojiText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <TextDisplay className={className} useEmojiFont={true}>
      {children}
    </TextDisplay>
  );
}

export function SafeText({ children, className = '', fallback = '' }: { children: React.ReactNode; className?: string; fallback?: string }) {
  return (
    <TextDisplay className={className} fallbackText={fallback}>
      {children}
    </TextDisplay>
  );
}

