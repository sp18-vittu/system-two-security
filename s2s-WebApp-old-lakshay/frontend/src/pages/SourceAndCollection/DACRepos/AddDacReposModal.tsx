import React, { useState } from 'react'
import SelectRepositoryPage from './SelectRepositoryPage'
import CloneRepositoryPage from './CloneRepositoryPage'

interface AddDacReposModalModalProps {
  isOpen: boolean
  onClose: () => void
  setProcessModalOpen: any
  repoandinput: any
  setReposandInput: any
}

const AddDacReposModal: React.FC<AddDacReposModalModalProps> = ({
  isOpen,
  onClose,
  setProcessModalOpen,
  repoandinput,
  setReposandInput,
}) => {
  if (!isOpen) return null
  const [selectRepo, setSelectRepo] = useState(null as any)

  const handleNextpage = () => {
    setReposandInput(!repoandinput)
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      {!repoandinput && (
        <CloneRepositoryPage
          handleNextpage={handleNextpage}
          onClose={onClose}
          setProcessModalOpen={setProcessModalOpen}
        />
      )}
      {repoandinput && (
        <SelectRepositoryPage
          handleNextpage={handleNextpage}
          selectRepo={selectRepo}
          setSelectRepo={setSelectRepo}
          onClose={onClose}
        />
      )}
    </div>
  )
}

export default AddDacReposModal
