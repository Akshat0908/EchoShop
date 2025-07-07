import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarIcon } from '@heroicons/react/24/solid';
import RestaurantMenu from './RestaurantMenu';

interface RestaurantRecommendationsProps {
  userProfile: {
    preferences: string[];
    dietary: string[];
    location: string;
  };
  onAddToCart?: (item: any, quantity: number) => void;
}

const mockRestaurants = [
  {
    id: 1,
    name: "Tony's Italian Kitchen",
    cuisine: "Italian",
    rating: 4.8,
    priceRange: "$$",
    estimatedTime: "25-30 min",
    specialties: ["Pizza", "Pasta", "Vegetarian Options"],
    image: "🍕",
    match: 95
  },
  {
    id: 2,
    name: "Green Garden Café",
    cuisine: "Vegetarian",
    rating: 4.6,
    priceRange: "$",
    estimatedTime: "15-20 min",
    specialties: ["Buddha Bowls", "Quinoa Salads", "Vegan"],
    image: "🥗",
    match: 90
  },
  {
    id: 3,
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.7,
    priceRange: "$$",
    estimatedTime: "30-35 min",
    specialties: ["Curry", "Biryani", "Vegetarian"],
    image: "🍛",
    match: 85
  },
  {
    id: 4,
    name: "Fresh Sushi Co",
    cuisine: "Japanese",
    rating: 4.9,
    priceRange: "$$$",
    estimatedTime: "20-25 min",
    specialties: ["Sushi", "Sashimi", "Tempura"],
    image: "🍣",
    match: 75
  }
];

const RestaurantRecommendations = ({ userProfile, onAddToCart }: RestaurantRecommendationsProps) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  // Filter restaurants based on user preferences
  const getRecommendedRestaurants = () => {
    return mockRestaurants
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
  };

  const handleViewMenu = (restaurant: any) => {
    setSelectedRestaurant(restaurant);
  };

  const handleAddToCart = (item: any, quantity: number) => {
    onAddToCart?.(item, quantity);
  };

  return (
    <div className="space-y-4">
      {getRecommendedRestaurants().map((restaurant, index) => (
        <motion.div
          key={restaurant.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-4 hover:bg-card/70 transition-all duration-300 border-0 shadow-sm hover:shadow-md">
            <div className="flex items-start space-x-3">
              <div className="text-3xl">{restaurant.image}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground truncate">
                    {restaurant.name}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-green-500/50 text-green-500 bg-green-500/10"
                  >
                    {restaurant.match}% match
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium text-foreground">
                      {restaurant.rating}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {restaurant.priceRange}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {restaurant.estimatedTime}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {restaurant.specialties.slice(0, 2).map((specialty) => (
                    <Badge 
                      key={specialty} 
                      variant="secondary" 
                      className="text-xs py-0 px-2 bg-primary/10 text-primary border-primary/20"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {restaurant.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs py-0 px-2">
                      +{restaurant.specialties.length - 2}
                    </Badge>
                  )}
                </div>

                <Button
                  onClick={() => handleViewMenu(restaurant)}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-8 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                >
                  View Menu
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}





      {/* Restaurant Menu Modal */}
      {selectedRestaurant && (
        <RestaurantMenu
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default RestaurantRecommendations;