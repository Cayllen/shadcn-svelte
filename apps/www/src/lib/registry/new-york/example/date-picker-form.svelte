<script lang="ts" context="module">
	import { z } from "zod";

	export const formSchema = z.object({
		dob: z.string().refine((v) => v, { message: "A date of birth is required." }),
	});

	export type FormSchema = typeof formSchema;
</script>

<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import CalendarIcon from "svelte-radix/Calendar.svelte";
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		CalendarDate,
		today,
	} from "@internationalized/date";
	import { cn } from "$lib/utils";
	import { Button, buttonVariants } from "@/registry/new-york/ui/button";
	import { Calendar } from "@/registry/new-york/ui/calendar";
	import * as Popover from "@/registry/new-york/ui/popover";
	import * as Form from "@/registry/new-york/ui/form";
	import type { SuperValidated, Infer } from "sveltekit-superforms";
	import SuperDebug, { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	let data: SuperValidated<Infer<FormSchema>> = $page.data.datePicker;
	export { data as form };

	const form = superForm(data, {
		validators: zodClient(formSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success("You submitted" + JSON.stringify(f.data, null, 2));
			} else {
				toast.error("Please fix the errors in the form.");
			}
		},
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter("en-US", {
		dateStyle: "long",
	});

	let value: DateValue | undefined;

	$: value = $formData.dob ? parseDate($formData.dob) : undefined;

	let placeholder: DateValue = today(getLocalTimeZone());
</script>

<form method="POST" action="?/datePicker" class="space-y-8" use:enhance>
	<Form.Field {form} name="dob" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>Date of birth</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					{...attrs}
					class={cn(
						buttonVariants({ variant: "outline" }),
						"w-[280px] justify-start pl-4 text-left font-normal",
						!value && "text-muted-foreground"
					)}
				>
					{value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
					<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						{value}
						bind:placeholder
						minValue={new CalendarDate(1900, 1, 1)}
						maxValue={today(getLocalTimeZone())}
						calendarLabel="Date of birth"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								$formData.dob = v.toString();
							} else {
								$formData.dob = "";
							}
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Your date of birth is used to calculator your age</Form.Description>
			<Form.FieldErrors />
			<input hidden value={$formData.dob} name={attrs.name} />
		</Form.Control>
	</Form.Field>
	<Button type="submit">Submit</Button>
	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
