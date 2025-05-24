export type Tone = {
  value: string;
  label: string;
  tier: 'free' | 'basic' | 'pro';
};

export const getTones = () => {
  const freeTones: Tone[] = [
    { value: 'natural', label: 'Natural', tier: 'free' },
    { value: 'friendly', label: 'Friendly', tier: 'free' },
    { value: 'casual', label: 'Casual', tier: 'free' },
    { value: 'enthusiastic', label: 'Enthusiastic', tier: 'free' },
    { value: 'playful', label: 'Playful', tier: 'free' },
  ];

  const basicTones: Tone[] = [
    { value: 'flirty', label: 'Flirty', tier: 'basic' },
    { value: 'witty', label: 'Witty', tier: 'basic' },
    { value: 'mysterious', label: 'Mysterious', tier: 'basic' },
    { value: 'confident', label: 'Confident', tier: 'basic' },
    { value: 'curious', label: 'Curious', tier: 'basic' },
  ];

  const proTones: Tone[] = [
    { value: 'romantic', label: 'Romantic', tier: 'pro' },
    { value: 'passionate', label: 'Passionate', tier: 'pro' },
    { value: 'charming', label: 'Charming', tier: 'pro' },
    { value: 'deep', label: 'Deep & Thoughtful', tier: 'pro' },
    { value: 'bold', label: 'Bold', tier: 'pro' },
  ];

  return {
    freeTones,
    basicTones,
    proTones,
  };
};
