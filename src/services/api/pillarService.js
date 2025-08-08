import pillarsData from "@/services/mockData/pillars.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const pillarService = {
  async getAllPillars() {
    try {
      await delay(500);
      
      if (!pillarsData || !Array.isArray(pillarsData)) {
        throw new Error('Invalid pillars data structure');
      }
      
      console.log('Pillars service: Successfully loaded', pillarsData.length, 'pillars');
      return pillarsData;
    } catch (error) {
      console.error('Pillars service error:', error);
      throw new Error(`Failed to load pillars: ${error.message}`);
    }
  },

  async getPillarById(id) {
    try {
      await delay(300);
      
      if (!id) {
        throw new Error('Pillar ID is required');
      }
      
      const pillar = pillarsData.find(p => p.id === parseInt(id));
      if (!pillar) {
        throw new Error(`Pillar with id ${id} not found`);
      }
      
      return pillar;
    } catch (error) {
      console.error('Get pillar by ID error:', error);
      throw new Error(`Failed to get pillar: ${error.message}`);
    }
  },

  async getPillarQuestions(pillarId) {
    try {
      await delay(200);
      
      if (!pillarId) {
        throw new Error('Pillar ID is required');
      }
      
      const pillar = pillarsData.find(p => p.id === parseInt(pillarId));
      if (!pillar) {
        throw new Error(`Pillar with id ${pillarId} not found`);
      }
      
      return pillar.questions || [];
    } catch (error) {
      console.error('Get pillar questions error:', error);
      throw new Error(`Failed to get pillar questions: ${error.message}`);
    }
  },

  async create(newPillar) {
    try {
      await delay(400);
      
      if (!newPillar || typeof newPillar !== 'object') {
        throw new Error('Valid pillar data is required');
      }
      
      const pillarWithId = {
        ...newPillar,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      pillarsData.push(pillarWithId);
      return { ...pillarWithId };
    } catch (error) {
      console.error('Create pillar error:', error);
      throw new Error(`Failed to create pillar: ${error.message}`);
    }
  },

  async update(id, pillarData) {
    try {
      await delay(350);
      
      if (!id) {
        throw new Error('Pillar ID is required');
      }
      
      if (!pillarData || typeof pillarData !== 'object') {
        throw new Error('Valid pillar data is required');
      }
      
      const index = pillarsData.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        throw new Error("Pillar not found");
      }
      
      pillarsData[index] = { ...pillarsData[index], ...pillarData };
      return { ...pillarsData[index] };
    } catch (error) {
      console.error('Update pillar error:', error);
      throw new Error(`Failed to update pillar: ${error.message}`);
    }
  },

  async delete(id) {
    try {
      await delay(300);
      
      if (!id) {
        throw new Error('Pillar ID is required');
      }
      
      const index = pillarsData.findIndex(p => p.id === parseInt(id));
      if (index === -1) {
        throw new Error("Pillar not found");
      }
      
      pillarsData.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Delete pillar error:', error);
      throw new Error(`Failed to delete pillar: ${error.message}`);
    }
  }
};

export default pillarService;