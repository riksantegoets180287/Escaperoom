const sounds = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  complete: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  typing: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  hover: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  cardOpen: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3',
  input: 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3',
  correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
};

export const playSound = (name: keyof typeof sounds, volume: number = 0.5) => {
  const audio = new Audio(sounds[name]);
  audio.volume = volume;
  audio.play().catch(e => console.log('Audio play blocked:', e));
};
