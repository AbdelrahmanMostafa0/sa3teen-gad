const ANALYTICS_PROMPT_KEY = "analytics_prompt_dismissed";
const DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Check if enough time has passed since the user last dismissed the analytics prompt
 * @returns true if the prompt should be shown, false otherwise
 */
export function shouldShowAnalyticsPrompt(): boolean {
  if (typeof window === "undefined") return false;

  const dismissedAt = localStorage.getItem(ANALYTICS_PROMPT_KEY);

  if (!dismissedAt) {
    return true;
  }

  const dismissedTimestamp = parseInt(dismissedAt, 10);
  const now = Date.now();

  // Show prompt if more than 7 days have passed
  return now - dismissedTimestamp > DISMISSAL_DURATION;
}

/**
 * Store the current timestamp when user dismisses the analytics prompt
 */
export function dismissAnalyticsPrompt(): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(ANALYTICS_PROMPT_KEY, Date.now().toString());
}

/**
 * Clear the dismissal timestamp (useful for testing)
 */
export function clearAnalyticsPromptDismissal(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ANALYTICS_PROMPT_KEY);
}
