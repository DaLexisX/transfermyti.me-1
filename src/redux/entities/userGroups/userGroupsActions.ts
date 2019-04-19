import { createAsyncAction, createStandardAction } from 'typesafe-actions';
import { batchClockifyRequests, getValidEntities } from '~/redux/utils';
import {
  apiCreateClockifyUserGroup,
  apiFetchClockifyUserGroups,
  apiFetchTogglUserGroups,
} from '~/redux/entities/api/userGroups';
import {
  showFetchErrorNotification,
  updateInTransferDetails,
} from '~/redux/app/appActions';
import {
  selectClockifyUsersByWorkspace,
  selectTogglUsersByWorkspaceFactory,
} from '~/redux/entities/users/usersSelectors';
import { selectUserGroupsTransferPayloadForWorkspace } from './userGroupsSelectors';
import { UserGroupCompounder } from './UserGroupCompounder';
import {
  ClockifyUserGroupModel,
  CompoundTimeEntryModel,
  CompoundUserGroupModel,
  CompoundUserModel,
  EntityGroup,
  EntityWithName,
  ReduxDispatch,
  ReduxGetState,
  TogglUserGroupModel,
  ToolName,
} from '~/types';

export interface EntryCountCalculatorModel {
  toolName: ToolName;
  timeEntries: Array<CompoundTimeEntryModel>;
  usersById: Record<string, CompoundUserModel>;
}

export const clockifyUserGroupsFetch = createAsyncAction(
  '@userGroups/CLOCKIFY_FETCH_REQUEST',
  '@userGroups/CLOCKIFY_FETCH_SUCCESS',
  '@userGroups/CLOCKIFY_FETCH_FAILURE',
)<void, Array<ClockifyUserGroupModel>, void>();

export const togglUserGroupsFetch = createAsyncAction(
  '@userGroups/TOGGL_FETCH_REQUEST',
  '@userGroups/TOGGL_FETCH_SUCCESS',
  '@userGroups/TOGGL_FETCH_FAILURE',
)<void, Array<CompoundUserGroupModel>, void>();

export const clockifyUserGroupsTransfer = createAsyncAction(
  '@userGroups/CLOCKIFY_TRANSFER_REQUEST',
  '@userGroups/CLOCKIFY_TRANSFER_SUCCESS',
  '@userGroups/CLOCKIFY_TRANSFER_FAILURE',
)<void, Array<ClockifyUserGroupModel>, void>();

export const flipIsUserGroupIncluded = createStandardAction(
  '@userGroups/FLIP_IS_INCLUDED',
)<string>();

export const addTogglUserIdToGroup = createStandardAction(
  '@userGroups/ADD_TOGGL_USER_ID_TO_GROUP',
)<{ userId: string; userGroupId: string }>();

export const calculateUserGroupEntryCounts = createStandardAction(
  '@userGroups/CALCULATE_ENTRY_COUNTS',
)<EntryCountCalculatorModel>();

export const fetchClockifyUserGroups = (workspaceId: string) => async (
  dispatch: ReduxDispatch,
  getState: ReduxGetState,
) => {
  dispatch(clockifyUserGroupsFetch.request());

  try {
    const clockifyUserGroups = await apiFetchClockifyUserGroups(workspaceId);

    const state = getState();
    const usersByWorkspace = selectClockifyUsersByWorkspace(state);
    const userGroups = convertToCompoundUserGroups(
      workspaceId,
      clockifyUserGroups,
      usersByWorkspace,
    );

    return dispatch(clockifyUserGroupsFetch.success(userGroups));
  } catch (error) {
    dispatch(showFetchErrorNotification(error));
    return dispatch(clockifyUserGroupsFetch.failure());
  }
};

export const fetchTogglUserGroups = (workspaceId: string) => async (
  dispatch: ReduxDispatch,
  getState: ReduxGetState,
) => {
  dispatch(togglUserGroupsFetch.request());

  try {
    const togglUserGroups = await apiFetchTogglUserGroups(workspaceId);

    const state = getState();
    const usersByWorkspace = selectTogglUsersByWorkspaceFactory(false)(state);
    const userGroups = convertToCompoundUserGroups(
      workspaceId,
      togglUserGroups,
      usersByWorkspace,
    );

    return dispatch(togglUserGroupsFetch.success(userGroups));
  } catch (error) {
    dispatch(showFetchErrorNotification(error));
    return dispatch(togglUserGroupsFetch.failure());
  }
};

export const transferUserGroupsToClockify = (
  togglWorkspaceId: string,
  clockifyWorkspaceId: string,
) => async (dispatch: ReduxDispatch, getState: ReduxGetState) => {
  const state = getState();
  const userGroupsInWorkspace = selectUserGroupsTransferPayloadForWorkspace(
    state,
  )(togglWorkspaceId);
  const countOfUserGroups = userGroupsInWorkspace.length;
  if (countOfUserGroups === 0) return Promise.resolve();

  dispatch(clockifyUserGroupsTransfer.request());

  const onUserGroup = (recordNumber: number, entityRecord: EntityWithName) => {
    dispatch(
      updateInTransferDetails({
        countTotal: countOfUserGroups,
        countCurrent: recordNumber,
        entityGroup: EntityGroup.UserGroups,
        workspaceId: togglWorkspaceId,
        entityRecord,
      }),
    );
  };

  try {
    const userGroups = await batchClockifyRequests(
      4,
      onUserGroup,
      userGroupsInWorkspace,
      apiCreateClockifyUserGroup,
      clockifyWorkspaceId,
    );

    return dispatch(clockifyUserGroupsTransfer.success(userGroups));
  } catch (error) {
    dispatch(showFetchErrorNotification(error));
    return dispatch(clockifyUserGroupsTransfer.failure());
  }
};

function convertToCompoundUserGroups(
  workspaceId: string,
  userGroups: Array<TogglUserGroupModel | ClockifyUserGroupModel>,
  usersByWorkspace: Record<string, Array<CompoundUserModel>>,
): Array<CompoundUserGroupModel> {
  if (getValidEntities(userGroups).length === 0) return [];

  const userGroupCompounder = new UserGroupCompounder(
    workspaceId,
    usersByWorkspace,
  );

  return userGroups.map(userGroup => userGroupCompounder.compound(userGroup));
}
