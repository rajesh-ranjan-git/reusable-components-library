import { sanitizeMongoData } from "../db/db.utils.js";
import { omitObjectProperties, toTitleCase } from "./common.utils.js";

export const normalizedDiscoveredUser = (users) => {
  return sanitizeMongoData(users).map((user) => ({
    ...omitObjectProperties(user, ["id", "user"]),
    userId: user.user.id,
    jobRole: getCurrentJobRole(user.experiences),
    topSkills: getTopSkills(user.skills),
  }));
};

export const getFullName = (user) => {
  if (!user) return "John Doe";

  const { firstName, lastName, userName, email } = user;

  if (firstName && lastName) return toTitleCase(`${firstName} ${lastName}`);
  if (firstName) return toTitleCase(firstName);
  if (lastName) return toTitleCase(lastName);
  if (userName) return userName;
  if (email) return email;

  return "John Doe";
};

export const getCurrentJobRole = (experiences) => {
  if (!experiences?.length) return null;

  let latest = null;

  for (const exp of experiences) {
    if (exp?.isCurrent && exp?.role) return exp.role;

    if (
      exp?.role &&
      exp?.startDate &&
      (!latest || new Date(exp.startDate) > new Date(latest.startDate))
    ) {
      latest = exp;
    }
  }

  return latest?.role ?? null;
};

export const getTopSkills = (skills, limit = 3) => {
  const skillLevelRank = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    expert: 4,
  };

  return [...skills]
    .sort((a, b) => skillLevelRank[b.level] - skillLevelRank[a.level])
    .slice(0, limit);
};
