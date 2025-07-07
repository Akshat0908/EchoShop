import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

interface PerformanceMetrics {
  processingTime: number;
  tokensUsed: number;
  confidence: number;
  apiLatency: number;
  audioLatency: number;
  totalLatency: number;
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
  isActive: boolean;
}

const PerformanceMonitor = ({ metrics, isActive }: PerformanceMonitorProps) => {
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);
  const [averageMetrics, setAverageMetrics] = useState<PerformanceMetrics>({
    processingTime: 0,
    tokensUsed: 0,
    confidence: 0,
    apiLatency: 0,
    audioLatency: 0,
    totalLatency: 0
  });

  // Update history when new metrics arrive
  useEffect(() => {
    if (metrics.processingTime > 0) {
      setHistory(prev => {
        const newHistory = [...prev, metrics].slice(-10); // Keep last 10 measurements
        return newHistory;
      });
    }
  }, [metrics]);

  // Calculate averages
  useEffect(() => {
    if (history.length > 0) {
      const avg = history.reduce((acc, curr) => ({
        processingTime: acc.processingTime + curr.processingTime,
        tokensUsed: acc.tokensUsed + curr.tokensUsed,
        confidence: acc.confidence + curr.confidence,
        apiLatency: acc.apiLatency + curr.apiLatency,
        audioLatency: acc.audioLatency + curr.audioLatency,
        totalLatency: acc.totalLatency + curr.totalLatency
      }), {
        processingTime: 0,
        tokensUsed: 0,
        confidence: 0,
        apiLatency: 0,
        audioLatency: 0,
        totalLatency: 0
      });

      setAverageMetrics({
        processingTime: avg.processingTime / history.length,
        tokensUsed: Math.round(avg.tokensUsed / history.length),
        confidence: avg.confidence / history.length,
        apiLatency: avg.apiLatency / history.length,
        audioLatency: avg.audioLatency / history.length,
        totalLatency: avg.totalLatency / history.length
      });
    }
  }, [history]);

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value <= threshold * 0.7) return 'text-green-500';
    if (value <= threshold) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceBadge = (value: number, threshold: number) => {
    if (value <= threshold * 0.7) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (value <= threshold) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  if (!isActive) return null;

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-primary">Performance Monitor</h3>
        <Badge variant="outline" className="ml-auto text-xs">
          {history.length} samples
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Current Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Current</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">Processing</span>
              </div>
              <span className={`text-xs font-mono ${getPerformanceColor(metrics.processingTime, 1000)}`}>
                {metrics.processingTime.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">API Latency</span>
              </div>
              <span className={`text-xs font-mono ${getPerformanceColor(metrics.apiLatency, 500)}`}>
                {metrics.apiLatency.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-muted-foreground">Confidence</span>
              </div>
              <span className="text-xs font-mono text-blue-500">
                {(metrics.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Average Metrics */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Average</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Processing</span>
              <span className={`text-xs font-mono ${getPerformanceColor(averageMetrics.processingTime, 1000)}`}>
                {averageMetrics.processingTime.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">API Latency</span>
              <span className={`text-xs font-mono ${getPerformanceColor(averageMetrics.apiLatency, 500)}`}>
                {averageMetrics.apiLatency.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <span className="text-xs font-mono text-blue-500">
                {(averageMetrics.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Performance Status</span>
          <div className="flex gap-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${getPerformanceBadge(metrics.processingTime, 1000)}`}
            >
              {metrics.processingTime <= 700 ? 'Fast' : metrics.processingTime <= 1000 ? 'Good' : 'Slow'}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${getPerformanceBadge(metrics.confidence, 0.8)}`}
            >
              {metrics.confidence >= 0.9 ? 'High' : metrics.confidence >= 0.8 ? 'Good' : 'Low'} Acc
            </Badge>
          </div>
        </div>
      </div>

      {/* Real-time Chart */}
      {history.length > 1 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Response Time Trend</span>
          </div>
          <div className="flex items-end justify-between h-12 gap-1">
            {history.slice(-8).map((metric, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-primary/20 to-primary/5 rounded-sm transition-all duration-300"
                style={{ 
                  height: `${Math.max(4, (metric.processingTime / 1000) * 48)}px`,
                  opacity: index === history.length - 1 ? 1 : 0.6
                }}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default PerformanceMonitor; 