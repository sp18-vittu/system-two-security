import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

interface SortableHeaderProps {
  title: string
  sortField: string
  currentSortField: string | null
  currentSortOrder: 'asc' | 'desc' | null
  onSortChange: (field: string | null, order: 'asc' | 'desc' | null) => void
}

const SortableHeader = (props: SortableHeaderProps) => {
  const { title, sortField, currentSortField, currentSortOrder, onSortChange } = props

  const isActive = currentSortField === sortField

  const handleClick = () => {
    if (!isActive) {
      onSortChange(sortField, 'asc')
    } else if (currentSortOrder === 'asc') {
      onSortChange(sortField, 'desc')
    } else if (currentSortOrder === 'desc') {
      onSortChange(null, null)
    }
  }

  return (
    <div
      className='flex items-center space-x-2 group relative cursor-pointer w-full sortable-header'
      onClick={handleClick}
    >
      <span>{title}</span>
      {!isActive ? (
        <ArrowUpwardIcon
          fontSize='small'
          className='text-[#98a1ac] opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        />
      ) : currentSortOrder === 'asc' ? (
        <ArrowUpwardIcon fontSize='small' className='text-white opacity-100' />
      ) : (
        <ArrowDownwardIcon fontSize='small' className='text-white opacity-100' />
      )}
    </div>
  )
}

export default SortableHeader
