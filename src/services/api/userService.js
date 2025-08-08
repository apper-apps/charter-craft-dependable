import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userService = {
  async getAll() {
    await delay(300);
    return [...usersData];
  },

  async getById(id) {
    await delay(250);
    const user = usersData.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async getParticipants() {
    await delay(350);
    return usersData.filter(u => u.role === "participant").map(u => ({ ...u }));
  },

  async getAdmins() {
    await delay(300);
    return usersData.filter(u => u.role === "admin").map(u => ({ ...u }));
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      Id: Math.max(...usersData.map(u => u.Id)) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    usersData.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(350);
    const index = usersData.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    usersData[index] = { ...usersData[index], ...userData };
    return { ...usersData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = usersData.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    usersData.splice(index, 1);
    return true;
  },

  // Mock authentication methods
  async login(email, password) {
    await delay(500);
    const user = usersData.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    return { ...user };
  },

  async getCurrentUser() {
    await delay(200);
    // For demo purposes, return the first admin user
    return { ...usersData.find(u => u.role === "admin") || usersData[0] };
  }
};

export default userService;