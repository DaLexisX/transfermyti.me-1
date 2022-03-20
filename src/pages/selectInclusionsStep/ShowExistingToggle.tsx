import React from "react";

import { styled, Toggle } from "~/components";

const Label = styled.div(
  {
    marginBottom: "0.75rem",
  },
  ({ theme }) => ({
    fontWeight: theme.fontWeights.bold,
  }),
);

interface Props {
  isToggled: boolean;
  onToggle: VoidFunction;
}

const ShowExistingToggle: React.FC<Props> = ({
  isToggled,
  onToggle,
  ...props
}) => (
  <div css={{ marginBottom: "0.75rem" }} {...props}>
    <Label id="show-existing-toggle">
      Show records that already exist in target?
    </Label>
    <Toggle
      aria-label="Show records that already exist in target?"
      aria-labelledby="show-existing-toggle"
      css={(theme) => ({ background: theme.colors.white })}
      isToggled={isToggled}
      onToggle={onToggle}
    />
  </div>
);

export default ShowExistingToggle;
