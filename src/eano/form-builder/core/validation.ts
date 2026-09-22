/**
 * @file validation.ts
 * @description Core validation engine for the Form Builder system.
 * Evaluates all field-level rules (required, min, max, pattern, email, url, custom).
 */

import type { FormField, ValidationRule, FormRuntimeCtx } from "../types/form.types";
import { parseValidationString, getDefaultValidationMessage } from "./validationHelpers";

/* ========================================================================== */
/*                              Helper Utilities                              */
/* ========================================================================== */

/**
 * Check if a value is considered "empty".
 */
const isEmpty = (value: any): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

/**
 * Strip HTML tags from string to get plain text length.
 * Used for richtext validation.
 */
const stripHtmlTags = (html: string): string => {
  if (!html || typeof html !== "string") return "";
  // Remove HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, "") // Remove tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
};

/**
 * Simple regex validators for email and URL.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i;

/* ========================================================================== */
/*                              Main Validation                               */
/* ========================================================================== */

/**
 * Validate a single field value against its rules.
 * @param field - Field definition (includes validation array or string)
 * @param value - Current value
 * @param ctx - Optional runtime context (for custom validators)
 * @returns Array of error messages (empty if valid)
 *
 * @example
 * const errors = await validateField(field, value, ctx);
 */
export async function validateField(
  field: FormField,
  value: any,
  ctx?: FormRuntimeCtx
): Promise<string[]> {
  // Container fields don't have validation
  if (!('validation' in field)) {
    return [];
  }

  const rawRules = field.validation;

  let rules: ValidationRule[] = [];

  if (typeof rawRules === "string") {
    // "required|min:1" → ValidationRule[]
    rules = parseValidationString(rawRules);
  } else if (Array.isArray(rawRules)) {
    rules = rawRules;
  } else {
    rules = [];
  }

  const errors: string[] = [];

  for (const rule of rules) {
    const message = await validateRule(rule, value, ctx, field);
    if (message) errors.push(message);
  }

  return errors;
}

/**
 * Validate a single rule on a given value.
 */
async function validateRule(
  rule: ValidationRule,
  value: any,
  ctx?: FormRuntimeCtx,
  field?: FormField
): Promise<string | void> {
  // Check if this is a richtext field
  const isRichTextField = field && 'type' in field && field.type === 'richtext';
  
  // For richtext, get plain text length
  const textLength = isRichTextField && typeof value === 'string' 
    ? stripHtmlTags(value).length 
    : typeof value === 'string' 
      ? value.length 
      : 0;

  switch (rule.kind) {
    case "required":
      // For richtext, check if plain text is empty
      if (isRichTextField && typeof value === 'string') {
        if (stripHtmlTags(value).trim() === '') {
          return rule.message || getDefaultValidationMessage(rule, field);
        }
      } else if (isEmpty(value)) {
        return rule.message || getDefaultValidationMessage(rule, field);
      }
      break;

    case "min":
      if (isRichTextField && typeof value === 'string') {
        // For richtext, validate plain text length
        if (textLength < rule.value) {
          return rule.message || getDefaultValidationMessage(rule, field);
        }
      } else if (typeof value === "string" && value.length < rule.value) {
        return rule.message || getDefaultValidationMessage(rule, field);
      } else if (typeof value === "number" && value < rule.value) {
        return rule.message || getDefaultValidationMessage(rule, field);
      }
      break;

    case "max":
      if (isRichTextField && typeof value === 'string') {
        // For richtext, validate plain text length
        if (textLength > rule.value) {
          return rule.message || getDefaultValidationMessage(rule, field);
        }
      } else if (typeof value === "string" && value.length > rule.value) {
        return rule.message || getDefaultValidationMessage(rule, field);
      } else if (typeof value === "number" && value > rule.value) {
        return rule.message || getDefaultValidationMessage(rule, field);
      }
      break;

    case "pattern":
      if (typeof value === "string" && rule.regex && !rule.regex.test(value)) {
        return rule.message || getDefaultValidationMessage(rule, field);
      }
      break;

    case "email":
      if (typeof value === "string" && !EMAIL_REGEX.test(value)) {
        return rule.message || getDefaultValidationMessage(rule, field);
      }
      break;

    case "url":
      if (typeof value === "string" && !URL_REGEX.test(value)) {
        return rule.message || getDefaultValidationMessage(rule, field);
      }
      break;

    case "custom":
      if (typeof rule.validate === "function") {
        const res = await rule.validate(value, ctx!, field!);
        if (typeof res === "string") return res;
      }
      break;
  }
}
