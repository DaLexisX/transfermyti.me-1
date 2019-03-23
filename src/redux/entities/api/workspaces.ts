import { firstAndLastDayOfYear } from '~/redux/utils';
import { CreateNamedEntityRequest, HttpMethod } from '~/types/commonTypes';
import { ClockifyWorkspace, TogglSummaryReport } from '~/types/workspacesTypes';

export const apiFetchClockifyWorkspaces = (): Promise<ClockifyWorkspace[]> =>
  fetch('/clockify/api/workspaces/');

export const apiFetchTogglWorkspaceSummaryForYear = (
  email: string,
  workspaceId: string,
  year: number,
): Promise<TogglSummaryReport> => {
  const { firstDay, lastDay } = firstAndLastDayOfYear(year, 'YYYY-MM-DD');

  const queryString = [
    `workspace_id=${workspaceId}`,
    `since=${firstDay}`,
    `until=${lastDay}`,
    `user_agent=${email}`,
  ].join('&');

  return fetch(`/toggl/reports/summary?${queryString}`);
};

export const apiCreateClockifyWorkspace = (
  workspaceRecord: CreateNamedEntityRequest,
): Promise<ClockifyWorkspace> =>
  fetch('/clockify/api/workspaces/', {
    method: HttpMethod.Post,
    body: workspaceRecord as any,
  });
