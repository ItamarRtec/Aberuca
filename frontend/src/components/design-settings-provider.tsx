"use client";

import { useEffect } from "react";
import {
  applyDesignSettings,
  readDesignSettings,
} from "@/lib/design-settings";

export function DesignSettingsProvider() {
  useEffect(() => {
    applyDesignSettings(readDesignSettings());
  }, []);

  return null;
}
