export type Language = {
  name: string;
  code: string;
  bcp47: string;
};

export const languages: Language[] = [
  { name: 'Hindi', code: 'hi', bcp47: 'hi-IN' },
  { name: 'Bhojpuri', code: 'bho', bcp47: 'hi-IN' }, // Fallback to Hindi for speech API
  { name: 'Tamil', code: 'ta', bcp47: 'ta-IN' },
  { name: 'Bengali', code: 'bn', bcp47: 'bn-IN' },
  { name: 'Marathi', code: 'mr', bcp47: 'mr-IN' },
  { name: 'Telugu', code: 'te', bcp47: 'te-IN' },
  { name: 'Odia', code: 'or', bcp47: 'bn-IN' }, // Fallback to Bengali for speech API
];
