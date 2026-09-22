// src/eano/access-control/Can.tsx

import { Can as CaslCan } from "@casl/react";
import { useAbilityFromContext } from "./AbilityContext";
import type { Action, Subject } from "./types";
import type { AppAbility } from "./ability";

interface CanProps {
  I: Action;
  a: Subject;
  children: React.ReactNode;
  data?: any;
  ability?: AppAbility;
}

export function Can({ I, a, data, ability, children }: CanProps) {
  const contextAbility = useAbilityFromContext();
  const finalAbility = ability ?? contextAbility;

  return (
    <CaslCan I={I} a={a} this={data} ability={finalAbility}>
      {children}
    </CaslCan>
  );
}
