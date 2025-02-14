import { toolNameByMappingSelector } from "~/modules/allEntities/allEntitiesSelectors";
import { getStore } from "~/redux/configureStore";
import { capitalize } from "~/utilities/textTransforms";

export function replaceMappingWithToolName(label: string): string {
  const store = getStore();

  const toolNameByMapping = toolNameByMappingSelector(store.getState());

  const { source, target } = toolNameByMapping;
  let updatedLabel = label;

  if (/source/gi.test(label)) {
    updatedLabel = updatedLabel.replace(/source/gi, capitalize(source));
  }

  if (/target/gi.test(label)) {
    updatedLabel = updatedLabel.replace(/target/gi, capitalize(target));
  }

  return updatedLabel;
}
