import type { SagaIterator } from "redux-saga";
import { spawn } from "redux-saga/effects";

import { allEntitiesSaga } from "~/modules/allEntities/allEntitiesSaga";
import { credentialsSaga } from "~/modules/credentials/credentialsSaga";
import { projectMonitoringSaga } from "~/modules/projects/sagas/projectsSagas";
import { taskMonitoringSaga } from "~/modules/tasks/sagas/tasksSagas";
import { workspacesSaga } from "~/modules/workspaces/sagas/workspacesSaga";

export function* allSagas(): SagaIterator {
  yield spawn(allEntitiesSaga);
  yield spawn(credentialsSaga);
  yield spawn(projectMonitoringSaga);
  yield spawn(taskMonitoringSaga);
  yield spawn(workspacesSaga);
}
