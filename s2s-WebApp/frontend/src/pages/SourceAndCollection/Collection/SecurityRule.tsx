import React, { useState } from 'react'
import { ExpandMore, ChevronRight } from '@mui/icons-material'

type TreeNode = {
  id: string
  label: string
  children?: TreeNode[]
}

type TreeItemProps = {
  node: TreeNode
  selectedNode: string | null
  expandedNodes: Set<string>
  onToggle: (nodeId: string) => void
  onExpandCollapse: (nodeId: string) => void
  level: any
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  selectedNode,
  expandedNodes,
  onToggle,
  onExpandCollapse,
  level,
}) => {
  const isSelected = selectedNode === node.id
  const isExpanded = expandedNodes.has(node.id)

  return (
    <div key={node.label} className={`pl-${level * 6} my-1`}>
      <div className='flex items-center cursor-pointer text-white '>
        {node.children && (
          <button
            className='mr-2 text-gray-600 hover:text-blue-500 focus:outline-none'
            onClick={() => onExpandCollapse(node.id)}
          >
            {isExpanded ? <ExpandMore className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
          </button>
        )}
        <div
          onClick={(e: any) => {
            e.stopPropagation(), onToggle(node.id)
          }}
          className={`${
            isSelected
              ? 'flex items-center gap-3 p-2 rounded-md border border-[#EE7103] w-full'
              : 'flex items-center gap-3 p-2 w-full'
          }`}
        >
          {isSelected ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7ZM9 14L11 16L15.5 11.5'
                stroke='#309F00'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <path
                d='M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z'
                stroke='#657890'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          )}
          <span>{node.label}</span>
        </div>
      </div>
      {isExpanded && node.children && (
        <div className='pl-4'>
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedNode={selectedNode}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onExpandCollapse={onExpandCollapse}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const SecurityRule: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const handleToggle = (nodeId: string) => {
    setSelectedNode((prev) => (prev === nodeId ? null : nodeId))
  }

  const handleExpandCollapse = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newExpandedNodes = new Set(prev)
      if (newExpandedNodes.has(nodeId)) {
        newExpandedNodes.delete(nodeId) // Collapse if already expanded
      } else {
        newExpandedNodes.add(nodeId) // Expand if not expanded
      }
      return newExpandedNodes
    })
  }

  const treeData: TreeNode[] = [
    {
      id: '1',
      label: 'Child Node 1',
      children: [
        { id: '6', label: 'Subchild Node 1' },
        { id: '7', label: 'Subchild Node 2' },
      ],
    },
    {
      id: '2',
      label: 'Child Node 2',
      children: [
        { id: '3', label: 'Subchild Node 1' },
        { id: '4', label: 'Subchild Node 2' },
      ],
    },
    { id: '5', label: 'Child Node 3' },
  ]

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold text-gray-800'>Security Rules</h1>
      <div>
        {treeData.map((node, index: any) => (
          <TreeItem
            key={node.id}
            node={node}
            selectedNode={selectedNode}
            expandedNodes={expandedNodes}
            onToggle={handleToggle}
            onExpandCollapse={handleExpandCollapse}
            level={index}
          />
        ))}
      </div>
    </div>
  )
}

export default SecurityRule
