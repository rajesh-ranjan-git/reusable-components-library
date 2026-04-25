import "../services/logger/logger.service.js";
import { setDbAdapter } from "../services/logger/logger.service.js";
import connectDB from "../db/db.connect.js";
import Log from "../models/log/log.model.js";
import Profile from "../models/user/profile/profile.model.js";
import User from "../models/user/auth/user.model.js";
import Account from "../models/user/auth/account.model.js";
import { authService } from "../services/auth/auth.service.js";

const MAX_USERS = 500;

const firstNames = [
  "James",
  "John",
  "Robert",
  "Michael",
  "William",
  "David",
  "Richard",
  "Joseph",
  "Thomas",
  "Charles",
  "Mary",
  "Patricia",
  "Jennifer",
  "Linda",
  "Elizabeth",
  "Barbara",
  "Susan",
  "Jessica",
  "Sarah",
  "Karen",
  "Christopher",
  "Daniel",
  "Paul",
  "Mark",
  "Donald",
  "George",
  "Kenneth",
  "Steven",
  "Edward",
  "Brian",
  "Nancy",
  "Lisa",
  "Betty",
  "Margaret",
  "Sandra",
  "Ashley",
  "Kimberly",
  "Emily",
  "Donna",
  "Michelle",
  "Kevin",
  "Jason",
  "Matthew",
  "Gary",
  "Timothy",
  "Jose",
  "Larry",
  "Jeffrey",
  "Frank",
  "Scott",
  "Carol",
  "Amanda",
  "Melissa",
  "Deborah",
  "Stephanie",
  "Rebecca",
  "Sharon",
  "Laura",
  "Cynthia",
  "Kathleen",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Gomez",
  "Phillips",
  "Evans",
  "Turner",
  "Diaz",
  "Parker",
  "Cruz",
  "Edwards",
  "Collins",
  "Reyes",
];

const genders = ["male", "female", "other"];
const maritalStatuses = [
  "married",
  "single",
  "separated",
  "divorced",
  "complicated",
];
const skillsList = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "CSS",
  "HTML",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "GraphQL",
];
const skillLevels = ["beginner", "intermediate", "advanced", "expert"];
const interestsList = [
  "Reading",
  "Traveling",
  "Coding",
  "Music",
  "Sports",
  "Gaming",
  "Photography",
  "Cooking",
  "Art",
  "Writing",
];
const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Tesla",
  "Adobe",
  "Salesforce",
  "Spotify",
];
const roles = [
  "Software Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
];

const avatarIds = [
  "1535713875002-d1d0cf377fde",
  "1527980965255-d3b416303d12",
  "1494790108377-be9c29b29330",
  "1580489944761-15a19d654956",
  "1438761681033-6461ffad8d80",
  "1472099645785-5658abf4ff4e",
  "1507003211169-0a1dd7228f2d",
  "1500648767791-00dcc994a43e",
  "1544005313-94ddf0286df2",
  "1552058544-f2b08422138a",
];

const coverIds = [
  "1506744626772-83b5b6966275",
  "1470071131808-1284b3e51381",
  "1449844908441-8829872d2607",
  "1469474968028-56623f02e42e",
  "1472214103451-9374bd1c798e",
  "1433086966358-54859d0ed716",
  "1475924156734-496f6cac6ec1",
  "1493246507139-91e8fad9978e",
  "1464822759023-fed622ff2c3b",
  "1519681393784-d120267933ba",
];

const seedUsers = async () => {
  try {
    await connectDB();
    setDbAdapter(async (entry) => Log.create(entry));

    logger.info("📢 [ USERS ] Initial users seeding started!");

    for (let i = 1; i <= MAX_USERS; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomAvatarId =
        avatarIds[Math.floor(Math.random() * avatarIds.length)];
      const randomCoverId =
        coverIds[Math.floor(Math.random() * coverIds.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@server.com`;

      const gender = genders[Math.floor(Math.random() * genders.length)];
      const maritalStatus =
        maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)];
      const phone = Math.floor(1000000000 + Math.random() * 9000000000);
      const dob = new Date(
        Date.now() - (18 + Math.random() * 32) * 365 * 24 * 60 * 60 * 1000,
      );
      const bio = `Hello! I am ${firstName} ${lastName}, a passionate professional from the industry.`;
      const nickName =
        `${firstName.slice(0, 3)}${lastName.slice(0, 3)}`.toLowerCase();

      const numSkills = 2 + Math.floor(Math.random() * 3);
      const skills = Array.from({ length: numSkills }, () => ({
        name: skillsList[Math.floor(Math.random() * skillsList.length)],
        level: skillLevels[Math.floor(Math.random() * skillLevels.length)],
      }));

      const numInterests = 2 + Math.floor(Math.random() * 3);
      const interests = Array.from(
        { length: numInterests },
        () => interestsList[Math.floor(Math.random() * interestsList.length)],
      );

      const numExp = 1 + Math.floor(Math.random() * 2);
      const experiences = Array.from({ length: numExp }, (_, idx) => ({
        company: companies[Math.floor(Math.random() * companies.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        startDate: new Date(
          Date.now() - (1 + Math.random() * 5) * 365 * 24 * 60 * 60 * 1000,
        ),
        endDate:
          idx === 0
            ? null
            : new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        isCurrent: idx === 0,
        description:
          "Worked on various impactful projects and collaborated with cross-functional teams.",
      }));

      try {
        const { userId } = await authService.register({
          email,
          password: "Rajesh@0",
          firstName,
          lastName,
        });

        await User.findByIdAndUpdate(userId, {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        });

        await Profile.findOneAndUpdate(
          { user: userId },
          {
            avatar: `https://images.unsplash.com/photo-${randomAvatarId}?auto=format&fit=crop&w=400&h=400`,
            cover: `https://images.unsplash.com/photo-${randomCoverId}?auto=format&fit=crop&w=1200&h=800`,
            nickName,
            gender,
            phone,
            dob,
            maritalStatus,
            bio,
            experiences,
            skills,
            interests,
          },
        );

        logger.info(`✅ Created user ${i}/${MAX_USERS}: ${email}`);
      } catch (err) {
        if (err.code === "USER ALREADY EXISTS") {
          logger.warn(`⚠️ User ${email} already exists, skipping...`);
        } else {
          throw err;
        }
      }
    }

    logger.success(`✅ [ USERS ] ${MAX_USERS} users seeded successfully!`);
    process.exit(0);
  } catch (error) {
    logger.error("❌ [ USERS ] Initial users seeding Failed:", error);
    process.exit(1);
  }
};

seedUsers();
