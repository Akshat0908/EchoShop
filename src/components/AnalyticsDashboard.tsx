import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Zap, 
  Clock, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  MessageSquare,
  Activity,
  Play,
  Pause
} from 'lucide-react';

interface AnalyticsData {
  totalInteractions: number;
  successfulOrders: number;
  averageResponseTime: number;
  groqApiCalls: number;
  voiceCommands: number;
  userSatisfaction: number;
  activeUsers: number;
  revenue: number;
}

interface AnalyticsDashboardProps {
  isActive: boolean;
  onToggle: () => void;
}

const AnalyticsDashboard = ({ isActive, onToggle }: AnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalInteractions: 0,
    successfulOrders: 0,
    averageResponseTime: 0,
    groqApiCalls: 0,
    voiceCommands: 0,
    userSatisfaction: 0,
    activeUsers: 0,
    revenue: 0
  });

  const [isLive, setIsLive] = useState(false);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setAnalytics(prev => ({
        totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 3) + 1,
        successfulOrders: prev.successfulOrders + Math.floor(Math.random() * 2),
        averageResponseTime: Math.max(200, prev.averageResponseTime + (Math.random() - 0.5) * 50),
        groqApiCalls: prev.groqApiCalls + Math.floor(Math.random() * 5) + 2,
        voiceCommands: prev.voiceCommands + Math.floor(Math.random() * 4) + 1,
        userSatisfaction: Math.min(100, Math.max(85, prev.userSatisfaction + (Math.random() - 0.5) * 5)),
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 3) - 1),
        revenue: prev.revenue + Math.floor(Math.random() * 25) + 10
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getMetricColor = (value: number, threshold: number) => {
    if (value >= threshold * 0.9) return 'text-green-500';
    if (value >= threshold * 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'totalInteractions': return <MessageSquare className="w-4 h-4" />;
      case 'successfulOrders': return <ShoppingCart className="w-4 h-4" />;
      case 'averageResponseTime': return <Clock className="w-4 h-4" />;
      case 'groqApiCalls': return <Zap className="w-4 h-4" />;
      case 'voiceCommands': return <Activity className="w-4 h-4" />;
      case 'userSatisfaction': return <TrendingUp className="w-4 h-4" />;
      case 'activeUsers': return <Users className="w-4 h-4" />;
      case 'revenue': return <BarChart3 className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatMetric = (metric: string, value: number) => {
    switch (metric) {
      case 'averageResponseTime':
        return `${value.toFixed(0)}ms`;
      case 'userSatisfaction':
        return `${value.toFixed(1)}%`;
      case 'revenue':
        return `$${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  const metrics = [
    { key: 'totalInteractions', label: 'Total Interactions', threshold: 100 },
    { key: 'successfulOrders', label: 'Successful Orders', threshold: 50 },
    { key: 'averageResponseTime', label: 'Avg Response Time', threshold: 500 },
    { key: 'groqApiCalls', label: 'Groq API Calls', threshold: 200 },
    { key: 'voiceCommands', label: 'Voice Commands', threshold: 80 },
    { key: 'userSatisfaction', label: 'User Satisfaction', threshold: 90 },
    { key: 'activeUsers', label: 'Active Users', threshold: 10 },
    { key: 'revenue', label: 'Revenue', threshold: 1000 }
  ];

  if (!isActive) return null;

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Real-Time Analytics</h3>
            <p className="text-sm text-muted-foreground">Live performance metrics and insights</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {timeRange}
            </Badge>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isLive ? 'Live' : 'Demo'}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
            className="text-xs"
          >
            Hide
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 mb-6">
        {(['1h', '24h', '7d'] as const).map((range) => (
          <Button
            key={range}
            size="sm"
            variant={timeRange === range ? "default" : "outline"}
            onClick={() => setTimeRange(range)}
            className="text-xs"
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div
            key={metric.key}
            className="p-4 bg-gradient-to-br from-card/50 to-card/30 rounded-lg border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              {getMetricIcon(metric.key)}
              <span className="text-xs font-medium text-muted-foreground">
                {metric.label}
              </span>
            </div>
            
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${getMetricColor(analytics[metric.key as keyof AnalyticsData], metric.threshold)}`}>
                {formatMetric(metric.key, analytics[metric.key as keyof AnalyticsData])}
              </span>
            </div>
            
            <div className="mt-2">
              <div className="w-full bg-muted/30 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (analytics[metric.key as keyof AnalyticsData] / metric.threshold) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Groq Performance */}
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-blue-500" />
            <h4 className="font-semibold text-sm text-blue-500">Groq API Performance</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Response Time</span>
              <span className="font-mono text-green-500">{analytics.averageResponseTime.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">API Calls</span>
              <span className="font-mono text-blue-500">{analytics.groqApiCalls}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-mono text-green-500">99.8%</span>
            </div>
          </div>
        </Card>

        {/* Voice Analytics */}
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-green-500" />
            <h4 className="font-semibold text-sm text-green-500">Voice Analytics</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Voice Commands</span>
              <span className="font-mono text-green-500">{analytics.voiceCommands}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-mono text-green-500">96.2%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg Duration</span>
              <span className="font-mono text-blue-500">2.3s</span>
            </div>
          </div>
        </Card>

        {/* Business Metrics */}
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <h4 className="font-semibold text-sm text-purple-500">Business Impact</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Orders</span>
              <span className="font-mono text-purple-500">{analytics.successfulOrders}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Revenue</span>
              <span className="font-mono text-green-500">${analytics.revenue}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Satisfaction</span>
              <span className="font-mono text-green-500">{analytics.userSatisfaction.toFixed(1)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <h4 className="font-semibold text-sm mb-3">Live Activity</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">
                {i === 0 ? 'User ordered Margherita Pizza' :
                 i === 1 ? 'Voice command processed in 245ms' :
                 i === 2 ? 'Groq API call completed successfully' :
                 i === 3 ? 'User preference updated in knowledge graph' :
                 'New voice interaction started'}
              </span>
              <span className="text-muted-foreground ml-auto">
                {i === 0 ? '2s ago' : i === 1 ? '5s ago' : i === 2 ? '8s ago' : i === 3 ? '12s ago' : '15s ago'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AnalyticsDashboard; 