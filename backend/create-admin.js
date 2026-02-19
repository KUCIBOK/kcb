const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@kucibok.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@kucibok.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@kucibok.com',
      password: passwordHash,
      role: 'admin',
      telephone: '+1234567890',
      isEmailVerified: true,
      isActive: true,
      profileCompleted: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@kucibok.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    // Also create a test collector user
    const collectorUser = new User({
      name: 'Test Collector',
      email: 'collector@test.com',
      password: passwordHash,
      role: 'collector',
      telephone: '+1234567891',
      isEmailVerified: true,
      isActive: true,
      profileCompleted: true
    });

    await collectorUser.save();
    console.log('\n✅ Test collector user created successfully!');
    console.log('Email: collector@test.com');
    console.log('Password: admin123');
    console.log('Role: collector');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();