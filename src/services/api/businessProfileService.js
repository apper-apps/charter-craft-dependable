import businessProfilesData from "@/services/mockData/businessProfiles.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const businessProfileService = {
  async getAll() {
    await delay(300);
    return [...businessProfilesData];
  },

  async getById(id) {
    await delay(250);
    const profile = businessProfilesData.find(p => p.Id === id);
    if (!profile) {
      throw new Error("Business profile not found");
    }
    return { ...profile };
  },

  async getByUserId(userId) {
    await delay(300);
    const profile = businessProfilesData.find(p => p.userId === userId.toString());
    if (!profile) {
      throw new Error("Business profile not found for user");
    }
    return { ...profile };
  },

  async create(profileData) {
    await delay(400);
    const newProfile = {
      Id: Math.max(...businessProfilesData.map(p => p.Id)) + 1,
      ...profileData,
      userId: profileData.userId.toString()
    };
    businessProfilesData.push(newProfile);
    return { ...newProfile };
  },

  async update(id, profileData) {
    await delay(350);
    const index = businessProfilesData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Business profile not found");
    }
    businessProfilesData[index] = { ...businessProfilesData[index], ...profileData };
    return { ...businessProfilesData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = businessProfilesData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Business profile not found");
    }
    businessProfilesData.splice(index, 1);
    return true;
  }
};

export default businessProfileService;