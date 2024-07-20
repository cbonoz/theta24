import OpenAI from "openai";

// Set OpenAI's API key to use vLLM's API server.
const openAiKey = process.env.NEXT_PUBLIC_OPEN_API_KEY;
const openAiBase =
	process.env.NEXT_PUBLIC_THETA_API_URL ||
	"https://gemma2b1zs30uriff-2c7dcb97ce0c4265.tec-s1.onthetaedgecloud.com/v1";
const dangerouslyAllowBrowser = true;

const openai = new OpenAI({
	apiKey: openAiKey,
	baseURL: openAiBase,
	dangerouslyAllowBrowser,
});

export const generateVideoRequestScript = async (videoRequest: string) => {
	const prompt = `Pretend the following is a video concept: ${videoRequest}. Generate a hypothetical script for this video.`;

	const completion: any = await openai.completions.create({
		model: "google/gemma-2b",
		prompt: [prompt],
		max_tokens: 200,
	});

	console.log("completion", JSON.stringify(completion, null, 2));

	return completion;
};
