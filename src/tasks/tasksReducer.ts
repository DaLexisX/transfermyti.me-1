import * as R from "ramda";
import { ActionType, createReducer } from "typesafe-actions";

import { flushAllEntities } from "~/allEntities/allEntitiesActions";
import { updateAreAllRecordsIncluded } from "~/redux/reduxUtils";
import { Mapping, TasksByIdModel } from "~/typeDefs";

import * as tasksActions from "./tasksActions";

type TasksAction = ActionType<typeof tasksActions | typeof flushAllEntities>;

export interface TasksState {
  readonly source: TasksByIdModel;
  readonly target: TasksByIdModel;
  readonly isFetching: boolean;
}

export const initialState: TasksState = {
  source: {},
  target: {},
  isFetching: false,
};

export const tasksReducer = createReducer<TasksState, TasksAction>(initialState)
  .handleAction(
    [tasksActions.createTasks.success, tasksActions.fetchTasks.success],
    (state, { payload }) => ({
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
    }),
  )
  .handleAction(
    [
      tasksActions.createTasks.request,
      tasksActions.deleteTasks.request,
      tasksActions.fetchTasks.request,
    ],
    (state) => ({
      ...state,
      isFetching: true,
    }),
  )
  .handleAction(
    [
      tasksActions.createTasks.failure,
      tasksActions.deleteTasks.failure,
      tasksActions.fetchTasks.failure,
    ],
    (state) => ({
      ...state,
      isFetching: false,
    }),
  )
  .handleAction(tasksActions.flipIsTaskIncluded, (state, { payload }) =>
    R.over(R.lensPath([Mapping.Source, payload, "isIncluded"]), R.not, state),
  )
  .handleAction(tasksActions.updateIsTaskIncluded, (state, { payload }) =>
    R.set(
      R.lensPath([Mapping.Source, payload.id, "isIncluded"]),
      payload.isIncluded,
      state,
    ),
  )
  .handleAction(
    tasksActions.updateAreAllTasksIncluded,
    (state, { payload }) => ({
      ...state,
      source: updateAreAllRecordsIncluded(state.source, payload),
    }),
  )
  .handleAction([tasksActions.deleteTasks.success, flushAllEntities], () => ({
    ...initialState,
  }));
