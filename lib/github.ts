import { cache } from "react";
import { GITHUB_REPO } from "@/lib/site";

export const fetchStarCount = cache(async () => {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const count = data?.stargazers_count;
    return typeof count === "number" && Number.isInteger(count) && count >= 0
      ? count
      : null;
  } catch {
    return null;
  }
});
