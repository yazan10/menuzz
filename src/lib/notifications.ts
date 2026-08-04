// Browser Notification & Audio Alert Helper for menuz platform

let alertIntervalId: number | null = null;
let alertAudioCtx: AudioContext | null = null;
let isAlertRinging = false;
const soundListeners = new Set<(ringing: boolean) => void>();

function notifySoundListeners() {
  soundListeners.forEach((fn) => fn(isAlertRinging));
}

export function subscribeOrderAlertState(listener: (ringing: boolean) => void) {
  soundListeners.add(listener);
  listener(isAlertRinging);
  return () => {
    soundListeners.delete(listener);
  };
}

export function isOrderAlertRinging(): boolean {
  return isAlertRinging;
}

function playKitchenBellRing() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!alertAudioCtx || alertAudioCtx.state === 'closed') {
      alertAudioCtx = new AudioCtx();
    }
    const ctx = alertAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Bell chime 1: High note E5
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Bell chime 2: Higher note G#5
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(830.61, now + 0.15);
    gain2.gain.setValueAtTime(0.35, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);

    // Bell chime 3: High bell B5
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(987.77, now + 0.3);
    gain3.gain.setValueAtTime(0.4, now + 0.3);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.3);
    osc3.stop(now + 0.8);

  } catch (err) {
    console.warn('Kitchen bell sound failed or blocked by browser user gesture policy:', err);
  }
}

export function startOrderAlertSound() {
  if (isAlertRinging) return;
  isAlertRinging = true;
  notifySoundListeners();

  // Play immediately
  playKitchenBellRing();

  // Loop every 1.2 seconds until stopped
  if (typeof window !== 'undefined') {
    if (alertIntervalId) clearInterval(alertIntervalId);
    alertIntervalId = window.setInterval(() => {
      if (isAlertRinging) {
        playKitchenBellRing();
      } else {
        if (alertIntervalId) clearInterval(alertIntervalId);
      }
    }, 1200);
  }
}

export function stopOrderAlertSound() {
  isAlertRinging = false;
  notifySoundListeners();

  if (alertIntervalId) {
    clearInterval(alertIntervalId);
    alertIntervalId = null;
  }

  if (alertAudioCtx && alertAudioCtx.state !== 'closed') {
    try {
      alertAudioCtx.close();
    } catch {
      // ignore
    }
    alertAudioCtx = null;
  }
}

export function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // First Tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Second Tone (Higher chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (err) {
    console.warn('Audio playback failed or context restricted:', err);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications.');
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Permission request error:', err);
    return 'denied';
  }
}

export function triggerBrowserNotification(title: string, options?: { body?: string; icon?: string; tag?: string; isOrder?: boolean }) {
  if (options?.isOrder) {
    startOrderAlertSound();
  } else {
    playNotificationChime();
  }

  // Try standard browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body: options?.body || 'تنبيه جديد من منصة menuz',
        icon: options?.icon || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop',
        tag: options?.tag || 'menuz-alert',
        dir: 'rtl',
        lang: 'ar',
      });

      notif.onclick = () => {
        stopOrderAlertSound();
        window.focus();
      };
    } catch (err) {
      console.warn('Failed to dispatch native browser notification:', err);
    }
  }
}

