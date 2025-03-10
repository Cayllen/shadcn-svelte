import path from "path";
import type { RequestInit } from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import * as z from "zod";
import { Config } from "../get-config";
import { getEnvProxy } from "../get-env-proxy";
import {
	registryBaseColorSchema,
	registryIndexSchema,
	registryItemSchema,
	registryItemWithContentSchema,
	registryWithContentSchema,
	stylesSchema,
} from "./schema";

const baseUrl = process.env.COMPONENTS_REGISTRY_URL ?? "https://shadcn-svelte.com";

const proxyUrl = getEnvProxy();

export type RegistryItem = z.infer<typeof registryItemSchema>;

export async function getRegistryIndex() {
	try {
		const [result] = await fetchRegistry(["index.json"]);

		return registryIndexSchema.parse(result);
	} catch (error) {
		throw new Error(`Failed to fetch components from registry.`);
	}
}

export async function getRegistryStyles() {
	try {
		const [result] = await fetchRegistry(["styles/index.json"]);

		return stylesSchema.parse(result);
	} catch (error) {
		throw new Error(`Failed to fetch styles from registry.`);
	}
}

export async function getRegistryBaseColors() {
	return [
		{
			name: "slate",
			label: "Slate",
		},
		{
			name: "gray",
			label: "Gray",
		},
		{
			name: "zinc",
			label: "Zinc",
		},
		{
			name: "neutral",
			label: "Neutral",
		},
		{
			name: "stone",
			label: "Stone",
		},
	];
}

export async function getRegistryBaseColor(baseColor: string) {
	try {
		const [result] = await fetchRegistry([`colors/${baseColor}.json`]);

		return registryBaseColorSchema.parse(result);
	} catch (error) {
		throw new Error(`Failed to fetch base color from registry.`);
	}
}

export async function resolveTree(
	index: z.infer<typeof registryIndexSchema>,
	names: string[]
) {
	const tree: z.infer<typeof registryIndexSchema> = [];

	for (const name of names) {
		const entry = index.find((entry) => entry.name === name);

		if (!entry) {
			continue;
		}

		tree.push(entry);

		if (entry.registryDependencies) {
			const dependencies = await resolveTree(index, entry.registryDependencies);
			tree.push(...dependencies);
		}
	}

	return tree.filter(
		(component, index, self) =>
			self.findIndex((c) => c.name === component.name) === index
	);
}

export async function fetchTree(
	config: Config,
	tree: z.infer<typeof registryIndexSchema>
) {
	try {
		const trueStyle = config.typescript ? config.style : `${config.style}-js`;
		const paths = tree.map((item) => `styles/${trueStyle}/${item.name}.json`);
		const result = await fetchRegistry(paths);

		return registryWithContentSchema.parse(result);
	} catch (error) {
		throw new Error(`Failed to fetch tree from registry.`);
	}
}

export async function getItemTargetPath(
	config: Config,
	item: Pick<z.infer<typeof registryItemWithContentSchema>, "type">,
	override?: string
) {
	// Allow overrides for all items but ui.
	if (override && item.type !== "components:ui") {
		return override;
	}

	const [parent, type] = item.type.split(":");
	if (!(parent in config.resolvedPaths)) {
		return null;
	}

	return path.join(
		config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
		type
	);
}

async function fetchRegistry(paths: string[]) {
	try {
		let options: RequestInit = {};

		if (proxyUrl) {
			options.agent = new HttpsProxyAgent(proxyUrl);
		}

		const results = await Promise.all(
			paths.map(async (path) => {
				const response = await fetch(`${baseUrl}/registry/${path}`, options);
				return await response.json();
			})
		);

		return results;
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to fetch registry from ${baseUrl}.`);
	}
}
