import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  name: string;
  preferences: string[];
  dietary: string[];
  location: string;
  lastOrder?: string;
  avatar?: string;
}

interface MultiUserSwitchProps {
  currentUser: UserProfile;
  onUserSwitch: (user: UserProfile) => void;
}

const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    preferences: ['Italian', 'Vegetarian', 'Healthy'],
    dietary: ['No nuts', 'Low sodium'],
    location: 'Downtown SF',
    lastOrder: 'Mediterranean Bowl from Fresh & Green'
  },
  {
    id: '2', 
    name: 'John Smith',
    preferences: ['American', 'Pizza', 'Burgers'],
    dietary: ['No dairy'],
    location: 'Mission District',
    lastOrder: 'Pepperoni Pizza from Tony\'s'
  },
  {
    id: '3',
    name: 'Emily Chen',
    preferences: ['Asian', 'Sushi', 'Vegan'],
    dietary: ['Vegan', 'Gluten-free'],
    location: 'SOMA',
    lastOrder: 'Dragon Roll from Sakura Sushi'
  }
];

const MultiUserSwitch = ({ currentUser, onUserSwitch }: MultiUserSwitchProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full justify-between bg-muted/30 hover:bg-muted/50 border-0"
        aria-label="Switch user profile"
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm font-medium">{currentUser.name}</span>
        </div>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            <Card className="p-3 w-64 bg-card/95 backdrop-blur-sm border-0 shadow-xl">
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                Switch Profile
              </h3>
              
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <motion.button
                    key={user.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onUserSwitch(user);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2 rounded-lg text-left transition-colors ${
                      currentUser.id === user.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-muted/30'
                    }`}
                    tabIndex={0}
                    aria-label={`Switch to ${user.name}'s profile`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.location}</p>
                        </div>
                      </div>
                      {currentUser.id === user.id && (
                        <UserCheck className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    
                    <div className="mt-1 flex flex-wrap gap-1">
                      {user.preferences.slice(0, 2).map((pref) => (
                        <Badge key={pref} variant="outline" className="text-xs bg-primary/5 border-primary/20">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiUserSwitch;