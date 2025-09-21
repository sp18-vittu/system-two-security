import React, { useState } from 'react'
import { useData } from '../../../layouts/shared/DataProvider'
const yaml = require('js-yaml')

interface FiltersDialogProps {
  isOpen: boolean
  onClose: () => void
  detectionsList: any
  setFilterdata: any
  filterdata: any
}

const FiltersDialog: React.FC<FiltersDialogProps> = ({
  isOpen,
  onClose,
  detectionsList,
  setFilterdata,
  filterdata,
}) => {
  if (!isOpen) return null

  const { srcnamecheckedIds, setSrcNameCheckedIds, srccheckedIds, setSrcCheckedIds }: any =
    useData()

  const SourceuniqueData = detectionsList.filter(
    (item: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.source === item.source),
  )

  let taguniqueData: string[] = [];
  let statusuniqueData: any[] = [];
  let authoruniqueData: any[] = [];
  let logsourcategory: any[] = [];
  let logsourceproduct: any[] = [];

  const parsedContent = detectionsList?.map((item: any) => {
    try {
      const parsedContent = yaml.load(item.content) as { tags?: any[], status: any, references: any, title: any, id: any, date: any, logsource: any, falsepositives: any, author: any, };
      taguniqueData = [...(parsedContent?.tags || []), ...taguniqueData];
      statusuniqueData.push(parsedContent?.status);
      logsourceproduct.push(parsedContent?.logsource?.product)
      logsourcategory.push(parsedContent?.logsource?.category)
      authoruniqueData.push(parsedContent?.author);
    } catch (error) {
      console.error('Error parsing YAML:', error);
    }
  });


  const uniquetagsArray = Array.from(new Set(taguniqueData));
  const uniquestatusArray = Array.from(new Set(statusuniqueData));
  const uniqueproductArray = Array.from(new Set(logsourceproduct));
  const uniquecategoryArray = Array.from(new Set(logsourcategory));
  const uniqueauthorArray = Array.from(new Set(authoruniqueData));

  const [filtercheckedIds, setFilterCheckedIds] = useState<any[]>([])
  const [filtersrccheckedIds, setFilterSrcCheckedIds] = useState<any[]>([])
  const toggleCheckbox = (id: any) => {
    setSrcCheckedIds((prev: any) => {
      const updatedCheckedIds = prev.includes(id)
        ? prev.filter((itemId: any) => itemId !== id)
        : [...prev, id]

      const selectedIDs = new Set(updatedCheckedIds)
      const selectedRows = detectionsList.filter((row: any) => selectedIDs.has(row.id))
      setFilterCheckedIds(selectedRows) // Properly set the selected rows
      return updatedCheckedIds
    })
  }

  const toggleSourceCheckbox = (id: any) => {
    setSrcNameCheckedIds((prev: any) => {
      const updatedCheckedIds = prev.includes(id)
        ? prev.filter((itemId: any) => itemId !== id)
        : [...prev, id]
      const selectedIDs = new Set(updatedCheckedIds)
      const selectedRows = detectionsList.filter((row: any) => selectedIDs.has(row.id))
      setFilterSrcCheckedIds(selectedRows) // Properly set the selected rows
      return updatedCheckedIds
    })
  }

  const handleSearch = () => {
    const parsedContent = detectionsList?.map((item: any) => {
      try {
        const parsed = yaml.load(item.content) as {
          tags?: any[];
          status: string;
          references: any;
          title: any;
          id: any;
          date: any;
          logsource: { product?: string; category?: string };
          falsepositives: any;
          author: string;
        };

        return {
          tags: parsed.tags || [],
          logsource: parsed.logsource || {},
          status: parsed.status || '',
          author: parsed.author || '',
          id: item?.uuid ? item?.uuid : item?.id
        };
      } catch (error) {
        console.error('Error parsing YAML:', error);
        return { tags: [], logsource: {}, status: '', author: '' }; // Return default structure
      }
    });

    // **Find Matching Values**
    let containsValues = parsedContent?.filter(
      (item: any) =>
        item.tags.some((tag: any) => srcnamecheckedIds.includes(tag)) ||  // Check if any tag matches
        srcnamecheckedIds.includes(item.logsource.product) || srcnamecheckedIds.includes(item.logsource.category) ||
        srcnamecheckedIds.includes(item.status) ||
        srcnamecheckedIds.includes(item.author)
    );

    containsValues = containsValues?.filter(
      (item: any, index: any, self: any) => index === self.findIndex((t: any) => t.id === item.id),
    )
    if (containsValues && containsValues?.length > 0) {
      const filteredData = detectionsList.filter((item: any) =>
        containsValues.some((filterItem: any) => filterItem.id === (item?.uuid ? item?.uuid : item?.id)),
      )
      setFilterdata(filteredData)
      onClose()
    } else {
      setFilterdata(filterdata)
      onClose()
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div
        className='bg-[#1d2939] rounded-lg flex flex-col gap-4 items-center justify-start relative shadow-xl overflow-scroll hide-scrollbar w-[50%] max-lg:w-[75%] max-md:w-[90%] max-h-[90%]'
        style={{
          boxShadow:
            '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
        }}
      >
        <div className='flex flex-col gap-0 items-center justify-start self-stretch flex-shrink-0 relative'>
          <div className='p-6 pt-6 pb-0 flex flex-col gap-4 items-start justify-start self-stretch flex-shrink-0 relative'>
            <div className='bg-[#32435a] rounded-[28px] flex-shrink-0 w-12 h-12 relative'>
              {/* <img  src="filter-funnel-020.svg" /> */}
              <svg
                className='w-6 h-6 absolute left-3 top-3 overflow-visible'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
              >
                <path
                  d='M3.38589 5.66687C2.62955 4.82155 2.25138 4.39889 2.23712 4.03968C2.22473 3.72764 2.35882 3.42772 2.59963 3.22889C2.87684 3 3.44399 3 4.57828 3H19.4212C20.5555 3 21.1227 3 21.3999 3.22889C21.6407 3.42772 21.7748 3.72764 21.7624 4.03968C21.7481 4.39889 21.3699 4.82155 20.6136 5.66687L14.9074 12.0444C14.7566 12.2129 14.6812 12.2972 14.6275 12.3931C14.5798 12.4781 14.5448 12.5697 14.5236 12.6648C14.4997 12.7721 14.4997 12.8852 14.4997 13.1113V18.4584C14.4997 18.6539 14.4997 18.7517 14.4682 18.8363C14.4403 18.911 14.395 18.9779 14.336 19.0315C14.2692 19.0922 14.1784 19.1285 13.9969 19.2012L10.5969 20.5612C10.2293 20.7082 10.0455 20.7817 9.89802 20.751C9.76901 20.7242 9.6558 20.6476 9.583 20.5377C9.49975 20.4122 9.49975 20.2142 9.49975 19.8184V13.1113C9.49975 12.8852 9.49975 12.7721 9.47587 12.6648C9.45469 12.5697 9.41971 12.4781 9.37204 12.3931C9.31828 12.2972 9.2429 12.2129 9.09213 12.0444L3.38589 5.66687Z'
                  stroke='white'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
            <div className='flex flex-col gap-1 items-start justify-start self-stretch flex-shrink-0 relative'>
              <div className='text-white text-left font-[Inter-SemiBold] text-lg leading-7 font-semibold relative self-stretch'>
                Filter By
              </div>
            </div>
          </div>
          <div
            onClick={onClose}
            className='rounded-lg p-2 flex flex-row gap-0 items-center justify-center flex-shrink-0 w-[44px] h-[44px] absolute right-4 top-4 overflow-hidden cursor-pointer'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M18 6L6 18M6 6L18 18'
                stroke='#98A2B3'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </div>
        </div>
        <div className='p-0 px-[24px] pb-[8px] flex flex-col gap-[16px] items-start justify-start self-stretch flex-shrink-0 relative'>
          <div className='flex flex-col gap-[8px] items-start justify-start flex-shrink-0 relative'>
            <div className='text-white text-left font-medium text-sm leading-5 relative'>
              Source Type
            </div>
            <div className='flex flex-row gap-3 items-start justify-start flex-shrink-0 relative'>
              {SourceuniqueData.map((item: any) => {
                let sourcesslt: any =
                  item.source == 'cti'
                    ? 'CTI Report '
                    : item.source == 'dac_repo'
                      ? 'DAC Repo'
                      : item.source == 'imported'
                        ? 'Imported'
                        : item.source == 'shared'
                          ? 'Shared/Community'
                          : 'S2S Curated'
                return (
                  <div className='bg-[#48576c] rounded-sm p-[6px_8px] flex flex-row gap-0.5 items-center justify-center flex-shrink-0 relative'>
                    <div className='flex flex-row gap-1.5 items-center justify-start flex-shrink-0 relative'>
                      <div
                        className='p-1 flex items-center justify-center cursor-pointer'
                        onClick={() => toggleCheckbox(item.id)}
                      >
                        <div
                          className={`rounded border w-5 h-5 overflow-hidden flex items-center justify-center ${srccheckedIds.includes(item.id)
                            ? 'bg-[#ee7103] border-[#ee7103]'
                            : 'border-gray-300'
                            }`}
                        >
                          {srccheckedIds.includes(item.id) && (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='w-4 h-4 text-white'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M5 13l4 4L19 7'
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className='text-white text-center font-medium text-sm leading-5 relative'>
                        {sourcesslt}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className='flex flex-col gap-2 items-start justify-start flex-shrink-0 relative'>
            <div className='text-white text-left text-sm leading-5 font-medium relative'>
              Log Source/Product
            </div>
            <div className='flex flex-row flex-wrap gap-3 items-start justify-start flex-shrink-0 relative'>
              {uniqueproductArray?.map((item: any, index: any) => (
                <div
                  key={index}
                  className='bg-[#48576c] rounded-sm p-[6px_8px] flex flex-row gap-0.5 items-center justify-center flex-shrink-0 relative'
                >
                  <div className='flex flex-row gap-1.5 items-center justify-start flex-shrink-0 relative'>
                    <div
                      className='p-1 flex items-center justify-center cursor-pointer'
                      onClick={() => toggleSourceCheckbox(item)}
                    >
                      <div
                        className={`rounded border w-5 h-5 overflow-hidden flex items-center justify-center ${srcnamecheckedIds.includes(item)
                          ? 'bg-[#ee7103] border-[#ee7103]'
                          : 'border-gray-300'
                          }`}
                      >
                        {srcnamecheckedIds.includes(item) && (
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
                    <div className='text-white text-center font-medium text-sm leading-5 relative truncate max-w-[100px]'>
                      {item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-2 items-start justify-start flex-shrink-0 relative'>
            <div className='text-white text-left text-sm leading-5 font-medium relative'>
              Log Source/Category
            </div>
            <div className='flex flex-row flex-wrap gap-3 items-start justify-start flex-shrink-0 relative'>
              {uniquecategoryArray?.map((item: any, index: any) => (
                <div
                  key={index}
                  className='bg-[#48576c] rounded-sm p-[6px_8px] flex flex-row gap-0.5 items-center justify-center flex-shrink-0 relative'
                >
                  <div className='flex flex-row gap-1.5 items-center justify-start flex-shrink-0 relative'>
                    <div
                      className='p-1 flex items-center justify-center cursor-pointer'
                      onClick={() => toggleSourceCheckbox(item)}
                    >
                      <div
                        className={`rounded border w-5 h-5 overflow-hidden flex items-center justify-center ${srcnamecheckedIds.includes(item)
                          ? 'bg-[#ee7103] border-[#ee7103]'
                          : 'border-gray-300'
                          }`}
                      >
                        {srcnamecheckedIds.includes(item) && (
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
                    <div className='text-white text-center font-medium text-sm leading-5 relative truncate max-w-[100px]'>
                      {item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-2 items-start justify-start flex-shrink-0 relative'>
            <div className='text-white text-left text-sm leading-5 font-medium relative'>
              Status
            </div>
            <div className='flex flex-row flex-wrap gap-3 items-start justify-start flex-shrink-0 relative'>
              {uniquestatusArray?.map((item: any, index: any) => (
                <div
                  key={index}
                  className='bg-[#48576c] rounded-sm p-[6px_8px] flex flex-row gap-0.5 items-center justify-center flex-shrink-0 relative'
                >
                  <div className='flex flex-row gap-1.5 items-center justify-start flex-shrink-0 relative'>
                    <div
                      className='p-1 flex items-center justify-center cursor-pointer'
                      onClick={() => toggleSourceCheckbox(item)}
                    >
                      <div
                        className={`rounded border w-5 h-5 overflow-hidden flex items-center justify-center ${srcnamecheckedIds.includes(item)
                          ? 'bg-[#ee7103] border-[#ee7103]'
                          : 'border-gray-300'
                          }`}
                      >
                        {srcnamecheckedIds.includes(item) && (
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
                    <div className='text-white text-center font-medium text-sm leading-5 relative truncate max-w-[100px]'>
                      {item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-2 items-start justify-start flex-shrink-0 relative'>
            <div className='text-white text-left text-sm leading-5 font-medium relative'>
              Author
            </div>
            <div className='flex flex-row flex-wrap gap-3 items-start justify-start flex-shrink-0 relative'>
              {uniqueauthorArray?.map((item: any, index: any) => (
                <div
                  key={index}
                  className='bg-[#48576c] rounded-sm p-[6px_8px] flex flex-row gap-0.5 items-center justify-center flex-shrink-0 relative'
                >
                  <div className='flex flex-row gap-1.5 items-center justify-start flex-shrink-0 relative'>
                    <div
                      className='p-1 flex items-center justify-center cursor-pointer'
                      onClick={() => toggleSourceCheckbox(item)}
                    >
                      <div
                        className={`rounded border w-5 h-5 overflow-hidden flex items-center justify-center ${srcnamecheckedIds.includes(item)
                          ? 'bg-[#ee7103] border-[#ee7103]'
                          : 'border-gray-300'
                          }`}
                      >
                        {srcnamecheckedIds.includes(item) && (
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
                    <div className='text-white text-center font-medium text-sm leading-5 relative truncate max-w-[100px]'>
                      {item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-2 items-start justify-start flex-shrink-0 relative'>
            <div className='text-white text-left text-sm leading-5 font-medium relative'>
              Tags
            </div>
            <div className='flex flex-row flex-wrap gap-3 items-start justify-start flex-shrink-0 relative'>
              {uniquetagsArray?.map((item: any, index: any) => (
                <div
                  key={index}
                  className='bg-[#48576c] rounded-sm p-[6px_8px] flex flex-row gap-0.5 items-center justify-center flex-shrink-0 relative'
                >
                  <div className='flex flex-row gap-1.5 items-center justify-start flex-shrink-0 relative'>
                    <div
                      className='p-1 flex items-center justify-center cursor-pointer'
                      onClick={() => toggleSourceCheckbox(item)}
                    >
                      <div
                        className={`rounded border w-5 h-5 overflow-hidden flex items-center justify-center ${srcnamecheckedIds.includes(item)
                          ? 'bg-[#ee7103] border-[#ee7103]'
                          : 'border-gray-300'
                          }`}
                      >
                        {srcnamecheckedIds.includes(item) && (
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
                    <div className='text-white text-center font-medium text-sm leading-5 relative truncate max-w-[100px]'>
                      {item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='px-6 py-6 flex flex-row items-start justify-between self-stretch flex-shrink-0 relative'>
          <button
            onClick={() => {
              setSrcNameCheckedIds([]), setSrcCheckedIds([]), setFilterdata([])
            }}
            className='rounded-lg border border-[#ee7103] px-3 py-2 flex flex-row gap-2 items-center justify-center flex-shrink-0 w-[120px] relative overflow-hidden shadow-xs'
          >
            <div className='text-[#ee7103] text-left font-[Inter] text-base leading-5 font-semibold relative'>
              Clear Filters
            </div>
          </button>
          <div className='flex flex-row gap-3 items-center justify-start flex-shrink-0 relative'>
            <button
              onClick={onClose}
              className='bg-white rounded-lg border border-gray-300 p-2.5 px-3 flex flex-row gap-2 items-center justify-center flex-shrink-0 w-30 relative shadow-xs overflow-hidden'
            >
              <div className='text-gray-800 text-left font-semibold text-base leading-5 relative'>
                Cancel
              </div>
            </button>
            <button
              disabled={srcnamecheckedIds?.length > 0 || srccheckedIds?.length > 0 ? false : true}
              onClick={handleSearch}
              className={`${srcnamecheckedIds?.length > 0 || srccheckedIds?.length > 0
                ? 'cursor-pointer'
                : 'cursor-not-allowed opacity-50 hover'
                } bg-orange-500 rounded-lg p-2.5 px-3 flex flex-row gap-2 items-center justify-center flex-shrink-0 w-[120px] relative shadow-xs overflow-hidden`}
            >
              <div className='text-white text-left font-inter text-lg leading-5 font-semibold relative'>
                Apply
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FiltersDialog
