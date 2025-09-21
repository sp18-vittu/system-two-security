import CheckboxList from './checkbox'
import Button from '@mui/material/Button'
import {
  createAuthorizationStoreModel,
  createDefaultFGAStore,
  addUserToDocumentAsViewer,
  removeUserFromDocumentAsViewer,
  checkUserOnDocumentAsViewer,
  getDocuments,
} from 'authorization'
import { useNavigate } from 'react-router-dom'

export default function AdminConsle() {
  let storeId: string | undefined
  let authId: string | undefined
  const navigate = useNavigate()

  storeId = '01H5P9YK279R3TS49VYC3Q759G'
  authId = '01H5PA4ZSDSCZYN7QH9XP73FBF'

  async function initializeFGAStore() {
    storeId = await createDefaultFGAStore()
    if (storeId) {
      authId = await createAuthorizationStoreModel(storeId)
    }

    if (storeId && authId) {
      const docs = await getDocuments('admin', 'owner', storeId, authId)
      console.log(docs)
      docs.forEach((item: any) => {
        console.log(item)
      })
    }
  }

  async function addUserToDocument() {
    if (authId && storeId) {
      const docDom = document.getElementById('docId') as HTMLInputElement
      const docUser = document.getElementById('user').value
      const docRole = document.getElementById('role').value

      if (docDom) {
        const documentId = docDom.value
        if (documentId) {
          await addUserToDocumentAsViewer(docUser, documentId, docRole, storeId, authId)
        }
      }
    }
  }

  async function removeUserFromDocument() {
    if (authId && storeId) {
      const docDom = document.getElementById('docId') as HTMLInputElement
      const docUser = document.getElementById('user').value
      const docRole = document.getElementById('role').value
      if (docDom) {
        const documentId = docDom.value
        if (documentId) {
          await removeUserFromDocumentAsViewer(docUser, documentId, docRole, storeId, authId)
        }
      }
    }
  }

  async function checkUser() {
    if (authId && storeId) {
      const docDom = document.getElementById('docId') as HTMLInputElement
      const docUser = document.getElementById('user').value
      const docRole = document.getElementById('role').value
      if (docDom) {
        const documentId = docDom.value
        if (documentId) {
          const permitted = await checkUserOnDocumentAsViewer(
            docUser,
            documentId,
            docRole,
            storeId,
            authId,
          )

          alert(`Validation result: user is permitted to access document =  ${permitted}`)
        }
      }
    }
  }

  const home = () => {
    navigate('/')
  }

  return (
    <div>
      <Button color='primary' onClick={home}>
        {' '}
        <span> Back</span>
      </Button>
      <div
        style={{
          height: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CheckboxList />
        <div>
          <div>
            <input type='text' id='docId' placeholder='Document'></input>
            <select id='user'>
              <option value='agent'>Agent</option>
              <option value='customer'>Customer</option>
              <option value='manager'>Manager</option>
            </select>
            <select id='role'>
              <option>owner</option>
              <option>writer</option>
              <option>reader</option>
            </select>
            <input type='test' id='page' placeholder='Page'></input>
          </div>

          <button onClick={initializeFGAStore}>InitializeFGA</button>
          <button onClick={addUserToDocument}>AddUserToDocument</button>
          <button onClick={removeUserFromDocument}>RemoveUserFromDocument</button>
          <button onClick={checkUser}>CheckUser</button>
        </div>
      </div>
    </div>
  )
}
