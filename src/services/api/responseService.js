import usersData from "@/services/mockData/users.json";
import businessProfilesData from "@/services/mockData/businessProfiles.json";
import pillarsData from "@/services/mockData/pillars.json";
import responsesData from "@/services/mockData/responses.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const responseService = {
  async getAllResponses() {
    try {
      await delay(300);
      
      if (!responsesData || !Array.isArray(responsesData)) {
        throw new Error('Invalid responses data structure');
      }
      
      console.log('Responses service: Successfully loaded', responsesData.length, 'responses');
      return responsesData;
    } catch (error) {
      console.error('Responses service error:', error);
      throw new Error(`Failed to load responses: ${error.message}`);
    }
  },

  async getResponsesByUserId(userId) {
    try {
      await delay(200);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const userResponses = responsesData.filter(r => r.userId === parseInt(userId));
      console.log(`Found ${userResponses.length} responses for user ${userId}`);
      return userResponses;
    } catch (error) {
      console.error('Get responses by user ID error:', error);
      throw new Error(`Failed to get user responses: ${error.message}`);
    }
  },

  async getResponsesByPillar(pillarId) {
    try {
      await delay(200);
      
      if (!pillarId) {
        throw new Error('Pillar ID is required');
      }
      
      const pillarResponses = responsesData.filter(r => r.pillarId === parseInt(pillarId));
      return pillarResponses;
    } catch (error) {
      console.error('Get responses by pillar error:', error);
      throw new Error(`Failed to get pillar responses: ${error.message}`);
    }
  },

  async submitResponse(responseData) {
    try {
      await delay(500);
      
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response data');
      }
      
      const newResponse = {
        id: Date.now(),
        ...responseData,
        createdAt: new Date().toISOString()
      };
      
      responsesData.push(newResponse);
      return newResponse;
    } catch (error) {
      console.error('Submit response error:', error);
      throw new Error(`Failed to submit response: ${error.message}`);
    }
  },

  async updateResponse(id, updates) {
    try {
      await delay(300);
      
      if (!id) {
        throw new Error('Response ID is required');
      }
      
const index = responsesData.findIndex(r => r.id === parseInt(id));
      if (index === -1) {
        throw new Error('Response not found');
      }
      
      responsesData[index] = {
        ...responsesData[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      return responsesData[index];
    } catch (error) {
      console.error('Update response error:', error);
      throw new Error(`Failed to update response: ${error.message}`);
    }
  },

  async getResponseByUserAndPillar(userId, pillarId) {
    try {
      await delay(200);
      
      // Validate parameters
      if (userId == null || userId === undefined) {
        return null;
      }
      
      const userIdString = String(userId);
      const response = responsesData.find(r => 
        r.userId === userIdString && r.pillarId === pillarId
      );
      return response ? { ...response } : null;
    } catch (error) {
      console.error('Get response by user and pillar error:', error);
      return null;
    }
  },

async saveResponse(responseData) {
    try {
      await delay(400);
    
    // Validate responseData and userId
    if (!responseData || responseData.userId == null || responseData.userId === undefined) {
      throw new Error('Invalid response data: userId is required');
    }
    
    const userIdString = String(responseData.userId);
    
    // Check if response already exists
    const existingIndex = responsesData.findIndex(r => 
      r.userId === userIdString && r.pillarId === responseData.pillarId
    );
    
    if (existingIndex !== -1) {
      // Update existing response
      responsesData[existingIndex] = {
        ...responsesData[existingIndex],
        ...responseData,
        userId: userIdString,
        lastUpdated: new Date().toISOString()
      };
      return { ...responsesData[existingIndex] };
    } else {
      // Create new response
      const newResponse = {
        Id: Math.max(...responsesData.map(r => r.Id)) + 1,
        ...responseData,
        userId: userIdString,
        lastUpdated: new Date().toISOString()
      };
      responsesData.push(newResponse);
      return { ...newResponse };
}
    } catch (error) {
      console.error('Save response error:', error);
      throw new Error(`Failed to save response: ${error.message}`);
    }
  },
async create(responseData) {
    try {
      await delay(400);
    
    // Validate responseData and userId
    if (!responseData || responseData.userId == null || responseData.userId === undefined) {
      throw new Error('Invalid response data: userId is required');
    }
    
    const newResponse = {
      Id: Math.max(...responsesData.map(r => r.Id)) + 1,
      ...responseData,
      userId: String(responseData.userId),
      lastUpdated: new Date().toISOString()
    };
    responsesData.push(newResponse);
return { ...newResponse };
    } catch (error) {
      console.error('Create response error:', error);
      throw new Error(`Failed to create response: ${error.message}`);
    }
  },
async update(id, responseData) {
    try {
      await delay(350);
    const index = responsesData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Response not found");
    }
    
    // Ensure userId is properly handled if provided in update
    const updatedData = { ...responseData };
    if (updatedData.userId != null && updatedData.userId !== undefined) {
      updatedData.userId = String(updatedData.userId);
    }
    
    responsesData[index] = { 
      ...responsesData[index], 
      ...updatedData,
      lastUpdated: new Date().toISOString()
    };
return { ...responsesData[index] };
    } catch (error) {
      console.error('Update response error:', error);
      throw new Error(`Failed to update response: ${error.message}`);
    }
  },
async delete(id) {
    try {
      await delay(300);
    const index = responsesData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Response not found");
    }
    responsesData.splice(index, 1);
return true;
    } catch (error) {
      console.error('Delete response error:', error);
      throw new Error(`Failed to delete response: ${error.message}`);
    }
  }
};

export default responseService;