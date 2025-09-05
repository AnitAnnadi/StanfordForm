import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudentResponse from './models/StudentResponse.js';
import User from './models/User.js';
import School from './models/School.js';

dotenv.config();
mongoose.set('strictQuery', true); // suppress mongoose warning

const jan1_2025 = new Date("2025-01-01");

const getCurriculumCounts = async () => {
  console.log("📘 Starting curriculum counts");

  const getCount = async (formTypes, dateRange) => {
    console.log(`➡️ Counting: ${formTypes.join(', ')} (${dateRange.label})`);

    const result = await StudentResponse.aggregate([
      {
        $match: {
          formType: { $in: formTypes },
          createdAt: dateRange.query
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
                    { $eq: ["$state", "California"] },
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
    ]);

    return result.length > 0 ? result[0].totalStudents : 0;
  };

  const before2025 = { label: "before 2025", query: { $lt: jan1_2025 } };
  const after2025 = { label: "2025 and after", query: { $gte: jan1_2025 } };

  return {
    youAndMeElem: {
      before2025: await getCount(["You and Me, Together Vape-Free(elem)"], before2025),
      after2025: await getCount(["You and Me, Together Vape-Free(elem)"], after2025)
    },
    youAndMeMiddle: {
      before2025: await getCount(["You and Me Vape Free (middle school and above)"], before2025),
      after2025: await getCount(["You and Me Vape Free (middle school and above)"], after2025)
    },
    smartTalk: {
      before2025: await getCount([
        "Smart Talk: Cannabis Prevention & Education Awareness",
        "Smart Talk: Cannabis Prevention & Education Awareness(elem)"
      ], before2025),
      after2025: await getCount([
        "Smart Talk: Cannabis Prevention & Education Awareness",
        "Smart Talk: Cannabis Prevention & Education Awareness(elem)"
      ], after2025)
    },
    safetyFirst: {
      before2025: await getCount(["Safety First", "Safety First(Fentanyl)"], before2025),
      after2025: await getCount(["Safety First", "Safety First(Fentanyl)"], after2025)
    },
    healthyFuturesNicotine: {
      before2025: await getCount(["Healthy Futures: Tobacco/Nicotine/Vaping"], before2025),
      after2025: await getCount(["Healthy Futures: Tobacco/Nicotine/Vaping"], after2025)
    },
    healthyFuturesCannabis: {
      before2025: await getCount(["Healthy Futures: Cannabis"], before2025),
      after2025: await getCount(["Healthy Futures: Cannabis"], after2025)
    }
  };
};

const run = async () => {
  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected!");

    const result = await getCurriculumCounts();
    console.log("📊 Results:", JSON.stringify(result, null, 2));

    await mongoose.disconnect();
    console.log("🔌 Disconnected.");
  } catch (err) {
    console.error("❌ Failed to run query:", err);
  }
};

run();
