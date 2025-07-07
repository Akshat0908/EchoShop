import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  modifiers?: string[];
}

interface CartStatusProps {
  items: CartItem[];
}

const CartStatus = ({ items }: CartStatusProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <h3 className="font-semibold text-sm text-green-500">Cart Updated</h3>
        <Badge variant="outline" className="ml-auto text-xs bg-green-500/10 text-green-500 border-green-500/20">
          {totalItems} items
        </Badge>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {items.slice(-3).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">{item.name}</span>
                {item.quantity > 1 && (
                  <Badge variant="outline" className="text-xs">
                    x{item.quantity}
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length > 3 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
            +{items.length - 3} more items
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm font-medium">Total:</span>
          <span className="text-sm font-bold text-green-500">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Say "checkout" or "place order" when you're ready to complete your purchase.
      </div>
    </Card>
  );
};

export default CartStatus; 