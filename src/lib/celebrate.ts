import { sounds } from "./soundEffects";

/**
 * Universal celebration trigger
 * Dispatches celebratory confetti across the screen and plays retro audio fanfare
 */
export function triggerCelebration(message?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("celebrate-confetti", { detail: { message } }));
    sounds.playCoin();
  }
}

export function playClickSound() {
  if (typeof window !== "undefined") {
    sounds.playClick();
  }
}

export function playSuccessSound() {
  if (typeof window !== "undefined") {
    sounds.playSuccess();
  }
}

export function playAlertSound() {
  if (typeof window !== "undefined") {
    sounds.playAlert();
  }
}

