// Multi-Agent System with Coral Protocol-inspired Communication
// Implements agent orchestration and task coordination for EchoShop

import { knowledgeGraph, UserProfile } from './knowledgeGraph';
import { echoShopAgent } from './groqService';

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: 'TASK_REQUEST' | 'TASK_RESPONSE' | 'DATA_UPDATE' | 'STATUS_UPDATE' | 'ERROR';
  payload: any;
  timestamp: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AgentTask {
  id: string;
  type: 'VOICE_INPUT' | 'INTENT_CLASSIFICATION' | 'PROFILE_UPDATE' | 'RESTAURANT_SEARCH' | 'ORDER_PROCESSING' | 'RECOMMENDATION_GENERATION' | 'RESPONSE_GENERATION';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  input: any;
  output?: any;
  createdAt: Date;
  completedAt?: Date;
  assignedAgent?: string;
}

export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  isActive: boolean;
  currentTask?: string;
  messageQueue: AgentMessage[];
}

export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private messageBus: AgentMessage[] = [];
  private taskQueue: AgentTask[] = [];
  private activeTasks: Map<string, AgentTask> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    const agentDefinitions = [
      {
        id: 'voice-input',
        name: 'Voice Input Agent',
        capabilities: ['speech_recognition', 'audio_processing', 'voice_activity_detection']
      },
      {
        id: 'intent-router',
        name: 'Intent Router Agent',
        capabilities: ['intent_classification', 'request_routing', 'context_analysis']
      },
      {
        id: 'profile-manager',
        name: 'Profile Management Agent',
        capabilities: ['profile_update', 'preference_extraction', 'knowledge_graph_management']
      },
      {
        id: 'discovery',
        name: 'Discovery Agent',
        capabilities: ['restaurant_search', 'menu_analysis', 'filtering']
      },
      {
        id: 'ordering',
        name: 'Ordering Agent',
        capabilities: ['cart_management', 'order_processing', 'payment_handling']
      },
      {
        id: 'recommendation',
        name: 'Recommendation Agent',
        capabilities: ['personalized_suggestions', 'trend_analysis', 'collaborative_filtering']
      },
      {
        id: 'response-generator',
        name: 'Response Generation Agent',
        capabilities: ['natural_language_generation', 'text_to_speech', 'conversation_management']
      }
    ];

    agentDefinitions.forEach(def => {
      this.agents.set(def.id, {
        ...def,
        isActive: true,
        messageQueue: []
      });
    });
  }

  // Send message between agents
  sendMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): void {
    const fullMessage: AgentMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.messageBus.push(fullMessage);
    
    // Route message to target agent
    const targetAgent = this.agents.get(message.to);
    if (targetAgent) {
      targetAgent.messageQueue.push(fullMessage);
    }
  }

  // Create and assign a task
  async createTask(taskType: AgentTask['type'], input: any, priority: AgentMessage['priority'] = 'MEDIUM'): Promise<string> {
    const task: AgentTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: taskType,
      status: 'PENDING',
      input,
      createdAt: new Date()
    };

    this.taskQueue.push(task);
    this.activeTasks.set(task.id, task);

    // Find appropriate agent and assign task
    const assignedAgent = this.findBestAgentForTask(taskType);
    if (assignedAgent) {
      await this.assignTaskToAgent(task.id, assignedAgent);
    }

    return task.id;
  }

  // Find the best agent for a given task type
  private findBestAgentForTask(taskType: AgentTask['type']): string | null {
    const agentCapabilityMap: Record<AgentTask['type'], string[]> = {
      'VOICE_INPUT': ['voice-input'],
      'INTENT_CLASSIFICATION': ['intent-router'],
      'PROFILE_UPDATE': ['profile-manager'],
      'RESTAURANT_SEARCH': ['discovery'],
      'ORDER_PROCESSING': ['ordering'],
      'RECOMMENDATION_GENERATION': ['recommendation'],
      'RESPONSE_GENERATION': ['response-generator']
    };

    const capableAgents = agentCapabilityMap[taskType] || [];
    const availableAgents = capableAgents.filter(agentId => {
      const agent = this.agents.get(agentId);
      return agent && agent.isActive && !agent.currentTask;
    });

    return availableAgents[0] || null;
  }

  // Assign task to specific agent
  private async assignTaskToAgent(taskId: string, agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    const task = this.activeTasks.get(taskId);
    
    if (agent && task) {
      agent.currentTask = taskId;
      task.assignedAgent = agentId;
      task.status = 'IN_PROGRESS';

      // Send task assignment message
      this.sendMessage({
        from: 'orchestrator',
        to: agentId,
        type: 'TASK_REQUEST',
        payload: { taskId, taskType: task.type, input: task.input },
        priority: 'HIGH'
      });

      // Execute the task immediately
      await this.executeAgentTask(agentId, taskId);
    }
  }

  // Process voice input through the agent pipeline
  async processVoiceInput(audioInput: string, userProfile: UserProfile): Promise<string> {
    try {
      // Check for stop commands first
      const lowerInput = audioInput.toLowerCase().trim();
      if (lowerInput === 'stop' || lowerInput === 'ok stop' || lowerInput === 'stop listening' || 
          lowerInput === 'quit' || lowerInput === 'exit' || lowerInput === 'end') {
        console.log('Stop command detected in agent system');
        return 'Voice interface stopped. Click the microphone button to start again.';
      }

      // Simplified direct processing for demo
      console.log('Processing voice input:', audioInput);
      
      // Step 1: Intent Classification
      const intent = await this.handleIntentClassification({ userInput: audioInput });
      console.log('Intent classified:', intent);
      
      // Step 2: Profile Update
      const profileUpdate = await this.handleProfileUpdate({ userInput: audioInput, userProfile });
      console.log('Profile updated:', profileUpdate);
      
      // Step 3: Restaurant Search (if searching)
      let searchResults = null;
      if (audioInput.toLowerCase().includes('search') || audioInput.toLowerCase().includes('find') || 
          audioInput.toLowerCase().includes('pizza') || audioInput.toLowerCase().includes('restaurant')) {
        searchResults = await this.handleRestaurantSearch({ userProfile });
        console.log('Search results:', searchResults);
      }
      
      // Step 4: Order Processing (if ordering)
      let orderResult = null;
      if (audioInput.toLowerCase().includes('order') || audioInput.toLowerCase().includes('add') || 
          audioInput.toLowerCase().includes('pizza')) {
        orderResult = await this.handleOrderProcessing({ 
          userInput: audioInput, 
          userProfile,
          searchResults 
        });
        console.log('Order result:', orderResult);
      }
      
      // Step 5: Recommendation Generation
      const recommendations = await this.handleRecommendationGeneration({ userProfile });
      console.log('Recommendations:', recommendations);
      
      // Step 6: Response Generation
      const response = await this.handleResponseGeneration({
        userInput: audioInput,
        userProfile,
        searchResults,
        orderResult,
        recommendations
      });
      
      console.log('Final response:', response);
      return response.response || 'I apologize, but I could not process your request. Please try again.';
      
    } catch (error) {
      console.error('Error in agent pipeline:', error);
      return 'I encountered an error processing your request. Please try again.';
    }
  }

  // Wait for task completion
  private async waitForTaskCompletion(taskId: string, timeout: number = 10000): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const task = this.activeTasks.get(taskId);
      if (task?.status === 'COMPLETED' || task?.status === 'FAILED') {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Task ${taskId} timed out`);
  }

  // Handle agent task execution
  async executeAgentTask(agentId: string, taskId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    const task = this.activeTasks.get(taskId);
    
    if (!agent || !task) return;

    try {
      let output: any = null;

      switch (task.type) {
        case 'VOICE_INPUT':
          output = await this.handleVoiceInput(task.input);
          break;
        case 'INTENT_CLASSIFICATION':
          output = await this.handleIntentClassification(task.input);
          break;
        case 'PROFILE_UPDATE':
          output = await this.handleProfileUpdate(task.input);
          break;
        case 'RESTAURANT_SEARCH':
          output = await this.handleRestaurantSearch(task.input);
          break;
        case 'ORDER_PROCESSING':
          output = await this.handleOrderProcessing(task.input);
          break;
        case 'RECOMMENDATION_GENERATION':
          output = await this.handleRecommendationGeneration(task.input);
          break;
        case 'RESPONSE_GENERATION':
          output = await this.handleResponseGeneration(task.input);
          break;
      }

      // Update task with output
      task.output = output;
      task.status = 'COMPLETED';
      task.completedAt = new Date();
      
      // Free up agent
      agent.currentTask = undefined;

      // Notify orchestrator
      this.sendMessage({
        from: agentId,
        to: 'orchestrator',
        type: 'TASK_RESPONSE',
        payload: { taskId, output },
        priority: 'HIGH'
      });

    } catch (error) {
      console.error(`Error executing task ${taskId} on agent ${agentId}:`, error);
      task.status = 'FAILED';
      agent.currentTask = undefined;
      
      this.sendMessage({
        from: agentId,
        to: 'orchestrator',
        type: 'ERROR',
        payload: { taskId, error: error.message },
        priority: 'CRITICAL'
      });
    }
  }

  // Agent task handlers
  private async handleVoiceInput(input: any): Promise<any> {
    // Simulate voice processing
    await new Promise(resolve => setTimeout(resolve, 200));
    return { processedAudio: input.audioInput };
  }

  private async handleIntentClassification(input: any): Promise<any> {
    const intent = await echoShopAgent.classifyIntent(input.userInput);
    return { intent, confidence: 0.95 };
  }

  private async handleProfileUpdate(input: any): Promise<any> {
    const { preferences, dietary } = knowledgeGraph.extractPreferencesFromConversation(input.userInput);
    knowledgeGraph.updateUserPreferences(input.userProfile.id, preferences, dietary);
    return { updatedPreferences: preferences, updatedDietary: dietary };
  }

  private async handleRestaurantSearch(input: any): Promise<any> {
    const recommendations = knowledgeGraph.getPersonalizedRecommendations(input.userProfile.id);
    return { restaurants: recommendations };
  }

  private async handleOrderProcessing(input: any): Promise<any> {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 500));
    return { orderStatus: 'added_to_cart', items: ['Margherita Pizza'] };
  }

  private async handleRecommendationGeneration(input: any): Promise<any> {
    const recommendations = knowledgeGraph.getPersonalizedRecommendations(input.userProfile.id);
    return { recommendations: recommendations.slice(0, 3) };
  }

  private async handleResponseGeneration(input: any): Promise<any> {
    const response = await echoShopAgent.processUserInputWithContext(
      input.userInput, 
      input.userProfile, 
      {
        searchResults: input.searchResults,
        orderResult: input.orderResult,
        recommendations: input.recommendations
      }
    );
    return { response };
  }

  // Get system status
  getSystemStatus(): {
    activeAgents: number;
    pendingTasks: number;
    activeTasks: number;
    messageQueueSize: number;
  } {
    const activeAgents = Array.from(this.agents.values()).filter(agent => agent.isActive).length;
    const pendingTasks = this.taskQueue.filter(task => task.status === 'PENDING').length;
    const activeTasks = this.activeTasks.size;
    const messageQueueSize = this.messageBus.length;

    return {
      activeAgents,
      pendingTasks,
      activeTasks,
      messageQueueSize
    };
  }

  // Get agent status
  getAgentStatus(): Agent[] {
    return Array.from(this.agents.values());
  }

  // Get task status
  getTaskStatus(): AgentTask[] {
    return Array.from(this.activeTasks.values());
  }
}

// Export singleton instance
export const agentOrchestrator = new AgentOrchestrator(); 