<script lang="ts">
	import { Calendar } from "@/registry/new-york/ui/calendar";
	import { today, getLocalTimeZone } from "@internationalized/date";

	let value = today(getLocalTimeZone());
</script>

<Calendar bind:value class="rounded-md border shadow" />
