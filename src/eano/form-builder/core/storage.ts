/**
 * @file storage.ts
 * @description Handles form data persistence (session, local) for the Form Builder system.
 * Each form is stored under a unique key derived from its formId.
 */

/* ========================================================================== */
/*                               Helpers                                       */
/* ========================================================================== */

/**
 * Build a storage key to namespace saved data.
 * @param formId - Unique form identifier
 */
const buildKey = (formId: string): string => `form_${formId}`;

/**
 * Safely parse JSON with fallback.
 */
const safeParse = <T>(data: string | null, fallback: T): T => {
  try {
    return data ? (JSON.parse(data) as T) : fallback;
  } catch {
    return fallback;
  }
};

/* ========================================================================== */
/*                               Core API                                     */
/* ========================================================================== */

/**
 * Save form data to the specified storage.
 * @param formId - Unique form identifier
 * @param data - Form values to persist
 * @param storage - Storage type: "session" or "local"
 *
 * @example
 * saveForm("productForm", { title: "Laptop" }, "session");
 */
export function saveForm(
  formId: string,
  data: Record<string, any>,
  storage: "session" | "local"
): void {
  const key = buildKey(formId);

  try {
    if (storage === "local") {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.warn(`Failed to save form data for "${formId}":`, error);
  }
}

/**
 * Load form data from the specified storage.
 * Returns empty object if not found.
 *
 * @param formId - Unique form identifier
 * @param storage - Storage type: "session" or "local"
 *
 * @example
 * const values = loadForm("productForm", "session");
 */
export function loadForm(
  formId: string,
  storage: "session" | "local"
): Record<string, any> {
  const key = buildKey(formId);

  try {
    if (storage === "local") {
      return safeParse(localStorage.getItem(key), {});
    } else {
      return safeParse(sessionStorage.getItem(key), {});
    }
  } catch (error) {
    console.warn(`Failed to load form data for "${formId}":`, error);
    return {};
  }
}

/**
 * Clear form data from the specified storage.
 *
 * @param formId - Unique form identifier
 * @param storage - Storage type: "session" or "local"
 *
 * @example
 * clearForm("productForm", "session");
 */
export function clearForm(
  formId: string,
  storage: "session" | "local"
): void {
  const key = buildKey(formId);

  try {
    if (storage === "local") {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  } catch (error) {
    console.warn(`Failed to clear form data for "${formId}":`, error);
  }
}
