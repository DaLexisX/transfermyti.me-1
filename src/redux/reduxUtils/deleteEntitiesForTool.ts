import { SagaIterator } from "@redux-saga/types";

import { call, delay, put } from "redux-saga/effects";

import { getApiDelayForTool } from "./fetchActions";
import { incrementEntityGroupTransferCompletedCount } from "~/allEntities/allEntitiesActions";
import { EntityGroup, ToolName, ValidEntity } from "~/typeDefs";

/**
 * Loops through specified source records and calls the specified apiDeleteFunc
 * on each record to delete it from the source.
 */
export function* deleteEntitiesForTool<TEntity>({
  toolName,
  sourceRecords,
  apiDeleteFunc,
}: {
  toolName: ToolName;
  sourceRecords: TEntity[];
  apiDeleteFunc: (sourceRecord: AnyValid) => SagaIterator;
}): SagaIterator {
  const apiDelay = getApiDelayForTool(toolName);

  const validSourceRecords = sourceRecords as ValidEntity<TEntity>[];
  for (const sourceRecord of validSourceRecords) {
    yield call(apiDeleteFunc, sourceRecord);

    const entityGroup = sourceRecord.memberOf as EntityGroup;
    yield put(incrementEntityGroupTransferCompletedCount(entityGroup));

    yield delay(apiDelay);
  }
}
