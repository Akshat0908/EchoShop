import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mic, ShoppingCart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceCommands = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const commandCategories = [
    {
      title: "Add to Cart",
      icon: <ShoppingCart className="w-4 h-4" />,
      commands: [
        "Order a pizza",
        "Add pasta to my cart",
        "Get me a salad",
        "I want 2 pizzas",
        "Buy a Mediterranean bowl",
        "Give me extra cheese pizza"
      ]
    },
    {
      title: "Modifiers",
      icon: <Sparkles className="w-4 h-4" />,
      commands: [
        "Pizza with extra cheese",
        "Salad without onions",
        "Pasta with garlic bread",
        "Vegetarian options only",
        "Low sodium please"
      ]
    },
    {
      title: "Quantities",
      icon: <Mic className="w-4 h-4" />,
      commands: [
        "Order 3 pizzas",
        "Get 2 salads",
        "I need 4 pasta dishes",
        "Add one more pizza"
      ]
    }
  ];

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm text-primary">Voice Commands</h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? 'Hide' : 'Show'} Examples
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Try these natural voice commands to add items to your cart:
      </p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {commandCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <h4 className="text-xs font-medium text-foreground">{category.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.commands.map((command, cmdIndex) => (
                    <Badge
                      key={cmdIndex}
                      variant="outline"
                      className="text-xs bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 cursor-pointer"
                      onClick={() => {
                        // Could trigger voice input with this command
                        console.log('Suggested command:', command);
                      }}
                    >
                      "{command}"
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
            "Order a pizza"
          </Badge>
          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
            "Add pasta"
          </Badge>
          <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
            "Get me a salad"
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default VoiceCommands; 