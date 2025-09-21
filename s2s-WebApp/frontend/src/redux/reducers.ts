import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import domainreducer from './nodes/domain/reducer'
import { userDetailreducer } from './nodes/users/reducer'
import { RoleDetailreducer } from './nodes/users/reducer'
import { dataVaultreducer } from './nodes/datavault/reducer'
import { datavalutsavereducer } from './nodes/datavault/reducer'
import { datavalutUpdatereducer } from './nodes/datavault/reducer'
import { Inviteusersavereducer } from './nodes/users/reducer'
import { dataVaultdeletereducer } from './nodes/datavault/reducer'
import connectors from './nodes/entities/connectors/reducer'
import integrations from './nodes/intergrations/reducer'
import app from './nodes/app/reducer'
import { reducer, chatnameReducer } from './nodes/chats/chatReducer'
import newChatReducers from './nodes/chats/newchatReducer'
import { History } from 'history'
import { indUserdetailreducer } from './nodes/users/reducer'
import { userSettingUpdatereducer } from './nodes/users/reducer'
import { userdeletereducer } from './nodes/users/reducer'
import { userroleupdatereducer } from './nodes/users/reducer'
import { dataIngestionereducer } from './nodes/datavault/reducer'
import { dataVaultIdreducer } from './nodes/datavault/reducer'
import { dataingestionUrlreducer } from './nodes/datavault/reducer'
import { dataVaultdomainIdreducer } from './nodes/datavault/reducer'
import { repositoryDocreducer } from './nodes/repository/reducer'
import { docdeletereducer } from './nodes/repository/reducer'
import { docdeleteAllreducer } from './nodes/repository/reducer'
import { docSelectdeletereducer } from './nodes/repository/reducer'
import { dataVaultfileviewreducer } from './nodes/repository/reducer'
import {
  vaultPermissionaceessupdatereducer,
  vaultPermissionDetailsreducer,
  vaultdeletereducer,
  vaultPermissionroleDetailsreducer,
  textEditorSaveReducer,
} from './nodes/vaultPermission/reducer'
import { saveuserreducer } from './nodes/datavault/reducer'
import {
  chatDetailreducer,
  addchatupdatereducer,
  chatDeletereducer,
  chatHistoryreducer,
  chatHistorySavereducer,
  createchatreducer,
} from './nodes/chat/reducer'
import { chatupdatereducer } from './nodes/chat/reducer'
import { getAddSourcereducer } from './nodes/chat/reducer'
import { chatUpdatepagereducer } from './nodes/chat/reducer'
import { chatUpdategetreducer } from './nodes/chat/reducer'
import { AuditDetailreducer, feedbackreducer } from './nodes/audit/reducer'
import { chatConversationeducer } from './nodes/chat/reducer'
import { dataSingmaFilesreducer } from './nodes/sigma-files/reducer'
import { dataSingmaCitNamereducer } from './nodes/sigma-files/reducer'
import { sigmaalldeletereducer } from './nodes/sigma-files/reducer'
import { datactiReportreducer } from './nodes/cti-report/reducer'
import { sigmadeletereducer } from './nodes/sigma-files/reducer'
import { updateFileTitleReducer } from './nodes/cti-report/reducer'
import { TargetFilesFilesreducer } from './nodes/py-sigma/reducer'
import { bulkTransalatesavereducer } from './nodes/py-sigma/reducer'
import { singleTransalatesavereducer } from './nodes/py-sigma/reducer'
import { ctiBulkTransalatesavereducer } from './nodes/py-sigma/reducer'
import { ctirepBulkTransalatesavereducer } from './nodes/py-sigma/reducer'
import { feedlyCTiPostreducer } from './nodes/feedlyform/reducer'
import { feedlyGetFormReducer } from './nodes/feedlyform/reducer'
import { feedlyUpdateFormReducer } from './nodes/feedlyform/reducer'
import { feedlyDeletereducer } from './nodes/feedlyform/reducer'
import { feedlyIdGetFormReducer } from './nodes/feedlyform/reducer'
import { splunkDeletereducer } from './nodes/splunkform/reducer'
import { splunkGetFormReducer } from './nodes/splunkform/reducer'
import { executeQueryReducer } from './nodes/py-sigma/reducer'
import { auth } from './nodes/signIn/reducer'
import { bulkCtiReportReducer } from './nodes/bulk-ctiReport/reducer'
import {
  getThreatReducer,
  getThreatSummaryReducer,
  threatAODPackageReducer,
} from './nodes/threatBriefs/reducer'
import { createChatReducer } from './nodes/chatPage/reducer'
import { apiReducer } from './nodes/statuscode/reducer'

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    app,
    connectors,
    integrations,
    reducer,
    chatnameReducer,
    newChatReducers,
    domainreducer,
    userDetailreducer,
    RoleDetailreducer,
    Inviteusersavereducer,
    indUserdetailreducer,
    userdeletereducer,
    dataVaultreducer,
    datavalutsavereducer,
    userroleupdatereducer,
    dataVaultdeletereducer,
    datavalutUpdatereducer,
    dataIngestionereducer,
    dataVaultIdreducer,
    dataingestionUrlreducer,
    repositoryDocreducer,
    docdeletereducer,
    docSelectdeletereducer,
    userSettingUpdatereducer,
    vaultPermissionDetailsreducer,
    vaultdeletereducer,
    saveuserreducer,
    dataVaultfileviewreducer,
    vaultPermissionroleDetailsreducer,
    vaultPermissionaceessupdatereducer,
    chatDetailreducer,
    createChatReducer,
    createchatreducer,
    chatDeletereducer,
    chatupdatereducer,
    addchatupdatereducer,
    getAddSourcereducer,
    chatUpdatepagereducer,
    chatUpdategetreducer,
    AuditDetailreducer,
    chatConversationeducer,
    feedbackreducer,
    chatHistoryreducer,
    chatHistorySavereducer,
    dataVaultdomainIdreducer,
    dataSingmaFilesreducer,
    dataSingmaCitNamereducer,
    datactiReportreducer,
    updateFileTitleReducer,
    sigmadeletereducer,
    sigmaalldeletereducer,
    docdeleteAllreducer,
    TargetFilesFilesreducer,
    bulkTransalatesavereducer,
    singleTransalatesavereducer,
    ctiBulkTransalatesavereducer,
    ctirepBulkTransalatesavereducer,
    feedlyCTiPostreducer,
    feedlyGetFormReducer,
    feedlyUpdateFormReducer,
    feedlyDeletereducer,
    feedlyIdGetFormReducer,
    splunkDeletereducer,
    splunkGetFormReducer,
    executeQueryReducer,
    textEditorSaveReducer,
    bulkCtiReportReducer,
    auth,
    getThreatReducer,
    getThreatSummaryReducer,
    threatAODPackageReducer,
    apiReducer,
  })

export default createRootReducer
