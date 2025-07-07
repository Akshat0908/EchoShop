import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  echoShopAgent, 
  synthesizeSpeechOptimized, 
  transcribeAudioOptimized,
  type OptimizedResponse 
} from '@/services/groqService';
import { agentOrchestrator } from '@/services/agentSystem';
import { knowledgeGraph } from '@/services/knowledgeGraph';
import VoiceCommands from './VoiceCommands';
import CartStatus from './CartStatus';

// TypeScript declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceInterfaceProps {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  onOrderUpdate: (order: any[]) => void;
  onPerformanceUpdate?: (metrics: any) => void;
  userProfile: {
    preferences: string[];
    dietary: string[];
    location: string;
  };
}

// Performance optimization: Client-side VAD (Voice Activity Detection)
class VoiceActivityDetector {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array;
  private isListening = false;
  private silenceTimer: NodeJS.Timeout | null = null;
  private onSpeechStart: () => void;
  private onSpeechEnd: () => void;
  private onAudioData: (data: Uint8Array) => void;

  constructor(
    onSpeechStart: () => void,
    onSpeechEnd: () => void,
    onAudioData: (data: Uint8Array) => void
  ) {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.onSpeechStart = onSpeechStart;
    this.onSpeechEnd = onSpeechEnd;
    this.onAudioData = onAudioData;
  }

  async start(stream: MediaStream) {
    this.microphone = this.audioContext.createMediaStreamSource(stream);
    this.microphone.connect(this.analyser);
    this.isListening = true;
    this.detectVoiceActivity();
  }

  stop() {
    this.isListening = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
  }

  private detectVoiceActivity() {
    if (!this.isListening) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    this.onAudioData(this.dataArray);

    // Calculate average volume
    const average = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;
    const threshold = 30; // Adjustable threshold

    if (average > threshold) {
      // Speech detected
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
      this.onSpeechStart();
    } else {
      // Silence detected
      if (!this.silenceTimer) {
        this.silenceTimer = setTimeout(() => {
          this.onSpeechEnd();
        }, 1500); // 1.5 seconds of silence to trigger speech end
      }
    }

    requestAnimationFrame(() => this.detectVoiceActivity());
  }
}

const VoiceInterface = ({ isListening, setIsListening, onOrderUpdate, onPerformanceUpdate, userProfile }: VoiceInterfaceProps) => {
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    processingTime: number;
    tokensUsed: number;
    confidence: number;
  }>({ processingTime: 0, tokensUsed: 0, confidence: 0 });
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array());
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  const recognition = useRef<any>(null);
  const vad = useRef<VoiceActivityDetector | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  // Performance optimization: Debounced processing
  const debouncedProcess = useCallback(
    debounce(async (input: string) => {
      await processUserInputOptimized(input);
    }, 300),
    []
  );

  // Debounce utility function
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Optimized user input processing
  const processUserInputOptimized = async (input: string) => {
    const startTime = performance.now();
    
    // Check for stop commands first
    const lowerInput = input.toLowerCase().trim();
    if (lowerInput === 'stop' || lowerInput === 'ok stop' || lowerInput === 'stop listening' || 
        lowerInput === 'quit' || lowerInput === 'exit' || lowerInput === 'end') {
      console.log('Stop command detected, stopping voice interface');
      stopListening();
      setAiResponse('Voice interface stopped. Click the microphone button to start again.');
      setConversation(prev => [...prev, { role: 'user', content: input }, { role: 'assistant', content: 'Voice interface stopped.' }]);
      return;
    }

    setIsProcessing(true);
    setConversation(prev => [...prev, { role: 'user', content: input }]);

    try {
      // Use optimized Groq API with structured responses
      console.log('Processing with optimized Groq API...');
      const result: OptimizedResponse = await echoShopAgent.processUserInputOptimized(input, userProfile, conversation);
      
      setAiResponse(result.response);
      const metrics = {
        processingTime: result.metadata.processingTime,
        tokensUsed: result.metadata.tokensUsed,
        confidence: result.confidence,
        apiLatency: result.metadata.processingTime * 0.8, // Estimate API latency
        audioLatency: result.metadata.processingTime * 0.2, // Estimate audio processing
        totalLatency: result.metadata.processingTime
      };
      
      setPerformanceMetrics(metrics);
      onPerformanceUpdate?.(metrics);
      
      setConversation(prev => [...prev, { role: 'assistant', content: result.response }]);
      
      // Optimized text-to-speech
      const ttsResult = await synthesizeSpeechOptimized(result.response, {
        rate: 0.9,
        pitch: 1,
        volume: 0.8
      });
      
      if (ttsResult.success) {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), ttsResult.duration);
      }
      
      // Extract order information from structured response
      if (result.entities.action === 'add_to_cart' && result.entities.food) {
        const mockOrderItem = {
          id: Date.now(),
          name: result.entities.food[0] || 'Custom Order',
          restaurant: result.entities.restaurant?.[0] || 'Recommended Restaurant',
          price: result.entities.price || 18.99,
          quantity: result.entities.quantity || 1,
          modifiers: result.entities.modifiers || []
        };
        setCartItems(prev => [...prev, mockOrderItem]);
        onOrderUpdate([mockOrderItem]);
        
        // Provide feedback about what was added
        const feedbackResponse = `Perfect! I've added ${mockOrderItem.quantity} ${mockOrderItem.name}${mockOrderItem.modifiers.length > 0 ? ` with ${mockOrderItem.modifiers.join(', ')}` : ''} from ${mockOrderItem.restaurant} to your cart for $${mockOrderItem.price.toFixed(2)}. What else would you like to order?`;
        setAiResponse(feedbackResponse);
        setConversation(prev => [...prev.slice(0, -1), { role: 'assistant', content: feedbackResponse }]);
      }
      
      // Update user profile in knowledge graph
      const { preferences, dietary } = knowledgeGraph.extractPreferencesFromConversation(input);
      if (preferences.length > 0 || dietary.length > 0) {
        knowledgeGraph.updateUserPreferences(userProfile.id, preferences, dietary);
      }
      
    } catch (error) {
      console.error('Optimized processing failed, using fallback:', error);
      // Fallback to legacy processing
      try {
        const response = await agentOrchestrator.processVoiceInput(input, userProfile);
        setAiResponse(response);
        setConversation(prev => [...prev, { role: 'assistant', content: response }]);
        await synthesizeSpeechOptimized(response);
      } catch (fallbackError) {
        console.error('All processing failed, using mock response:', fallbackError);
        const fallbackResponse = await mockGroqAPI(input, userProfile, conversation);
        setAiResponse(fallbackResponse);
        setConversation(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
        
        toast({
          title: "Using Offline Mode",
          description: "Connected to local AI processing due to API limitations.",
          variant: "default"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize optimized speech recognition with VAD
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show interim results for better UX
        if (interimTranscript) {
          setTranscript(interimTranscript);
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          debouncedProcess(finalTranscript);
        }
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive"
        });
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [debouncedProcess]);

  const startListening = async () => {
    try {
      // Get microphone access with optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Optimized for Whisper
          channelCount: 1
        }
      });

      // Initialize VAD
      vad.current = new VoiceActivityDetector(
        () => console.log('Speech started'),
        () => console.log('Speech ended'),
        (data) => setAudioData(data)
      );
      
      await vad.current.start(stream);

      // Start speech recognition
      if (recognition.current) {
        recognition.current.start();
      } else {
        toast({
          title: "Voice Not Supported",
          description: "Your browser doesn't support voice recognition. Try typing instead.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Microphone access error:', error);
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (vad.current) {
      vad.current.stop();
    }
    if (recognition.current) {
      recognition.current.stop();
    }
    setIsListening(false);
  };

  // Mock Groq API call for fallback
  const mockGroqAPI = async (input: string, profile: any, history: any[]): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Faster mock response
    
    const lowerInput = input.toLowerCase();
    
    // Enhanced order detection
    const orderKeywords = ['order', 'add', 'get', 'buy', 'want', 'give me', 'i need', 'bring me'];
    const isOrderCommand = orderKeywords.some(keyword => lowerInput.includes(keyword));
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return `Hello! I'm your AI food ordering assistant. I see you prefer ${profile.preferences.join(' and ')} food. What would you like to order today?`;
    }
    
    // Enhanced pizza ordering
    if (lowerInput.includes('pizza')) {
      if (isOrderCommand) {
        const quantity = lowerInput.match(/(\d+)/)?.[1] || '1';
        const hasExtraCheese = lowerInput.includes('extra cheese') || lowerInput.includes('cheese');
        const modifiers = hasExtraCheese ? ['extra cheese'] : [];
        const price = hasExtraCheese ? 22.99 : 18.99;
        
        // Add to cart
        const mockOrderItem = {
          id: Date.now(),
          name: 'Margherita Pizza',
          restaurant: 'Tony\'s Italian',
          price: price,
          quantity: parseInt(quantity),
          modifiers: modifiers
        };
        setCartItems(prev => [...prev, mockOrderItem]);
        onOrderUpdate([mockOrderItem]);
        
        return `Perfect! I've added ${quantity} Margherita Pizza${hasExtraCheese ? ' with extra cheese' : ''} from Tony's Italian to your cart for $${price.toFixed(2)}. What else would you like to order?`;
      } else {
        return `Great choice! Based on your preference for Italian food, I recommend Tony's Italian Restaurant. They have excellent Margherita and Pepperoni pizzas. Just say "order a pizza" to add it to your cart!`;
      }
    }
    
    // Enhanced Italian food ordering
    if (lowerInput.includes('italian') || lowerInput.includes('pasta')) {
      if (isOrderCommand) {
        const quantity = lowerInput.match(/(\d+)/)?.[1] || '1';
        const pastaType = lowerInput.includes('spaghetti') ? 'Spaghetti Carbonara' : 
                         lowerInput.includes('fettuccine') ? 'Fettuccine Alfredo' : 'Spaghetti Carbonara';
        const price = 16.99;
        
        const mockOrderItem = {
          id: Date.now(),
          name: pastaType,
          restaurant: 'Tony\'s Italian',
          price: price,
          quantity: parseInt(quantity),
          modifiers: []
        };
        setCartItems(prev => [...prev, mockOrderItem]);
        onOrderUpdate([mockOrderItem]);
        
        return `Excellent! I've added ${quantity} ${pastaType} from Tony's Italian to your cart for $${price.toFixed(2)}. Would you like to add anything else?`;
      } else {
        return `Excellent! I found Tony's Italian Restaurant which perfectly matches your preferences. They offer authentic Italian cuisine with options for your dietary needs. Just say "order pasta" to add it to your cart!`;
      }
    }
    
    // Enhanced vegetarian ordering
    if (lowerInput.includes('vegetarian') || lowerInput.includes('vegan') || lowerInput.includes('salad')) {
      if (isOrderCommand) {
        const quantity = lowerInput.match(/(\d+)/)?.[1] || '1';
        const saladType = lowerInput.includes('mediterranean') ? 'Mediterranean Bowl' : 
                         lowerInput.includes('quinoa') ? 'Quinoa Salad' : 'Mediterranean Bowl';
        const price = 14.99;
        
        const mockOrderItem = {
          id: Date.now(),
          name: saladType,
          restaurant: 'Fresh & Green',
          price: price,
          quantity: parseInt(quantity),
          modifiers: []
        };
        setCartItems(prev => [...prev, mockOrderItem]);
        onOrderUpdate([mockOrderItem]);
        
        return `Perfect! I've added ${quantity} ${saladType} from Fresh & Green to your cart for $${price.toFixed(2)}. This matches your dietary preferences perfectly!`;
      } else {
        return `Perfect! I found several vegetarian options that match your dietary preferences. Fresh & Green has amazing Mediterranean bowls and quinoa salads. Just say "order a salad" to add it to your cart!`;
      }
    }
    
    // Generic order commands
    if (isOrderCommand) {
      return `I'd be happy to help you order! What specific food item would you like to add to your cart? You can say things like "order a pizza", "add pasta", or "get me a salad".`;
    }
    
    // Checkout commands
    if (lowerInput.includes('checkout') || lowerInput.includes('place order') || lowerInput.includes('complete order')) {
      return `Great! I'm processing your order with ${cartItems.length} items for a total of $${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}. Your order will be ready in 25-30 minutes. Thank you for using EchoShop!`;
    }
    
    return `I understand you're looking for food options. Based on your preferences for ${profile.preferences.join(', ')}, I can recommend several restaurants in ${profile.location}. Just say "order [food item]" to add it to your cart!`;
  };

  return (
    <div className="space-y-6">
      {/* Voice Control */}
      <div className="text-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center"
        >
          <Button
            onClick={isListening ? stopListening : startListening}
            size="lg"
            className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 voice-active' 
                : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg'
            }`}
            disabled={isProcessing || isSpeaking}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-foreground border-t-transparent" />
            ) : isSpeaking ? (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            ) : isListening ? (
              <StopIcon className="h-8 w-8" />
            ) : (
              <MicrophoneIcon className="h-8 w-8" />
            )}
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-foreground">
              {isListening ? 'Listening...' : isProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : 'Tap to speak'}
            </p>
            {performanceMetrics.processingTime > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Response: {performanceMetrics.processingTime.toFixed(0)}ms | 
                Tokens: {performanceMetrics.tokensUsed} | 
                Confidence: {(performanceMetrics.confidence * 100).toFixed(0)}%
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Real-time Audio Visualization */}
      {isListening && (
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-sm text-accent">Voice Activity</h3>
          </div>
          <div className="flex items-end justify-center h-16 gap-1">
            {Array.from(audioData.slice(0, 32)).map((value, index) => (
              <div
                key={index}
                className="w-1 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-100"
                style={{ 
                  height: `${Math.max(2, (value / 255) * 60)}px`,
                  opacity: value > 30 ? 1 : 0.3
                }}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Current Transcript */}
      {transcript && (
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <h3 className="font-semibold text-sm text-primary">You Said</h3>
          </div>
          <p className="text-sm text-foreground">{transcript}</p>
        </Card>
      )}

      {/* AI Response */}
      {aiResponse && (
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <h3 className="font-semibold text-sm text-accent">AI Response</h3>
          </div>
          <p className="text-sm text-foreground">{aiResponse}</p>
        </Card>
      )}

      {/* Conversation History */}
      <Card className="p-4 max-h-80 overflow-y-auto bg-gradient-to-b from-card/50 to-card/30 border-0">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <h3 className="font-semibold text-sm text-primary">Conversation History</h3>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {conversation.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-foreground'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {conversation.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <MicrophoneIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Start a conversation by tapping the microphone
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Voice Commands */}
      <VoiceCommands />

      {/* Cart Status */}
      <CartStatus items={cartItems} />
    </div>
  );
};

export default VoiceInterface; 