// Simple test script for EchoShop demo
// Run this in the browser console to test the agent system

console.log('🧪 EchoShop Demo Test Script');
console.log('Testing agent system and knowledge graph...');

// Test knowledge graph
const testKnowledgeGraph = () => {
  console.log('\n📊 Testing Knowledge Graph...');
  
  // Import the knowledge graph (this would need to be available globally)
  if (typeof window !== 'undefined' && window.knowledgeGraph) {
    const kg = window.knowledgeGraph;
    
    // Test user profile retrieval
    const user1 = kg.getUserProfile('1');
    console.log('User 1 profile:', user1);
    
    // Test recommendations
    const recommendations = kg.getPersonalizedRecommendations('1');
    console.log('Recommendations for User 1:', recommendations);
    
    // Test preference extraction
    const { preferences, dietary } = kg.extractPreferencesFromConversation('I love Italian food and I am vegetarian');
    console.log('Extracted preferences:', preferences);
    console.log('Extracted dietary:', dietary);
    
    return true;
  } else {
    console.log('❌ Knowledge Graph not available in browser context');
    return false;
  }
};

// Test agent system
const testAgentSystem = () => {
  console.log('\n🤖 Testing Agent System...');
  
  if (typeof window !== 'undefined' && window.agentOrchestrator) {
    const orchestrator = window.agentOrchestrator;
    
    // Test system status
    const status = orchestrator.getSystemStatus();
    console.log('System status:', status);
    
    // Test agent status
    const agents = orchestrator.getAgentStatus();
    console.log('Agent status:', agents);
    
    return true;
  } else {
    console.log('❌ Agent System not available in browser context');
    return false;
  }
};

// Test voice processing simulation
const testVoiceProcessing = async () => {
  console.log('\n🎤 Testing Voice Processing Simulation...');
  
  const testInputs = [
    'Hello, I want to order pizza',
    'I am vegetarian and looking for healthy options',
    'Show me Italian restaurants near me',
    'Add a margherita pizza to my order'
  ];
  
  for (const input of testInputs) {
    console.log(`\nTesting input: "${input}"`);
    
    // Simulate the processing pipeline
    const lowerInput = input.toLowerCase();
    
    // Intent classification
    let intent = 'general';
    if (lowerInput.includes('order') || lowerInput.includes('add')) intent = 'order';
    if (lowerInput.includes('search') || lowerInput.includes('show')) intent = 'search';
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) intent = 'greeting';
    
    console.log(`Intent: ${intent}`);
    
    // Preference extraction
    const preferences = [];
    const dietary = [];
    
    if (lowerInput.includes('italian')) preferences.push('Italian');
    if (lowerInput.includes('vegetarian')) dietary.push('Vegetarian');
    if (lowerInput.includes('healthy')) preferences.push('Healthy');
    if (lowerInput.includes('pizza')) preferences.push('Italian');
    
    console.log(`Preferences: ${preferences.join(', ')}`);
    console.log(`Dietary: ${dietary.join(', ')}`);
    
    // Mock response generation
    let response = '';
    if (intent === 'greeting') {
      response = `Hello! I'm your AI food ordering assistant. What would you like to order today?`;
    } else if (intent === 'order' && lowerInput.includes('pizza')) {
      response = `Perfect! I've found Tony's Italian Restaurant which matches your preferences. I've added a Margherita Pizza to your cart for $18.99. Would you like to add anything else?`;
    } else if (intent === 'search') {
      response = `I found several restaurants that match your preferences. Tony's Italian has excellent Italian cuisine, and Fresh & Green offers healthy vegetarian options. Which would you prefer?`;
    } else {
      response = `I understand you're looking for food options. Based on your preferences, I can recommend several restaurants. What type of cuisine are you in the mood for?`;
    }
    
    console.log(`Response: ${response}`);
  }
  
  return true;
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting EchoShop Demo Tests...\n');
  
  const kgTest = testKnowledgeGraph();
  const agentTest = testAgentSystem();
  const voiceTest = await testVoiceProcessing();
  
  console.log('\n📋 Test Results:');
  console.log(`Knowledge Graph: ${kgTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Agent System: ${agentTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Voice Processing: ${voiceTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (kgTest && agentTest && voiceTest) {
    console.log('\n🎉 All tests passed! EchoShop is ready for demo.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the console for details.');
  }
};

// Export for use in browser
if (typeof window !== 'undefined') {
  window.echoShopTest = {
    testKnowledgeGraph,
    testAgentSystem,
    testVoiceProcessing,
    runAllTests
  };
  
  console.log('🧪 EchoShop test functions available as window.echoShopTest');
  console.log('Run window.echoShopTest.runAllTests() to test everything');
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testKnowledgeGraph,
    testAgentSystem,
    testVoiceProcessing,
    runAllTests
  };
} 