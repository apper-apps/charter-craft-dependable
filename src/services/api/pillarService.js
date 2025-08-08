import pillarsData from "@/services/mockData/pillars.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const pillarService = {
  async getAll() {
    await delay(300);
    return [...pillarsData];
  },

  async getById(id) {
    await delay(250);
    const pillar = pillarsData.find(p => p.Id === id);
    if (!pillar) {
      throw new Error("Pillar not found");
    }
    return { ...pillar };
  },

  async create(pillarData) {
    await delay(400);
    const newPillar = {
      Id: Math.max(...pillarsData.map(p => p.Id)) + 1,
      ...pillarData
    };
    pillarsData.push(newPillar);
    return { ...newPillar };
  },

  async update(id, pillarData) {
    await delay(350);
    const index = pillarsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Pillar not found");
    }
    pillarsData[index] = { ...pillarsData[index], ...pillarData };
    return { ...pillarsData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = pillarsData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Pillar not found");
    }
    pillarsData.splice(index, 1);
    return true;
  }
};

export default pillarService;