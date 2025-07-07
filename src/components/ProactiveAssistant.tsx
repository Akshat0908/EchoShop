import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, Star, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProactiveAssistantProps {
  userProfile: {
    name: string;
    preferences: string[];
    dietary: string[];
    location: string;
    lastOrder?: string;
  };
  onSuggestionAccept: (suggestion: any) => void;
}

interface ProactiveSuggestion {
  id: string;
  type: 'reorder' | 'trending' | 'new' | 'time-based';
  title: string;
  description: string;
  restaurant: string;
  price: number;
  confidence: number;
  reasoning: string;
  icon: any;
}

const ProactiveAssistant = ({ userProfile, onSuggestionAccept }: ProactiveAssistantProps) => {
  const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<ProactiveSuggestion | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate proactive suggestions based on user profile and current time
    const generateSuggestions = () => {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();
      
      const newSuggestions: ProactiveSuggestion[] = [];

      // Time-based suggestions
      if (hour >= 11 && hour <= 14) {
        newSuggestions.push({
          id: 'lunch-time',
          type: 'time-based',
          title: 'Perfect lunch timing!',
          description: `Based on your usual lunch pattern, you might enjoy something ${userProfile.preferences[0]?.toLowerCase() || 'delicious'} right now.`,
          restaurant: 'Your Favorite Spots',
          price: 15.99,
          confidence: 0.8,
          reasoning: 'Historical lunch ordering pattern detected',
          icon: Clock
        });
      }

      if (hour >= 17 && hour <= 20) {
        newSuggestions.push({
          id: 'dinner-time',
          type: 'time-based',
          title: 'Dinner time suggestion',
          description: `How about your usual ${userProfile.lastOrder || 'favorite dish'} from last week?`,
          restaurant: 'Tony\'s Italian Restaurant',
          price: 22.99,
          confidence: 0.9,
          reasoning: 'You ordered this 3 times last week at similar time',
          icon: Clock
        });
      }

      // Preference-based suggestions
      if (userProfile.preferences.includes('Italian')) {
        newSuggestions.push({
          id: 'trending-italian',
          type: 'trending',
          title: 'Trending in Italian cuisine',
          description: 'New truffle pasta is getting rave reviews from customers with similar tastes',
          restaurant: 'Bella Vista',
          price: 28.99,
          confidence: 0.7,
          reasoning: 'High ratings from users with similar preferences',
          icon: TrendingUp
        });
      }

      // Weekend special suggestions
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newSuggestions.push({
          id: 'weekend-special',
          type: 'new',
          title: 'Weekend special nearby',
          description: `New ${userProfile.preferences[0] || 'restaurant'} place just opened in ${userProfile.location}`,
          restaurant: 'Metro Bistro',
          price: 19.99,
          confidence: 0.6,
          reasoning: 'New restaurant matching your preferences in your area',
          icon: MapPin
        });
      }

      setSuggestions(newSuggestions);
      
      // Show a suggestion after a delay
      if (newSuggestions.length > 0) {
        setTimeout(() => {
          setActiveSuggestion(newSuggestions[0]);
          setIsVisible(true);
        }, 3000);
      }
    };

    generateSuggestions();
    
    // Update suggestions every 5 minutes
    const interval = setInterval(generateSuggestions, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userProfile]);

  const handleAcceptSuggestion = (suggestion: ProactiveSuggestion) => {
    onSuggestionAccept(suggestion);
    setActiveSuggestion(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setActiveSuggestion(null);
    setIsVisible(false);
    
    // Show next suggestion if available
    const currentIndex = suggestions.findIndex(s => s.id === activeSuggestion?.id);
    if (currentIndex < suggestions.length - 1) {
      setTimeout(() => {
        setActiveSuggestion(suggestions[currentIndex + 1]);
        setIsVisible(true);
      }, 10000); // Wait 10 seconds before showing next
    }
  };

  return (
    <AnimatePresence>
      {isVisible && activeSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <Card className="p-4 glass-effect card-shadow border-l-4 border-l-primary">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <activeSuggestion.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{activeSuggestion.title}</h4>
                  <p className="text-xs text-muted-foreground">{activeSuggestion.restaurant}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="p-1 h-auto"
                aria-label="Dismiss suggestion"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-foreground mb-3">
              {activeSuggestion.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  ${activeSuggestion.price}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-xs text-muted-foreground">
                    {Math.round(activeSuggestion.confidence * 100)}% match
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleAcceptSuggestion(activeSuggestion)}
                className="flex-1"
              >
                Order Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>

            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                💡 {activeSuggestion.reasoning}
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProactiveAssistant;