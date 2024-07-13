


export const generateVideoRequestScript = async (videoRequest: string) => {

  const prompt = `Pretend the following is a video concept: ${videoRequest}. Generate a hypothetical script for this video.`

  // TODO: call llm api to generate script

  return prompt
}
