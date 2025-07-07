import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SystemStatus = () => {
  const [status] = useState({
    ordersToday: 127,
    activeDeliveries: 8,
    avgDeliveryTime: 25,
    restaurants: [
      { name: "Tony's Italian Kitchen", status: 'Open', orders: 12, rating: 4.8 },
      { name: "Green Garden Café", status: 'Open', orders: 8, rating: 4.6 },
      { name: "Spice Route", status: 'Busy', orders: 15, rating: 4.7 },
      { name: "Fresh Sushi Co", status: 'Open', orders: 6, rating: 4.9 }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-green-400';
      case 'Busy': return 'text-orange-400';
      case 'Closed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-green-400/20';
      case 'Busy': return 'bg-orange-400/20';
      case 'Closed': return 'bg-red-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Daily Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="text-sm font-bold text-primary">{status.ordersToday}</div>
          <div className="text-xs text-muted-foreground">Orders Today</div>
        </div>
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="text-sm font-bold text-accent">{status.activeDeliveries}</div>
          <div className="text-xs text-muted-foreground">Active</div>
        </div>
        <div className="text-center p-2 bg-muted/30 rounded-lg">
          <div className="text-sm font-bold text-primary">{status.avgDeliveryTime}min</div>
          <div className="text-xs text-muted-foreground">Avg Time</div>
        </div>
      </div>



      {/* Restaurant Status */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Restaurant Status</h4>
        {status.restaurants.slice(0, 3).map((restaurant, index) => (
          <motion.div
            key={restaurant.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusBg(restaurant.status)}`}>
                <div className={`w-full h-full rounded-full ${restaurant.status === 'Open' ? 'animate-pulse' : ''}`} />
              </div>
              <span className="text-xs font-medium text-foreground truncate">{restaurant.name}</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs px-1 py-0 ${getStatusColor(restaurant.status)} border-current`}
            >
              {restaurant.status}
            </Badge>
          </motion.div>
        ))}
      </div>

      {/* Order Flow */}
      <div className="p-2 bg-primary/5 rounded-lg">
        <h4 className="text-xs font-medium text-primary mb-2">Order Flow</h4>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Voice</span>
          <span>→</span>
          <span>Kitchen</span>
          <span>→</span>
          <span>Delivery</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;