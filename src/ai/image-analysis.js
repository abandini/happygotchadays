/**
 * AI-powered image analysis using Cloudflare Workers AI
 */

/**
 * Detect breed from pet image
 * @param {Ai} ai - Cloudflare AI binding
 * @param {ArrayBuffer} imageData - Image data
 * @returns {Promise<object>} - Breed detection results
 */
export async function detectBreed(ai, imageData) {
  try {
    const result = await ai.run('@cf/microsoft/resnet-50', {
      image: Array.from(new Uint8Array(imageData))
    });

    return result;
  } catch (error) {
    console.error('Breed detection error:', error);
    throw error;
  }
}

/**
 * Generate image description and alt text
 * @param {Ai} ai - Cloudflare AI binding
 * @param {ArrayBuffer} imageData - Image data
 * @returns {Promise<string>} - Image description
 */
export async function generateImageDescription(ai, imageData) {
  try {
    const result = await ai.run('@cf/llava-hf/llava-1.5-7b-hf', {
      image: Array.from(new Uint8Array(imageData)),
      prompt: "Describe this pet photo in detail, focusing on the animal's appearance, breed characteristics, and any activities shown.",
      max_tokens: 512
    });

    return result.description || result.response || 'Unable to generate description';
  } catch (error) {
    console.error('Image description error:', error);
    throw error;
  }
}

/**
 * Moderate image content
 * @param {Ai} ai - Cloudflare AI binding
 * @param {ArrayBuffer} imageData - Image data
 * @returns {Promise<object>} - Moderation results
 */
export async function moderateImage(ai, imageData) {
  try {
    // Use vision model to check for inappropriate content
    const result = await ai.run('@cf/llava-hf/llava-1.5-7b-hf', {
      image: Array.from(new Uint8Array(imageData)),
      prompt: "Is this image appropriate for a family-friendly pet adoption website? Answer yes or no and explain briefly.",
      max_tokens: 256
    });

    const response = result.description || result.response || '';
    const isAppropriate = response.toLowerCase().includes('yes');

    return {
      isAppropriate,
      reason: response
    };
  } catch (error) {
    console.error('Image moderation error:', error);
    // Default to safe if moderation fails
    return { isAppropriate: true, reason: 'Moderation unavailable' };
  }
}

/**
 * Generate tags for image
 * @param {Ai} ai - Cloudflare AI binding
 * @param {ArrayBuffer} imageData - Image data
 * @returns {Promise<string[]>} - Array of tags
 */
export async function generateImageTags(ai, imageData) {
  try {
    const result = await ai.run('@cf/llava-hf/llava-1.5-7b-hf', {
      image: Array.from(new Uint8Array(imageData)),
      prompt: "Generate 5-10 relevant tags for this pet photo (e.g., 'puppy', 'playful', 'outdoor', 'sleeping'). Return only comma-separated tags.",
      max_tokens: 128
    });

    const response = result.description || result.response || '';
    const tags = response.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    return tags;
  } catch (error) {
    console.error('Tag generation error:', error);
    return [];
  }
}
