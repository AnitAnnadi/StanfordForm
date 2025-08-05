import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudentResponse from './models/StudentResponse.js';
import User from './models/User.js';
import School from './models/School.js';

dotenv.config();
mongoose.set('strictQuery', true); // suppress mongoose warning

const startOf2023 = new Date("2023-01-01");

const getCurriculumCounts = async () => {
  console.log("📘 Starting curriculum counts");

const getCount = async (formTypes) => {
  console.log(`➡️ Counting: ${formTypes.join(', ')}`);

  const result = await StudentResponse.aggregate([
    {
      $match: {
        formType: { $in: formTypes },
        createdAt: { $gte: startOf2023 }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "teacher",
        foreignField: "_id",
        as: "teacherDoc"
      }
    },
    { $unwind: { path: "$teacherDoc", preserveNullAndEmptyArrays: false } },
    {
      $lookup: {
        from: "schools",
        let: { teacherId: "$teacherDoc._id", schoolName: "$school" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$teacher", "$$teacherId"] },
                  { $ne: ["$state", "California"] }, // ❌ Not California
                  { $eq: ["$school", "$$schoolName"] }
                ]
              }
            }
          },
          { $limit: 1 }
        ],
        as: "schoolDoc"
      }
    },
    { $unwind: { path: "$schoolDoc", preserveNullAndEmptyArrays: false } },
    {
      $count: "totalStudents"
    }
  ])
  .option({ maxTimeMS: 120000 });

  return result.length > 0 ? result[0].totalStudents : 0;
};

  return {
    youAndMe: await getCount([
      "You and Me, Together Vape-Free(elem)",
      "You and Me Vape Free (middle school and above)"
    ]),
    smartTalk: await getCount([
      "Smart Talk: Cannabis Prevention & Education Awareness",
      "Smart Talk: Cannabis Prevention & Education Awareness(elem)"
    ]),
    safetyFirst: await getCount([
      "Safety First",
      "Safety First(Fentanyl)"
    ]),
    healthyFuturesNicotine: await getCount([
      "Healthy Futures: Tobacco/Nicotine/Vaping"
    ]),
    healthyFuturesCannabis: await getCount([
      "Healthy Futures: Cannabis"
    ])
  };
};

const run = async () => {
  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected!");

    const result = await getCurriculumCounts();
    console.log("📊 Results:", result);

    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
  } catch (err) {
    console.error("❌ Failed to run query:", err);
  }
};

run();
