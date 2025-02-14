import { lensPath, not, over } from "ramda";
import { createReducer, type ActionType } from "typesafe-actions";

import { allEntitiesFlushed } from "~/modules/allEntities/allEntitiesActions";
import * as usersActions from "~/modules/users/usersActions";
import { Mapping, type User } from "~/typeDefs";

type UsersAction = ActionType<typeof usersActions | typeof allEntitiesFlushed>;

export interface UsersState {
  readonly source: Dictionary<User>;
  readonly target: Dictionary<User>;
  readonly isFetching: boolean;
}

export const initialState: UsersState = {
  source: {},
  target: {},
  isFetching: false,
};

export const usersReducer = createReducer<UsersState, UsersAction>(initialState)
  .handleAction([usersActions.fetchUsers.success], (state, { payload }) => ({
    ...state,
    source: {
      ...state.source,
      ...payload.source,
    },
    target: {
      ...state.target,
      ...payload.target,
    },
    isFetching: false,
  }))
  .handleAction(
    [
      usersActions.createUsers.request,
      usersActions.deleteUsers.request,
      usersActions.fetchUsers.request,
    ],
    (state) => ({
      ...state,
      isFetching: true,
    }),
  )
  .handleAction(
    [
      usersActions.createUsers.success,
      usersActions.createUsers.failure,
      usersActions.deleteUsers.failure,
      usersActions.fetchUsers.failure,
    ],
    (state) => ({
      ...state,
      isFetching: false,
    }),
  )
  .handleAction(usersActions.isUserIncludedToggled, (state, { payload }) =>
    over(lensPath([Mapping.Source, payload, "isIncluded"]), not, state),
  )
  .handleAction([usersActions.deleteUsers.success, allEntitiesFlushed], () => ({
    ...initialState,
  }));
