"use client";

import BasicCard from "@/components/basic-card";
import RenderObject from "@/components/render-object";
import { Button } from "@/components/ui/button";
import { useEthersSigner } from "@/lib/get-signer";
import { siteConfig } from "@/util/site-config";
import { useState } from "react";

const About = () => {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);

	const signer = useEthersSigner();

	return (
		<div className="flex flex-row items-center justify-center mt-8">
			<BasicCard
				title="About CreatorPage"
				description="Learn more about CreatorPage and how it works."
				className="max-w-[1000px] p-4"
			>
				{siteConfig.about.map((section, index) => (
					<div key={index} className="mt-4">
						<h3 className="text-lg font-bold">{section.title}</h3>
						<p>{section.description}</p>
					</div>
				))}

				{/* <Button
                    onClick={getSchemaId}
                    disabled={loading}
                    className="mt-3"
                >
                    {loading && (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Get Schema ID
                </Button> */}

				{result && (
					<div className="my-2">
						<RenderObject title="Result" obj={result} />
					</div>
				)}
			</BasicCard>
		</div>
	);
};
export default About;
