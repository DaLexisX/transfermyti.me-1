type NotificationType = "error" | "info" | "success";

export interface NotificationModel {
  id: string;
  message: string;
  type: NotificationType;
}

export enum RoutePath {
  PickToolAction = "/pick-tool-action",
  EnterApiKeys = "/enter-api-keys",
  SelectWorkspaces = "/select-workspaces",
  SelectInclusions = "/select-inclusions",
  PerformToolAction = "/perform-tool-action",
  ToolActionSuccess = "/tool-action-success",
}
