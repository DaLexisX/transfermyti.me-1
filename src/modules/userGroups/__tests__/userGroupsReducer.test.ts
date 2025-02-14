import cases from "jest-in-case";
import { lensProp, set } from "ramda";

import { FAKES } from "~/jestUtilities";
import * as userGroupsActions from "~/modules/userGroups/userGroupsActions";

import { initialState, userGroupsReducer } from "../userGroupsReducer";

const { INVALID_ACTION, REDUX_STATE, TOGGL_USER_GROUP_ID } = FAKES;

const MOCK_PAYLOAD = {
  source: { ...REDUX_STATE.userGroups.source },
  target: { ...REDUX_STATE.userGroups.target },
};

describe("within userGroupsReducer", () => {
  test("returns input state if an invalid action type is passed to the reducer", () => {
    const result = userGroupsReducer(initialState, INVALID_ACTION);

    expect(result).toEqual(initialState);
  });

  test("returns input state if no state is passed to the reducer", () => {
    const result = userGroupsReducer(undefined, INVALID_ACTION);

    expect(result).toEqual(initialState);
  });

  cases(
    "the isFetching is set to the correct value based on the dispatched action",
    (options) => {
      const updatedState = {
        ...REDUX_STATE.userGroups,
        isFetching: options.initialStatus,
      };
      const result = userGroupsReducer(updatedState, options.action);

      expect(result.isFetching).toEqual(options.expectedStatus);
    },
    [
      {
        name: "when the createUserGroups.success action is dispatched",
        initialStatus: true,
        action: userGroupsActions.createUserGroups.success(MOCK_PAYLOAD),
        expectedStatus: false,
      },
      {
        name: "when the fetchUserGroups.success action is dispatched",
        initialStatus: true,
        action: userGroupsActions.fetchUserGroups.success(MOCK_PAYLOAD),
        expectedStatus: false,
      },
      {
        name: "when the createUserGroups.request action is dispatched",
        initialStatus: false,
        action: userGroupsActions.createUserGroups.request(),
        expectedStatus: true,
      },
      {
        name: "when the deleteUserGroups.request action is dispatched",
        initialStatus: false,
        action: userGroupsActions.deleteUserGroups.request(),
        expectedStatus: true,
      },
      {
        name: "when the fetchUserGroups.request action is dispatched",
        initialStatus: false,
        action: userGroupsActions.fetchUserGroups.request(),
        expectedStatus: true,
      },
      {
        name: "when the createUserGroups.failure action is dispatched",
        initialStatus: true,
        action: userGroupsActions.createUserGroups.failure(),
        expectedStatus: false,
      },
      {
        name: "when the deleteUserGroups.failure action is dispatched",
        initialStatus: true,
        action: userGroupsActions.deleteUserGroups.failure(),
        expectedStatus: false,
      },
      {
        name: "when the fetchUserGroups.failure action is dispatched",
        initialStatus: true,
        action: userGroupsActions.fetchUserGroups.failure(),
        expectedStatus: false,
      },
    ],
  );

  test(`the isUserGroupIncludedToggled action flips the "isIncluded" value of the userGroup with id = payload`, () => {
    const updatedState = set(
      lensProp("source"),
      {
        [TOGGL_USER_GROUP_ID]: {
          ...REDUX_STATE.userGroups.source[TOGGL_USER_GROUP_ID],
          isIncluded: false,
        },
      },
      REDUX_STATE.userGroups,
    );

    const result = userGroupsReducer(
      updatedState,
      userGroupsActions.isUserGroupIncludedToggled(TOGGL_USER_GROUP_ID),
    );

    expect(result.source[TOGGL_USER_GROUP_ID].isIncluded).toBe(true);
  });

  test("the deleteUserGroups.success action resets state to initial state", () => {
    const result = userGroupsReducer(
      REDUX_STATE.userGroups,
      userGroupsActions.deleteUserGroups.success(),
    );

    expect(result).toEqual(initialState);
  });
});
