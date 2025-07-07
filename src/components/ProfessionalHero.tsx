import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Play, ArrowDown } from 'lucide-react';

interface ProfessionalHeroProps {
  onStartVoiceDemo: () => void;
}

const ProfessionalHero = ({ onStartVoiceDemo }: ProfessionalHeroProps) => {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('voice-demo');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden professional-grid">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary/5 via-background to-accent/5">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-primary/20"
                  animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.02,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80 z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Enterprise Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-sm font-medium glass-effect border-primary/30"
            >
              🚀 Enterprise Voice Commerce Platform
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-7xl md:text-8xl font-bold mb-2 leading-tight bg-gradient-to-r from-blue-500 via-blue-400 to-yellow-400 bg-clip-text text-transparent"
          >
            EchoShop
          </motion.h1>

          {/* Subheading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl md:text-5xl font-semibold mb-6 text-center text-foreground"
          >
            Enterprise
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-2xl md:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionary voice-first AI platform powering the future of e-commerce.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              onClick={onStartVoiceDemo}
              className="px-8 py-4 text-lg font-semibold gradient-primary hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Mic className="w-5 h-5 mr-2" />
              Order Now
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToDemo}
              className="px-8 py-4 text-lg font-semibold glass-effect hover-lift"
            >
              <Play className="w-5 h-5 mr-2" />
              See Menu
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { label: 'Restaurants', value: '500+', desc: 'Local partners' },
              { label: 'Delivery Time', value: '25min', desc: 'Average delivery' },
              { label: 'Satisfaction', value: '4.9★', desc: 'Customer rating' }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="text-center glass-effect p-6 rounded-lg hover-lift"
              >
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={scrollToDemo}
            className="p-2 rounded-full glass-effect hover:bg-primary/20 transition-colors"
            aria-label="Scroll to demo section"
          >
            <ArrowDown className="w-6 h-6 text-primary" />
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"
      />
    </section>
  );
};

export default ProfessionalHero;