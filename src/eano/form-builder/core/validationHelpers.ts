/**
 * @file validationHelpers.ts
 * @description Helpers for parsing string-based validation rules and providing default messages.
 */

import type { ValidationRule, FormField } from "../types/form.types";

/* ========================================================================== */
/*                          String → ValidationRule[]                          */
/* ========================================================================== */

/**
 * Parse a Laravel-like validation string into an array of ValidationRule objects.
 *
 * Examples:
 *  "required|min:1"        → [{ kind: "required" }, { kind: "min", value: 1 }]
 *  "required|email"        → [{ kind: "required" }, { kind: "email" }]
 *  "min:3|max:10|url"      → [...]
 */
export function parseValidationString(raw: string): ValidationRule[] {
    if (!raw || typeof raw !== "string") return [];

    const tokens = raw.split("|").map((t) => t.trim()).filter(Boolean);

    const rules: ValidationRule[] = [];

    for (const token of tokens) {
        const [kindRaw, arg] = token.split(":");
        const kind = kindRaw.trim() as ValidationRule["kind"];

        switch (kind) {
            case "required":
                rules.push({ kind: "required" });
                break;

            case "min":
                if (arg !== undefined) {
                    const num = Number(arg);
                    if (!Number.isNaN(num)) {
                        rules.push({ kind: "min", value: num });
                    }
                }
                break;

            case "max":
                if (arg !== undefined) {
                    const num = Number(arg);
                    if (!Number.isNaN(num)) {
                        rules.push({ kind: "max", value: num });
                    }
                }
                break;

            case "email":
                rules.push({ kind: "email" });
                break;

            case "url":
                rules.push({ kind: "url" });
                break;

            // يمكنك لاحقاً إضافة pattern, custom, ... إلخ
            default:
                // Unknown rule → تجاهله حتى لا نكسر النظام
                break;
        }
    }

    return rules;
}

/* ========================================================================== */
/*                        Default Error Messages (Central)                    */
/* ========================================================================== */

/**
 * Central place for all default validation messages.
 * You can customize wording here only once.
 */
export function getDefaultValidationMessage(
    rule: ValidationRule,
    field?: FormField
): string {

    const fieldLabel = getFieldLabel(field);

    switch (rule.kind) {
        case "required":
            return `${fieldLabel} is required.`;

        case "min":
            return `Minimum value is ${rule.value}.`;

        case "max":
            return `Maximum value is ${rule.value}.`;

        case "pattern":
            return `${fieldLabel} has an invalid format.`;

        case "email":
            return `Please enter a valid email address.`;

        case "url":
            return `Please enter a valid URL.`;

        case "custom":
            return `${fieldLabel} is invalid.`;

        default:
            return `${fieldLabel} is invalid.`;
    }
}

function getFieldLabel(field?: FormField): string {
    if (!field) return "Unknown Field";

    if (field.type === "container") {
        return "Container";
    }

    const f = field as any;

    return (
        f.label ||
        f.props?.label ||
        f.name ||
        "Unknown Field"
    );
}

