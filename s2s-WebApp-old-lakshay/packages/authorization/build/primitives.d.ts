/**
 * List of primitives to interact with FGA authorization backend.
 * @returns
 */
export declare function createDefaultFGAStore(): Promise<string | undefined>;
export declare function createAuthorizationStoreModel(argStoreId: string): Promise<string | undefined>;
/**
 * Documents - CRUD
 * @param docId
 * @param argStoreId
 * @param argAuthorizationModelId
 */
export declare function addDocument(docId: string, argStoreId: string, argAuthorizationModelId: string): Promise<void>;
export declare function getDocuments(userId: string, relationType: string, argStoreId: string, argAuthorizationModelId: string): Promise<string[]>;
/**
 * User CRUD
 * @param userId
 * @param docId
 * @param argStoreId
 * @param argAuthorizationModelId
 */
export declare function addUserToDocumentAsViewer(userId: string, docId: string, role: string, argStoreId: string, argAuthorizationModelId: string): Promise<void>;
export declare function removeUserFromDocumentAsViewer(userId: string, docId: string, role: string, argStoreId: string, argAuthorizationModelId: string): Promise<void>;
export declare function checkUserOnDocumentAsViewer(userId: string, docId: string, role: string, argStoreId: string, argAuthorizationModelId: string): Promise<boolean>;
