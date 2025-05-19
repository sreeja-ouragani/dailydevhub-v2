const skillKeywords = ['react', 'node', 'express', 'mongodb', 'javascript', 'typescript', 'tailwind', 'ai', 'machine learning'];

export const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  return skillKeywords.filter(skill => lowerText.includes(skill));
};
