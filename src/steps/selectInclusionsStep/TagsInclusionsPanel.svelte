<script lang="ts">
  import {
    areAllTagsIncludedUpdated,
    isTagIncludedToggled,
  } from "~/modules/tags/tagsActions";
  import {
    tagsForInclusionsTableSelector,
    tagsTotalCountsByTypeSelector,
  } from "~/modules/tags/tagsSelectors";
  import { dispatchAction, selectorToStore } from "~/redux/reduxToStore";
  import { EntityGroup } from "~/typeDefs";

  import EntityGroupInclusionsPanel from "~/components/EntityGroupInclusionsPanel.svelte";

  const tags = selectorToStore(tagsForInclusionsTableSelector);

  const totalCountsByType = selectorToStore(tagsTotalCountsByTypeSelector);

  function handleToggleAll(event: CustomEvent<boolean>): void {
    dispatchAction(areAllTagsIncludedUpdated(event.detail));
  }

  function handleToggleOne(event: CustomEvent<string>): void {
    dispatchAction(isTagIncludedToggled(event.detail));
  }
</script>

<EntityGroupInclusionsPanel
  entityGroup={EntityGroup.Tags}
  rowNumber={2}
  tableRecords={$tags}
  tableFields={[
    { label: "Name", field: "name" },
    { label: "Time Entry Count", field: "entryCount" },
  ]}
  totalCountsByType={$totalCountsByType}
  on:toggle-all={handleToggleAll}
  on:toggle-one={handleToggleOne}
/>
