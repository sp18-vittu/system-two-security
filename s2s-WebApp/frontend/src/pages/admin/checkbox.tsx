import { createAuthorizationStoreModel, createDefaultFGAStore, getDocuments } from 'authorization'
import React, { useState } from 'react'

interface CheckboxItem {
  checked: boolean
  id: number
  label: string
}

class checkboxItemImpl implements CheckboxItem {
  checked = false
  id = 0
  label = 'default label'
}

const CheckboxList: React.FC = () => {
  const [checkboxItems, setCheckboxItems] = useState<CheckboxItem[]>([new checkboxItemImpl()])

  const handleCheckboxChange = (id: number) => {
    setCheckboxItems((items) =>
      items.map((item) =>
        item.id === id ? { id: item.id, label: item.label, checked: !item.checked } : item,
      ),
    )
  }

  async function refresh() {
    const storeId = await createDefaultFGAStore()
    if (storeId) {
      const authId = await createAuthorizationStoreModel(storeId)
      if (authId) {
        const docs = await getDocuments('admin', 'owner', storeId, authId)
        docs.forEach((item) => {
          const checkboxItem = new checkboxItemImpl()
          checkboxItem.label = item
          setCheckboxItems((items) => [...items, checkboxItem])
        })
      }
    }

    setCheckboxItems((items) => [...items, new checkboxItemImpl()])
  }

  return (
    <div>
      {checkboxItems.map((item) => (
        <div key={item.id}>
          <input
            type='checkbox'
            checked={item.checked || false}
            onChange={() => handleCheckboxChange(item.id)}
          />
          <label>{item.label}</label>
        </div>
      ))}
      <button onClick={refresh}>Refresh</button>
    </div>
  )
}

export default CheckboxList
