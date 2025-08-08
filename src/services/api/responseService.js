import responsesData from "@/services/mockData/responses.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const responseService = {
  async getAll() {
    await delay(300);
    return [...responsesData];
  },

  async getById(id) {
    await delay(250);
    const response = responsesData.find(r => r.Id === id);
    if (!response) {
      throw new Error("Response not found");
    }
    return { ...response };
  },

async getUserResponses(userId) {
    await delay(350);
    
    // Validate userId parameter
    if (userId == null || userId === undefined) {
      return [];
    }
    
    const userIdString = String(userId);
    return responsesData
      .filter(r => r.userId === userIdString)
      .map(r => ({ ...r }));
  },

async getPillarResponse(userId, pillarId) {
    await delay(300);
    
    // Validate parameters
    if (userId == null || userId === undefined) {
      return null;
    }
    
    const userIdString = String(userId);
    const response = responsesData.find(r => 
      r.userId === userIdString && r.pillarId === pillarId
    );
    return response ? { ...response } : null;
  },

async saveResponse(responseData) {
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
  },

async create(responseData) {
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
  },

async update(id, responseData) {
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
  },

  async delete(id) {
    await delay(300);
    const index = responsesData.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Response not found");
    }
    responsesData.splice(index, 1);
    return true;
  }
};

export default responseService;