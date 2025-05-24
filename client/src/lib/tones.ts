export type Tone = {
  value: string;
  label: string;
  tier: 'free' | 'basic' | 'pro';
};

export const getTones = () => {
  const freeTones: Tone[] = [
    { value: 'authentic', label: 'Authentic', tier: 'free' },
    { value: 'supportive', label: 'Supportive', tier: 'free' },
    { value: 'casual', label: 'Casual', tier: 'free' },
    { value: 'witty', label: 'Witty', tier: 'free' },
    { value: 'playful', label: 'Playful', tier: 'free' },
  ];

  const basicTones: Tone[] = [
    { value: 'flirty', label: 'Flirty', tier: 'basic' },
    { value: 'enthusiastic', label: 'Enthusiastic', tier: 'basic' },
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
