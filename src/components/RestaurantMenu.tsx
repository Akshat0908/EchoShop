import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary?: string[];
  image: string;
}

interface RestaurantMenuProps {
  restaurant: {
    id: number;
    name: string;
    cuisine: string;
    image: string;
  };
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomato sauce, basil, olive oil',
    price: 18.99,
    category: 'Pizza',
    dietary: ['Vegetarian'],
    image: '🍕'
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella and tomato sauce',
    price: 21.99,
    category: 'Pizza',
    image: '🍕'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    price: 14.99,
    category: 'Salads',
    dietary: ['Vegetarian'],
    image: '🥗'
  },
  {
    id: '4',
    name: 'Spaghetti Carbonara',
    description: 'Fresh pasta with eggs, pancetta, parmesan, black pepper',
    price: 19.99,
    category: 'Pasta',
    image: '🍝'
  },
  {
    id: '5',
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in creamy tomato curry sauce',
    price: 22.99,
    category: 'Curry',
    image: '🍛'
  },
  {
    id: '6',
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice with mixed vegetables and spices',
    price: 18.99,
    category: 'Biryani',
    dietary: ['Vegetarian', 'Vegan'],
    image: '🍛'
  }
];

const RestaurantMenu = ({ restaurant, onClose, onAddToCart }: RestaurantMenuProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    onAddToCart(item, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name} added to your order`,
    });
  };

  const categories = Array.from(new Set(mockMenuItems.map(item => item.category)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <Card className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{restaurant.image}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{restaurant.name}</h2>
                <p className="text-muted-foreground">{restaurant.cuisine} Cuisine</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {categories.map(category => (
              <div key={category} className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">{category}</h3>
                <div className="grid gap-4">
                  {mockMenuItems
                    .filter(item => item.category === category)
                    .map(item => (
                    <Card key={item.id} className="p-4 hover:bg-card/70 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-foreground">{item.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              {item.dietary && (
                                <div className="flex gap-1 mt-2">
                                  {item.dietary.map(diet => (
                                    <Badge key={diet} variant="secondary" className="text-xs">
                                      {diet}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-primary">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={!quantities[item.id]}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {quantities[item.id] || 1}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button
                              onClick={() => handleAddToCart(item)}
                              size="sm"
                              className="px-4"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RestaurantMenu;