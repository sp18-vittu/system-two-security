import React, { createContext, useContext, useState } from 'react'
type DataContextType = {
  data: any
  setData: React.Dispatch<any>
  detail: any
  setDetail: React.Dispatch<any>
  sendNewRepositoryDetail: any
  setSendNewRepositoryDetail: React.Dispatch<any>
  saveData: any
  setSaveData: React.Dispatch<any>
  InsightDetail: any
  setInsightDetail: React.Dispatch<any>
  copyFiles: any
  setCopyFiles: React.Dispatch<any>
  CTIReport: any
  setCTIReport: React.Dispatch<any>
  chatScreen: any
  setChatScreen: React.Dispatch<any>
  openThreat: any
  setOpenThreat: React.Dispatch<any>
  ctiFileName: any
  setCtiFileName: React.Dispatch<any>
  HuntToaster: any
  setHuntToaster: React.Dispatch<any>
  ResultToaster: any
  setResultToaster: React.Dispatch<any>
  wssProvider: any
  setWssProvider: React.Dispatch<any>
  Faildname: any
  setHuntFaild: React.Dispatch<any>
  wrokbenchHome: any
  setWrokbenchHome: React.Dispatch<any>
  SaveValue: any
  setSaveValue: React.Dispatch<any>
  globalSearch: any
  setGlobalSearch: React.Dispatch<any>
  sigmafilsearch: any
  setSigmafilsearch: React.Dispatch<any>
  authordetails: any
  setAuthordetails: React.Dispatch<any>
  sigmaViewwss: any
  setSigmaViewwss: React.Dispatch<any>
  yamlEditorFiles: any
  setYamlEditorFiles: React.Dispatch<any>
  yamlEditorOpen: any
  setYamlEditorOpen: React.Dispatch<any>
  yamlChatOpen: any
  setYamlChatOpen: React.Dispatch<any>
  chatinputwss: any
  setChatinputWss: React.Dispatch<any>
  responceChatwss: any
  setResponceChatWss: React.Dispatch<any>
  Chatmessage: any
  setChatmessage: React.Dispatch<any>
  sendwssconnect: any
  setSendwssconnect: React.Dispatch<any>
  sendwssProcessing: any
  setSendwssProcessing: React.Dispatch<any>
  tbList: any
  setTBList: React.Dispatch<any>
  srccheckedIds: any
  setSrcCheckedIds: React.Dispatch<any>
  srcnamecheckedIds: any
  setSrcNameCheckedIds: React.Dispatch<any>
  artifactList: any
  setArtifactList: React.Dispatch<any>
  dacFolderId: any
  setDacFolderId: React.Dispatch<any>
  impFolderId: any
  setImpFolderId: React.Dispatch<any>
  sigmaSearchFiles: any
  setSigmaSearchFiles: React.Dispatch<any>
  CtiReportList: any
  setCtiReportList: React.Dispatch<any>
  importViewRule: any
  setImportViewRule: React.Dispatch<any>
}
const DataContext = createContext<DataContextType | null>(null)
interface props {
  children: any
}
const DataProvider = ({ children }: props) => {
  const [data, setData] = useState<any>(null)
  const [detail, setDetail] = useState<any>(null)
  const [sendNewRepositoryDetail, setSendNewRepositoryDetail] = useState<any>(null)
  const [saveData, setSaveData] = useState<any>(null)
  const [InsightDetail, setInsightDetail] = useState<any>(null)
  const [copyFiles, setCopyFiles] = useState<any>(null)
  const [CTIReport, setCTIReport] = useState<any>(null)
  const [chatScreen, setChatScreen] = useState<any>(null)
  const [openThreat, setOpenThreat] = useState<any>(null)
  const [ctiFileName, setCtiFileName] = useState<any>(null)
  const [HuntToaster, setHuntToaster] = useState<any>(null)
  const [ResultToaster, setResultToaster] = useState<any>(null)
  const [wssProvider, setWssProvider] = useState<any>(null)
  const [Faildname, setHuntFaild] = useState<any>(null as any)
  const [wrokbenchHome, setWrokbenchHome] = useState<any>(false as any)
  const [SaveValue, setSaveValue] = useState(true as any)
  const [globalSearch, setGlobalSearch] = useState('' as any)
  const [sigmafilsearch, setSigmafilsearch] = useState(null as any)
  const [authordetails, setAuthordetails] = useState(null as any)
  const [sigmaViewwss, setSigmaViewwss] = useState(true as any)
  const [yamlEditorFiles, setYamlEditorFiles] = useState(null as any)
  const [yamlEditorOpen, setYamlEditorOpen] = useState(false as any)
  const [yamlChatOpen, setYamlChatOpen] = useState(true as any)
  const [chatinputwss, setChatinputWss] = useState([] as any)
  const [responceChatwss, setResponceChatWss] = useState([] as any)
  const [Chatmessage, setChatmessage] = useState([] as any)
  const [sendwssconnect, setSendwssconnect] = useState(false as any)
  const [sendwssProcessing, setSendwssProcessing] = useState(false as any)
  const [tbList, setTBList] = useState([] as any)
  const [srccheckedIds, setSrcCheckedIds] = useState<number[]>([]);
  const [srcnamecheckedIds, setSrcNameCheckedIds] = useState<number[]>([]);
  const [artifactList, setArtifactList] = useState<any[]>([]);
  const [dacFolderId, setDacFolderId] = useState<any>(null);
  const [impFolderId, setImpFolderId] = useState<any>(null);
  const [sigmaSearchFiles, setSigmaSearchFiles] = useState<any>(null);
  const [CtiReportList, setCtiReportList] = useState<any>(null);
  const [importViewRule, setImportViewRule] = useState<any>(null);


  return (
    <div>
      <DataContext.Provider
        value={{
          data,
          setData,
          detail,
          setDetail,
          sendNewRepositoryDetail,
          setSendNewRepositoryDetail,
          saveData,
          setSaveData,
          InsightDetail,
          setInsightDetail,
          copyFiles,
          setCopyFiles,
          CTIReport,
          setCTIReport,
          chatScreen,
          setChatScreen,
          openThreat,
          setOpenThreat,
          ctiFileName,
          setCtiFileName,
          HuntToaster,
          setHuntToaster,
          ResultToaster,
          setResultToaster,
          wssProvider,
          setWssProvider,
          Faildname,
          setHuntFaild,
          wrokbenchHome,
          setWrokbenchHome,
          SaveValue,
          setSaveValue,
          globalSearch,
          setGlobalSearch,
          sigmafilsearch,
          setSigmafilsearch,
          authordetails,
          setAuthordetails,
          sigmaViewwss,
          setSigmaViewwss,
          yamlEditorFiles,
          setYamlEditorFiles,
          yamlEditorOpen,
          setYamlEditorOpen,
          yamlChatOpen,
          setYamlChatOpen,
          chatinputwss,
          setChatinputWss,
          responceChatwss,
          setResponceChatWss,
          Chatmessage,
          setChatmessage,
          sendwssconnect,
          setSendwssconnect,
          tbList,
          setTBList,
          srccheckedIds,
          setSrcCheckedIds,
          srcnamecheckedIds,
          setSrcNameCheckedIds,
          artifactList,
          setArtifactList,
          sendwssProcessing,
          setSendwssProcessing,
          dacFolderId,
          setDacFolderId,
          impFolderId,
          setImpFolderId,
          sigmaSearchFiles,
          setSigmaSearchFiles,
          CtiReportList,
          setCtiReportList,
          importViewRule,
          setImportViewRule
        }}
      >
        {children}
      </DataContext.Provider>
    </div>
  )
}
export default DataProvider
export const useData = () => useContext(DataContext)
