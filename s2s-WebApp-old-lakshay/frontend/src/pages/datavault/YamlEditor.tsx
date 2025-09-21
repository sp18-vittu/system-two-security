import React, { useEffect } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-yaml'

// Import the required themes
import 'ace-builds/src-noconflict/theme-twilight' // Dark theme
import 'ace-builds/src-noconflict/theme-github' // Light theme
import 'ace-builds/src-noconflict/theme-github' // Light theme
import { Box } from '@mui/material'
import { useData } from '../../layouts/shared/DataProvider'

interface props {
  ymltext: any
  setYmlText: any
  setSeloctror: any
  modeOfView: any
}

const YamlEditor = ({ ymltext, setYmlText, setSeloctror, modeOfView }: props) => {
  const { setSigmaViewwss, setYamlEditorOpen }: any = useData()
  const handleChange = (newValue: any) => {
    setYamlEditorOpen(true)
    setSigmaViewwss(false)
    setYmlText(newValue)
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
        mode='yaml'
        value={ymltext}
        wrapEnabled={true}
        theme='twilight'
        name='yaml-editor'
        readOnly={modeOfView == 'ruleeditor' ? false : true}
        onChange={handleChange}
        editorProps={{ $blockScrolling: true }}
        style={{ width: '100%', height: '100%', borderRadius: "12px" }}
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

export default YamlEditor
