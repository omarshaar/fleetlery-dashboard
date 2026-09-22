// src/eano/access-control/AbilityContext.tsx

import { createContext, useContext } from "react";
import { emptyAbility } from "./ability";
import type { AppAbility } from "./ability";

export const AbilityContext = createContext<AppAbility>(emptyAbility as AppAbility);

export const useAbilityFromContext = () => useContext(AbilityContext);
