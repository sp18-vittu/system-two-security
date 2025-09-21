import React, { RefObject, useEffect, useRef, useState } from 'react'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import local from '../../../utils/local'
import { createChat } from '../../../redux/nodes/chatPage/action'
import { ChatHistoryDetails, chatSideList } from '../../../redux/nodes/chat/action'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { environment } from '../../../environment/environment'
import { v4 as uuidv4 } from 'uuid'
import DetectionsDetails from './DetectionsDetails'
import FiltersDialog from './FiltersDialog'
import { useData } from '../../../layouts/shared/DataProvider'
import CopyAndNewCollectionsDialog from '../Collection/CopyAndNewCollectionsDialog'
import {
    getallCollection,
    getinboxCollection,
    workbenchyamlFileUpdate,
    yamlFileValidation,
} from '../../../redux/nodes/Collections/action'
import { documentGetuuid } from '../../../redux/nodes/Imports/action'
import CustomToast from '../../../layouts/App/CustomToast'
import toast from 'react-hot-toast'
import DetectionDialog from '../Collection/DetectionDialog'
import CreationDetectionsDetails from './CreationDetectionsDetails'
const yaml = require('js-yaml')
import { Box, Divider } from '@mui/material'
import Skeleton from "@mui/material/Skeleton";

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    inline?: boolean
    className?: string
    children?: React.ReactNode
}

function SourceRuleChats() {
    const dispatch = useDispatch()
    const navigateTo = useNavigate()
    const location = useLocation();
    const { state } = location;
    const { id } = useParams()
    const Token = local.getItem('bearerToken')
    const token = JSON.parse(Token as any)
    const { width, height } = useWindowResolution();
    const dynamicHeight = Math.max(100, height * 0.9);
    const [ShowRule, setShowRule] = useState(true as any);
    const localStorageauth = local.getItem('auth')
    const localss = JSON.parse(localStorageauth as any)
    const userIdchat: any = localss?.user?.user?.id
    const [sessionList, setSessionList] = useState([] as any)
    const [messages, setMessages] = useState<any[]>([])
    const [inputMessage, setInputMessage] = useState<any[]>([])
    const [sendmessage, setSendmessage] = useState('' as any)
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [ctiChat, setctiChat] = useState([] as any)
    const [sessionid, setSessionId] = useState(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const divRef: RefObject<HTMLDivElement> = useRef(null)
    const bottomRef = useRef<HTMLDivElement>(null);
    const [isSend, setisSend] = useState(false);
    const [cancelChat, setCancelChat] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [singleparams, setSingleparams] = useState(null as any)
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isdetectionOpen, setDetectionOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState([] as any)
    const [createselectedRows, setCreateSelectedRows] = useState([] as any)
    const [exselectedRows, setExSelectedRows] = useState([] as any)
    const [isAccordionOpen, setIsAccordionOpen] = useState(false as any);
    const [collectiondata, setCollectiondata] = useState([] as any)
    const [collectionorcti, setCollectionorcti] = useState("ruleChat" as any);
    const [dLoader, setDLoader] = useState(false);
    const [inboxList, setInboxList] = useState([] as any)
    const navigate = useNavigate()
    const [wssstatus, setwsstatus] = useState(null as any)
    const [sigmasearchList, setSigmasearchList] = useState(null as any)
    const [ruleIndex, setRuleIndex] = useState(0 as any)
    const [createdetectionsList, setCreateDetectionsList] = useState([] as any)
    const [creatingRule, setIscreatingRule] = useState(false as any);

    const {
        chatinputwss,
        responceChatwss,
        Chatmessage,
        setChatmessage,
        sendwssconnect,
        setSendwssconnect,
        artifactList,
        setArtifactList,
        sendwssProcessing,
        setSendwssProcessing,
        sigmaSearchFiles,
        setSigmaSearchFiles
    }: any = useData();
    const [filterdata, setFilterdata] = useState([] as any);

    useEffect(() => {
        if (artifactList?.length > 0) {
            fetchartifactsAllData(artifactList)
            setDLoader(true)
            setDetectionsList(artifactList[0]?.data?.sigma_rules)
        }
    }, [artifactList, responceChatwss])

    useEffect(() => {
        dispatch(getinboxCollection() as any).then((res: any) => {
            if (res?.type == 'INBOX_COLLECTION_GET_SUCCESS') {
                setInboxList(res.payload)
            }
        })
        fetchDetails()
        fetchSessiondetails()
    }, []);

    useEffect(() => {
        fetchSessiondetails()
        if (id) {
            fetchHistoryAllData()
        }

    }, [id]);


    const [detectionsList, setDetectionsList] = useState([] as any)
    const fetchDetails = () => {
        dispatch(getallCollection() as any).then((res: any) => {
            if (res?.payload?.length > 0) {
                let collection = [{ name: '+ New' }, ...res.payload]
                setCollectiondata(collection)
            } else {
                let collection = [{ name: '+ New' }]
                setCollectiondata(collection)
            }
        })
    }

    const fetchartifactsCreateData = async (fetchdata: any) => {
        if (fetchdata && fetchdata[0]?.data?.sigmaRules?.length > 0) {
            const docId: any = fetchdata[0]?.data?.sigmaRules.map((row: any) => {
                return row?.id
            });
            const updatedArray2 = fetchdata[0]?.data?.sigmaRules?.map((item: any, index: any) => {
                const match = fetchdata[0]?.data?.sigmaRules.find((el: any) => el?.id === item?.id);
                if (match) {
                    let parsedJSON = yaml.load(fetchdata[0]?.data?.sigmaRules[index]?.content)
                    return {
                        ...fetchdata[0]?.data?.sigmaRules[index],
                        title: parsedJSON?.title,
                        upload: "yaml"
                    };
                }
            });

            setCreateDetectionsList(updatedArray2)
        } else if (fetchdata && fetchdata[0]?.data?.sigma_rules?.length > 0) {
            const docId: any = fetchdata[0]?.data?.sigma_rules.map((row: any) => {
                return row?.id
            });
            const updatedArray2 = fetchdata[0]?.data?.sigma_rules?.map((item: any, index: any) => {
                const match = fetchdata[0]?.data?.sigma_rules.find((el: any) => el?.id === item?.id);
                if (match) {
                    let parsedJSON = yaml.load(fetchdata[0]?.data?.sigma_rules[index]?.content)
                    return {
                        ...fetchdata[0]?.data?.sigma_rules[index],
                        title: parsedJSON?.title,
                        upload: "yaml"
                    };
                }
            });
            setCreateDetectionsList(updatedArray2)
            toast.success(
                <CustomToast
                    message={'Rule updated Successfully'}
                    onClose={() => toast.dismiss()} // Dismiss only this toast
                />,
                {
                    duration: 2000,
                    position: 'top-center',
                    style: {
                        background: '#fff',
                        color: '#000', // White text color
                        width: '500px',
                    },
                },
            )
        }
    }


    const fetchartifactsAllData = async (fetchdata: any) => {
        if (fetchdata && fetchdata[0]?.data?.sigmaRules?.length > 0) {
            const docId: any = fetchdata[0]?.data?.sigmaRules.map((row: any) => {
                return row?.id
            });
            await dispatch(documentGetuuid(docId) as any).then((res: any) => {
                if (res.type == "DOCUMENT_UUID_GET_SUCCESS") {
                    setDLoader(false)
                    const updatedArray2 = res?.payload?.map((item: any, index: any) => {

                        const match = fetchdata[0]?.data?.sigmaRules.find((el: any) => el?.id === item?.uuid);
                        if (match) {
                            return {
                                ...item,
                                source: match.source,
                                s3: match.s3,
                                content: match.content,
                            };
                        } else {
                            let parsedJSON = yaml.load(fetchdata[0]?.data?.sigmaRules[index]?.content)
                            return {
                                ...fetchdata[0]?.data?.sigmaRules[index],
                                title: parsedJSON?.title,
                                upload: "yaml"
                            };
                        }



                    });
                    setDetectionsList(updatedArray2);
                }
            });
        } else if (fetchdata && fetchdata[0]?.data?.sigma_rules?.length > 0) {
            const docId: any = fetchdata[0]?.data?.sigma_rules.map((row: any) => {
                return row?.id
            });
            await dispatch(documentGetuuid(docId) as any).then((res: any) => {
                if (res.type == "DOCUMENT_UUID_GET_SUCCESS") {
                    setDLoader(false)
                    const updatedArray2 = res?.payload?.map((item: any, index: any) => {

                        const match = fetchdata[0]?.data?.sigma_rules.find((el: any) => el?.id === item?.uuid);
                        if (match) {
                            return {
                                ...item,
                                source: match.source,
                                s3: match.s3,
                                content: match.content,
                            };
                        } else {
                            let parsedJSON = yaml.load(fetchdata[0]?.data?.sigma_rules[index]?.content)
                            return {
                                ...fetchdata[0]?.data?.sigma_rules[index],
                                title: parsedJSON?.title,
                                upload: "yaml"
                            };
                        }



                    });
                    setDetectionsList(updatedArray2);
                }
            });
        }
    }
    const handleNavigatelanding = () => {
        navigateTo(`/app/chatworkbench`)
        sessionStorage.setItem('active', 'Chats')
    }

    const [rows, setRows] = useState(1)
    const [shift, setShift] = useState(null as any)
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => { 
        setChatmessage([])
        if (event.key === 'Enter' && !event.shiftKey && !isSend && !sendwssconnect) {
            event.preventDefault()
            setShift(event)
            handleWebSocket()
        }
    }

    const handleOnChange = (e: any) => {
        const value = e.target.value
        if (value === '') {
            setSendmessage('')
            setRows(1)
        } else {
            setSendmessage(value)
        }
    }
    const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'inherit'
        if (e.target.value === '') {
            e.target.style.height = '36px'
        } else {
            e.target.style.height = `${Math.min(e.target.scrollHeight, 48)}px`
        }
    }

    useEffect(() => {
        if (cancelChat) handleWebSocket()
    }, [cancelChat])

    useEffect(() => {
        if (sigmaSearchFiles) {
            setDetectionsList([])
            handleWebSocket()
            let objcts = [...messages, { message: sigmaSearchFiles?.sendmessage, question: true }]
            setInputMessage(objcts)
        }
    }, [sigmaSearchFiles])

    const stopWebSocket = () => {
        if (
            socket &&
            (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
        ) {
            setCancelChat(true)
            setisSend(false)
        }
    }


    const connectWebSocket = (id: any, files: any) => {
        return new Promise((resolve: any, reject: any) => {
            const connection = wssConnectionMethod(id, files)
            if (connection) {
                let ws = connection()
                ws.addEventListener('open', function (event: any) {
                    console.log('WebSocket is open now. addEventListener')
                    resolve(ws)
                })
            } else {
                reject('Sorry Connection Failed')
            }
        })
    }

    const handleWebSocket = () => {
        const vaultdata: any = sessionStorage.getItem('vaultdata')
        const datavalut = JSON.parse(vaultdata)
        const sessionName = sendmessage
        const chatObj = {
            sessionName: sendmessage ? sendmessage?.trim() : sigmaSearchFiles?.sendmessage?.trim(),
        }
        const getname: any = sessionStorage.getItem('sessionName')
        const getnamejson = JSON.parse(getname)
        if (!getnamejson) {
            sessionStorage.setItem('sessionName', JSON.stringify(chatObj))
        }

        const selectFiles = {
            vaultId: datavalut?.vaultId ? datavalut?.vaultId : 0,
            id: datavalut?.reportId ? datavalut?.reportId : 0,
            ruleId: 0,
            mitreLocation: datavalut?.mitreLocation ? datavalut?.mitreLocation : null,
            global: datavalut?.globalVault ? datavalut?.globalVault : false,
            sessionItem: true,
        }

        if (!id) {
            setMessages([])
            dispatch(createChat(selectFiles, chatObj) as any).then((newChatResponse: any) => {
                if (newChatResponse.type === 'CREATE_CHAT_SUCCESS') {
                    sessionStorage.setItem('chatid', newChatResponse?.payload?.id)
                    navigateTo(`/app/chatworkbench/${newChatResponse.payload.id}`)
                    navigateTo(`/app/sourcerulechats/${newChatResponse.payload.id}`, { state: { sources: state?.sources, sourcesheaer: state?.sourcesheaer } })
                    connectWebSocket(newChatResponse.payload.id, selectFiles).then((wsResponse: any) => {
                        if (wsResponse) {
                            sendPrompt(datavalut, wsResponse)
                        }
                    })
                }
            })
        } else {
            if (!socket?.readyState) {
                connectWebSocket(id, state ? state : selectFiles)
                    .then((wsResponse: any) => {
                        if (wsResponse) {
                            sendPrompt(datavalut, wsResponse)
                        }
                    })
                    .catch((err: any) => {
                        console.log('connectWebSocket err======>', err)
                    })
            } else {
                sendPrompt(datavalut, socket)
            }
        }
    }

    const sendPrompt = (datavalut: any, webSocket: any) => {
        if (sendmessage.trim() || cancelChat || sigmaSearchFiles?.sendmessage.trim()) {

            if (sendmessage || cancelChat || sigmaSearchFiles?.sendmessage.trim()) {
                setRows(1)
                let object: any
                if (state?.sourcesheaer == "sources") {
                    if (state.sources) {
                        object =
                        {
                            "message_id": uuidv4(),
                            "message": sendmessage ? sendmessage : sigmaSearchFiles?.sendmessage.trim(),
                            "focus": "sigma_search",
                            "artifacts": [{
                                "type": "sigma_search",
                                "data": {
                                    sources: [
                                        state?.sources
                                    ]
                                }
                            }]
                        }
                    } else {
                        object =
                        {
                            "message_id": uuidv4(),
                            "message": sendmessage ? sendmessage : sigmaSearchFiles?.sendmessage,
                            "focus": "sigma_search",
                            "artifacts": [{
                                "type": "sigma_search",
                                "data": {
                                    sources: [
                                        "cti",
                                        "dac_repo",
                                        "imported"
                                    ]
                                }
                            }]
                        }
                    }

                } else if (state?.sourcesheaer == "landing") {
                    object = {
                        "message_id": uuidv4(),
                        "message": sendmessage ? sendmessage : sigmaSearchFiles?.sendmessage,
                        "focus": "rule_agent",
                        "artifacts": [{
                            "type": "rule_chat",
                        }],

                    }
                } else {
                    object =
                    {
                        "message_id": uuidv4(),
                        "message": sendmessage ? sendmessage : sigmaSearchFiles?.sendmessage,
                        "focus": "sigma_search",
                        "artifacts": [{
                            "type": "sigma_search",
                            "data": {
                                sources: [
                                    "collection",
                                ]
                            }
                        }]
                    }
                }

                let cancelObject: any = {
                    cancel: true,
                }
                if (webSocket && webSocket.readyState === WebSocket.OPEN) {
                    if (cancelChat) {
                        webSocket.send(JSON.stringify(cancelObject))
                        setCancelChat(false)
                        setSendmessage('')
                        setSigmaSearchFiles(null)
                        // setInputMessage(sendmessage)
                        setwsstatus(null)
                    } else {
                        setwsstatus('Thinking')
                        setSendmessage('')
                        setisSend(true)
                        let objcts = [...messages, { message: object.message, question: true }]
                        setInputMessage(objcts)
                        setMessages((prevMessages: any) => [
                            ...prevMessages,
                            { message: object.message, question: true },
                        ])
                        webSocket.send(JSON.stringify(object))
                    }
                }
            }
        }
    }

    const wssConnectionMethod = (chatId: any, selectedFiles: any) => {
        const localStorage1 = local.getItem('bearerToken')
        const token = JSON.parse(localStorage1 as any)
        const barearTockens = token?.bearerToken.split(' ')
        const sessionnams: any = sessionList.find((x: any) => x.id == id)
        let ws: any = null
        let messageMap: any = null
        ws = new WebSocket(
            `${environment?.baseWssUrl}/intel-chat/${chatId}/${sessionnams?.sessionName}?Authorization=${barearTockens[1]}`,
        )
        setSocket(ws)
        if (ws === null) {
            console.log(' WebSocket creation failure')
            return
        }
        setDLoader(true)
        setctiChat([])
        setisSend(false)
        messageMap = new Map()

        ws.addEventListener('open', () => {
            console.log('WebSocket connected')
        })
        ws.addEventListener('message', (event: any) => onMessage(event, messageMap))

        ws.addEventListener('close', function (event: any) {
            setisSend(false)
            console.log('WebSocket closed')
        })

        return () => {
            if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
                setisSend(false)
                console.log('WebSocket is CONNECTING')
                return ws
            } else {
                return 'WebSocket connection was failed.'
            }
        }
    }


    const onMessage = (event: any, messageMap: any) => {
        const value = JSON.parse(event.data)
        setwsstatus(value?.status)
        if (messageMap.has(value.message_id)) {
            const existingMessage: any = messageMap.get(value.message_id)
            existingMessage.status = value?.status || null
            existingMessage.artifacts = value?.artifacts || []
            existingMessage.message += value.message ? value.message : ''
            existingMessage.done = value.done ? value.done : false
            existingMessage.focus = value.focus ? value.focus : ''
            existingMessage.sources = value.sources ? value.sources : []
            existingMessage.sourcesvalue = value.sources ? value.sources : []
            existingMessage.timestamp = value?.created ? value?.created : null
            existingMessage.sourcescount = null

            if ((value?.artifacts?.length > 0 && value?.status == "found_matches") || (value?.artifacts?.length > 0 && !value?.status)) {
                fetchartifactsAllData(value?.artifacts)
                setDetectionsList(value?.artifacts[0]?.data?.sigma_rules);
            }

            if (value?.artifacts?.length > 0 && value?.status == "created_rule") {
                fetchartifactsCreateData(value?.artifacts)
                setCreateDetectionsList(value?.artifacts[0]?.data?.sigma_rules)
                setIscreatingRule(false)
            } else if (value?.status == "creating_rule" || value?.status == "updating_rule") {
                setIscreatingRule(true)
            }
        } else {
            messageMap.set(value.message_id, {
                message: value.message,
                question: false,
                error: value.error,
            })
        }
        const mergedMessages = Array.from(messageMap.values())

        setctiChat(mergedMessages)

        const chatgetId: any = sessionStorage.getItem('chatid')

        if (value.done) {
            if ((value?.artifacts?.length > 0 && value?.status == "found_matches") || (value?.artifacts?.length > 0 && !value?.status)) {
                fetchartifactsAllData(value?.artifacts)
                setDetectionsList(value?.artifacts[0]?.data?.sigma_rules);
            }

            if (value?.artifacts?.length > 0 && value?.status == "created_rule") {
                fetchartifactsCreateData(value?.artifacts)
                setCreateDetectionsList(value?.artifacts[0]?.data?.sigma_rules)
            }
            fetchHistoryAllData()
            const mergedMessages: any = Array.from(messageMap.values())
            const extractedData = mergedMessages?.map((item: any) => item.sources).flat()
            const Cti: any = extractedData.filter((item: any) => {
                return item?.category == 'cti' || item?.category == 'mitre' || item?.category == 'cve'
            })
            const Sigma: any = extractedData.filter((item: any) => {
                return item?.category == 'sigma' || item?.category == 'yara'
            })
            mergedMessages[0].sources = Cti

            mergedMessages[0].sourcescount =
                Sigma.length > 0
                    ? Sigma.reduce((counts: any, item: any) => {
                        counts[item.category] = (counts[item.category] || 0) + 1
                        return counts
                    }, {})
                    : null
            setMessages((pre: any) => [...pre, ...mergedMessages])
            messageMap.clear()
            setctiChat([])
            setisSend(false)
            setSendwssProcessing(false)
            setSigmaSearchFiles(null)
            setwsstatus(null)
            setSendmessage('')
        }
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }

        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, ctiChat, detectionsList?.length > 0, createdetectionsList?.length > 0, wssstatus]);

    const fetchSessiondetails = () => {
        dispatch(chatSideList(token, 0) as any).then((res: any) => {
            if (res.type == 'CHAT_DETAIL_SUCCESS') {
                setSessionList(res?.payload)
            }
        })
    }

    const fetchHistoryAllData = () => {
        let noOfprompts: any = 100
        let selectOption: any
        const dataid: any = sessionStorage.getItem('chatid')
        dispatch(ChatHistoryDetails(userIdchat, id ? id : Number(dataid), noOfprompts) as any).then(
            (reponse: any) => {
                if (reponse) {
                    let mergedMessages: any = reponse?.payload
                    let arr: any = []
                    let artifactsList: any = []
                    let artifactsquList: any = []
                    for (let i = 0; i < mergedMessages?.length; i++) {
                        if (mergedMessages[i]?.sources?.length > 0) {
                            const Cti: any = mergedMessages[i].sources.filter((item: any) => {
                                return (
                                    item?.category == 'cti' || item?.category == 'mitre' || item?.category == 'cve'
                                )
                            })
                            const Sigma: any = mergedMessages[i].sources.filter((item: any) => {
                                return item?.category == 'sigma' || item?.category == 'yara'
                            })
                            mergedMessages[i].sources = Cti

                            mergedMessages[i].sourcescount =
                                Sigma.length > 0
                                    ? Sigma.reduce((counts: any, item: any) => {
                                        counts[item.category] = (counts[item.category] || 0) + 1
                                        return counts
                                    }, {})
                                    : null
                            arr.push(mergedMessages[i])
                        } else {
                            arr.push(mergedMessages[i])
                        }
                        selectOption = mergedMessages[i]
                        const artifacts: any = mergedMessages.find((x: any) => x?.artifacts)

                        if ((id || dataid) && (!mergedMessages[i]?.question && mergedMessages[i]?.artifacts?.length > 0 || !mergedMessages[i]?.question && mergedMessages[i]?.createdRules?.length > 0 || !mergedMessages[i]?.question && mergedMessages[i]?.foundMatches?.length > 0)) {
                            artifactsList.push(mergedMessages[i])
                        }
                        if ((id || dataid) && mergedMessages[i]?.question) {
                            artifactsquList.push(mergedMessages[i])
                        }
                    }
                    const lastIndex = artifactsList.length - 1;
                    if (((id || dataid) && artifactsList[lastIndex]?.artifacts?.length > 0) || ((id || dataid) && artifactsList[lastIndex]?.foundMatches?.length > 0)) {
                        fetchartifactsAllData(artifactsList[lastIndex].artifacts.length > 0 ? artifactsList[lastIndex].artifacts : artifactsList[lastIndex].foundMatches)
                    } else if (((id || dataid) && artifactsList[lastIndex]?.artifacts?.length == 0) || ((id || dataid) && artifactsList[lastIndex]?.foundMatches?.length == 0)) {
                        setDetectionsList([])
                    }
                    if ((id || dataid) && artifactsList[lastIndex]?.createdRules?.length > 0) {
                        fetchartifactsCreateData(artifactsList[lastIndex].createdRules)
                    } else if ((id || dataid) && artifactsList[lastIndex]?.createdRules?.length == 0) {
                        setCreateDetectionsList([])
                    }

                    const lastQa = artifactsquList.length - 1;
                    if ((id || dataid) && artifactsquList[lastQa]) {
                        setSigmasearchList(artifactsquList[lastQa]);
                    }
                    setMessages(mergedMessages)

                }
            })
    }


    const handleNavigate = () => {
        if (state?.sourcesheaer == "collection") {
            navigateTo('/app/collections')
        } else if (state?.sourcesheaer == "sources") {
            navigateTo('/app/sourcespage')
        } else {
            navigateTo('/app/landingpage')
        }

    }

    const [showPopover, setShowPopover] = useState(false)

    const copyToClipboard = (data: any) => {
        navigator.clipboard.writeText(data)
        setShowPopover(true)
        setTimeout(() => {
            setShowPopover(false)
        }, 2000)
    }

    const handlecopyToinbox = (codeContent: any, responce: any) => {
        const validation = {
            sigma_rule: codeContent,
        }
        dispatch(yamlFileValidation(validation) as any).then((res: any) => {
            if (res.type == 'VALIDATION_YAML_FILE_SUCCESS') {
                if (res?.payload.valid) {
                    toast.success(
                        <CustomToast
                            message={`Validated Successfully`}
                            onClose={() => toast.dismiss()} // Dismiss only this toast
                        />,
                        {
                            duration: 2000,
                            position: 'top-center',
                            style: {
                                background: '#fff',
                                color: '#000', // White text color
                                width: '500px',
                            },
                        },
                    )
                    let parsedJSON = yaml.load(codeContent)
                    const blob = new Blob([codeContent], { type: 'text/plain' })
                    const file = new File([blob], `${parsedJSON?.title}.yml`, { type: 'text/plain' })
                    const data = new FormData()
                    data.append('file', file)
                    dispatch(workbenchyamlFileUpdate(inboxList?.id, Number(id), data) as any)
                        .then((res: any) => {
                            if (res.type == 'UPDATE_YAML_FILE_SUCCESS') {
                                toast.success(
                                    <CustomToast
                                        message={'Rule copied successfully'}
                                        onClose={() => toast.dismiss()} // Dismiss only this toast
                                    />,
                                    {
                                        duration: 4000,
                                        position: 'top-center',
                                        style: {
                                            background: '#fff',
                                            color: '#000', // White text color
                                            width: '500px',
                                        },
                                    },
                                )
                            } else {
                                toast.error(
                                    <CustomToast
                                        message='Failed to copy the rule. Please try again.'
                                        onClose={() => toast.dismiss()} // Dismiss only this toast
                                    />,
                                    {
                                        duration: 4000,
                                        position: 'top-center',
                                        style: {
                                            background: '#fff',
                                            color: '#000', // White text color
                                            width: '500px',
                                        },
                                    },
                                )
                            }
                        })
                        .catch((error: any) => { })
                } else {
                    toast.error(
                        <CustomToast
                            message={`Validation failed with ${res?.payload?.errors?.length}errors`}
                            onClose={() => toast.dismiss()} // Dismiss only this toast
                        />,
                        {
                            duration: 1000,
                            position: 'top-center',
                            style: {
                                background: '#fff',
                                color: '#000', // White text color
                                width: '500px',
                            },
                        },
                    )
                    setMessages((prevMessages: any) => [
                        ...prevMessages,
                        { ...res?.payload, message: null, question: false },
                    ])
                }
            }
        })
    }

    const handlecopyToCollection = (params: any, codeContent: any, responce: any) => {
        const validation = {
            sigma_rule: codeContent,
        }
        dispatch(yamlFileValidation(validation) as any).then((res: any) => {
            if (res.type == 'VALIDATION_YAML_FILE_SUCCESS') {
                if (res?.payload.valid) {
                    toast.success(
                        <CustomToast
                            message={`Validated Successfully`}
                            onClose={() => toast.dismiss()} // Dismiss only this toast
                        />,
                        {
                            duration: 2000,
                            position: 'top-center',
                            style: {
                                background: '#fff',
                                color: '#000', // White text color
                                width: '500px',
                            },
                        },
                    )
                    let parsedJSON = yaml.load(codeContent)
                    const collectionTest: any = [
                        {
                            id: id,
                            title: parsedJSON?.title,
                            yamlText: codeContent,
                        },
                    ]
                    setCollectionorcti(params)
                    setSelectedRows(collectionTest)
                    setDialogOpen(true)
                } else {
                    toast.error(
                        <CustomToast
                            message={`Validation failed with ${res?.payload?.errors?.length}errors`}
                            onClose={() => toast.dismiss()} // Dismiss only this toast
                        />,
                        {
                            duration: 1000,
                            position: 'top-center',
                            style: {
                                background: '#fff',
                                color: '#000', // White text color
                                width: '500px',
                            },
                        },
                    )
                    setMessages((prevMessages: any) => [
                        ...prevMessages,
                        { ...res?.payload, message: null, question: false },
                    ])
                }
            }
        })
    }

    const cleanMarkdown = (text: string): string => {
        return text.replace(/null|undefined/g, '').trim()
    }

    const formatText = (text: string): string => {
        return text?.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    useEffect(() => {
        fetchDetails()
    }, [isDialogOpen])

    return (
        <>
            <div className='bg-[#1d2939] p-6 flex flex-row items-center justify-between relative overflow-hidden max-md:gap-4 flex-wrap'>
                {/* Back Button */}
                <button
                    onClick={handleNavigate}
                    className='flex flex-row gap-3 items-center justify-center max-sm:gap-1'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        className='max-sm:w-4 max-sm:h-4'
                    >
                        <path
                            d='M19 12H5M5 12L12 19M5 12L12 5'
                            stroke='#EE7103'
                            stroke-width='2'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                        />
                    </svg>
                    <div className='text-[#ee7103] text-lg font-semibold max-sm:text-base'>Back</div>
                </button>

                {/* Create Detections Section */}
                <div className='flex flex-row gap-4 items-center flex-1 justify-center'>
                    {/* Title */}
                    <div className='flex flex-row gap-2 items-center'>
                        <div className='text-white text-xl font-medium max-sm:text-lg'>
                            {state?.sourcesheaer == 'collection'
                                ? 'Review Detections'
                                : state?.sourcesheaer == 'sources'
                                    ? 'Discover Detections'
                                    : 'Create Detection'}
                        </div>
                    </div>

                    {/* Detection Agent */}
                    <div
                        className={`relative flex-shrink-0 ${state?.sourcesheaer === "collection"
                            ? "w-[130px] h-[31px] p-[4px]"
                            : state?.sourcesheaer === "sources"
                                ? "w-[130px] h-[31px] p-[4px]"
                                : "w-[130px] h-[31px] p-[4px]"
                            } flex items-center justify-center`}
                    >
                        <svg
                            className="absolute w-full h-full"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 137 32"
                            fill="none"
                        >
                            <path
                                d="M0.5 12.5C0.5 6.14873 5.64873 1 12 1H125C131.351 1 136.5 6.14873 136.5 12.5V19.5C136.5 25.8513 131.351 31 125 31H12C5.64872 31 0.5 25.8513 0.5 19.5V12.5Z"
                                fill="#0F121B"
                                stroke="#7690B2"
                            />
                        </svg>
                        <div
                            className="absolute text-[#ee7103] text-sm leading-6 text-center"
                        >
                            {state?.sourcesheaer === "collection"
                                ? "Review Agent"
                                : state?.sourcesheaer === "sources"
                                    ? "Discover Agent"
                                    : "Create Agent"}
                        </div>
                    </div>

                </div>
                {/* Show/Hide Detections */}
                {
                 detectionsList?.length > 0 && (
                    <div className='flex max-md:basis-full justify-center'>  
                        <button
                        onClick={() => setShowRule(!ShowRule)}
                        className='border border-[#ee7103] rounded-lg px-3.5 py-2 shadow-sm lg:hidden max-sm:py-1.5'
                        >
                            <div className='text-sm font-semibold text-white max-sm:text-[12px]'>
                                {!ShowRule ? 'Show Detections' : 'Show Chat'}
                            </div>
                        </button>
                    </div>  
                    )
                }
              
            </div>
            <div
                style={{
                    height: `${dynamicHeight}px`,
                    width: '100%',
                    textAlign: 'left',
                    overflowY: 'hidden',
                    backgroundColor: '#0C111D',
                    borderRadius: '8px',
                    // marginLeft: '20px',
                }}
            >
                <div className='grid grid-cols-12 items-center gap-4'>
                    <div
                        className={`transition-all duration-500 ease-in-out bg-white shadow-md ${(detectionsList?.length > 0 || createdetectionsList?.length > 0) && ShowRule ? 'col-span-5 translate-x-0 max-lg:hidden' : 'col-span-12 translate-x-0'
                            }`}
                        style={{
                            height: `${dynamicHeight}px`,
                            width: '100%',
                            textAlign: 'left',
                            overflowY: 'hidden',
                            backgroundColor: '#0C111D',
                            borderRadius: '8px',
                            // marginLeft: '20px',
                        }}
                    >
                        <div className='grid grid-rows-[1fr_auto] h-full'>
                            {/* Scrollable top section */}
                            <div className='overflow-y-auto p-4 min-h-full'>
                                <div className='grid grid-cols-12 items-center gap-4'>
                                    {/* Optional content for each column */}
                                    {((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) && <div className='col-span-3 flex items-center justify-center max-lg:col-span-1'></div>}
                                    <div className={`${((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) ? 'col-span-6 max-lg:col-span-10' : 'col-span-12'} relative`}>
                                        {(!isSend && !sigmaSearchFiles) ? (
                                            <>
                                                {messages.map((responce: any, index: any) => (
                                                    <>
                                                        {responce.question && (
                                                            <div key={index}>
                                                                <div className='flex mb-2 mt-[24px]'>
                                                                    <div className='bg-[#054D80] rounded-xl p-1'>
                                                                        <svg
                                                                            width='16'
                                                                            height='16'
                                                                            viewBox='0 0 16 16'
                                                                            fill='none'
                                                                            xmlns='http://www.w3.org/2000/svg'
                                                                        >
                                                                            <g id='recording-01'>
                                                                                <path
                                                                                    id='Icon'
                                                                                    d='M6.80001 13.3999L9.20001 13.3999M4.40001 10.6999L11.6 10.6999M2.60001 7.9999L13.4 7.9999M4.40001 5.2999L11.6 5.2999M6.80001 2.5999L9.20001 2.5999'
                                                                                    stroke='white'
                                                                                    strokeLinecap='round'
                                                                                    strokeLinejoin='round'
                                                                                />
                                                                            </g>
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                                                            You
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className='mb-4 items-center justify-center w-full'>
                                                                    <div className='bg-[#054D80] text-white p-3 rounded-lg w-full break-words'>
                                                                        <div className="markdown-content">
                                                                            <ReactMarkdown
                                                                                components={{
                                                                                    h1: ({ children }) => (
                                                                                        <h1 className='markdown-heading'>{children}</h1>
                                                                                    ),
                                                                                    h2: ({ children }) => (
                                                                                        <h2 className='markdown-heading'>{children}</h2>
                                                                                    ),
                                                                                    h3: ({ children }) => (
                                                                                        <h3 className='markdown-heading'>{children}</h3>
                                                                                    ),
                                                                                    a: ({ node, ...props }) => (
                                                                                        <a {...props} target='_blank' rel='noopener noreferrer'>
                                                                                            {props.children}
                                                                                        </a>
                                                                                    ),
                                                                                    code({ inline, className, children, ...props }: CodeProps) {
                                                                                        const match = /language-(\w+)/.exec(className || '')
                                                                                        const codeContent = String(children).replace(/\n$/, '')
                                                                                        return !inline && match ? (
                                                                                            <div className='relative markdown-code-block'>
                                                                                                <SyntaxHighlighter
                                                                                                    style={darcula as any}
                                                                                                    language={match[1]}
                                                                                                    PreTag='div'
                                                                                                    wrapLines={true}
                                                                                                    wrapLongLines={true}
                                                                                                    showLineNumbers={true}
                                                                                                    className={`markdown-code ${className}`}
                                                                                                    {...props}
                                                                                                >
                                                                                                    {String(children).replace(/\n$/, '')}
                                                                                                </SyntaxHighlighter>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <code className={className} {...props}>
                                                                                                {children}
                                                                                            </code>
                                                                                        )
                                                                                    },
                                                                                }}
                                                                            >
                                                                                {cleanMarkdown(!responce?.error && responce?.message
                                                                                    ? responce?.message
                                                                                    : responce?.error
                                                                                        ? responce?.error
                                                                                        : "We're facing technical difficulties. Retry later, please.")}
                                                                            </ReactMarkdown>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {/* Message 2 */}
                                                        {!responce.question && !responce?.status && (
                                                            <div key={index}>
                                                                <div className='flex mb-2 mt-[24px]'>
                                                                    <div className=''>
                                                                        <svg
                                                                            xmlns='http://www.w3.org/2000/svg'
                                                                            width='24'
                                                                            height='24'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                        >
                                                                            <circle cx='12' cy='12' r='12' fill='#1D2939' />
                                                                            <path
                                                                                fill-rule='evenodd'
                                                                                clip-rule='evenodd'
                                                                                d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                                                                fill='#EE7103'
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                                                            S2S AI
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className='mb-4 text-left items-center justify-center w-full'>
                                                                    <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words'>
                                                                        {responce?.message ? (
                                                                            <div className="markdown-content">
                                                                                <ReactMarkdown
                                                                                    components={{
                                                                                        h1: ({ children }) => (
                                                                                            <h1 className='markdown-heading'>{children}</h1>
                                                                                        ),
                                                                                        h2: ({ children }) => (
                                                                                            <h2 className='markdown-heading'>{children}</h2>
                                                                                        ),
                                                                                        h3: ({ children }) => (
                                                                                            <h3 className='markdown-heading'>{children}</h3>
                                                                                        ),
                                                                                        a: ({ node, ...props }) => (
                                                                                            <a {...props} target='_blank' rel='noopener noreferrer'>
                                                                                                {props.children}
                                                                                            </a>
                                                                                        ),

                                                                                        code({
                                                                                            inline,
                                                                                            className,
                                                                                            children,
                                                                                            ...props
                                                                                        }: CodeProps) {
                                                                                            const match = /language-(\w+)/.exec(className || '')
                                                                                            const codeContent = String(children).replace(/\n$/, '')
                                                                                            if (match && match[1] === 'yaml') {
                                                                                                sessionStorage.setItem(
                                                                                                    'ymal',
                                                                                                    JSON.stringify(codeContent),
                                                                                                )
                                                                                            }

                                                                                            return !inline && match ? (
                                                                                                <>
                                                                                                    <div className='flex items-center justify-between  w-full h-full flex-wrap py-2'>
                                                                                                        {/* Rule Text */}
                                                                                                        <div className='text-white text-sm font-semibold leading-[20px] font-inter'></div>

                                                                                                        {/* Action Buttons */}
                                                                                                        <div className='flex items-center gap-6 justify-end flex-wrap'>
                                                                                                            {/* Copy Button */}
                                                                                                            <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                                                                copyToClipboard(codeContent)
                                                                                                            }>
                                                                                                                <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter'>
                                                                                                                    Copy
                                                                                                                </span>
                                                                                                                <svg

                                                                                                                    className='cursor-pointer'
                                                                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                                                                    width='20'
                                                                                                                    height='20'
                                                                                                                    viewBox='0 0 20 20'
                                                                                                                    fill='none'
                                                                                                                >
                                                                                                                    <g clip-path='url(#clip0_4347_5948)'>
                                                                                                                        <path
                                                                                                                            d='M6.6665 6.6665V4.33317C6.6665 3.39975 6.6665 2.93304 6.84816 2.57652C7.00795 2.26292 7.26292 2.00795 7.57652 1.84816C7.93304 1.6665 8.39975 1.6665 9.33317 1.6665H15.6665C16.5999 1.6665 17.0666 1.6665 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.3332 2.93304 18.3332 3.39975 18.3332 4.33317V10.6665C18.3332 11.5999 18.3332 12.0666 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.0666 13.3332 16.5999 13.3332 15.6665 13.3332H13.3332M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                            stroke='#EE7103'
                                                                                                                            stroke-width='1.66667'
                                                                                                                            stroke-linecap='round'
                                                                                                                            stroke-linejoin='round'
                                                                                                                        />
                                                                                                                    </g>
                                                                                                                    <defs>
                                                                                                                        <clipPath id='clip0_4347_5948'>
                                                                                                                            <rect
                                                                                                                                width='20'
                                                                                                                                height='20'
                                                                                                                                fill='white'
                                                                                                                            />
                                                                                                                        </clipPath>
                                                                                                                    </defs>
                                                                                                                </svg>
                                                                                                                {showPopover && (
                                                                                                                    <div className='absolute  p-1 bg-white text-black rounded shadow z-10 mt-16'>
                                                                                                                        Copied!
                                                                                                                    </div>
                                                                                                                )}
                                                                                                            </div>

                                                                                                            {/* Move to Detection Lab Button */}
                                                                                                            <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                                                                handlecopyToinbox(codeContent, responce)
                                                                                                            }>
                                                                                                                <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter'>
                                                                                                                    Move to Detection Lab
                                                                                                                </span>
                                                                                                                <svg

                                                                                                                    className='cursor-pointer'
                                                                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                                                                    width='20'
                                                                                                                    height='20'
                                                                                                                    viewBox='0 0 20 20'
                                                                                                                    fill='none'
                                                                                                                >
                                                                                                                    <g clip-path='url(#clip0_4347_6313)'>
                                                                                                                        <path
                                                                                                                            d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                            stroke='#EE7103'
                                                                                                                            stroke-width='1.66667'
                                                                                                                            stroke-linecap='round'
                                                                                                                            stroke-linejoin='round'
                                                                                                                        />
                                                                                                                    </g>
                                                                                                                    <defs>
                                                                                                                        <clipPath id='clip0_4347_6313'>
                                                                                                                            <rect
                                                                                                                                width='20'
                                                                                                                                height='20'
                                                                                                                                fill='white'
                                                                                                                            />
                                                                                                                        </clipPath>
                                                                                                                    </defs>
                                                                                                                </svg>
                                                                                                            </div>

                                                                                                            {/* Move to a Collection Button */}
                                                                                                            <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                                                                handlecopyToCollection(
                                                                                                                    'workbench',
                                                                                                                    codeContent,
                                                                                                                    responce,
                                                                                                                )
                                                                                                            }>
                                                                                                                <span className='text-[#EE7103] text-sm font-semibold leading-[20px] font-inter'>
                                                                                                                    Move to a Collection
                                                                                                                </span>
                                                                                                                <svg

                                                                                                                    className='cursor-pointer'
                                                                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                                                                    width='20'
                                                                                                                    height='20'
                                                                                                                    viewBox='0 0 20 20'
                                                                                                                    fill='none'
                                                                                                                >
                                                                                                                    <g clip-path='url(#clip0_4347_5916)'>
                                                                                                                        <path
                                                                                                                            d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                            stroke='#EE7103'
                                                                                                                            stroke-width='1.66667'
                                                                                                                            stroke-linecap='round'
                                                                                                                            stroke-linejoin='round'
                                                                                                                        />
                                                                                                                    </g>
                                                                                                                    <defs>
                                                                                                                        <clipPath id='clip0_4347_5916'>
                                                                                                                            <rect
                                                                                                                                width='20'
                                                                                                                                height='20'
                                                                                                                                fill='white'
                                                                                                                            />
                                                                                                                        </clipPath>
                                                                                                                    </defs>
                                                                                                                </svg>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className='relative markdown-code-block'>
                                                                                                        <div className='yaml-container'>
                                                                                                            <SyntaxHighlighter
                                                                                                                style={darcula as any}
                                                                                                                language={match[1]}
                                                                                                                PreTag='div'
                                                                                                                wrapLines={true}
                                                                                                                wrapLongLines={true}
                                                                                                                showLineNumbers={true}
                                                                                                                className={`markdown-code ${className}`}
                                                                                                                {...props}
                                                                                                            >
                                                                                                                {String(children).replace(/\n$/, '')}
                                                                                                            </SyntaxHighlighter>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <code className={className} {...props}>
                                                                                                    {children}
                                                                                                </code>
                                                                                            )
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    {cleanMarkdown(!responce?.error && responce?.message
                                                                                        ? responce?.message
                                                                                        : responce?.error
                                                                                            ? responce?.error
                                                                                            : "We're facing technical difficulties. Retry later, please.")}
                                                                                </ReactMarkdown>
                                                                            </div>
                                                                        ) : (
                                                                            <div className='p-4'>
                                                                                <div className='flex flex-row'>
                                                                                    <h2 className='text-white text-md font-normal leading-[150%]'>
                                                                                        Validated Errors{' '}
                                                                                    </h2>
                                                                                    <span className='text-gray-500 text-md font-normal leading-6'>{`(${responce?.errors?.length} Errors found)`}</span>
                                                                                </div>
                                                                                <ul className='list-disc list-inside text-red-700'>
                                                                                    {responce?.errors?.map((error: any, index: any) => (
                                                                                        <li key={index}>{error}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                ))}

                                            </>
                                        ) : (
                                            <>
                                                <>
                                                    {inputMessage?.map((responce: any, index: any) => {
                                                        if (divRef.current) {
                                                            divRef.current.scrollTop =
                                                                divRef.current.scrollHeight - divRef.current.clientHeight
                                                        }
                                                        return (
                                                            <>
                                                                <div key={index}>
                                                                    {responce.question && (
                                                                        <>
                                                                            <div className='flex mb-2 mt-[24px]'>
                                                                                <div className='bg-[#054D80] rounded-xl p-1'>
                                                                                    <svg
                                                                                        width='16'
                                                                                        height='16'
                                                                                        viewBox='0 0 16 16'
                                                                                        fill='none'
                                                                                        xmlns='http://www.w3.org/2000/svg'
                                                                                    >
                                                                                        <g id='recording-01'>
                                                                                            <path
                                                                                                id='Icon'
                                                                                                d='M6.80001 13.3999L9.20001 13.3999M4.40001 10.6999L11.6 10.6999M2.60001 7.9999L13.4 7.9999M4.40001 5.2999L11.6 5.2999M6.80001 2.5999L9.20001 2.5999'
                                                                                                stroke='white'
                                                                                                strokeLinecap='round'
                                                                                                strokeLinejoin='round'
                                                                                            />
                                                                                        </g>
                                                                                    </svg>
                                                                                </div>
                                                                                <div>
                                                                                    <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                                                                        You
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className='mb-4 items-center justify-center w-full'>
                                                                                <div className='bg-[#054D80] text-white p-3 rounded-lg w-full break-words'>
                                                                                    <div className="markdown-content">
                                                                                        <ReactMarkdown
                                                                                            components={{
                                                                                                h1: ({ children }) => (
                                                                                                    <h1 className='markdown-heading'>{children}</h1>
                                                                                                ),
                                                                                                h2: ({ children }) => (
                                                                                                    <h2 className='markdown-heading'>{children}</h2>
                                                                                                ),
                                                                                                h3: ({ children }) => (
                                                                                                    <h3 className='markdown-heading'>{children}</h3>
                                                                                                ),
                                                                                                a: ({ node, ...props }) => (
                                                                                                    <a
                                                                                                        {...props}
                                                                                                        target='_blank'
                                                                                                        rel='noopener noreferrer'
                                                                                                    >
                                                                                                        {props.children}
                                                                                                    </a>
                                                                                                ),
                                                                                                code({
                                                                                                    inline,
                                                                                                    className,
                                                                                                    children,
                                                                                                    ...props
                                                                                                }: CodeProps) {
                                                                                                    const match = /language-(\w+)/.exec(className || '')
                                                                                                    const codeContent = String(children).replace(
                                                                                                        /\n$/,
                                                                                                        '',
                                                                                                    )
                                                                                                    return !inline && match ? (
                                                                                                        <div className='relative markdown-code-block'>
                                                                                                            <SyntaxHighlighter
                                                                                                                style={darcula as any}
                                                                                                                language={match[1]}
                                                                                                                PreTag='div'
                                                                                                                wrapLines={true}
                                                                                                                wrapLongLines={true}
                                                                                                                showLineNumbers={true}
                                                                                                                className={`markdown-code ${className}`}
                                                                                                                {...props}
                                                                                                            >
                                                                                                                {String(children).replace(/\n$/, '')}
                                                                                                            </SyntaxHighlighter>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <code className={className} {...props}>
                                                                                                            {children}
                                                                                                        </code>
                                                                                                    )
                                                                                                },
                                                                                            }}
                                                                                        >
                                                                                            {cleanMarkdown(!responce?.error && responce?.message
                                                                                                ? responce?.message
                                                                                                : responce?.error
                                                                                                    ? responce?.error
                                                                                                    : "We're facing technical difficulties. Retry later, please.")}
                                                                                        </ReactMarkdown>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {!responce.question && !responce?.status && (responce?.message || responce?.error) && (
                                                                        <div key={index}>
                                                                            <div className='flex mb-2 mt-[24px]'>
                                                                                <div className=''>
                                                                                    <svg
                                                                                        xmlns='http://www.w3.org/2000/svg'
                                                                                        width='24'
                                                                                        height='24'
                                                                                        viewBox='0 0 24 24'
                                                                                        fill='none'
                                                                                    >
                                                                                        <circle cx='12' cy='12' r='12' fill='#1D2939' />
                                                                                        <path
                                                                                            fill-rule='evenodd'
                                                                                            clip-rule='evenodd'
                                                                                            d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                                                                            fill='#EE7103'
                                                                                        />
                                                                                    </svg>
                                                                                </div>
                                                                                <div>
                                                                                    <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                                                                        S2S AI
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className='mb-4 text-left items-center justify-center w-full'>
                                                                                <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words'>
                                                                                    <div className="markdown-content">
                                                                                        <ReactMarkdown
                                                                                            components={{
                                                                                                h1: ({ children }) => (
                                                                                                    <h1 className='markdown-heading'>{children}</h1>
                                                                                                ),
                                                                                                h2: ({ children }) => (
                                                                                                    <h2 className='markdown-heading'>{children}</h2>
                                                                                                ),
                                                                                                h3: ({ children }) => (
                                                                                                    <h3 className='markdown-heading'>{children}</h3>
                                                                                                ),

                                                                                                a: ({ node, ...props }) => (
                                                                                                    <a
                                                                                                        {...props}
                                                                                                        target='_blank'
                                                                                                        rel='noopener noreferrer'
                                                                                                    >
                                                                                                        {props.children}
                                                                                                    </a>
                                                                                                ),

                                                                                                code({
                                                                                                    inline,
                                                                                                    className,
                                                                                                    children,
                                                                                                    ...props
                                                                                                }: CodeProps) {
                                                                                                    const match = /language-(\w+)/.exec(className || '')
                                                                                                    const codeContent = String(children).replace(
                                                                                                        /\n$/,
                                                                                                        '',
                                                                                                    )
                                                                                                    return !inline && match ? (
                                                                                                        <>
                                                                                                            <>
                                                                                                                <div className='flex items-center justify-between w-full h-[20px]'>
                                                                                                                    <div className='text-white text-sm font-medium leading-5'>
                                                                                                                        Rule
                                                                                                                    </div>

                                                                                                                    <div className='flex items-center gap-6 justify-end flex-wrap'>
                                                                                                                        <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                                                                            copyToClipboard(codeContent)
                                                                                                                        }>
                                                                                                                            <span className='text-[#EE7103] text-sm font-inter  leading-5'>
                                                                                                                                Copy
                                                                                                                            </span>
                                                                                                                            <svg
                                                                                                                                xmlns='http://www.w3.org/2000/svg'
                                                                                                                                width='20'
                                                                                                                                height='20'
                                                                                                                                viewBox='0 0 20 20'
                                                                                                                                fill='none'
                                                                                                                            >
                                                                                                                                <g clip-path='url(#clip0_4347_5948)'>
                                                                                                                                    <path
                                                                                                                                        d='M6.6665 6.6665V4.33317C6.6665 3.39975 6.6665 2.93304 6.84816 2.57652C7.00795 2.26292 7.26292 2.00795 7.57652 1.84816C7.93304 1.6665 8.39975 1.6665 9.33317 1.6665H15.6665C16.5999 1.6665 17.0666 1.6665 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.3332 2.93304 18.3332 3.39975 18.3332 4.33317V10.6665C18.3332 11.5999 18.3332 12.0666 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.0666 13.3332 16.5999 13.3332 15.6665 13.3332H13.3332M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                                        stroke='#EE7103'
                                                                                                                                        stroke-width='1.66667'
                                                                                                                                        stroke-linecap='round'
                                                                                                                                        stroke-linejoin='round'
                                                                                                                                    />
                                                                                                                                </g>
                                                                                                                                <defs>
                                                                                                                                    <clipPath id='clip0_4347_5948'>
                                                                                                                                        <rect
                                                                                                                                            width='20'
                                                                                                                                            height='20'
                                                                                                                                            fill='white'
                                                                                                                                        />
                                                                                                                                    </clipPath>
                                                                                                                                </defs>
                                                                                                                            </svg>
                                                                                                                        </div>

                                                                                                                        <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                                                                            handlecopyToinbox(codeContent, responce)
                                                                                                                        }>
                                                                                                                            <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                                                                                                Move to Detection Lab
                                                                                                                            </span>
                                                                                                                            <svg

                                                                                                                                xmlns='http://www.w3.org/2000/svg'
                                                                                                                                width='20'
                                                                                                                                height='20'
                                                                                                                                viewBox='0 0 20 20'
                                                                                                                                fill='none'
                                                                                                                            >
                                                                                                                                <g clip-path='url(#clip0_4347_6313)'>
                                                                                                                                    <path
                                                                                                                                        d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                                        stroke='#EE7103'
                                                                                                                                        stroke-width='1.66667'
                                                                                                                                        stroke-linecap='round'
                                                                                                                                        stroke-linejoin='round'
                                                                                                                                    />
                                                                                                                                </g>
                                                                                                                                <defs>
                                                                                                                                    <clipPath id='clip0_4347_6313'>
                                                                                                                                        <rect
                                                                                                                                            width='20'
                                                                                                                                            height='20'
                                                                                                                                            fill='white'
                                                                                                                                        />
                                                                                                                                    </clipPath>
                                                                                                                                </defs>
                                                                                                                            </svg>
                                                                                                                        </div>

                                                                                                                        <div className='flex items-center justify-center gap-1.5 cursor-pointer' onClick={() =>
                                                                                                                            handlecopyToCollection(
                                                                                                                                'workbench',
                                                                                                                                codeContent,
                                                                                                                                responce,
                                                                                                                            )
                                                                                                                        }>
                                                                                                                            <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                                                                                                Move to a Collection
                                                                                                                            </span>
                                                                                                                            <svg

                                                                                                                                xmlns='http://www.w3.org/2000/svg'
                                                                                                                                width='20'
                                                                                                                                height='20'
                                                                                                                                viewBox='0 0 20 20'
                                                                                                                                fill='none'
                                                                                                                            >
                                                                                                                                <g clip-path='url(#clip0_4347_5916)'>
                                                                                                                                    <path
                                                                                                                                        d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                                        stroke='#EE7103'
                                                                                                                                        stroke-width='1.66667'
                                                                                                                                        stroke-linecap='round'
                                                                                                                                        stroke-linejoin='round'
                                                                                                                                    />
                                                                                                                                </g>
                                                                                                                                <defs>
                                                                                                                                    <clipPath id='clip0_4347_5916'>
                                                                                                                                        <rect
                                                                                                                                            width='20'
                                                                                                                                            height='20'
                                                                                                                                            fill='white'
                                                                                                                                        />
                                                                                                                                    </clipPath>
                                                                                                                                </defs>
                                                                                                                            </svg>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className='relative markdown-code-block'>
                                                                                                                    <div className='yaml-container'>
                                                                                                                        <SyntaxHighlighter
                                                                                                                            style={darcula as any}
                                                                                                                            language={match[1]}
                                                                                                                            PreTag='div'
                                                                                                                            wrapLines={true}
                                                                                                                            wrapLongLines={true}
                                                                                                                            showLineNumbers={true}
                                                                                                                            className={`markdown-code ${className}`}
                                                                                                                            {...props}
                                                                                                                        >
                                                                                                                            {String(children).replace(/\n$/, '')}
                                                                                                                        </SyntaxHighlighter>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </>
                                                                                                        </>
                                                                                                    ) : (
                                                                                                        <code className={className} {...props}>
                                                                                                            {children}
                                                                                                        </code>
                                                                                                    )
                                                                                                },
                                                                                            }}
                                                                                        >
                                                                                            {cleanMarkdown(!responce?.error && responce?.message
                                                                                                ? responce?.message
                                                                                                : responce?.error
                                                                                                    ? responce?.error
                                                                                                    : "We're facing technical difficulties. Retry later, please.")}
                                                                                        </ReactMarkdown>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {!responce.question && responce?.status && (<div>
                                                                        <div className='bouncing-loader'>
                                                                            <div></div>
                                                                            <div></div>
                                                                            <div></div>

                                                                            <span
                                                                                style={{
                                                                                    fontSize: 24,
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                                    marginLeft: 40,
                                                                                }}
                                                                            >
                                                                                {formatText(responce?.status)}
                                                                            </span>

                                                                        </div>
                                                                    </div>)}
                                                                </div>
                                                            </>
                                                        )
                                                    })}
                                                    {!wssstatus && isSend ? (<>
                                                        {ctiChat?.length > 0 && (
                                                            <div>
                                                                <div className='flex mb-2 mt-[24px]'>
                                                                    <div className=''>
                                                                        <svg
                                                                            xmlns='http://www.w3.org/2000/svg'
                                                                            width='24'
                                                                            height='24'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                        >
                                                                            <circle cx='12' cy='12' r='12' fill='#1D2939' />
                                                                            <path
                                                                                fill-rule='evenodd'
                                                                                clip-rule='evenodd'
                                                                                d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                                                                fill='#EE7103'
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                                                            S2S AI
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {ctiChat.map((responce: any, index: any) => {
                                                                    if (divRef.current) {
                                                                        divRef.current.scrollTop =
                                                                            divRef.current.scrollHeight - divRef.current.clientHeight
                                                                    }
                                                                    return (
                                                                        <>
                                                                            {/* Message 2 */}
                                                                            {!responce.question && !responce?.status && (responce?.message || responce?.error) && (
                                                                                <div key={index}>
                                                                                    <div className='mb-4 text-left items-center justify-center w-full'>
                                                                                        <div className='bg-[#1d2939] text-white p-3 rounded-lg w-full break-words'>
                                                                                            <div className="markdown-content">
                                                                                                <ReactMarkdown
                                                                                                    components={{
                                                                                                        h1: ({ children }) => (
                                                                                                            <h1 className='markdown-heading'>{children}</h1>
                                                                                                        ),
                                                                                                        h2: ({ children }) => (
                                                                                                            <h2 className='markdown-heading'>{children}</h2>
                                                                                                        ),
                                                                                                        h3: ({ children }) => (
                                                                                                            <h3 className='markdown-heading'>{children}</h3>
                                                                                                        ),

                                                                                                        code({
                                                                                                            inline,
                                                                                                            className,
                                                                                                            children,
                                                                                                            ...props
                                                                                                        }: CodeProps) {
                                                                                                            const match = /language-(\w+)/.exec(className || '')
                                                                                                            const codeContent = String(children).replace(
                                                                                                                /\n$/,
                                                                                                                '',
                                                                                                            )
                                                                                                            return !inline && match ? (
                                                                                                                <>
                                                                                                                    <div className='flex items-center justify-between w-full h-[20px]'>
                                                                                                                        {/* Rule Text */}
                                                                                                                        <div className='text-white text-sm font-medium leading-5'>
                                                                                                                            Rule
                                                                                                                        </div>

                                                                                                                        {/* Action Buttons */}
                                                                                                                        <div className='flex items-center gap-6 justify-end flex-wrap'>
                                                                                                                            {/* Copy Button */}
                                                                                                                            <div className='flex items-center justify-center gap-1.5'>
                                                                                                                                <span className='text-[#EE7103] text-sm font-inter  leading-5'>
                                                                                                                                    Copy
                                                                                                                                </span>
                                                                                                                                <svg
                                                                                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                                                                                    width='20'
                                                                                                                                    height='20'
                                                                                                                                    viewBox='0 0 20 20'
                                                                                                                                    fill='none'
                                                                                                                                >
                                                                                                                                    <g clip-path='url(#clip0_4347_5948)'>
                                                                                                                                        <path
                                                                                                                                            d='M6.6665 6.6665V4.33317C6.6665 3.39975 6.6665 2.93304 6.84816 2.57652C7.00795 2.26292 7.26292 2.00795 7.57652 1.84816C7.93304 1.6665 8.39975 1.6665 9.33317 1.6665H15.6665C16.5999 1.6665 17.0666 1.6665 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.3332 2.93304 18.3332 3.39975 18.3332 4.33317V10.6665C18.3332 11.5999 18.3332 12.0666 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.0666 13.3332 16.5999 13.3332 15.6665 13.3332H13.3332M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                                            stroke='#EE7103'
                                                                                                                                            stroke-width='1.66667'
                                                                                                                                            stroke-linecap='round'
                                                                                                                                            stroke-linejoin='round'
                                                                                                                                        />
                                                                                                                                    </g>
                                                                                                                                    <defs>
                                                                                                                                        <clipPath id='clip0_4347_5948'>
                                                                                                                                            <rect
                                                                                                                                                width='20'
                                                                                                                                                height='20'
                                                                                                                                                fill='white'
                                                                                                                                            />
                                                                                                                                        </clipPath>
                                                                                                                                    </defs>
                                                                                                                                </svg>
                                                                                                                            </div>

                                                                                                                            {/* Move to Detection Lab Button */}
                                                                                                                            <div className='flex items-center justify-center gap-1.5'>
                                                                                                                                <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                                                                                                    Move to Detection Lab
                                                                                                                                </span>
                                                                                                                                <svg
                                                                                                                                    onClick={() =>
                                                                                                                                        handlecopyToinbox(
                                                                                                                                            codeContent,
                                                                                                                                            responce,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                                                                                    width='20'
                                                                                                                                    height='20'
                                                                                                                                    viewBox='0 0 20 20'
                                                                                                                                    fill='none'
                                                                                                                                >
                                                                                                                                    <g clip-path='url(#clip0_4347_6313)'>
                                                                                                                                        <path
                                                                                                                                            d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                                            stroke='#EE7103'
                                                                                                                                            stroke-width='1.66667'
                                                                                                                                            stroke-linecap='round'
                                                                                                                                            stroke-linejoin='round'
                                                                                                                                        />
                                                                                                                                    </g>
                                                                                                                                    <defs>
                                                                                                                                        <clipPath id='clip0_4347_6313'>
                                                                                                                                            <rect
                                                                                                                                                width='20'
                                                                                                                                                height='20'
                                                                                                                                                fill='white'
                                                                                                                                            />
                                                                                                                                        </clipPath>
                                                                                                                                    </defs>
                                                                                                                                </svg>
                                                                                                                            </div>

                                                                                                                            {/* Move to a Collection Button */}
                                                                                                                            <div className='flex items-center justify-center gap-1.5'>
                                                                                                                                <span className='text-[#EE7103] text-sm font-inter leading-5'>
                                                                                                                                    Move to a Collection
                                                                                                                                </span>
                                                                                                                                <svg
                                                                                                                                    xmlns='http://www.w3.org/2000/svg'
                                                                                                                                    width='20'
                                                                                                                                    height='20'
                                                                                                                                    viewBox='0 0 20 20'
                                                                                                                                    fill='none'
                                                                                                                                >
                                                                                                                                    <g clip-path='url(#clip0_4347_5916)'>
                                                                                                                                        <path
                                                                                                                                            d='M8.74984 1.66883C8.1873 1.67646 7.84959 1.70903 7.57652 1.84816C7.26292 2.00795 7.00795 2.26292 6.84816 2.57652C6.70903 2.84959 6.67646 3.1873 6.66883 3.74984M16.2498 1.66883C16.8124 1.67646 17.1501 1.70903 17.4232 1.84816C17.7368 2.00795 17.9917 2.26292 18.1515 2.57652C18.2906 2.84958 18.3232 3.18729 18.3308 3.74983M18.3308 11.2498C18.3232 11.8124 18.2907 12.1501 18.1515 12.4232C17.9917 12.7368 17.7368 12.9917 17.4232 13.1515C17.1501 13.2906 16.8124 13.3232 16.2498 13.3308M18.3332 6.6665V8.33317M11.6665 1.6665H13.3331M4.33317 18.3332H10.6665C11.5999 18.3332 12.0666 18.3332 12.4232 18.1515C12.7368 17.9917 12.9917 17.7368 13.1515 17.4232C13.3332 17.0666 13.3332 16.5999 13.3332 15.6665V9.33317C13.3332 8.39975 13.3332 7.93304 13.1515 7.57652C12.9917 7.26292 12.7368 7.00795 12.4232 6.84816C12.0666 6.6665 11.5999 6.6665 10.6665 6.6665H4.33317C3.39975 6.6665 2.93304 6.6665 2.57652 6.84816C2.26292 7.00795 2.00795 7.26292 1.84816 7.57652C1.6665 7.93304 1.6665 8.39975 1.6665 9.33317V15.6665C1.6665 16.5999 1.6665 17.0666 1.84816 17.4232C2.00795 17.7368 2.26292 17.9917 2.57652 18.1515C2.93304 18.3332 3.39975 18.3332 4.33317 18.3332Z'
                                                                                                                                            stroke='#EE7103'
                                                                                                                                            stroke-width='1.66667'
                                                                                                                                            stroke-linecap='round'
                                                                                                                                            stroke-linejoin='round'
                                                                                                                                        />
                                                                                                                                    </g>
                                                                                                                                    <defs>
                                                                                                                                        <clipPath id='clip0_4347_5916'>
                                                                                                                                            <rect
                                                                                                                                                width='20'
                                                                                                                                                height='20'
                                                                                                                                                fill='white'
                                                                                                                                            />
                                                                                                                                        </clipPath>
                                                                                                                                    </defs>
                                                                                                                                </svg>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className='relative markdown-code-block'>
                                                                                                                        <div className='yaml-container'>
                                                                                                                            <SyntaxHighlighter
                                                                                                                                style={darcula as any}
                                                                                                                                language={match[1]}
                                                                                                                                PreTag='div'
                                                                                                                                wrapLines={true}
                                                                                                                                wrapLongLines={true}
                                                                                                                                showLineNumbers={true}
                                                                                                                                className={`markdown-code ${className}`}
                                                                                                                                {...props}
                                                                                                                            >
                                                                                                                                {String(children).replace(/\n$/, '')}
                                                                                                                            </SyntaxHighlighter>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </>
                                                                                                            ) : (
                                                                                                                <code className={className} {...props}>
                                                                                                                    {children}
                                                                                                                </code>
                                                                                                            )
                                                                                                        },
                                                                                                    }}
                                                                                                >
                                                                                                    {cleanMarkdown(!responce?.error && responce?.message
                                                                                                        ? responce?.message
                                                                                                        : responce?.error
                                                                                                            ? responce?.error
                                                                                                            : responce?.error ? "We're facing technical difficulties. Retry later, please." : '')}
                                                                                                </ReactMarkdown>
                                                                                            </div>
                                                                                            <span className='mt-2'>
                                                                                                <div
                                                                                                    className={`inline-block h-4 w-4 bg-white rounded-full mb-[-0.2rem] ml-2`}
                                                                                                ></div>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {!responce.question && responce?.status && (<div>
                                                                                <div className='bouncing-loader'>
                                                                                    <div></div>
                                                                                    <div></div>
                                                                                    <div></div>

                                                                                    <span
                                                                                        style={{
                                                                                            fontSize: 24,
                                                                                            justifyContent: 'center',
                                                                                            alignItems: 'center',
                                                                                            marginLeft: 40,
                                                                                        }}
                                                                                    >
                                                                                        {formatText(responce?.status)}
                                                                                    </span>

                                                                                </div>
                                                                            </div>)}
                                                                        </>
                                                                    )
                                                                })}

                                                            </div>
                                                        )}
                                                        {ctiChat?.length == 0 && (
                                                            <>
                                                                <div className='flex mb-2 mt-[24px]'>
                                                                    <div className=''>
                                                                        <svg
                                                                            xmlns='http://www.w3.org/2000/svg'
                                                                            width='24'
                                                                            height='24'
                                                                            viewBox='0 0 24 24'
                                                                            fill='none'
                                                                        >
                                                                            <circle cx='12' cy='12' r='12' fill='#1D2939' />
                                                                            <path
                                                                                fill-rule='evenodd'
                                                                                clip-rule='evenodd'
                                                                                d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                                                                fill='#EE7103'
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                                                            S2S AI
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className='bouncing-loader'>
                                                                        <div></div>
                                                                        <div></div>
                                                                        <div></div>

                                                                        <span
                                                                            style={{
                                                                                fontSize: 12,
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                marginLeft: 40,
                                                                            }}
                                                                        >
                                                                            {'Thinking'}
                                                                        </span>

                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                    ) : (

                                                        <>
                                                            <div className='flex mb-2 mt-[24px]'>
                                                                <div className=''>
                                                                    <svg
                                                                        xmlns='http://www.w3.org/2000/svg'
                                                                        width='24'
                                                                        height='24'
                                                                        viewBox='0 0 24 24'
                                                                        fill='none'
                                                                    >
                                                                        <circle cx='12' cy='12' r='12' fill='#1D2939' />
                                                                        <path
                                                                            fill-rule='evenodd'
                                                                            clip-rule='evenodd'
                                                                            d='M14.8765 10.8779L15.2961 11.2848L17 11.2862V10.7792L15.6267 9.44747H8.72307L8.30347 9.04054V7.77044L8.72307 7.36351H15.2291L15.6487 7.77044H16.9747V7.26486L15.9793 5.93311H7.97287L6.59961 7.26486V9.54611L7.97287 10.8779H14.8765ZM14.8765 13.1221L15.2961 12.7152L17 12.7138V13.2208L15.6267 14.5525H8.72307L8.30347 14.9595V16.2296L8.72307 16.6365H15.2291L15.6487 16.2296H16.9747V16.7351L15.9793 18.0669H7.97287L6.59961 16.7351V14.4539L7.97287 13.1221H14.8765Z'
                                                                            fill='#EE7103'
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <p className='overflow-hidden text-white text-wrap truncate font-inter font-medium ps-2  text-sm md:text-base'>
                                                                        S2S AI
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className='bouncing-loader'>
                                                                    <div></div>
                                                                    <div></div>
                                                                    <div></div>

                                                                    <span
                                                                        style={{
                                                                            fontSize: 16,
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            marginLeft: 40,
                                                                        }}
                                                                    >
                                                                        {formatText(wssstatus ? wssstatus : "Thinking")}
                                                                    </span>

                                                                </div>
                                                            </div>
                                                        </>

                                                    )}
                                                    <div ref={bottomRef}></div>
                                                </>

                                            </>
                                        )}

                                    </div>
                                    {((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) && <div className='col-span-3 flex items-center justify-center max-lg:col-span-1'></div>}
                                    <div ref={bottomRef}></div>
                                </div>
                            </div>

                            {/* Bottom section */}
                            <div className='p-4'>
                                <div className='grid grid-cols-12 items-center gap-4'>
                                    {((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) && <div className='col-span-3 flex items-center justify-center max-lg:col-span-1'></div>}
                                    <div className={`${((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) ? 'col-span-6 max-lg:col-span-10' : 'col-span-12'} relative`}>
                                        <div className='box-border bg-[#1d2939] rounded-[10px] border-2 border-[#1d2939] p-[14px_14px_14px_22px] flex flex-col gap-2 items-center justify-center relative overflow-hidden'>
                                            <div className='flex flex-row gap-4 items-center justify-start self-stretch flex-shrink-0 relative'>
                                                <textarea
                                                    placeholder={'Ask a follow-up question'}
                                                    className='text-[#98a2b3] text-left font-medium text-[16px] leading-[24px] bg-transparent border-none outline-none w-full max-h-32 resize-none max-md:max-h-50'
                                                    value={sendmessage}
                                                    onChange={handleOnChange}
                                                    onInput={handleResize}
                                                    onKeyDown={handleKeyDown}
                                                    rows={rows}
                                                />
                                                {!isSend && !sendwssconnect && (<button disabled={!sendmessage ? true : false} type='button' onClick={() => handleWebSocket()} className={`${!sendmessage ? 'cursor-not-allowed opacity-50 hover bg-orange-600' : 'bg-orange-600 cursor-pointer'} bg-orange-600 rounded-md p-2 flex flex-row gap-1 items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M8.74976 11.2501L17.4998 2.50014M8.85608 11.5235L11.0462 17.1552C11.2391 17.6513 11.3356 17.8994 11.4746 17.9718C11.5951 18.0346 11.7386 18.0347 11.8592 17.972C11.9983 17.8998 12.095 17.6518 12.2886 17.1559L17.7805 3.08281C17.9552 2.63516 18.0426 2.41133 17.9948 2.26831C17.9533 2.1441 17.8558 2.04663 17.7316 2.00514C17.5886 1.95736 17.3647 2.0447 16.9171 2.21939L2.84398 7.71134C2.34808 7.90486 2.10013 8.00163 2.02788 8.14071C1.96524 8.26129 1.96532 8.40483 2.0281 8.52533C2.10052 8.66433 2.34859 8.7608 2.84471 8.95373L8.47638 11.1438C8.57708 11.183 8.62744 11.2026 8.66984 11.2328C8.70742 11.2596 8.74028 11.2925 8.76709 11.3301C8.79734 11.3725 8.81692 11.4228 8.85608 11.5235Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                </button>)}

                                                {isSend && (<button type='button' onClick={() => stopWebSocket()} className={`${'bg-orange-600 cursor-pointer'} bg-orange-600 rounded-md p-2 flex flex-row gap-1 items-center justify-center flex-shrink-0 relative shadow-[0px_1px_2px_rgba(16,24,40,0.05)] overflow-hidden`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 20 20" fill="none">
                                                        <path d="M9.99999 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 9.99999 1.66663C5.39762 1.66663 1.66666 5.39759 1.66666 9.99996C1.66666 14.6023 5.39762 18.3333 9.99999 18.3333Z" stroke={`${'orange'}`} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6.66666 7.99996C6.66666 7.53325 6.66666 7.29989 6.75748 7.12163C6.83738 6.96483 6.96486 6.83735 7.12166 6.75745C7.29992 6.66663 7.53328 6.66663 7.99999 6.66663H12C12.4667 6.66663 12.7001 6.66663 12.8783 6.75745C13.0351 6.83735 13.1626 6.96483 13.2425 7.12163C13.3333 7.29989 13.3333 7.53325 13.3333 7.99996V12C13.3333 12.4667 13.3333 12.7 13.2425 12.8783C13.1626 13.0351 13.0351 13.1626 12.8783 13.2425C12.7001 13.3333 12.4667 13.3333 12 13.3333H7.99999C7.53328 13.3333 7.29992 13.3333 7.12166 13.2425C6.96486 13.1626 6.83738 13.0351 6.75748 12.8783C6.66666 12.7 6.66666 12.4667 6.66666 12V7.99996Z" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>)}
                                            </div>
                                        </div>
                                    </div>
                                    {((detectionsList?.length == 0 && createdetectionsList?.length == 0) || !ShowRule) && <div className='col-span-3 flex items-center justify-center max-lg:col-span-1'></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="2" height={`${dynamicHeight}px`} viewBox="0 0 2 930" fill="none">
                        <path d="M1 1V929" stroke="#475467" stroke-linecap="round" />
                    </svg> */}

                    {(detectionsList?.length > 0 || createdetectionsList?.length > 0) && ShowRule && (
                        <div
                            className='col-span-1 translate-x-0 opacity-100 max-lg:hidden'
                            style={{
                                height: `${dynamicHeight - 30}px`,
                                width: '2px',
                                backgroundColor: '#475467', // Gray color for the line
                                margin: '0 auto', // Centers the line in the grid gap
                                border: '1px solid #475467',
                            }}
                        ></div>
                    )}

                    {(detectionsList?.length > 0 || createdetectionsList?.length > 0) && (<div
                        className={`transition-all duration-500 ease-in-out   ${ShowRule
                            ? 'col-span-6  translate-x-0 opacity-100 max-lg:col-span-12'
                            : 'col-span-0 translate-x-full opacity-0'
                            }`}
                        style={{
                            height: `${dynamicHeight}px`,
                            width: '100%',
                            textAlign: 'left',
                            overflowY: 'hidden',
                            backgroundColor: '#0C111D',
                            borderRadius: '8px',
                            // marginLeft: '20px',
                        }}
                    >
                        <div className="flex flex-col h-full p-4">
                            {/* Scrollable Section */}
                            {creatingRule && (<> <Box
                                sx={{
                                    background: "#1d2939",
                                    borderRadius: "10px",
                                    padding: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "16px",
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    flexShrink: 0,
                                    height: "41px",
                                    position: "relative",
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    height={'100%'}
                                    width="100%"
                                    sx={{
                                        background: `linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.09) 50%,
      rgba(255, 255, 255, 0) 100%
    )`,
                                    }}
                                />
                            </Box>
                                <Box
                                    sx={{
                                        background: "#1d2939",
                                        padding: "16px",
                                        borderRadius: "10px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px",
                                        height: "220px",
                                        width: "100%",
                                        marginTop: 2
                                    }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        height={'100%'}
                                        width="100%"
                                        sx={{
                                            background: `linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.09) 50%,
      rgba(255, 255, 255, 0) 100%
    )`,
                                        }}
                                    />


                                    {/* <Skeleton variant="rectangular" height={24} width="50%" />
                  <Skeleton variant="rectangular" height={16} width="100%" /> */}
                                </Box>
                            </>
                            )}
                            {createdetectionsList?.length > 0 && !creatingRule && (<>
                                <CreationDetectionsDetails
                                    setModalOpen={setModalOpen}
                                    setDialogOpen={setDialogOpen}
                                    detectionsList={createdetectionsList}
                                    setSelectedRows={setSelectedRows}
                                    filterdata={filterdata}
                                    setFilterdata={setFilterdata}
                                    dLoader={dLoader}
                                    setDetectionOpen={setDetectionOpen}
                                    promptSources={sigmasearchList?.promptSources}
                                    setCollectionorcti={setCollectionorcti}
                                    workingpage="workbench"
                                    setRuleIndex={setRuleIndex}
                                    isAccordionOpen={isAccordionOpen}
                                    setIsAccordionOpen={setIsAccordionOpen}
                                    setCreateSelectedRows={setCreateSelectedRows}
                                    setExSelectedRows={setExSelectedRows}
                                />

                                {/* Fixed Divider */}
                                {detectionsList?.length > 0 && createdetectionsList?.length > 0 && (<Divider sx={{ borderColor: "#c2c8d3", my: 2 }} />)}
                            </>)}
                            {creatingRule && (<Divider sx={{ borderColor: "#c2c8d3", my: 2 }} />)}
                            {/* Section that moves with Accordion */}
                            {detectionsList?.length > 0 && (<div className="flex-1 overflow-y-auto scrollbar-hide">
                                <DetectionsDetails
                                    setModalOpen={setModalOpen}
                                    setDialogOpen={setDialogOpen}
                                    detectionsList={detectionsList}
                                    setSelectedRows={setSelectedRows}
                                    filterdata={filterdata}
                                    setFilterdata={setFilterdata}
                                    dLoader={dLoader}
                                    setDetectionOpen={setDetectionOpen}
                                    promptSources={sigmasearchList?.promptSources}
                                    setCollectionorcti={setCollectionorcti}
                                    workingpage="workbench"
                                    setRuleIndex={setRuleIndex}
                                    setCreateSelectedRows={setCreateSelectedRows}
                                    setExSelectedRows={setExSelectedRows}
                                />
                            </div>)}
                        </div>
                        {/* <div className='overflow-y-auto p-4 h-full'>
                            <DetectionsDetails setModalOpen={setModalOpen} setDialogOpen={setDialogOpen} detectionsList={detectionsList} setSelectedRows={setSelectedRows} filterdata={filterdata} setFilterdata={setFilterdata} dLoader={dLoader} setDetectionOpen={setDetectionOpen} promptSources={sigmasearchList?.promptSources} setCollectionorcti={setCollectionorcti} workingpage={"source"} setRuleIndex={setRuleIndex} />
                        </div> */}
                    </div>)}

                </div>
            </div>
            <FiltersDialog isOpen={isModalOpen}
                onClose={() => (setModalOpen(false))} detectionsList={detectionsList} setFilterdata={setFilterdata} filterdata={filterdata} />

            <CopyAndNewCollectionsDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false), setSingleparams(null)
                }}
                selectedRows={exselectedRows.length > 0 ? exselectedRows : createselectedRows}
                collectiondata={collectiondata}
                pramasdata={'ruleChat'}
                setDialogOpen={setDialogOpen}
                importId={null}
            />
            <DetectionDialog
                isOpen={isdetectionOpen}
                onClose={() => {
                    setDetectionOpen(false)
                }}
                detectionsList={detectionsList}
                collectiondata={collectiondata}
                inboxList={inboxList}
                ruleIndex={ruleIndex}
            />
        </>
    )
}

export default SourceRuleChats
