// import * as bcrypt from 'bcrypt';
// import AppDataSource from '../../ormconfig';
// import { UserEntity } from '../../modules/users/entities/user.entity';
// // import { PlantEntity } from '../../modules/plants/entities/plant.entity';
// import { SensorReadingEntity } from '../../modules/sensor-readings/entities/sensor-reading.entity';
// // import { UserActionEntity } from '../../modules/user-actions/entities/user-action.entity';
// // import { ActionType } from '../../modules/user-actions/enum/user-actions.enum';

// async function seed() {
//   console.log('🌱 Starting database seed...\n');

//   await AppDataSource.initialize();

//   // Run migrations
//   console.log('🔄 Running migrations...');
//   await AppDataSource.runMigrations();
//   console.log('✅ Migrations completed\n');

//   // Clear existing data
// //   console.log('🗑️  Clearing existing data...');
// //   await AppDataSource.getRepository(UserActionEntity).clear();
// //   await AppDataSource.getRepository(SensorReadingEntity).clear();
// //   await AppDataSource.getRepository(PlantEntity).clear();
// //   await AppDataSource.getRepository(UserEntity).clear();
//  // Clear existing data
//   console.log('🗑️  Clearing existing data...');
//   // try {
//   //   await AppDataSource.getRepository(UserActionEntity).clear();
//   // } catch (e) {
//   //   console.log('⏭️  user_actions table not found, skipping...');
//   // }
//   try {
//     await AppDataSource.getRepository(SensorReadingEntity).clear();
//   } catch (e) {
//     console.log('⏭️  sensor_readings table not found, skipping...');
//   }
//   // try {
//   //   await AppDataSource.getRepository(PlantEntity).clear();
//   // } catch (e) {
//   //   console.log('⏭️  plants table not found, skipping...');
//   // }
//   try {
//     await AppDataSource.getRepository(UserEntity).clear();
//   } catch (e) {
//     console.log('⏭️  users table not found, skipping...');
//   }
//   // Create users
//   console.log('👤 Creating users...');
//   const userRepo = AppDataSource.getRepository(UserEntity);

//   const hashedPassword = await bcrypt.hash('Password123!', 10);

//   const user1 = await userRepo.save({
//     email: 'john@example.com',
//     password: hashedPassword,
//     fullName: 'John Doe',
//     phone: '+989355864811',
//   });

//   const user2 = await userRepo.save({
//     email: 'jane@example.com',
//     password: hashedPassword,
//     fullName: 'Jane Smith',
//     phoneNumber: '+989224837505',
//   });

//   console.log(`✅ Created ${2} users`);

//   // Create plants
//   console.log('🌿 Creating plants...');
//   const plantRepo = AppDataSource.getRepository(PlantEntity);

//   const plant1 = await plantRepo.save({
//     name: "John's Tomato Plant",
//     species: 'Tomato',
//     description: 'Cherry tomato in the backyard',
//     location: 'Backyard Garden',
//     plantedDate: new Date('2024-01-15'),
//     deviceId: 'DEVICE_001',
//     userId: user1.id,
//     status: 'active',
//   });

//   const plant2 = await plantRepo.save({
//     name: "John's Rose Bush",
//     species: 'Rose',
//     description: 'Beautiful red roses',
//     location: 'Front Yard',
//     plantedDate: new Date('2024-02-01'),
//     deviceId: 'DEVICE_002',
//     userId: user1.id,
//     status: 'active',
//   });

//   const plant3 = await plantRepo.save({
//     name: "Jane's Basil",
//     species: 'Basil',
//     description: 'Fresh basil for cooking',
//     location: 'Kitchen Window',
//     plantedDate: new Date('2024-03-10'),
//     deviceId: 'DEVICE_003',
//     userId: user2.id,
//     status: 'active',
//   });

//   console.log(`✅ Created ${3} plants`);

//   // Create sensor readings (last 7 days)
//   console.log('📊 Creating sensor readings...');
//   const readingRepo = AppDataSource.getRepository(SensorReadingEntity);

//   const now = new Date();
//   const readings: any[] = [];

//   // Generate readings for each plant
//   for (const plant of [plant1, plant2, plant3]) {
//     // 7 days of data, 48 readings per day (every 30 minutes)
//     for (let day = 6; day >= 0; day--) {
//       for (let hour = 0; hour < 24; hour++) {
//         for (let half = 0; half < 2; half++) {
//           const timestamp = new Date(now);
//           timestamp.setDate(timestamp.getDate() - day);
//           timestamp.setHours(hour);
//           timestamp.setMinutes(half * 30);
//           timestamp.setSeconds(0);

//           // Simulate realistic data with daily patterns
//           const baseTemp = plant.species === 'Tomato' ? 24 : plant.species === 'Rose' ? 22 : 25;
//           const baseMoisture = plant.species === 'Tomato' ? 65 : plant.species === 'Rose' ? 55 : 60;
//           const baseLight = 20000;

//           // Temperature varies by time of day
//           const tempVariation = Math.sin((hour / 24) * Math.PI * 2) * 5;
//           const temperature = baseTemp + tempVariation + (Math.random() * 2 - 1);

//           // Moisture decreases during day, increases at night
//           const moistureVariation = hour > 6 && hour < 20 ? -5 : 2;
//           const moisture = baseMoisture + moistureVariation + (Math.random() * 3 - 1.5);

//           // Light follows sun pattern
//           const lightVariation = 
//             hour >= 6 && hour <= 18 
//               ? Math.sin(((hour - 6) / 12) * Math.PI) * baseLight 
//               : 0;
//           const light = lightVariation + (Math.random() * 2000);

//           readings.push({
//             temperature: Math.round(temperature * 100) / 100,
//             moisture: Math.round(moisture * 100) / 100,
//             light: Math.round(light * 100) / 100,
//             timestamp,
//             plantId: plant.id,
//           });
//         }
//       }
//     }
//   }

//   await readingRepo.save(readings);
//   console.log(`✅ Created ${readings.length} sensor readings`);

//   // Create user actions
//   console.log('📝 Creating user actions...');
//   const actionRepo = AppDataSource.getRepository(UserActionEntity);

//   const actions = [
//     // User 1 actions for plant 1
//     {
//       actionType: ActionType.WATERED,
//       notes: 'Watered thoroughly, soil was dry',
//       actionDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
//       plantId: plant1.id,
//       userId: user1.id,
//     },
//     {
//       actionType: ActionType.FERTILIZED,
//       notes: 'Applied organic fertilizer',
//       actionDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
//       plantId: plant1.id,
//       userId: user1.id,
//     },
//     {
//       actionType: ActionType.PRUNED,
//       notes: 'Removed dead leaves',
//       actionDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
//       plantId: plant1.id,
//       userId: user1.id,
//     },
//     // User 1 actions for plant 2
//     {
//       actionType: ActionType.WATERED,
//       notes: 'Light watering',
//       actionDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
//       plantId: plant2.id,
//       userId: user1.id,
//     },
//     {
//       actionType: ActionType.PESTICIDE_APPLIED,
//       notes: 'Applied neem oil for aphids',
//       actionDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
//       plantId: plant2.id,
//       userId: user1.id,
//     },
//     // User 2 actions for plant 3
//     {
//       actionType: ActionType.WATERED,
//       notes: 'Daily watering',
//       actionDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
//       plantId: plant3.id,
//       userId: user2.id,
//     },
//     {
//       actionType: ActionType.SOIL_CHANGED,
//       notes: 'Repotted with fresh soil',
//       actionDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
//       plantId: plant3.id,
//       userId: user2.id,
//     },
//   ];

//   await actionRepo.save(actions);
//   console.log(`✅ Created ${actions.length} user actions`);

//   await AppDataSource.destroy();

//   console.log('\n✨ Database seeded successfully!\n');
//   console.log('📧 Test User Credentials:');
//   console.log('   Email: john@example.com');
//   console.log('   Password: Password123!');
//   console.log('');
//   console.log('   Email: jane@example.com');
//   console.log('   Password: Password123!\n');
// }

// seed()
//   .then(() => {
//     console.log('Done!');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('❌ Seed failed:', error);
//     process.exit(1);
//   });