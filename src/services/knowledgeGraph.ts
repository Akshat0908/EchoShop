// Knowledge Graph Service for EchoShop
// Implements a graph-based user profile system with nodes and relationships

export interface GraphNode {
  id: string;
  type: 'User' | 'Preference' | 'Cuisine' | 'Dish' | 'Restaurant' | 'DietaryRestriction' | 'Address' | 'OrderHistory';
  properties: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphRelationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: 'HAS_PREFERENCE' | 'LIKES_CUISINE' | 'ORDERED_FROM' | 'HAS_DIETARY_RESTRICTION' | 'LIVES_AT' | 'ORDERED_DISH' | 'SIMILAR_TO';
  properties: Record<string, any>;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  preferences: string[];
  dietary: string[];
  location: string;
  lastOrder?: string;
  orderHistory: any[];
}

export class KnowledgeGraph {
  private nodes: Map<string, GraphNode> = new Map();
  private relationships: Map<string, GraphRelationship> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with default user profiles
    const defaultUsers = [
      {
        id: '1',
        name: 'Sarah Johnson',
        preferences: ['Italian', 'Vegetarian', 'Healthy'],
        dietary: ['No nuts', 'Low sodium'],
        location: 'Downtown SF',
        lastOrder: 'Mediterranean Bowl from Fresh & Green',
        orderHistory: []
      },
      {
        id: '2', 
        name: 'Mike Chen',
        preferences: ['Asian', 'Spicy', 'Quick'],
        dietary: ['No shellfish'],
        location: 'Mission District',
        lastOrder: 'Kung Pao Chicken from Golden Dragon',
        orderHistory: []
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        preferences: ['Mexican', 'Authentic', 'Family-sized'],
        dietary: ['Gluten-free'],
        location: 'North Beach',
        lastOrder: 'Tacos al Pastor from Taqueria El Farolito',
        orderHistory: []
      }
    ];

    defaultUsers.forEach(user => {
      this.createUserProfile(user);
    });
  }

  // Create a new user profile and corresponding graph nodes
  createUserProfile(profile: UserProfile): void {
    this.userProfiles.set(profile.id, profile);

    // Create user node
    const userNode: GraphNode = {
      id: `user_${profile.id}`,
      type: 'User',
      properties: {
        name: profile.name,
        location: profile.location
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.nodes.set(userNode.id, userNode);

    // Create preference nodes and relationships
    profile.preferences.forEach(pref => {
      const prefNode = this.getOrCreateNode('Preference', pref);
      this.createRelationship(userNode.id, prefNode.id, 'HAS_PREFERENCE');
    });

    // Create dietary restriction nodes and relationships
    profile.dietary.forEach(diet => {
      const dietNode = this.getOrCreateNode('DietaryRestriction', diet);
      this.createRelationship(userNode.id, dietNode.id, 'HAS_DIETARY_RESTRICTION');
    });

    // Create location node and relationship
    const locationNode = this.getOrCreateNode('Address', profile.location);
    this.createRelationship(userNode.id, locationNode.id, 'LIVES_AT');
  }

  // Get or create a node of specific type
  private getOrCreateNode(type: GraphNode['type'], value: string): GraphNode {
    const nodeId = `${type.toLowerCase()}_${value.replace(/\s+/g, '_').toLowerCase()}`;
    
    if (this.nodes.has(nodeId)) {
      return this.nodes.get(nodeId)!;
    }

    const newNode: GraphNode = {
      id: nodeId,
      type,
      properties: { value },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.nodes.set(nodeId, newNode);
    return newNode;
  }

  // Create a relationship between two nodes
  private createRelationship(sourceId: string, targetId: string, type: GraphRelationship['type'], properties: Record<string, any> = {}): void {
    const relationshipId = `${sourceId}_${type}_${targetId}`;
    
    const relationship: GraphRelationship = {
      id: relationshipId,
      sourceNodeId: sourceId,
      targetNodeId: targetId,
      type,
      properties,
      createdAt: new Date()
    };

    this.relationships.set(relationshipId, relationship);
  }

  // Get user profile by ID
  getUserProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  // Update user preferences based on conversation
  updateUserPreferences(userId: string, newPreferences: string[], newDietary: string[]): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    // Update profile
    profile.preferences = [...new Set([...profile.preferences, ...newPreferences])];
    profile.dietary = [...new Set([...profile.dietary, ...newDietary])];
    profile.updatedAt = new Date();

    // Update graph nodes
    const userNodeId = `user_${userId}`;
    
    newPreferences.forEach(pref => {
      const prefNode = this.getOrCreateNode('Preference', pref);
      this.createRelationship(userNodeId, prefNode.id, 'HAS_PREFERENCE');
    });

    newDietary.forEach(diet => {
      const dietNode = this.getOrCreateNode('DietaryRestriction', diet);
      this.createRelationship(userNodeId, dietNode.id, 'HAS_DIETARY_RESTRICTION');
    });
  }

  // Add order to user history
  addOrderToHistory(userId: string, order: any): void {
    const profile = this.userProfiles.get(userId);
    if (!profile) return;

    profile.orderHistory.push(order);
    profile.lastOrder = `${order.dish} from ${order.restaurant}`;

    // Create order history node
    const orderNode: GraphNode = {
      id: `order_${Date.now()}`,
      type: 'OrderHistory',
      properties: order,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.nodes.set(orderNode.id, orderNode);

    // Create relationships
    const userNodeId = `user_${userId}`;
    this.createRelationship(userNodeId, orderNode.id, 'ORDERED_DISH');
    
    const restaurantNode = this.getOrCreateNode('Restaurant', order.restaurant);
    this.createRelationship(userNodeId, restaurantNode.id, 'ORDERED_FROM');
  }

  // Get personalized recommendations based on user profile
  getPersonalizedRecommendations(userId: string): any[] {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    // Mock restaurant database with personalized filtering
    const allRestaurants = [
      {
        id: '1',
        name: "Tony's Italian",
        cuisine: 'Italian',
        dishes: [
          { name: 'Margherita Pizza', price: 18.99, vegetarian: true },
          { name: 'Pasta Carbonara', price: 16.99, vegetarian: false },
          { name: 'Bruschetta', price: 8.99, vegetarian: true }
        ],
        rating: 4.8,
        deliveryTime: '25-35 min'
      },
      {
        id: '2',
        name: 'Golden Dragon',
        cuisine: 'Asian',
        dishes: [
          { name: 'Kung Pao Chicken', price: 15.99, vegetarian: false },
          { name: 'Vegetable Stir Fry', price: 13.99, vegetarian: true },
          { name: 'Dim Sum Platter', price: 12.99, vegetarian: false }
        ],
        rating: 4.6,
        deliveryTime: '20-30 min'
      },
      {
        id: '3',
        name: 'Fresh & Green',
        cuisine: 'Healthy',
        dishes: [
          { name: 'Mediterranean Bowl', price: 14.99, vegetarian: true },
          { name: 'Quinoa Salad', price: 12.99, vegetarian: true },
          { name: 'Grilled Salmon', price: 18.99, vegetarian: false }
        ],
        rating: 4.7,
        deliveryTime: '15-25 min'
      },
      {
        id: '4',
        name: 'Taqueria El Farolito',
        cuisine: 'Mexican',
        dishes: [
          { name: 'Tacos al Pastor', price: 11.99, vegetarian: false },
          { name: 'Veggie Burrito', price: 10.99, vegetarian: true },
          { name: 'Guacamole & Chips', price: 6.99, vegetarian: true }
        ],
        rating: 4.5,
        deliveryTime: '18-28 min'
      }
    ];

    // Filter restaurants based on user preferences
    const filteredRestaurants = allRestaurants.filter(restaurant => {
      // Check if restaurant cuisine matches user preferences
      const matchesCuisine = profile.preferences.some(pref => 
        restaurant.cuisine.toLowerCase().includes(pref.toLowerCase())
      );

      // Check dietary restrictions
      const hasVegetarianOptions = restaurant.dishes.some(dish => dish.vegetarian);
      const needsVegetarian = profile.dietary.some(diet => 
        diet.toLowerCase().includes('vegetarian') || diet.toLowerCase().includes('vegan')
      );

      return matchesCuisine && (!needsVegetarian || hasVegetarianOptions);
    });

    // Sort by rating and add personalization score
    return filteredRestaurants
      .map(restaurant => ({
        ...restaurant,
        personalizationScore: this.calculatePersonalizationScore(restaurant, profile)
      }))
      .sort((a, b) => b.personalizationScore - a.personalizationScore);
  }

  // Calculate personalization score based on user profile
  private calculatePersonalizationScore(restaurant: any, profile: UserProfile): number {
    let score = restaurant.rating;

    // Boost score for preferred cuisines
    const cuisineMatch = profile.preferences.some(pref => 
      restaurant.cuisine.toLowerCase().includes(pref.toLowerCase())
    );
    if (cuisineMatch) score += 0.5;

    // Boost score for restaurants with vegetarian options if user is vegetarian
    const needsVegetarian = profile.dietary.some(diet => 
      diet.toLowerCase().includes('vegetarian') || diet.toLowerCase().includes('vegan')
    );
    const hasVegetarianOptions = restaurant.dishes.some(dish => dish.vegetarian);
    if (needsVegetarian && hasVegetarianOptions) score += 0.3;

    // Boost score for previously ordered restaurants
    const hasOrderedBefore = profile.orderHistory.some(order => 
      order.restaurant === restaurant.name
    );
    if (hasOrderedBefore) score += 0.2;

    return score;
  }

  // Extract preferences from user conversation
  extractPreferencesFromConversation(conversation: string): { preferences: string[], dietary: string[] } {
    const preferences: string[] = [];
    const dietary: string[] = [];

    const lowerConversation = conversation.toLowerCase();

    // Extract cuisine preferences
    const cuisines = ['italian', 'asian', 'mexican', 'indian', 'mediterranean', 'american', 'thai', 'japanese', 'chinese', 'korean'];
    cuisines.forEach(cuisine => {
      if (lowerConversation.includes(cuisine)) {
        preferences.push(cuisine);
      }
    });

    // Extract dietary restrictions
    const dietaryTerms = [
      { term: 'vegetarian', restriction: 'Vegetarian' },
      { term: 'vegan', restriction: 'Vegan' },
      { term: 'gluten-free', restriction: 'Gluten-free' },
      { term: 'no nuts', restriction: 'No nuts' },
      { term: 'no dairy', restriction: 'No dairy' },
      { term: 'low sodium', restriction: 'Low sodium' },
      { term: 'no shellfish', restriction: 'No shellfish' }
    ];

    dietaryTerms.forEach(({ term, restriction }) => {
      if (lowerConversation.includes(term)) {
        dietary.push(restriction);
      }
    });

    return { preferences, dietary };
  }

  // Get graph statistics
  getGraphStats(): { nodes: number; relationships: number; users: number } {
    return {
      nodes: this.nodes.size,
      relationships: this.relationships.size,
      users: this.userProfiles.size
    };
  }

  // Export graph data for visualization
  exportGraphData(): { nodes: GraphNode[]; relationships: GraphRelationship[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      relationships: Array.from(this.relationships.values())
    };
  }
}

// Export singleton instance
export const knowledgeGraph = new KnowledgeGraph(); 