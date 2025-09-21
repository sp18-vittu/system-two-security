import React from 'react'
import { useParams } from 'react-router-dom'
import Repository from './Repository'
import DataIngestion from './Dataingestion'
import VaultPermission from './Vaultpermission'

function Datavaultdoc() {
  const { id } = useParams()
  let documentName: any
  const activeTab = 1
  const datadetail: any = []

  datadetail
    .filter((item: any) => {
      return item.id == id
    })
    .map((test: any) => {
      documentName = test.name
    })

  return (
    <div>
      <h3 className='text-3xl font-bold ml-3.5 pt-3'> {documentName}</h3>
      <div>
        <div>
          {activeTab === 1 && (
            <div>
              <Repository />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <VaultPermission />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <DataIngestion />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Datavaultdoc
