// src/eano/access-control/AccessControlProvider.tsx

import React, { useEffect, useState } from "react";
import { AbilityContext } from "./AbilityContext";
import { buildAbility, emptyAbility } from "./ability";
import { accessControlConfig } from "../config";

export function AccessControlProvider({ children }: { children: React.ReactNode }) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [ability, setAbility] = useState(emptyAbility);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const perms = await accessControlConfig.getPermissions();
        setPermissions(perms);
      } catch {
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, []);

  useEffect(() => {
    if (!loading) {
      const valid = permissions.filter((p) => p.includes(".")) as `${string}.${string}`[];
      const newAbility = buildAbility(valid);
      setAbility(newAbility);
    }

  }, [permissions, loading]);


  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
