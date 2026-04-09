export const extractPermissions = (role) => {
  if (!role) return new Set();

  if (Array.isArray(role)) {
    role.forEach((ur) => {
      extractPermissions(ur.role);
    });
  }

  const permissions = new Set();

  role.permissions.forEach((p) => permissions.add(p.key));

  if (role.inherits?.length) {
    role.inherits.forEach((r) => extractPermissions(r));
  }

  return permissions;
};
