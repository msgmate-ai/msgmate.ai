export type Tone = {
  value: string;
  label: string;
  emoji: string;
  description: string;
  tier: 'free' | 'basic' | 'pro';
};

export const getTones = () => {
  const freeTones: Tone[] = [
    { value: 'playful', label: 'Playful', emoji: '😊', description: 'Light-hearted and fun responses with a touch of humour', tier: 'free' },
    { value: 'witty', label: 'Witty', emoji: '😏', description: 'Clever, quick-witted responses with subtle humour', tier: 'free' },
    { value: 'flirty', label: 'Flirty', emoji: '😘', description: 'Cheeky, suggestive replies that show romantic interest', tier: 'free' },
    { value: 'authentic', label: 'Authentic', emoji: '💯', description: 'Genuine, thoughtful responses that reveal your true personality', tier: 'free' },
    { value: 'supportive', label: 'Supportive', emoji: '🤗', description: 'Warm, encouraging messages that show you care', tier: 'free' },
  ];

  const basicTones: Tone[] = [
    { value: 'confident', label: 'Confident', emoji: '💪', description: 'Self-assured messages that convey certainty and poise', tier: 'basic' },
    { value: 'humorous', label: 'Humorous', emoji: '😂', description: 'Funny responses aimed at making them laugh', tier: 'basic' },
    { value: 'curious', label: 'Curious', emoji: '🤔', description: 'Inquisitive replies that show genuine interest in learning more', tier: 'basic' },
    { value: 'enthusiastic', label: 'Enthusiastic', emoji: '🎉', description: 'Energetic messages that express excitement and positivity', tier: 'basic' },
    { value: 'casual', label: 'Casual', emoji: '✌️', description: 'Relaxed, laid-back responses that keep things low-pressure', tier: 'basic' },
  ];

  const proTones: Tone[] = [
    { value: 'romantic', label: 'Romantic', emoji: '❤️', description: 'Affectionate messages that express deeper feelings', tier: 'pro' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🔮', description: 'Intriguing responses that leave them wanting to know more', tier: 'pro' },
    { value: 'assertive', label: 'Assertive', emoji: '👊', description: 'Direct, clear messages that show you know what you want', tier: 'pro' },
    { value: 'sincere', label: 'Sincere', emoji: '🙏', description: 'Heartfelt, honest responses that show vulnerability', tier: 'pro' },
    { value: 'charming', label: 'Charming', emoji: '✨', description: 'Sophisticated, elegant messages with subtle appeal', tier: 'pro' },
  ];

  return {
    freeTones,
    basicTones,
    proTones,
  };
};
