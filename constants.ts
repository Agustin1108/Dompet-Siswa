import { Category, SoundAssets } from "./types";

// Shortened Base64 audio placeholders for the purpose of this demo.
// In a production app, these would be hosted files or fuller base64 strings.
// Using very short synthesized blips to ensure code fits.

const TAP_SOUND = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; 
// Note: The above is a dummy header for size. 
// Real implementation uses a helper in AudioService to synthesize or plays actual files.
// Since I cannot embed 5MB of audio here, I will implement a Web Audio API synthesizer in the service
// to generate the sounds procedurally (Beeps, Boops, Swooshes) for maximum immersion without file weight.

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Makan', icon: '🍔', color: 'bg-orange-500' },
  { id: 'transport', name: 'Transport', icon: '🚌', color: 'bg-blue-500' },
  { id: 'school', name: 'Sekolah', icon: '📚', color: 'bg-indigo-500' },
  { id: 'snack', name: 'Jajan', icon: '🍦', color: 'bg-pink-500' },
  { id: 'game', name: 'Game', icon: '🎮', color: 'bg-purple-500' },
  { id: 'saving', name: 'Tabungan', icon: '💰', color: 'bg-green-500' },
  { id: 'other', name: 'Lainnya', icon: '⚪', color: 'bg-gray-400' },
];

export const APP_NAME = "Dompet Siswa";
