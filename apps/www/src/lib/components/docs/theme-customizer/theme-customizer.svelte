<script lang="ts">
	import Check from "svelte-radix/Check.svelte";

	import * as Popover from "@/registry/new-york/ui/popover";
	import * as Drawer from "@/registry/new-york/ui/drawer";
	import * as Tooltip from "@/registry/new-york/ui/tooltip";
	import { config } from "@/stores";
	import { mode } from "mode-watcher";
	import { themes } from "@/registry";
	import { cn } from "@/utils";
	import Button from "@/registry/new-york/ui/button/button.svelte";
	import Paintbrush from "lucide-svelte/icons/paintbrush";
	import { Customizer, ThemeCopyCodeButton } from ".";

	const colors = ["zinc", "rose", "blue", "green", "orange"];
</script>

<div class="flex items-center space-x-2">
	<div class="mr-2 hidden items-center space-x-0.5 lg:flex">
		{#each colors as color (color)}
			{@const theme = themes.find((theme) => theme.name === color)}
			{@const isActive = $config.theme === color}
			{#if theme}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<button
							{...builder}
							use:builder.action
							on:click={() => {
								config.update((prev) => ({
									...prev,
									theme: theme.name,
								}));
							}}
							class={cn(
								"flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs",
								isActive ? "border-[--theme-primary]" : "border-transparent"
							)}
							style="--theme-primary: hsl({theme?.activeColor[
								$mode === 'dark' ? 'dark' : 'light'
							]}"
						>
							<span
								class={cn(
									"flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]"
								)}
							>
								{#if isActive}
									<Check class="h-4 w-4 text-white" />
								{/if}
							</span>
							<span class="sr-only">{theme.label}</span>
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content
						align="center"
						class="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
					>
						{theme.label}
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		{/each}
	</div>
	<div class="block md:hidden">
		<Drawer.Root>
			<Drawer.Trigger asChild let:builder>
				<Button variant="outline" builders={[builder]}>
					<Paintbrush class="mr-2 h-4 w-4" />
					Customize
				</Button>
			</Drawer.Trigger>
			<Drawer.Content class="bg-white p-6 dark:bg-zinc-950">
				<Customizer />
			</Drawer.Content>
		</Drawer.Root>
	</div>
	<div class="hidden md:block">
		<Popover.Root>
			<Popover.Trigger asChild let:builder>
				<Button variant="outline" builders={[builder]}>
					<Paintbrush class="mr-2 h-4 w-4" />
					Customize
				</Button>
			</Popover.Trigger>
			<Popover.Content
				class="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
				align="end"
			>
				<Customizer />
			</Popover.Content>
		</Popover.Root>
	</div>
	<ThemeCopyCodeButton />
</div>
