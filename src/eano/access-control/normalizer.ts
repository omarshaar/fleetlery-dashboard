/**
 * Permission Normalizer
 * ---------------------
 * This function ensures that incoming permission/role data from the backend
 * is converted into a unified format compatible with our AccessControl system.
 *
 * WHY NORMALIZER?
 * ---------------
 * Backends may return permissions in various formats:
 *  - roles only       → ["admin", "developer"]
 *  - mixed structures → { roles: [...], grants: [...] }
 *  - invalid patterns → ["Product.view", "user.user", "ACTION_SUBJECT"]
 *
 * Our AccessControl system requires ALL permissions in the format:
 *      "action.subject"
 *
 * The normalizer is responsible for:
 *  1) Converting any backend data into valid permission strings.
 *  2) Expanding roles → permissions (if a mapping exists).
 *  3) Cleaning or transforming malformed permission names.
 *  4) Ensuring the final output is an array of valid permissions.
 *
 * IMPORTANT:
 * ----------
 * This function does NOT enforce any business rules.
 * It only transforms/normalizes raw backend data to a consistent format.
 *
 * The backend team should provide:
 *  - The exact role→permissions mapping (if roles are used)
 *  - The raw API structure for incoming authorization data
 *
 * RETURNS:
 *  -------
 *  A flat array of normalized permission strings:
 *      ["view.Product", "edit.Product", "manage.User"]
 */

export function normalizePermissions(_raw: any): string[] {
  /**
   * TODO:
   *  - Inspect raw data
   *  - Detect shape (roles? permissions? mixed?)
   *  - Apply role→permissions mapping if needed
   *  - Convert invalid formats into "action.subject"
   *  - Remove duplicates
   *  - Return final array of permission strings
   */

  // Placeholder — always return empty array until implemented
  return [];
}
