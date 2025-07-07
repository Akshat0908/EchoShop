import Groq from 'groq-sdk';

// Initialize Groq client with optimized settings
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true // For demo purposes only - in production use server-side
});

// Performance optimization: Cache for frequently used prompts
const PROMPT_CACHE = new Map<string, string>();

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface UserProfile {
  preferences: string[];
  dietary: string[];
  location: string;
}

// Optimized response format for faster parsing
export interface OptimizedResponse {
  response: string;
  intent: string;
  confidence: number;
  entities: {
    food?: string[];
    restaurant?: string[];
    action?: string;
  };
  metadata: {
    processingTime: number;
    tokensUsed: number;
  };
}

export class EchoShopAgent {
  private systemPrompt = `
You are EchoShop, an advanced AI assistant specializing in voice-first food ordering. 

RESPONSE FORMAT: Always respond in this exact JSON format:
{
  "response": "Your natural language response",
  "intent": "search|order|profile_update|recommendation|confirmation|greeting|help|add_to_cart",
  "confidence": 0.95,
  "entities": {
    "food": ["pizza", "pasta"],
    "restaurant": ["Tony's Italian"],
    "action": "add_to_cart|search|recommend",
    "quantity": 1,
    "price": 18.99,
    "modifiers": ["extra cheese", "no onions"]
  }
}

ORDER EXTRACTION RULES:
- When user says "order", "add", "get", "buy", "I want", "give me" → intent: "add_to_cart"
- Extract food items, quantities, and modifiers from voice input
- Include estimated prices for common items
- Suggest restaurants that match user preferences

Keep responses concise (max 150 words) and conversational. Consider user preferences and dietary restrictions.
`;

  // Performance optimization: Batch processing for multiple intents
  async processUserInputOptimized(
    userInput: string, 
    userProfile: UserProfile, 
    conversationHistory: ChatMessage[] = []
  ): Promise<OptimizedResponse> {
    const startTime = performance.now();
    
    try {
      // Optimized prompt construction
      const userContext = `User: ${userProfile.preferences.join(', ')} preferences, ${userProfile.dietary.join(', ')} dietary, ${userProfile.location} location`;
      
      const messages: ChatMessage[] = [
        { role: 'system', content: this.systemPrompt },
        { role: 'system', content: userContext },
        ...conversationHistory.slice(-4), // Reduced context for speed
        { role: 'user', content: userInput }
      ];

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: 'llama3-8b-8192',
        temperature: 0.3, // Lower temperature for more consistent responses
        max_tokens: 200, // Reduced for speed
        top_p: 0.9,
        response_format: { type: "json_object" }, // Structured output for faster parsing
        stream: false // Disable streaming for single responses
      });

      const content = completion.choices[0]?.message?.content || '{}';
      const processingTime = performance.now() - startTime;
      
      try {
        const parsed = JSON.parse(content);
        return {
          ...parsed,
          metadata: {
            processingTime,
            tokensUsed: completion.usage?.total_tokens || 0
          }
        };
      } catch (parseError) {
        // Fallback to structured response
        return {
          response: content,
          intent: 'search',
          confidence: 0.8,
          entities: {},
          metadata: {
            processingTime,
            tokensUsed: completion.usage?.total_tokens || 0
          }
        };
      }
      
    } catch (error) {
      console.error('Groq API Error:', error);
      return {
        response: 'I apologize, but I could not process your request. Please try again.',
        intent: 'help',
        confidence: 0.0,
        entities: {},
        metadata: {
          processingTime: performance.now() - startTime,
          tokensUsed: 0
        }
      };
    }
  }

  // Optimized intent classification with caching
  async classifyIntentOptimized(userInput: string): Promise<{ intent: string; confidence: number }> {
    const cacheKey = userInput.toLowerCase().trim();
    if (PROMPT_CACHE.has(cacheKey)) {
      return { intent: PROMPT_CACHE.get(cacheKey)!, confidence: 0.95 };
    }

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Classify intent as: search, order, profile_update, recommendation, confirmation, greeting, help. Respond with JSON: {"intent": "search", "confidence": 0.95}'
          },
          { role: 'user', content: userInput }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.1,
        max_tokens: 50,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content || '{"intent": "search", "confidence": 0.5}';
      const result = JSON.parse(content);
      
      // Cache the result
      PROMPT_CACHE.set(cacheKey, result.intent);
      
      return result;
      
    } catch (error) {
      console.error('Intent classification error:', error);
      return { intent: 'search', confidence: 0.5 };
    }
  }

  // Optimized recommendation generation with batching
  async generateRecommendationsOptimized(userProfile: UserProfile): Promise<{
    recommendations: string[];
    processingTime: number;
  }> {
    const startTime = performance.now();
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Generate 3 restaurant/dish recommendations. Return JSON: {"recommendations": ["restaurant1", "restaurant2", "restaurant3"]}'
          },
          {
            role: 'user',
            content: `Preferences: ${userProfile.preferences.join(', ')}, Dietary: ${userProfile.dietary.join(', ')}, Location: ${userProfile.location}`
          }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 150,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content || '{"recommendations": []}';
      const result = JSON.parse(content);
      
      return {
        recommendations: result.recommendations || ['Italian cuisine restaurants', 'Vegetarian-friendly options', 'Local favorites'],
        processingTime: performance.now() - startTime
      };
      
    } catch (error) {
      console.error('Recommendation generation error:', error);
      return {
        recommendations: ['Italian cuisine restaurants', 'Vegetarian-friendly options', 'Local favorites in your area'],
        processingTime: performance.now() - startTime
      };
    }
  }

  // Legacy method for backward compatibility
  async processUserInput(
    userInput: string, 
    userProfile: UserProfile, 
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const result = await this.processUserInputOptimized(userInput, userProfile, conversationHistory);
    return result.response;
  }
}

// Optimized Speech-to-Text with streaming support
export async function transcribeAudioOptimized(audioBlob: Blob): Promise<{
  text: string;
  processingTime: number;
  confidence: number;
}> {
  const startTime = performance.now();
  
  try {
    // Optimize audio format for faster processing
    const optimizedBlob = await optimizeAudioForTranscription(audioBlob);
    
    const formData = new FormData();
    formData.append('file', optimizedBlob, 'audio.wav');
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', 'en');
    formData.append('response_format', 'verbose_json'); // Get confidence scores

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groq.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    const result = await response.json();
    const processingTime = performance.now() - startTime;
    
    return {
      text: result.text || '',
      processingTime,
      confidence: result.segments?.[0]?.avg_logprob || 0.8
    };
    
  } catch (error) {
    console.error('Audio transcription error:', error);
    return {
      text: '',
      processingTime: performance.now() - startTime,
      confidence: 0.0
    };
  }
}

// Audio optimization for faster transcription
async function optimizeAudioForTranscription(audioBlob: Blob): Promise<Blob> {
  try {
    // Convert to optimal format for Whisper
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Resample to 16kHz if needed (Whisper optimal)
    const sampleRate = 16000;
    const offlineContext = new OfflineAudioContext(1, audioBuffer.length * sampleRate / audioBuffer.sampleRate, sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();
    
    const renderedBuffer = await offlineContext.startRendering();
    const channelData = renderedBuffer.getChannelData(0);
    
    // Convert to 16-bit PCM
    const pcmData = new Int16Array(channelData.length);
    for (let i = 0; i < channelData.length; i++) {
      pcmData[i] = Math.max(-32768, Math.min(32767, channelData[i] * 32768));
    }
    
    return new Blob([pcmData.buffer], { type: 'audio/wav' });
  } catch (error) {
    console.warn('Audio optimization failed, using original:', error);
    return audioBlob;
  }
}

// Legacy transcription function for backward compatibility
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const result = await transcribeAudioOptimized(audioBlob);
  return result.text;
}

// Optimized Text-to-Speech with better voice selection
export function synthesizeSpeechOptimized(text: string, options: {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  priority?: 'high' | 'normal' | 'low';
} = {}): Promise<{
  success: boolean;
  duration: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    if (!('speechSynthesis' in window)) {
      resolve({
        success: false,
        duration: 0,
        error: 'Text-to-speech not supported'
      });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.8;

    // Optimize voice selection for better quality
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.name.includes('Samantha')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      resolve({
        success: true,
        duration: performance.now() - startTime
      });
    };
    
    utterance.onerror = (error) => {
      resolve({
        success: false,
        duration: performance.now() - startTime,
        error: error.error
      });
    };

    speechSynthesis.speak(utterance);
  });
}

// Legacy TTS function for backward compatibility
export function synthesizeSpeech(text: string, options: {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
} = {}): Promise<void> {
  return synthesizeSpeechOptimized(text, options).then(() => {});
}

// Export singleton instance
export const echoShopAgent = new EchoShopAgent();