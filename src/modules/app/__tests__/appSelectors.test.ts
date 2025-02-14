import { FAKES } from "~/jestUtilities";

import * as appSelectors from "../appSelectors";

const { REDUX_STATE } = FAKES;

describe("within appSelectors", () => {
  test("the notificationsSelector returns state.app.notifications", () => {
    const state = {
      ...REDUX_STATE,
      app: {
        ...REDUX_STATE.app,
        notifications: [{ id: "ntf1", type: "info", message: "Test Message" } as const],
      },
    };

    const result = appSelectors.notificationsSelector(state);

    expect(result).toEqual([{ id: "ntf1", type: "info", message: "Test Message" } as const]);
  });
});
