import React, { useEffect, useState, useCallback } from 'react'
import ReactFlow, {
  addEdge,
  ReactFlowProvider,
  Node,
  Edge,
  NodeTypes,
  MarkerType,
  Position,
} from 'react-flow-renderer'
import Controls from './Controls'
import CustomPlanNode from './CustomPlanNode'
const nodeTypes: NodeTypes = {
  custom: CustomPlanNode,
}

const convertToFlowElements = (
  treeData: any,
  expandedNodes: any,
  horizontalSpacing: number = 600,
  baseVerticalSpacing: number = treeData?.children?.length * 100,
  level3AndBeyondSpacingFactor: number = 3,
) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const levelNodeCounts: Record<number, number> = {}

  const calculateTotalChildCount = (node: any): number => {
    if (!node?.children || node?.children?.length === 0) {
      return 0
    }
    let totalCount = node?.children?.length
    node?.children.forEach((child: any) => {
      totalCount += calculateTotalChildCount(child)
    })
    return totalCount
  }

  const countNodesAtLevels = (node: any, level: number = 0) => {
    if (!levelNodeCounts[level]) {
      levelNodeCounts[level] = 0
    }
    levelNodeCounts[level] += 1
    if (node?.children) {
      node?.children.forEach((child: any) => {
        countNodesAtLevels(child, level + 1)
      })
    }
  }

  const getNodePosition = (
    level: number,
    childNumber: number,
    nodesAtLevel: number,
    horizontalSpacing: number,
    baseVerticalSpacing: number,
    level3AndBeyondSpacingFactor: number,
    parentY?: number,
  ) => {
    const X = level * horizontalSpacing

    let adjustedVerticalSpacing = baseVerticalSpacing
    if (level >= 3) {
      adjustedVerticalSpacing /= level3AndBeyondSpacingFactor
    }
    const spacing1 = adjustedVerticalSpacing / (nodesAtLevel + 1)
    let Y

    if (level < 2) {
      if (childNumber % 2 !== 0) {
        Y = adjustedVerticalSpacing / 2 - (Math.floor(childNumber / 2) + 1) * spacing1
      } else {
        Y = adjustedVerticalSpacing / 2 + Math.floor(childNumber / 2) * spacing1
      }
    } else {
      Y = parentY !== undefined ? (childNumber + 1) * spacing1 : 0
    }

    return { x: X, y: Y }
  }

  const traverse = (
    node: any,
    parentId: string | null = null,
    level: number = 0,
    nodeIndex: number = 0,
    parentY?: number,
  ) => {
    const nodeId = node?.query_id
    const childCount = node?.children ? node?.children?.length : 0
    const totalCount = calculateTotalChildCount(node)
    const nodesAtLevel = levelNodeCounts[level] || 1

    const { x, y } = getNodePosition(
      level,
      nodeIndex,
      nodesAtLevel,
      horizontalSpacing,
      baseVerticalSpacing,
      level3AndBeyondSpacingFactor,
      parentY,
    )

    nodes.push({
      id: nodeId,
      type: 'custom',
      data: {
        label: node?.query_id === 'root' ? null : node?.description,
        log_sources: node?.log_sources,
        query_state: node?.query_state,
        query: node?.query,
        count: childCount,
        totalCount: totalCount,
      },
      position: { x, y },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    })

    if (parentId) {
      edges.push({
        id: `e${parentId}-${nodeId}`,
        source: parentId,
        type: 'smoothstep',
        target: nodeId,
        style: {
          stroke: !node?.query_state ? '#D92D20' : '#1570EF',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.Arrow,
          width: 25,
          height: 25,
          color: !node?.query_state ? '#D92D20' : '#1570EF',
        },
      })
    }

    const isExpanded = expandedNodes[nodeId] !== undefined ? expandedNodes[nodeId] : level === 0

    if (node?.children && isExpanded) {
      node?.children.forEach((child: any, index: number) => {
        traverse(child, nodeId, level + 1, index, y)
      })
    }
  }

  // Count the nodes at each level
  countNodesAtLevels(treeData)

  // Start traversal with the root node
  traverse(treeData, null, 0, 0)
  return { nodes, edges }
}

const HuntExecuteFlow = ({ planeNodeView }: any) => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  useEffect(() => {
    const initialTreeData: any = planeNodeView
    const { nodes: flowNodes, edges: flowEdges } = convertToFlowElements(
      initialTreeData,
      expandedNodes,
    )
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [expandedNodes, planeNodeView])

  useEffect(() => {
    const initialTreeData: any = planeNodeView
    if (selectedNodeId) {
      setExpandedNodes((prevExpandedNodes) => {
        const newExpandedNodes: Record<string, boolean> = {}
        // Open selected node and all its ancestors
        const openNodeAndAncestors = (id: any) => {
          if (id) {
            newExpandedNodes[id] = true
            const node = findNodeById(id, [initialTreeData])
            node?.parents.forEach((parent: any) => openNodeAndAncestors(parent))
          }
        }

        const findNodeById = (id: any, nodes: any): any => {
          let result = null
          for (const node of nodes) {
            if (node?.query_id === id) {
              result = { ...node, parents: [] }
              break
            }
            if (node?.children) {
              const childResult = findNodeById(id, node?.children)
              if (childResult) {
                result = childResult
                result.parents.push(node?.query_id)
                break
              }
            }
          }
          return result
        }

        openNodeAndAncestors(selectedNodeId)
        return newExpandedNodes
      })
    }
  }, [selectedNodeId, planeNodeView])

  const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds))

  const handleNodeClick = useCallback((event: any, node: any) => {
    setSelectedNodeId(node?.id)
    setExpandedNodes((prevExpandedNodes) => {
      // Collapse all nodes except the clicked node
      const newExpandedNodes: Record<string, boolean> = {}
      newExpandedNodes[node?.id] = !prevExpandedNodes[node?.id]
      return newExpandedNodes
    })
  }, [])

  const onResetView = useCallback(() => {
    const initialTreeData: any = planeNodeView
    const { nodes: flowNodes, edges: flowEdges } = convertToFlowElements(
      initialTreeData,
      expandedNodes,
    )
    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [])

  return (
    <div style={{ height: '68vh', width: '100%', position: 'relative', zIndex: 0 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes} // Register custom node types
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          fitView
          minZoom={0.5}
          maxZoom={2}
          style={{ cursor: 'pointer' }}
        >
          <Controls onResetView={onResetView} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

export default HuntExecuteFlow
