"use client";

import { useEffect, useState } from 'react';

export function AdminHelperWidget() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="elevenlabs/convai-widget-embed"]');
    
    if (existingScript) {
      setIsLoaded(true);
      return;
    }

    // Load the ElevenLabs ConvAI widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    
    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load ElevenLabs ConvAI widget');
    };
    
    // Add the script to the document
    document.head.appendChild(script);
    
    // Cleanup function to remove script when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Only render the widget after the script is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <elevenlabs-convai 
      agent-id="agent_8201k70nv8c5f9abxr56ad4xycpq"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
      }}
    />
  );
}
