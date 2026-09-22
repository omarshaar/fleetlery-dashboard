// src/eano/access-control/ability.ts

import {
  type MongoAbility,
  AbilityBuilder,
  createMongoAbility,
} from "@casl/ability";
import type { PermissionString } from "./types";

// Ability tuple type: [action, subject]
export type AppAbilityTuple = [string, string];

// Our Ability type
export type AppAbility = MongoAbility<AppAbilityTuple>;

// Build ability dynamically from permissions
export function buildAbility(permissions: PermissionString[]): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility);

  permissions.forEach((perm) => {
    const [action, subject] = perm.split(".");
    if (action && subject) {
      builder.can(action, subject);
    }
  });

  return builder.build(); // the correct way to build an ability
}

// Empty ability instance (no permissions)
export const emptyAbility: AppAbility = buildAbility([]); 