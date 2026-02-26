import mongoose from "mongoose";
import connectDB from "./connectDB.js";
import User from "../models/user.js";
import { getEncryptedPassword } from "../utils/authUtils.js";

const firstNames = [
  "john",
  "jane",
  "michael",
  "sarah",
  "david",
  "emma",
  "robert",
  "lisa",
  "william",
  "jennifer",
  "james",
  "mary",
  "thomas",
  "patricia",
  "charles",
  "linda",
  "daniel",
  "barbara",
  "matthew",
  "elizabeth",
  "anthony",
  "susan",
  "mark",
  "jessica",
  "donald",
  "karen",
  "steven",
  "nancy",
  "paul",
  "betty",
];

const lastNames = [
  "smith",
  "johnson",
  "williams",
  "brown",
  "jones",
  "garcia",
  "miller",
  "davis",
  "rodriguez",
  "martinez",
  "hernandez",
  "lopez",
  "gonzalez",
  "wilson",
  "anderson",
  "thomas",
  "taylor",
  "moore",
  "jackson",
  "martin",
  "lee",
  "perez",
  "thompson",
  "white",
  "harris",
  "sanchez",
  "clark",
  "kumar",
];

const cities = [
  "new york",
  "los angeles",
  "chicago",
  "houston",
  "phoenix",
  "philadelphia",
  "san antonio",
  "san diego",
  "dallas",
  "san jose",
  "mumbai",
  "delhi",
  "bangalore",
  "hyderabad",
  "chennai",
  "kolkata",
  "pune",
  "ahmedabad",
];

const states = [
  "california",
  "texas",
  "florida",
  "new york",
  "pennsylvania",
  "illinois",
  "ohio",
  "georgia",
  "maharashtra",
  "karnataka",
  "tamil nadu",
  "delhi",
];

const countries = [
  "united states",
  "india",
  "united kingdom",
  "canada",
  "australia",
];

const jobProfiles = [
  "software engineer",
  "data scientist",
  "product manager",
  "designer",
  "marketing manager",
  "sales executive",
  "business analyst",
  "devops engineer",
  "frontend developer",
  "backend developer",
  "full stack developer",
  "cto",
];

const skills = [
  "javascript",
  "python",
  "java",
  "react",
  "nodejs",
  "mongodb",
  "sql",
  "aws",
  "docker",
  "kubernetes",
  "machine learning",
  "data analysis",
  "project management",
  "agile",
  "scrum",
  "leadership",
  "communication",
];

const interests = [
  "reading",
  "traveling",
  "photography",
  "gaming",
  "cooking",
  "music",
  "sports",
  "technology",
  "art",
  "fitness",
  "yoga",
  "meditation",
  "coding",
];

const specialChars = ["!", "@", "#", "$", "%", "&", "_"];
const passwordSpecialChars = ["@", "#", "$", "%", "&"];

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomBoolean = () => Math.random() > 0.5;

const generateUserName = (firstName, lastName) => {
  const base = `${firstName}${lastName}${randomInt(1, 999)}`;
  if (randomBoolean()) {
    return base + randomElement(specialChars);
  }
  return base;
};

const generateEmail = (firstName, lastName) => {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
  return `${firstName}${lastName}${randomInt(1, 99)}@${randomElement(domains)}`;
};

// const generatePassword = async () => {
//   const upper = String.fromCharCode(randomInt(65, 90));
//   const lower = String.fromCharCode(randomInt(97, 122));
//   const digit = randomInt(0, 9);
//   const special = randomElement(passwordSpecialChars);

//   const chars =
//     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let password = upper + lower + digit + special;

//   for (let i = 0; i < randomInt(2, 6); i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }

//   const hashedPassword = await getEncryptedPassword(
//     password
//       .split("")
//       .sort(() => Math.random() - 0.5)
//       .join("")
//   );

//   return hashedPassword;
// };

const generatePassword = async () => {
  let password = "Rajesh@2";

  const hashedPassword = await getEncryptedPassword(password);

  return hashedPassword;
};

const generatePhoneNumber = () => {
  return parseInt(`${randomInt(6, 9)}${randomInt(100000000, 999999999)}`);
};

const generatePinCode = () => {
  return randomInt(100000, 999999);
};

const generateFacebookUrl = (userName) => {
  return `https://facebook.com/${userName.replace(/[^A-Za-z0-9-]/g, "")}`;
};

const generateInstagramUrl = (userName) => {
  return `https://instagram.com/${userName.replace(/[^A-Za-z0-9-]/g, "")}`;
};

const generateTwitterUrl = (userName) => {
  return `https://x.com/${userName.replace(/[^A-Za-z0-9-]/g, "")}`;
};

const generateGithubUrl = (userName) => {
  return `https://github.com/${userName.replace(/[^A-Za-z0-9-]/g, "")}`;
};

const generateLinkedinUrl = (userName) => {
  return `https://linkedin.com/in/${userName.replace(/[^A-Za-z0-9-]/g, "")}`;
};

const generateYoutubeUrl = (userName) => {
  return `https://youtube.com/in/${userName.replace(/[^A-Za-z0-9-]/g, "")}`;
};

const generateWebsite = (userName) => {
  return `https://www.${userName.replace(/[^A-Za-z0-9-]/g, "")}.com`;
};

const randomSubset = (arr, max) => {
  const count = randomInt(1, Math.min(max, arr.length));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const generateRandomUser = async (index) => {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const userName = generateUserName(firstName, lastName);

  const user = {
    userName: userName,
    email: generateEmail(firstName, lastName),
    password: await generatePassword(),
    passwordLastUpdated: new Date(
      Date.now() - randomInt(0, 365) * 24 * 60 * 60 * 1000,
    ),
    firstName: firstName,
    lastName: lastName,
  };

  if (randomBoolean() && Math.random() > 0.3) {
    user.middleName = randomElement(firstNames);
  }

  if (Math.random() > 0.3) {
    user.nickName = firstName + randomInt(1, 99);
  }

  if (Math.random() > 0.3) {
    user.age = randomInt(18, 65);
  }

  if (Math.random() > 0.3) {
    user.phone = generatePhoneNumber();
  }

  if (Math.random() > 0.3) {
    user.gender = randomElement(["male", "female", "other"]);
  }

  if (Math.random() > 0.3) {
    user.avatarUrl = `https://picsum.photos/800/600?random=${index}`;
  }

  if (Math.random() > 0.3) {
    user.coverPhotoUrl = `https://picsum.photos/1200/600?random=${index}`;
  }

  if (Math.random() > 0.3) {
    user.bio = `passionate ${randomElement(jobProfiles)} with ${randomInt(
      0,
      15,
    )} years of experience`;
  }

  if (Math.random() > 0.3) {
    user.maritalStatus = randomElement(["married", "single", "separated"]);
  }

  if (Math.random() > 0.3) {
    user.jobProfile = randomElement(jobProfiles);
  }

  if (Math.random() > 0.3) {
    user.experience = randomInt(0, 30);
  }

  if (Math.random() > 0.3) {
    user.facebook = generateFacebookUrl(userName);
  }

  if (Math.random() > 0.3) {
    user.instagram = generateInstagramUrl(userName);
  }

  if (Math.random() > 0.3) {
    user.twitter = generateTwitterUrl(userName);
  }

  if (Math.random() > 0.3) {
    user.github = generateGithubUrl(userName);
  }

  if (Math.random() > 0.3) {
    user.linkedin = generateLinkedinUrl(userName);
  }

  if (Math.random() > 0.3) {
    user.youtube = generateYoutubeUrl(userName);
  }

  if (Math.random() > 0.3) {
    user.website = generateWebsite(userName);
  }

  if (Math.random() > 0.3) {
    user.company = `${randomElement(lastNames)} technologies`;
  }

  if (Math.random() > 0.3) {
    user.organization = `${randomElement(lastNames)} technologies`;
  }

  if (Math.random() > 0.3) {
    user.skills = randomSubset(skills, 7);
  }

  if (Math.random() > 0.3) {
    user.interests = randomSubset(interests, 5);
  }

  if (Math.random() > 0.4) {
    user.address = {
      street: `${randomInt(1, 999)} ${randomElement(lastNames)} street`,
      city: randomElement(cities),
      state: randomElement(states),
      country: randomElement(countries),
      countryCode: randomInt(1, 999),
      pinCode: generatePinCode(),
    };

    if (Math.random() > 0.5) {
      user.address.landmark = `near ${randomElement(
        firstNames,
      )} ${randomElement(["mall", "park", "station"])}`;
    }
  }

  user.lastSeen = null;

  return user;
};

const seedUsers = async (count = 50) => {
  try {
    await connectDB();

    await User.deleteMany({});
    logger.success("✅ Cleared existing users");

    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(await generateRandomUser(i + 1));
    }

    await User.insertMany(users);
    logger.success(`✅ Successfully inserted ${count} users`);

    logger.info("\n📢 Sample user:", JSON.stringify(users[0], null, 2));

    mongoose.connection.close();
    logger.success("\n✅ Database connection closed");
  } catch (error) {
    logger.error("❌ Error seeding users:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

const numberOfUsers = process.argv[2] ? parseInt(process.argv[2]) : 50;
seedUsers(numberOfUsers);
