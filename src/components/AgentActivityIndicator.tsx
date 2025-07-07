import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Search, 
  User, 
  ShoppingCart, 
  Star, 
  MessageSquare,
  Zap,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { agentOrchestrator } from '@/services/agentSystem';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'processing' | 'complete';
  icon: any;
  description: string;
  lastAction?: string;
  processingTime?: number;
}

interface AgentActivityIndicatorProps {
  activeAgents: string[];
  onAgentClick?: (agentId: string) => void;
}

const allAgents: Agent[] = [
  {
    id: 'voice-input',
    name: 'Voice Input',
    status: 'idle',
    icon: Mic,
    description: 'Speech-to-Text Processing',
    lastAction: 'Listening for commands'
  },
  {
    id: 'intent-router',
    name: 'Intent Router',
    status: 'idle',
    icon: Zap,
    description: 'Understanding Intent',
    lastAction: 'Analyzing user request'
  },
  {
    id: 'profile-manager',
    name: 'Profile Manager',
    status: 'idle',
    icon: User,
    description: 'Managing User Profile',
    lastAction: 'Updating preferences'
  },
  {
    id: 'discovery',
    name: 'Discovery',
    status: 'idle',
    icon: Search,
    description: 'Finding Restaurants & Food',
    lastAction: 'Searching local restaurants'
  },
  {
    id: 'ordering',
    name: 'Ordering',
    status: 'idle',
    icon: ShoppingCart,
    description: 'Managing Orders',
    lastAction: 'Processing checkout'
  },
  {
    id: 'recommendation',
    name: 'Recommendation',
    status: 'idle',
    icon: Star,
    description: 'Personalized Suggestions',
    lastAction: 'Generating recommendations'
  },
  {
    id: 'response-gen',
    name: 'Response Gen',
    status: 'idle',
    icon: MessageSquare,
    description: 'Natural Language Response',
    lastAction: 'Crafting response'
  }
];

const AgentActivityIndicator = ({ activeAgents, onAgentClick }: AgentActivityIndicatorProps) => {
  const [agents, setAgents] = useState<Agent[]>(allAgents);
  const [isMinimized, setIsMinimized] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  useEffect(() => {
    const updateStatus = () => {
      const status = agentOrchestrator.getSystemStatus();
      const agentStatus = agentOrchestrator.getAgentStatus();
      
      setSystemStatus(status);
      
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          const agentData = agentStatus.find(a => a.id === agent.id);
          const isActive = activeAgents.includes(agent.id) || agentData?.currentTask;
          
          return {
            ...agent,
            status: isActive ? 'active' : 'idle',
            processingTime: isActive ? Date.now() : undefined,
            lastAction: agentData?.currentTask ? `Processing: ${agentData.currentTask}` : agent.lastAction
          };
        })
      );
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [activeAgents]);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-primary text-primary-foreground';
      case 'processing': return 'bg-accent text-accent-foreground';
      case 'complete': return 'bg-success text-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusAnimation = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'animate-agent-pulse';
      case 'processing': return 'animate-pulse';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 z-40"
    >
      <Card className="glass-effect card-shadow overflow-hidden">
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Multi-Agent System</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge variant="secondary" className="text-xs">
              {systemStatus ? `${systemStatus.activeAgents}/${agents.length}` : `${activeAgents.length} active`}
            </Badge>
            <motion.div
              animate={{ rotate: isMinimized ? 180 : 0 }}
              className="w-4 h-4 text-muted-foreground"
            >
              ▼
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border"
            >
              <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors agent-indicator ${
                      agent.status === 'active' ? 'active' : ''
                    } ${
                      agent.status !== 'idle' ? 'bg-primary/10' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => onAgentClick?.(agent.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${agent.name} agent - ${agent.status}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(agent.status)} ${getStatusAnimation(agent.status)}`}>
                      <agent.icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{agent.name}</p>
                        <Badge 
                          variant={agent.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs ml-2"
                        >
                          {agent.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {agent.lastAction}
                      </p>
                    </div>

                    {agent.status === 'active' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full"
                      />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="px-3 pb-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Powered by Groq & Llama</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span>Connected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default AgentActivityIndicator;