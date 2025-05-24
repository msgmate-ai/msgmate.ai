export type Tone = {
  value: string;
  label: string;
  tier: 'free' | 'basic' | 'pro';
};

export const getTones = () => {
  const freeTones: Tone[] = [
    { value: 'friendly', label: 'Friendly', tier: 'free' },
    { value: 'professional', label: 'Professional', tier: 'free' },
    { value: 'casual', label: 'Casual', tier: 'free' },
    { value: 'enthusiastic', label: 'Enthusiastic', tier: 'free' },
    { value: 'clear', label: 'Clear & Direct', tier: 'free' },
  ];

  const basicTones: Tone[] = [
    { value: 'empathetic', label: 'Empathetic', tier: 'basic' },
    { value: 'humorous', label: 'Humorous', tier: 'basic' },
    { value: 'supportive', label: 'Supportive', tier: 'basic' },
    { value: 'confident', label: 'Confident', tier: 'basic' },
    { value: 'curious', label: 'Curious', tier: 'basic' },
  ];

  const proTones: Tone[] = [
    { value: 'flirty', label: 'Flirty', tier: 'pro' },
    { value: 'assertive', label: 'Assertive', tier: 'pro' },
    { value: 'grateful', label: 'Grateful', tier: 'pro' },
    { value: 'diplomatic', label: 'Diplomatic', tier: 'pro' },
    { value: 'apologetic', label: 'Apologetic', tier: 'pro' },
  ];

  return {
    freeTones,
    basicTones,
    proTones,
  };
};
