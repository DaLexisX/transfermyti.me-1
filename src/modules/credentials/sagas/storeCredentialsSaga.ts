import type { SagaIterator } from "redux-saga";
import { select } from "redux-saga/effects";
import storage from "store";

import { STORAGE_KEY } from "~/constants";
import { credentialsByMappingSelector } from "~/modules/credentials/credentialsSelectors";
import { getIfDev } from "~/utilities/getIfDev";

export function* storeCredentialsSaga(): SagaIterator {
  const credentialsByMapping = yield select(credentialsByMappingSelector);

  if (getIfDev()) {
    const storedCredentials = storage.get(STORAGE_KEY) || {};
    storage.set(STORAGE_KEY, {
      ...storedCredentials,
      ...credentialsByMapping,
    });
  }
}
