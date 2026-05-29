import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-key',
});

export default openai;

export async function generateChatCompletion(messages: any[]) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY not found, returning mock response');
    return "This is a mock AI response. Please provide an OPENAI_API_KEY to get real AI-generated content.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
}
