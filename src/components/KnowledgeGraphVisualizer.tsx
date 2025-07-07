import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface KnowledgeGraphVisualizerProps {
  userId: string;
}

// Mock user data (replace with real data as needed)
const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'Downtown SF',
    preferences: ['Italian', 'Vegetarian', 'Healthy'],
    dietary: ['No nuts', 'Low sodium'],
    avatar: '',
  },
  {
    id: '2',
    name: 'Mike Chen',
    location: 'Mission District',
    preferences: ['Asian', 'Spicy', 'Quick'],
    dietary: [],
    avatar: '',
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    location: 'SOMA',
    preferences: ['Mexican', 'Authentic', 'Family-sized'],
    dietary: [],
    avatar: '',
  },
];

const KnowledgeGraphVisualizer = ({ userId }: KnowledgeGraphVisualizerProps) => {
  const user = mockUsers.find(u => u.id === userId) || mockUsers[0];

  return (
    <Card className="pro-card p-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <User className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
      <div className="text-sm text-muted-foreground mb-4">{user.location}</div>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {user.preferences.map((pref) => (
          <Badge key={pref} variant="outline" className="text-xs bg-primary/5 border-primary/20">
            {pref}
          </Badge>
        ))}
        {user.dietary.map((diet) => (
          <Badge key={diet} variant="secondary" className="text-xs">
            {diet}
          </Badge>
        ))}
      </div>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
        Your AI assistant uses your preferences and dietary needs to personalize recommendations and streamline your food ordering experience.
      </p>
    </Card>
  );
};

export default KnowledgeGraphVisualizer; 