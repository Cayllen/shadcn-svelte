<script lang="ts">
	import * as Button from "@/registry/default/ui/button";

	type $$Props = Button.Props;
</script>

<Button.Root type="submit" {...$$restProps}>
	<slot />
</Button.Root>
