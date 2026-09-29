/**
 * API Key & Rolling 24-Hour Trial Quota Manager for CyberIntel
 * 
 * - Handles client-side storage of user's personal OpenRouter API key.
 * - Enforces a rolling 24-hour limit of 25 complimentary AI generations using Cloudflare default secret.
 * - Automatically replenishes trial credits back to 25 every 24 hours.
 * - Dispatches browser events on updates so all UI components react immediately.
 */

export const TRIAL_LIMIT = 25;
export const TRIAL_WINDOW_HOURS = 24;
export const TRIAL_WINDOW_MS = TRIAL_WINDOW_HOURS * 60 * 60 * 1000;

const STORAGE_KEY_API_KEY = "cyberintel_custom_api_key";
const STORAGE_KEY_TRIAL_COUNT = "cyberintel_trial_used";
const STORAGE_KEY_TRIAL_RESET = "cyberintel_trial_reset_time";

/**
 * Checks if 24 hours have elapsed since the current window began.
 * If expired, automatically resets usage back to 0.
 */
export function checkAndApply24hReset(): void {
  if (typeof window === "undefined") return;
  try {
    const rawReset = localStorage.getItem(STORAGE_KEY_TRIAL_RESET);
    if (!rawReset) return;

    const resetTimestamp = parseInt(rawReset, 10);
    if (!isNaN(resetTimestamp) && Date.now() >= resetTimestamp) {
      // 24-hour cycle has elapsed! Replenish quota
      localStorage.setItem(STORAGE_KEY_TRIAL_COUNT, "0");
      localStorage.removeItem(STORAGE_KEY_TRIAL_RESET);
      window.dispatchEvent(
        new CustomEvent("cyberintel:quota-updated", {
          detail: { used: 0, remaining: TRIAL_LIMIT }
        })
      );
    }
  } catch {}
}

export function getCustomApiKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || "";
  } catch {
    return "";
  }
}

export function setCustomApiKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
    window.dispatchEvent(new CustomEvent("cyberintel:settings-updated", { detail: { hasKey: Boolean(key.trim()) } }));
  } catch (e) {
    console.error("Failed saving API key:", e);
  }
}

export function clearCustomApiKey(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
    window.dispatchEvent(new CustomEvent("cyberintel:settings-updated", { detail: { hasKey: false } }));
  } catch {}
}

export function hasCustomApiKey(): boolean {
  return Boolean(getCustomApiKey().trim());
}

export function getTrialUsed(): number {
  if (typeof window === "undefined") return 0;
  try {
    checkAndApply24hReset();
    const raw = localStorage.getItem(STORAGE_KEY_TRIAL_COUNT);
    const num = parseInt(raw || "0", 10);
    return isNaN(num) ? 0 : Math.max(0, num);
  } catch {
    return 0;
  }
}

export function incrementTrialUsed(): number {
  if (typeof window === "undefined") return 0;
  try {
    checkAndApply24hReset();
    const current = getTrialUsed();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEY_TRIAL_COUNT, next.toString());

    // If no reset timestamp exists yet for this cycle, start the 24h countdown
    if (!localStorage.getItem(STORAGE_KEY_TRIAL_RESET)) {
      const nextReset = Date.now() + TRIAL_WINDOW_MS;
      localStorage.setItem(STORAGE_KEY_TRIAL_RESET, nextReset.toString());
    }

    window.dispatchEvent(
      new CustomEvent("cyberintel:quota-updated", {
        detail: { used: next, remaining: Math.max(0, TRIAL_LIMIT - next) }
      })
    );
    return next;
  } catch {
    return 0;
  }
}

export function getTrialRemaining(): number {
  return Math.max(0, TRIAL_LIMIT - getTrialUsed());
}

export function isTrialExhausted(): boolean {
  if (hasCustomApiKey()) return false;
  return getTrialRemaining() <= 0;
}

export function getTimeUntilReset(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const rawReset = localStorage.getItem(STORAGE_KEY_TRIAL_RESET);
    if (!rawReset) return null;

    const resetTimestamp = parseInt(rawReset, 10);
    if (isNaN(resetTimestamp)) return null;

    const diff = resetTimestamp - Date.now();
    if (diff <= 0) return "resets now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${Math.max(1, minutes)}m`;
  } catch {
    return null;
  }
}

export function resetTrialQuota(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_TRIAL_COUNT);
    localStorage.removeItem(STORAGE_KEY_TRIAL_RESET);
    window.dispatchEvent(new CustomEvent("cyberintel:quota-updated", { detail: { used: 0, remaining: TRIAL_LIMIT } }));
  } catch {}
}
