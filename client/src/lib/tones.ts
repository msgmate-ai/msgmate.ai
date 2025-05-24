export type Tone = {
  value: string;
  label: string;
  emoji: string;
  tier: 'free' | 'basic' | 'pro';
};

export const getTones = () => {
  const freeTones: Tone[] = [
    { value: 'playful', label: 'Playful', emoji: '😊', tier: 'free' },
    { value: 'witty', label: 'Witty', emoji: '😏', tier: 'free' },
    { value: 'flirty', label: 'Flirty', emoji: '😘', tier: 'free' },
    { value: 'authentic', label: 'Authentic', emoji: '💯', tier: 'free' },
    { value: 'supportive', label: 'Supportive', emoji: '🤗', tier: 'free' },
  ];

  const basicTones: Tone[] = [
    { value: 'confident', label: 'Confident', emoji: '💪', tier: 'basic' },
    { value: 'humorous', label: 'Humorous', emoji: '😂', tier: 'basic' },
    { value: 'curious', label: 'Curious', emoji: '🤔', tier: 'basic' },
    { value: 'enthusiastic', label: 'Enthusiastic', emoji: '🎉', tier: 'basic' },
    { value: 'casual', label: 'Casual', emoji: '✌️', tier: 'basic' },
  ];

  const proTones: Tone[] = [
    { value: 'romantic', label: 'Romantic', emoji: '❤️', tier: 'pro' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🔮', tier: 'pro' },
    { value: 'assertive', label: 'Assertive', emoji: '👊', tier: 'pro' },
    { value: 'sincere', label: 'Sincere', emoji: '🙏', tier: 'pro' },
    { value: 'charming', label: 'Charming', emoji: '✨', tier: 'pro' },
  ];

  return {
    freeTones,
    basicTones,
    proTones,
  };
};
