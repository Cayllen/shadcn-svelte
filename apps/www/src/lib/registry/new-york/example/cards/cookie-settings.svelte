<script lang="ts">
	import { Button } from "@/registry/new-york/ui/button";
	import * as Card from "@/registry/new-york/ui/card";
	import { Label } from "@/registry/new-york/ui/label";
	import { Switch } from "@/registry/new-york/ui/switch";
	import { nanoid } from "nanoid";

	const id = nanoid(5);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Cookie Settings</Card.Title>
		<Card.Description>Manage your cookie settings here.</Card.Description>
	</Card.Header>
	<Card.Content class="grid gap-6">
		<div class="flex items-center justify-between space-x-4">
			<Label for="necessary-{id}" class="flex flex-col space-y-1">
				<span>Strictly Necessary</span>
				<span class="text-xs font-normal leading-snug text-muted-foreground">
					These cookies are essential in order to use the website and use its features.
				</span>
			</Label>
			<Switch id="necessary-{id}" checked aria-label="Necessary" />
		</div>
		<div class="flex items-center justify-between space-x-4">
			<Label for="functional-{id}" class="flex flex-col space-y-1">
				<span>Functional Cookies</span>
				<span class="text-xs font-normal leading-snug text-muted-foreground">
					These cookies allow the website to provide personalized functionality.
				</span>
			</Label>
			<Switch id="functional-{id}" aria-label="Functional" />
		</div>
		<div class="flex items-center justify-between space-x-4">
			<Label for="performance-{id}" class="flex flex-col space-y-1">
				<span>Performance Cookies</span>
				<span class="text-xs font-normal leading-snug text-muted-foreground">
					These cookies help to improve the performance of the website.
				</span>
			</Label>
			<Switch id="performance-{id}" aria-label="Performance" />
		</div>
	</Card.Content>
	<Card.Footer>
		<Button variant="outline" class="w-full">Save preferences</Button>
	</Card.Footer>
</Card.Root>
