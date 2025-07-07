import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';

interface OrderSummaryProps {
  currentOrder: Array<{
    id: number;
    name: string;
    restaurant: string;
    price: number;
    quantity: number;
  }>;
}

const OrderSummary = ({ currentOrder }: OrderSummaryProps) => {
  const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 25 ? 0 : 3.99;
  const tax = subtotal * 0.08875; // NY tax rate
  const total = subtotal + deliveryFee + tax;

  const handleRemoveItem = (itemId: number) => {
    // In real implementation, this would update the order state
    console.log('Remove item:', itemId);
  };

  const handlePlaceOrder = () => {
    // In real implementation, this would process the order
    console.log('Placing order:', currentOrder);
  };

  return (
    <div className="space-y-3">
      {currentOrder.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Your Order</span>
          </div>
          <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
            {currentOrder.length} item{currentOrder.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {currentOrder.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-foreground">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-1">
                    from {item.restaurant}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-primary/10 border-primary/20">
                      Qty: {item.quantity}
                    </Badge>
                    <span className="text-sm font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleRemoveItem(item.id)}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {currentOrder.length === 0 && (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCartIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your cart is empty
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use voice commands to add items
            </p>
          </div>
        )}
      </div>

      {currentOrder.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 pt-3 border-t border-border/30"
        >
          {/* Order Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Delivery Fee
                {deliveryFee === 0 && (
                  <Badge variant="outline" className="ml-2 text-xs bg-green-500/10 border-green-500/20 text-green-500">
                    FREE
                  </Badge>
                )}
              </span>
              <span className="text-foreground">${deliveryFee.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-border/30 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Free delivery message */}
          {deliveryFee > 0 && (
            <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded">
              Add ${(25 - subtotal).toFixed(2)} more for free delivery
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handlePlaceOrder}
              className="w-full bg-primary hover:bg-primary/90"
              size="sm"
            >
              Place Order • ${total.toFixed(2)}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-primary/30 hover:bg-primary/10"
            >
              Add More Items
            </Button>
          </div>

          {/* Estimated delivery */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Estimated delivery: 25-35 minutes
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderSummary;