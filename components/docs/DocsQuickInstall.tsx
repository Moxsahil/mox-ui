"use client";

import { useState } from "react";
import { installCommand, type PackageManager } from "@/lib/components";
import { TerminalLine } from "./DocsInstall";

export default function DocsQuickInstall({ registry }: { registry: string }) {
  const [pm, setPm] = useState<PackageManager>("pnpm");
  const command = installCommand({ registry }, pm);

  if (!command) return null;

  return <TerminalLine command={command} pm={pm} onPmChange={setPm} />;
}
