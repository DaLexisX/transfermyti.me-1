import React from "react";
import { Card, styled, Toggle } from "~/components";
import { WorkspaceModel } from "~/typeDefs";

const WorkspaceToggle = styled(Toggle)({}, ({ theme }) => ({
  marginTop: "0.5rem",
  background: theme.colors.secondary,

  "&:focus": {
    outlineColor: theme.colors.secondary,
  },
}));

interface Props {
  workspace: WorkspaceModel;
  onToggleIncluded: (workspace: WorkspaceModel) => void;
}

const SourceWorkspaceCard: React.FC<Props> = ({
  workspace,
  onToggleIncluded,
  ...props
}) => {
  const titleId = `includeToggle${workspace.id}`;

  return (
    <Card title={workspace.name} {...props}>
      <div id={titleId}>Include this workspace?</div>
      <WorkspaceToggle
        aria-label="Include this workspace"
        aria-labelledby={titleId}
        isToggled={workspace.isIncluded}
        onToggle={() => onToggleIncluded(workspace)}
      />
    </Card>
  );
};

export default SourceWorkspaceCard;
