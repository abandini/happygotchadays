/**
 * AI-powered content generation for gotcha day posts
 */

/**
 * Generate story suggestions for adoption narrative
 * @param {Ai} ai - Cloudflare AI binding
 * @param {object} petInfo - Pet information (name, species, breed, gotchaDate)
 * @returns {Promise<string[]>} - Array of story prompts
 */
export async function generateStoryPrompts(ai, petInfo) {
  try {
    const prompt = `Generate 5 creative writing prompts to help someone write their ${petInfo.species}'s adoption story. The ${petInfo.species} named ${petInfo.name} was adopted on ${petInfo.gotchaDate}${petInfo.breed ? ` and is a ${petInfo.breed}` : ''}. Make the prompts warm, emotional, and helpful for capturing the joy of rescue pet adoption. Format as a numbered list.`;

    const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a helpful assistant specializing in pet adoption stories.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 512
    });

    const response = result.response || '';
    const prompts = response
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return prompts;
  } catch (error) {
    console.error('Story prompt generation error:', error);
    return [
      `What was your first impression when you met ${petInfo.name}?`,
      `How did ${petInfo.name} adjust to their new home?`,
      `What's your favorite memory with ${petInfo.name}?`,
      `How has ${petInfo.name} changed your life?`,
      `What would you tell someone considering adopting a pet?`
    ];
  }
}

/**
 * Generate celebration message for gotcha day anniversary
 * @param {Ai} ai - Cloudflare AI binding
 * @param {object} petInfo - Pet information
 * @param {number} yearsWithFamily - Number of years since adoption
 * @returns {Promise<string>} - Celebration message
 */
export async function generateCelebrationMessage(ai, petInfo, yearsWithFamily) {
  try {
    const prompt = `Write a warm, joyful celebration message for ${petInfo.name}, a ${petInfo.species}${petInfo.breed ? ` (${petInfo.breed})` : ''}, who is celebrating ${yearsWithFamily} year${yearsWithFamily !== 1 ? 's' : ''} since being adopted. Keep it under 100 words, heartfelt, and celebratory. Focus on the joy of rescue and the bond between pet and family.`;

    const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: 'You are a warm, enthusiastic writer celebrating pet adoption anniversaries.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 256
    });

    return result.response || `Happy ${yearsWithFamily} year${yearsWithFamily !== 1 ? 's' : ''} with ${petInfo.name}! 🎉`;
  } catch (error) {
    console.error('Celebration message generation error:', error);
    return `Happy ${yearsWithFamily} year${yearsWithFamily !== 1 ? 's' : ''} with ${petInfo.name}! 🎉`;
  }
}

/**
 * Suggest hashtags for a post
 * @param {Ai} ai - Cloudflare AI binding
 * @param {object} petInfo - Pet information
 * @param {string} postContent - Post content
 * @returns {Promise<string[]>} - Array of hashtag suggestions
 */
export async function suggestHashtags(ai, petInfo, postContent) {
  try {
    const prompt = `Suggest 5-8 relevant hashtags for a social media post about ${petInfo.name}, a ${petInfo.species}${petInfo.breed ? ` (${petInfo.breed})` : ''} celebrating their gotcha day (adoption anniversary). Post content: "${postContent}". Include popular pet adoption hashtags. Return only hashtags with # symbol, comma-separated.`;

    const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 128
    });

    const response = result.response || '';
    const hashtags = response
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith('#'))
      .slice(0, 8);

    if (hashtags.length === 0) {
      return ['#GotchaDay', '#AdoptDontShop', '#RescuePet', '#PetAdoption', `#${petInfo.species}Love`];
    }

    return hashtags;
  } catch (error) {
    console.error('Hashtag suggestion error:', error);
    return ['#GotchaDay', '#AdoptDontShop', '#RescuePet', '#PetAdoption', `#${petInfo.species}Love`];
  }
}
