import User from "../models/User.js";

const defaultUsers = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    mobile: "1234567890",
  },
  {
    name: "Manager User",
    email: "manager@example.com",
    password: "manager123",
    role: "manager",
    mobile: "0987654321",
  },
];

export const initializeDefaultUsers = async () => {
  try {
    //! delete all users
    // await User.deleteMany();

    // Check if any users exist
    const userCount = await User.countDocuments();
    console.log(userCount);

    if (userCount === 0) {
      console.log("No users found. Creating default users...");

      // Create default users
      for (const userData of defaultUsers) {
        const user = new User(userData);
        await user.save();
        console.log(
          `Created default ${userData.role} user email: ${userData.email} \n Password: ${userData.password}`
        );
      }

      console.log("Default users created successfully");
    }
  } catch (error) {
    console.error("Error initializing default users:", error);
  }
};
