import React, { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-yaml'
// Import the required themes
import 'ace-builds/src-noconflict/theme-twilight' // Dark theme
import 'ace-builds/src-noconflict/theme-github' // Light theme
import 'ace-builds/src-noconflict/theme-github' // Light theme
import { Box } from '@mui/material'
interface props {
  ymltext: any
  setSeloctror: any
  setQueryValue: any
  setSinglequery: any
}
const YamlTextEditorForQuery = ({
  ymltext,
  setSeloctror,
  setQueryValue,
  setSinglequery,
}: props) => {
  const [typedText, setTypedText] = useState(null as any)
  useEffect(() => {
    setTypedText(ymltext)
    setSeloctror(ymltext)
  }, [ymltext])
  const handleChange = (newValue: any) => {
    setTypedText(newValue)
    setSinglequery(newValue)
    setQueryValue(newValue)
  }
  const editorRef: any = useRef(null)
  const [editorLoaded, setEditorLoaded] = useState(false)
  useEffect(() => {
    if (editorLoaded && editorRef.current) {
      editorRef.current.editor.focus()
      editorRef.current.editor.gotoLine(1) // Set cursor position
    }
  }, [editorRef, editorLoaded])
  const handleEditorLoad = (editor: any) => {
    setTimeout(() => {
      setEditorLoaded(true)
    }, 100)
  }

  useEffect(() => {
    const customStyles = `
        span.ace_meta.ace_tag {
            color: #75E0A7 !important;
            font-weight: bold !important;
            font-size:14px !important;
          }
          span.ace_constant.ace_numeric{
            color: #FF6600 !important;
            font-size:14px !important;
          }
          span.ace_constant.ace_language.ace_boolean{
            color:#FFFF00 !important;
            font-size:14px !important;
          }
          .ace_string{
            color: #FAA7E0 !important;
            font-size:14px !important;
            overflow-wrap: break-word !important;
          }
          span.ace_keyword{
            color: red !important;
          }
          div.ace_gutter{
            background-color:#32435A !important;
          }
          div.ace_layer.ace_gutter-layer.ace_folding-enabled{
            color:#fff !important;
            font-size:14px !important;
            font-weight: bold !important;
          }
          div.ace_gutter-active-line.ace_gutter-cell{
            background-color:#32435A !important;
            color:#fff !important;
          }
          span.ace_punctuation.ace_identifier {
            color: orange !important;
            display: none !important;
            font-size: 28px !important;
        }
        span.ace_constant.ace_language.ace_boolean::before {
          content: "!";
          color: pink;
        }
          ace_selected-word{
            background-color:red !important;
          }
        .ace_gutter .ace_gutter-layer{
          top:24px;
          }
        .ace_scroller .ace_content{
          top:24px;
        }
        `
    const styleEl = document.createElement('style')
    styleEl.textContent = customStyles
    document.head.appendChild(styleEl)
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        color: '#fff',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        border: '0',
      }}
    >
      <AceEditor
        ref={editorRef}
        mode='yaml'
        value={typedText}
        onLoad={handleEditorLoad}
        onChange={handleChange}
        wrapEnabled={true}
        theme='twilight'
        name='yaml-editor'
        readOnly={true}
        editorProps={{ $blockScrolling: true }}
        style={{
          width: '100%',
          height: '100%',
          color: '#fff',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          border: '0',
          borderRadius: "12px"
        }}
        setOptions={{
          useWorker: false,
          useSoftTabs: true,
          indentedSoftWrap: false,
          fontSize: '14px',
        }} // Disable worker for custom syntax highlighting
      />
    </Box>
  )
}
export default YamlTextEditorForQuery
