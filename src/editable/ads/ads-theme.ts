// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — tune to your brand.
export const adSkin: AdSkin = {
  radius: '28px',
  border: '1px solid #E4DECE',
  shadow: '0 10px 30px rgba(23,23,15,0.06)',
  background: '#ffffff',
  labelClassName: 'bg-[#5CBF4E] text-[#12210E]',
}

// Optional per-slot overrides — adjust only where you need to.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '24px', shadow: 'none', border: '1px solid #E4DECE' },
  popup: { radius: '32px' },
  header: { radius: '28px', background: '#F3EFE5' },
  rail: { radius: '20px' },
  feature: { radius: '28px' },
  interstitial: { radius: '32px', shadow: '0 24px 70px rgba(23,23,15,0.45)' },
  anchor: { radius: '999px', shadow: '0 10px 28px rgba(23,23,15,0.2)' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
// junior tweak


