import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Star, User, ShoppingCart, Activity, Network, BarChart3 } from 'lucide-react';
import VoiceInterface from '@/components/VoiceInterface';
import RestaurantRecommendations from '@/components/RestaurantRecommendations';
import OrderSummary from '@/components/OrderSummary';
import SystemStatus from '@/components/SystemStatus';
import ProfessionalHero from '@/components/ProfessionalHero';
import MultiUserSwitch from '@/components/MultiUserSwitch';
import ProactiveAssistant from '@/components/ProactiveAssistant';
import AgentActivityIndicator from '@/components/AgentActivityIndicator';
import KnowledgeGraphVisualizer from '@/components/KnowledgeGraphVisualizer';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    processingTime: 0,
    tokensUsed: 0,
    confidence: 0,
    apiLatency: 0,
    audioLatency: 0,
    totalLatency: 0
  });
  
  const [userProfile, setUserProfile] = useState({
    id: '1',
    name: 'Sarah Johnson',
    preferences: ['Italian', 'Vegetarian', 'Healthy'],
    dietary: ['No nuts', 'Low sodium'],
    location: 'Downtown SF',
    lastOrder: 'Mediterranean Bowl from Fresh & Green'
  });

  const handleUserSwitch = (newUser: any) => {
    setUserProfile(newUser);
  };

  const handleProactiveSuggestion = (suggestion: any) => {
    setCurrentOrder([...currentOrder, suggestion]);
  };

  const handleAddToCart = (item: any, quantity: number) => {
    const cartItem = {
      ...item,
      quantity,
      total: item.price * quantity,
      id: `${item.id}_${Date.now()}`
    };
    setCurrentOrder([...currentOrder, cartItem]);
  };

  const startVoiceDemo = () => {
    setIsListening(true);
    setActiveAgents(['voice-input', 'intent-router']);
  };

  // Update performance metrics when voice interface provides them
  const handlePerformanceUpdate = (metrics: any) => {
    setPerformanceMetrics(metrics);
  };

  return (
    <div className="min-h-screen scroll-smooth bg-background">
      <Navbar />
      {/* Professional Hero Section */}
      <ProfessionalHero onStartVoiceDemo={startVoiceDemo} />
      
      {/* Multi-Agent Activity Indicator */}
      <AgentActivityIndicator activeAgents={activeAgents} />
      
      {/* Proactive Assistant */}
      <ProactiveAssistant 
        userProfile={userProfile} 
        onSuggestionAccept={handleProactiveSuggestion} 
      />

      {/* Performance Toggle Buttons */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <Button
          size="sm"
          variant={showAnalytics ? "default" : "outline"}
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="text-xs"
        >
          <BarChart3 className="w-3 h-3 mr-1" />
          Analytics
        </Button>
        <Button
          size="sm"
          variant={showPerformance ? "default" : "outline"}
          onClick={() => setShowPerformance(!showPerformance)}
          className="text-xs"
        >
          <Activity className="w-3 h-3 mr-1" />
          Performance
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <div className="fixed top-24 right-4 z-40 w-96">
        <AnalyticsDashboard 
          isActive={showAnalytics} 
          onToggle={() => setShowAnalytics(false)} 
        />
      </div>

      {/* Performance Monitor */}
      <div className="fixed top-24 right-4 z-40 w-80">
        <PerformanceMonitor 
          metrics={performanceMetrics}
          isActive={showPerformance}
        />
      </div>

      {/* Trusted by Section */}
      <section className="py-8 bg-gradient-to-b from-background/80 to-background/95 border-b border-border/30">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Trusted by teams at</div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <span className="text-2xl font-bold text-primary">Slack</span>
            <span className="text-2xl font-bold text-accent">Intercom</span>
            <span className="text-2xl font-bold text-blue-400">HubSpot</span>
            <span className="text-2xl font-bold text-yellow-400">Monday.com</span>
            <span className="text-2xl font-bold text-green-500">Pipedrive</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">Features</h2>
          <p className="text-lg text-muted-foreground text-center mb-12">Everything you need for enterprise-grade, voice-first commerce.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center">
              <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary text-3xl">🎤</span>
              <h3 className="text-xl font-semibold mb-2">Voice-First Ordering</h3>
              <p className="text-muted-foreground">Order, search, and manage with natural language. No clicks required.</p>
            </div>
            {/* Feature Card 2 */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center">
              <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-accent/10 text-accent text-3xl">🤖</span>
              <h3 className="text-xl font-semibold mb-2">AI Multi-Agent System</h3>
              <p className="text-muted-foreground">Intelligent agents collaborate to handle discovery, recommendations, and fulfillment.</p>
            </div>
            {/* Feature Card 3 */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center">
              <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-500 text-3xl">⚡</span>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast API</h3>
              <p className="text-muted-foreground">Powered by Groq and Llama 3 for instant, context-aware responses.</p>
            </div>
            {/* Feature Card 4 */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center">
              <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-green-500/10 text-green-500 text-3xl">🔒</span>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">End-to-end encryption, SSO, and compliance for peace of mind.</p>
            </div>
            {/* Feature Card 5 */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center">
              <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400 text-3xl">📊</span>
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-muted-foreground">Real-time dashboards and reporting to optimize your business.</p>
            </div>
            {/* Feature Card 6 */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center">
              <span className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-purple-500/10 text-purple-500 text-3xl">🌐</span>
              <h3 className="text-xl font-semibold mb-2">Integrations</h3>
              <p className="text-muted-foreground">Connect with your favorite tools: Slack, HubSpot, Salesforce, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-background/95 to-background/90 border-b border-border/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">Pricing</h2>
          <p className="text-lg text-muted-foreground text-center mb-12">Simple, transparent pricing for teams of all sizes.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center border-2 border-primary/10">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-extrabold mb-2">$29</div>
              <div className="text-sm text-muted-foreground mb-4">per month</div>
              <ul className="mb-6 space-y-2 text-muted-foreground text-left">
                <li>✔️ Voice ordering</li>
                <li>✔️ AI recommendations</li>
                <li>✔️ Basic analytics</li>
                <li>✔️ Email support</li>
              </ul>
              <button className="w-full py-2 px-4 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">Get Started</button>
            </div>
            {/* Pro Plan */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center border-2 border-primary">
              <h3 className="text-2xl font-bold mb-2 text-primary">Pro</h3>
              <div className="text-4xl font-extrabold mb-2 text-primary">$79</div>
              <div className="text-sm text-muted-foreground mb-4">per month</div>
              <ul className="mb-6 space-y-2 text-muted-foreground text-left">
                <li>✔️ Everything in Starter</li>
                <li>✔️ Multi-agent orchestration</li>
                <li>✔️ Advanced analytics</li>
                <li>✔️ Integrations (Slack, HubSpot, etc.)</li>
                <li>✔️ Priority support</li>
              </ul>
              <button className="w-full py-2 px-4 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">Start Free Trial</button>
            </div>
            {/* Enterprise Plan */}
            <div className="pro-card pro-card-hover p-8 flex flex-col items-center text-center border-2 border-primary/10">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-extrabold mb-2">Custom</div>
              <div className="text-sm text-muted-foreground mb-4">Contact us</div>
              <ul className="mb-6 space-y-2 text-muted-foreground text-left">
                <li>✔️ Everything in Pro</li>
                <li>✔️ Enterprise security & SSO</li>
                <li>✔️ Dedicated account manager</li>
                <li>✔️ Custom integrations</li>
                <li>✔️ 24/7 support</li>
              </ul>
              <button className="w-full py-2 px-4 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Demo Section */}
      <section id="voice-demo" className="relative py-20 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Professional Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Live Demo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Voice-Powered Food Ordering
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of conversational commerce with AI-powered personalization
            </p>
          </motion.div>

          {/* Main Interface Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column - Voice Interface & User Info */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* Voice Interface Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Voice Assistant</h3>
                      <p className="text-sm text-muted-foreground">Speak naturally to order food</p>
                    </div>
                  </div>
                              <VoiceInterface
              isListening={isListening}
              setIsListening={setIsListening}
              onOrderUpdate={setCurrentOrder}
              onPerformanceUpdate={handlePerformanceUpdate}
              userProfile={userProfile}
            />
                </Card>
              </motion.div>

              {/* Restaurant Recommendations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Recommended for You</h3>
                      <p className="text-sm text-muted-foreground">Personalized restaurant suggestions</p>
                    </div>
                  </div>
                  <RestaurantRecommendations 
                    userProfile={userProfile} 
                    onAddToCart={handleAddToCart}
                  />
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Order & System Info */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* User Profile Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Your Profile</h3>
                      <p className="text-sm text-muted-foreground">Personalized experience</p>
                    </div>
                  </div>
                  <MultiUserSwitch 
                    currentUser={userProfile} 
                    onUserSwitch={handleUserSwitch} 
                  />
                </Card>
              </motion.div>

              {/* Order Summary */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Your Order</h3>
                      <p className="text-sm text-muted-foreground">Current cart items</p>
                    </div>
                  </div>
                  <OrderSummary currentOrder={currentOrder} />
                </Card>
              </motion.div>

              {/* System Status */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">System Status</h3>
                      <p className="text-sm text-muted-foreground">AI agent activity</p>
                    </div>
                  </div>
                  <SystemStatus />
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Knowledge Graph Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                  <Network className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Knowledge Graph</h3>
                  <p className="text-sm text-muted-foreground">Your preferences and relationships</p>
                </div>
              </div>
              <KnowledgeGraphVisualizer userId={userProfile.id} />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Status Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96"
      >
        <Card className="p-4 glass-effect border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-accent animate-voice-pulse' : 'bg-muted'}`} />
              <span className="text-sm text-muted-foreground">
                {isListening ? 'Listening...' : 'Ready to help'}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <span>Groq</span>
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <span>AI</span>
            </div>
          </div>
        </Card>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Index;