import {
  CreateStoreResponse,
  WriteAuthorizationModelResponse,
  WriteAuthorizationModelRequest,
  CheckResponse,
  OpenFgaApi,
  ListStoresResponse,
  ReadAuthorizationModelsResponse,
  ListObjectsResponse,
} from "@openfga/sdk";
import { SYNTH_GATE_AUTH_MODEL } from "./model";

const OPEN_FGA_STORE_NAME = "SYNTHGATE_AUTH_STORE";
const OPEN_FGA_HOST = "poc.synthgate.ai";
const OPEN_FGA_SCHEME = "http";

/**
 * List of primitives to interact with FGA authorization backend.
 * @returns
 */

export async function createDefaultFGAStore(): Promise<string | undefined> {
  try {
    const openFga = new OpenFgaApi({
      apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
      apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
    });

    //list all stores
    const resultListStores: ListStoresResponse = await openFga.listStores();
    if (resultListStores.stores?.length && resultListStores.stores[0].id) {
      return resultListStores.stores[0].id;
    }

    const result: CreateStoreResponse = await openFga.createStore({
      name: OPEN_FGA_STORE_NAME,
    });
    console.log(`successfully created store ${result.id}`);
    return result.id;
  } catch (error) {
    console.error("Failed to interact with FGA");
  }

  return "";
}

export async function createAuthorizationStoreModel(
  argStoreId: string
): Promise<string | undefined> {
  try {
    const openFga = new OpenFgaApi({
      apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
      apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
      storeId: argStoreId,
    });

    const resultAuthorizationId: ReadAuthorizationModelsResponse =
      await openFga.readAuthorizationModels();
    if (
      resultAuthorizationId.authorization_models?.length &&
      resultAuthorizationId.authorization_models[0].id
    ) {
      return resultAuthorizationId.authorization_models[0].id;
    }

    const result: WriteAuthorizationModelResponse =
      await openFga.writeAuthorizationModel(
        SYNTH_GATE_AUTH_MODEL as WriteAuthorizationModelRequest
      );
    console.log(`successfully created model ${result.authorization_model_id}`);
    return result.authorization_model_id;
  } catch (error) {
    console.error(error);
  }

  return "";
}

/**
 * Documents - CRUD
 * @param docId
 * @param argStoreId
 * @param argAuthorizationModelId
 */

export async function addDocument(
  docId: string,
  argStoreId: string,
  argAuthorizationModelId: string
): Promise<void> {
  const tupleWrite = {
    writes: {
      tuple_keys: [
        { user: `user:admin`, relation: "owner", object: `document:${docId}` },
      ],
    },
    authorization_model_id: argAuthorizationModelId,
  };

  try {
    const openFga = new OpenFgaApi({
      apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
      apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
      storeId: argStoreId,
    });
    const result = await openFga.write(tupleWrite);
    console.log(`successfully added document ${result}`);
  } catch (error) {
    console.error(error);
  }
}

export async function getDocuments(
  userId: string,
  relationType: string,
  argStoreId: string,
  argAuthorizationModelId: string
): Promise<string[]> {
  try {
    const openFga = new OpenFgaApi({
      apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
      apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
      storeId: argStoreId,
    });

    const request = {
      authorization_model_id: argAuthorizationModelId,
      user: `user:${userId}`,
      relation: relationType,
      type: "document",
      contextual_tuples: {
        tuple_keys: [],
      },
    };

    const result: ListObjectsResponse = await openFga.listObjects(request);
    if (result?.objects && result.objects?.length) {
      return result.objects;
    }
  } catch (error) {
    console.error(error);
  }
  return [];
}

/**
 * User CRUD
 * @param userId
 * @param docId
 * @param argStoreId
 * @param argAuthorizationModelId
 */

export async function addUserToDocumentAsViewer(
  userId: string,
  docId: string,
  role: string,
  argStoreId: string,
  argAuthorizationModelId: string
): Promise<void> {
  const tupleWrite = {
    writes: {
      tuple_keys: [
        {
          user: `user:${userId}`,
          relation: role,
          object: `document:${docId}`,
        },
      ],
    },
    authorization_model_id: argAuthorizationModelId,
  };

  try {
    const openFga = new OpenFgaApi({
      apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
      apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
      storeId: argStoreId,
    });
    const result = await openFga.write(tupleWrite);
    console.log(`successfully added user ${result}`);
  } catch (error) {
    console.error(error);
  }
}

export async function removeUserFromDocumentAsViewer(
  userId: string,
  docId: string,
  role: string,
  argStoreId: string,
  argAuthorizationModelId: string
): Promise<void> {
  const tupleWrite = {
    deletes: {
      tuple_keys: [
        {
          user: `user:${userId}`,
          relation: role,
          object: `document:${docId}`,
        },
      ],
    },
    authorization_model_id: argAuthorizationModelId,
  };

  try {
    const openFga = new OpenFgaApi({
      apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
      apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
      storeId: argStoreId,
    });
    const result = await openFga.write(tupleWrite);
    console.log(`successfully deleted user ${result}`);
  } catch (error) {
    console.error(error);
  }
}

export async function checkUserOnDocumentAsViewer(
  userId: string,
  docId: string,
  role: string,
  argStoreId: string,
  argAuthorizationModelId: string
): Promise<boolean> {
  const tupleCheck = {
    authorization_model_id: argAuthorizationModelId,
    tuple_key: {
      user: `user:${userId}`,
      relation: role,
      object: `document:${docId}`,
    },
  };

  try {
    const openFga = new OpenFgaApi({
      apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
      apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
      storeId: argStoreId,
    });
    const result: CheckResponse = await openFga.check(tupleCheck);
    console.log(`successfully checked user ${result}`);
    if (result.allowed) {
      return result.allowed;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}
