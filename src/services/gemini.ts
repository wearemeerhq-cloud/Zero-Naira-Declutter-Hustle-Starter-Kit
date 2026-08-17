import { UserProfile, StarterKit } from '../types';

export const generateStarterKitApi = async (profile: UserProfile): Promise<StarterKit> => {
  const response = await fetch('/api/generate-starter-kit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate Starter Kit. Server status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
