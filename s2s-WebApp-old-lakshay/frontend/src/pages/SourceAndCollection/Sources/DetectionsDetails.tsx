import React, { useEffect, useState } from 'react'
import FiltersDialog from './FiltersDialog'
import YamlEditor from '../../datavault/YamlEditor'
import useWindowResolution from '../../../layouts/Dashboard/useWindowResolution'
import CopyAndNewCollectionsDialog from '../Collection/CopyAndNewCollectionsDialog'
import { useData } from '../../../layouts/shared/DataProvider'
const yaml = require('js-yaml')
import { styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'


function DetectionsDetails({ setModalOpen, setDialogOpen, detectionsList, setSelectedRows, filterdata, setFilterdata, dLoader, setDetectionOpen, promptSources, setCollectionorcti, workingpage, setRuleIndex }: any) {
  const navigateTo = useNavigate()
  const location = useLocation();
  const { state } = location;
  const { id } = useParams()
  const {
    srcnamecheckedIds, setSrcNameCheckedIds, srccheckedIds, setSrcCheckedIds,
    sendwssconnect,
    setSendwssconnect,
    sendwssProcessing,
    setSendwssProcessing
  }: any = useData()
  const [openAccordionId, setOpenAccordionId] = useState([] as any);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const [ymltext, setYmlText] = useState('' as any);
  const { height } = useWindowResolution();
  const dynamicHeight = Math.max(400, height * 0.8);

  const toggleCheckbox = (id: any) => {
    setCollectionorcti(null)
    const item: any = filterdata.find((x: any) => x.id == id)
    setYmlText(item?.content)
    setCheckedIds((prev) => {
      const updatedCheckedIds = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];

      const selectedIDs = new Set(updatedCheckedIds);
      const selectedRows = (filterdata?.length > 0 ? filterdata : detectionsList).filter((row: any) => selectedIDs.has(row.id));
      setSelectedRows(selectedRows); // Properly set the selected rows
      return updatedCheckedIds;
    });
  };
  const toggleAccordion = (id: any) => {
    if (openAccordionId.includes(id)) {
      setOpenAccordionId(openAccordionId.filter((nodeId: any) => nodeId !== id))
    } else {
      setOpenAccordionId([...openAccordionId, id])
    }
  }

  const handleSelectAll = () => {
    const allIds = (filterdata?.length > 0 ? filterdata : detectionsList).map(
      (dectaion: any) => dectaion?.id,
    )
    setCheckedIds(allIds)
    const selectedIDs = new Set(allIds)
    const selectedRows = (filterdata?.length > 0 ? filterdata : detectionsList).filter((row: any) =>
      selectedIDs.has(row.id),
    )
    setSelectedRows(selectedRows)
  }

  const handleSelect = () => {
    const allIds = (filterdata?.length > 0 ? filterdata : detectionsList).map(
      (dectaion: any) => dectaion?.id,
    )
    setCheckedIds(allIds)
    const selectedIDs = new Set(allIds)
    const selectedRows = (filterdata?.length > 0 ? filterdata : detectionsList).filter((row: any) =>
      selectedIDs.has(row.id),
    )
    setSelectedRows(selectedRows)
  }

  const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: '#fff',
    },
    [`& .${tooltipClasses.tooltip}`]: {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.6)', // Add box shadow here
      backgroundColor: '#fff',
      color: '#000',
      maxWidth: '300px', // Adjust max width for better wrapping
      whiteSpace: 'normal', // Allows text wrapping
      wordBreak: 'break-word', // Ensures long words/URLs wrap properly
      overflowWrap: 'break-word', // Additional fallback for text wrapping
      padding: '8px 12px',
    },
  }));
  const handleClickOpen = (id: any, index: any) => {
    setRuleIndex(index)
    setDetectionOpen(true)
  }

  const handleClickOpenRule = (params: any) => {
    navigateTo(`/app/sigmaruleview/${params?.id}`, {
      state: {
        vaultId: params?.datavault?.id,
        singmaname: params?.title,
        sigmadetail: params,
        title: params?.datavault?.name,
        platformName: null,
        paramsdata: 'commensigmarule',
        chatHistory: {
          workingpage: workingpage,
          params: 'collection',
          id: id
        },
        tab: 1,
      },
    })
  }


  const isUUID = (uuid: any): boolean =>
    typeof uuid === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);

  return (
    <div className='flex flex-col gap-6 items-start justify-start w-full'>
      <div className='flex items-center justify-between w-full max-2xl:flex-col gap-4'>
        <div className='flex items-center gap-3 items-center'>
          <div className='text-white text-lg font-medium'>{`Detections (${filterdata?.length > 0 ? filterdata?.length : detectionsList?.length > 0 ? detectionsList.length : 0
            })`}</div>
        </div>

        <div className='flex items-center gap-3 max-xl:flex-col max-lg:flex-row max-sm:flex-col'>
          {detectionsList?.length > 1 ? (
            <>
              <div className='flex items-center gap-3'>
                <button
                  onClick={handleSelectAll}
                  className='flex items-center justify-center gap-2 border border-orange-500 rounded-lg px-4 py-2 shadow-sm'
                >
                  <span className='text-white text-sm font-semibold'>Select All</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <g clip-path='url(#clip0_1088_11560)'>
                      <path
                        d='M5.00008 12.5001L6.66675 14.1667L10.4167 10.4167M6.66675 6.66675V4.33341C6.66675 3.39999 6.66675 2.93328 6.8484 2.57676C7.00819 2.26316 7.26316 2.00819 7.57676 1.8484C7.93328 1.66675 8.39999 1.66675 9.33341 1.66675H15.6667C16.6002 1.66675 17.0669 1.66675 17.4234 1.8484C17.737 2.00819 17.992 2.26316 18.1518 2.57676C18.3334 2.93328 18.3334 3.39999 18.3334 4.33341V10.6667C18.3334 11.6002 18.3334 12.0669 18.1518 12.4234C17.992 12.737 17.737 12.992 17.4234 13.1518C17.0669 13.3334 16.6002 13.3334 15.6667 13.3334H13.3334M4.33341 18.3334H10.6667C11.6002 18.3334 12.0669 18.3334 12.4234 18.1518C12.737 17.992 12.992 17.737 13.1518 17.4234C13.3334 17.0669 13.3334 16.6002 13.3334 15.6667V9.33341C13.3334 8.39999 13.3334 7.93328 13.1518 7.57676C12.992 7.26316 12.737 7.00819 12.4234 6.8484C12.0669 6.66675 11.6002 6.66675 10.6667 6.66675H4.33341C3.39999 6.66675 2.93328 6.66675 2.57676 6.8484C2.26316 7.00819 2.00819 7.26316 1.8484 7.57676C1.66675 7.93328 1.66675 8.39999 1.66675 9.33341V15.6667C1.66675 16.6002 1.66675 17.0669 1.8484 17.4234C2.00819 17.737 2.26316 17.992 2.57676 18.1518C2.93328 18.3334 3.39999 18.3334 4.33341 18.3334Z'
                        stroke='white'
                        stroke-width='1.67'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_1088_11560'>
                        <rect width='20' height='20' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='2'
                  height='42'
                  viewBox='0 0 2 42'
                  fill='none'
                  className='max-xl:hidden'
                >
                  <path d='M1 1V41' stroke='#475467' stroke-linecap='round' />
                </svg>

                {/* <button onClick={() => setModalOpen(true)} className="flex items-center justify-center border border-orange-500 rounded-lg px-4 py-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.8215 4.72239C2.19121 4.01796 1.87607 3.66574 1.86418 3.3664C1.85386 3.10636 1.9656 2.85643 2.16628 2.69074C2.39728 2.5 2.86991 2.5 3.81515 2.5H16.1843C17.1295 2.5 17.6021 2.5 17.8331 2.69074C18.0338 2.85643 18.1456 3.10636 18.1352 3.3664C18.1233 3.66574 17.8082 4.01796 17.1779 4.72239L12.4227 10.037C12.2971 10.1774 12.2343 10.2477 12.1895 10.3276C12.1497 10.3984 12.1206 10.4747 12.1029 10.554C12.083 10.6435 12.083 10.7377 12.083 10.9261V15.382C12.083 15.5449 12.083 15.6264 12.0568 15.6969C12.0335 15.7591 11.9958 15.8149 11.9466 15.8596C11.8909 15.9102 11.8153 15.9404 11.664 16.001L8.83063 17.1343C8.52435 17.2568 8.3712 17.3181 8.24827 17.2925C8.14076 17.2702 8.04642 17.2063 7.98575 17.1148C7.91637 17.0101 7.91637 16.8452 7.91637 16.5153V10.9261C7.91637 10.7377 7.91637 10.6435 7.89647 10.554C7.87883 10.4747 7.84968 10.3984 7.80995 10.3276C7.76516 10.2477 7.70233 10.1774 7.57669 10.037L2.8215 4.72239Z" stroke="white" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button> */}

                <button
                  onClick={() => {
                    setIsAllChecked(false),
                      setCheckedIds([]),
                      setSelectedRows([]),
                      setFilterdata([]),
                      setSrcNameCheckedIds([]),
                      setSrcCheckedIds([])
                  }}
                  className='flex items-center justify-center gap-2 border border-orange-500 rounded-lg px-4 py-2 shadow-sm'
                >
                  <span className='text-white text-sm font-semibold'>Clear Selected</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M15 5L5 15M5 5L15 15'
                      stroke='white'
                      stroke-width='1.67'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </button>
              </div>

              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='2'
                height='42'
                viewBox='0 0 2 42'
                fill='none'
                className='max-xl:hidden'
              >
                <path d='M1 1V41' stroke='#475467' stroke-linecap='round' />
              </svg>

              <div className='flex items-center gap-3'>
                <button
                  disabled={checkedIds.length > 0 ? false : true}
                  onClick={() => setDialogOpen(true)}
                  className={`${checkedIds.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} flex items-center justify-center gap-2 border border-orange-500 rounded-lg px-4 py-2 shadow-sm`}
                >
                  <span className='text-white text-sm font-semibold'>Save Selected</span>
                </button>

                <button
                  disabled={checkedIds.length > 0 ? false : true}
                  onClick={() => {
                    setDialogOpen(true), handleSelectAll()
                  }}
                  className={`${checkedIds.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} flex items-center justify-center gap-2 border border-orange-500 rounded-lg px-4 py-2 shadow-sm`}
                >
                  <span className='text-white text-sm font-semibold'>Save All</span>
                </button>
              </div>
            </>
          ) : (
            <button
              disabled={detectionsList?.length == 0 ? true : false}
              onClick={() => {
                setDialogOpen(true), handleSelect()
              }}
              className={`${detectionsList?.length > 0 ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                } flex items-center justify-center gap-2 border border-orange-500 rounded-lg px-4 py-2 shadow-sm`}
            >
              <span className='text-white text-sm font-semibold'>Save</span>
            </button>
          )}
        </div>
      </div>

      {detectionsList && detectionsList?.length > 0 ? (<div className="space-y-4 w-full max-h-[600px] scrollbar-hide">
        {(filterdata?.length > 0 ? filterdata : detectionsList).map((dectaion: any, index: any) => {
          let parsedJSON = yaml.load(dectaion?.content)
          let Category: any = dectaion?.datavault?.category ? (dectaion?.datavault?.category == "CTI" ? "Public CTI" : dectaion?.datavault?.category) : dectaion?.source == "cti" ? "Public CTI" : null;
          let datavaultname: any = dectaion?.datavault?.name ? dectaion?.datavault?.name : dectaion?.ctiName
          const numberOfLines = dectaion?.content?.split('\n').length;
          const calculatedHeight = 250 + (numberOfLines * 20);

          return (
            <div
              key={dectaion?.id}
              className={`bg-[#1d2939] rounded-lg p-4 flex flex-col gap-4 ${'items-start justify-start'
                } w-full`}
            >
              <div className='grid grid-cols-12 gap-4 items-center w-full'>
                {/* Left Side */}
                <div className='col-span-8 flex items-center gap-4 max-sm:col-span-12'>
                  {/* Checkbox */}
                  <div
                    className='p-1 flex items-center justify-center cursor-pointer'
                    onClick={() => toggleCheckbox(dectaion?.id)}
                  >
                    <div
                      className={`rounded border w-5 h-5 overflow-hidden flex items-center justify-center ${checkedIds.includes(dectaion?.id)
                        ? 'bg-[#ee7103] border-[#ee7103]'
                        : 'border-gray-300'
                        }`}
                    >
                      {checkedIds.includes(dectaion?.id) && (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='w-4 h-4 text-white'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth={2}
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Accordion Toggle */}
                  <div
                    className='text-[#ee7103] text-center font-normal text-[32px] leading-[1] w-8 h-8 relative cursor-pointer'
                    onClick={() => toggleAccordion(dectaion?.id)}
                  >
                    {openAccordionId.includes(dectaion?.id) ? '–' : '+'}
                  </div>

                  {/* Title */}
                  <div className='flex items-center'>
                    {dLoader && detectionsList?.length == 0 ? (
                      <>
                        <div className='text-white text-left font-medium text-[16px] leading-[32px]'>
                          {`Detection Rule ${index + 1}. (fetching details...)`}
                        </div>
                        <span style={{ marginLeft: 20 }} className='loader'></span>
                      </>
                    ) : (
                      <BootstrapTooltip title={parsedJSON?.title} placement='bottom'>
                        <div className='text-[#fff] text-left font-normal text-[16px] leading-[28px]  line-clamp-1'>
                          {parsedJSON?.title}
                        </div>
                      </BootstrapTooltip>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className={`col-span-4 flex ${(state?.sourcesheaer === "collection" || promptSources?.includes("collection")) ? `items-end justify-end` : `items-start justify-start`} gap-4 max-sm:col-span-12`}>
                  {detectionsList?.length > 0 ? (
                    <>
                      {state?.sourcesheaer === "collection" || promptSources?.includes("collection") ? (
                        <Tooltip title={isUUID(dectaion?.id) ? "No Details Available" : ""} placement='bottom'>
                          <button disabled={isUUID(dectaion?.id)} onClick={() => handleClickOpenRule(dectaion)} className={`chat-button flex items-center justify-center gap-2 rounded-lg border border-[#ee7103] px-4 py-2 shadow-sm ${isUUID(dectaion?.id) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div className="text text-[#ee7103] font-semibold text-base leading-5">
                              {'View Details'}
                            </div>
                          </button>
                        </Tooltip>
                      ) : (
                        <>
                          {Category && datavaultname ? (

                            <div
                              onClick={() => handleClickOpen(dectaion?.id, index)}
                              className="text-[#53b1fd] text-left font-normal text-[16px] leading-[28px] w-[95%] break-words line-clamp-2 cursor-pointer"
                            >
                              <span className="uppercase">{Category}</span> : <BootstrapTooltip title={dectaion?.ctiName ? dectaion?.ctiName : datavaultname} placement='bottom'><span>{datavaultname}</span></BootstrapTooltip>
                            </div>
                          ) : (
                            <div onClick={() => handleClickOpen(dectaion?.id, index)} className={`text-[#53b1fd] ${'text-left'} font-normal text-[16px] leading-[28px] w-[95%] break-words line-clamp-2 cursor-pointer`}>
                              <span >{"SigmaHQ"}</span>
                            </div>
                          )}
                          {/* {textToShow ? (<BootstrapTooltip title={textToShow} placement='bottom'>
                            <div onClick={() => handleClickOpen(dectaion?.id)} className={`text-[#53b1fd] ${'text-left'} font-normal text-[16px] leading-[28px] w-[95%] break-words line-clamp-2 cursor-pointer`}>
                              {(dectaion?.source == "cti" || dectaion?.source == "dac_repo" || dectaion?.source == "imported" || dectaion?.source == "shared") ? (<>
                                {(dectaion?.datavault?.category ? (dectaion?.datavault?.category == "CTI" ? "Public CTI" : dectaion?.datavault?.category) : sourcesslt) +
                                  (dectaion?.ctiName ? " : " + (textToShow ? textToShow : dectaion?.title) : " : " + dectaion?.title)}
                              </>) : (
                                <>
                                  {"S2S Curated"}
                                </>
                              )}


                            </div>
                          </BootstrapTooltip>) : (
                            <BootstrapTooltip title={textToShow} placement='bottom'>
                              <div onClick={() => handleClickOpen(dectaion?.id)} className={`text-[#53b1fd] ${'text-left'} font-normal text-[16px] leading-[28px] w-[95%] break-words line-clamp-2 cursor-pointer`}>
                                {(dectaion?.source == "cti" || dectaion?.source == "dac_repo" || dectaion?.source == "imported" || dectaion?.source == "shared") ? (<>
                                  {(dectaion?.datavault?.category ? (dectaion?.datavault?.category == "CTI" ? "Public CTI" : dectaion?.datavault?.category) : sourcesslt) +
                                    (dectaion?.datavault?.name ? " : " + (dectaion?.datavault?.name ? dectaion?.datavault?.name : dectaion?.title) : " : " + dectaion?.title)}
                                </>) : (
                                  <>
                                    {"S2S Curated"}
                                  </>
                                )}
                              </div>
                            </BootstrapTooltip>
                          )} */}
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-[#53b1fd] text-left font-normal text-[16px] leading-[28px] whitespace-normal overflow-hidden">
                      {"S2S Generated"}
                    </div>
                  )}
                </div>

              </div>


              {openAccordionId.includes(dectaion?.id) && (
                <div className="mt-4 w-full p-4 rounded">
                  <div
                    style={{
                      height: `${calculatedHeight - 250}px`,
                      width: '100%',
                      textAlign: 'left',
                      overflowY: 'hidden',
                      backgroundColor: '#0C111D',
                      borderRadius: '8px',
                    }}
                  >
                    <YamlEditor
                      ymltext={dectaion?.content}
                      setYmlText={setYmlText}
                      setSeloctror={() => { }}
                      modeOfView={'ruleeditor'}
                    />
                  </div>
                </div>
              )}
            </div>)
        })}
      </div>) : (
        <>
          {sendwssProcessing && detectionsList?.length == 0 ? (<div className="space-y-4 w-full max-h-[600px] scrollbar-hide">
            <div className="flex flex-row gap-3 items-center justify-center w-full">
              Searching for matching detection rules...
            </div>
          </div>) : (
            <div className="space-y-4 w-full max-h-[600px] scrollbar-hide">
              <div className="flex flex-row gap-3 items-center justify-center w-full">
                No matching sigma rules were found.
              </div>
            </div>
          )}
        </>
      )}

    </div>
  )
}

export default DetectionsDetails
