import { Node, Edge } from 'react-flow-renderer'

interface Query {
  query_id: any
  log_sources: any
  parent_query_id: any
  query_state: any
  query: any
  path: any
  description: any
  children?: any
}

const NODE_WIDTH = 300
const HORIZONTAL_SPACING = 0 // Adjust as needed
const VERTICAL_SPACING = 150 // Adjust as needed
const PARENT_NODE_LEFT_OFFSET = 500 // Adjust to move parent nodes right
const CHILD_NODE_LEFT_OFFSET = -200 // Adjust to reduce space from left for child nodes
const EDGE_COLOR = '#1570EF' // Set the color for the edges

export const transformQueriesToPlanElements = (parentQueries: Query[], location: string) => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  let maxDepth = 0

  // Calculate the total width required at each level of depth
  const calculateTotalWidth = (queries: Query[]): number => {
    let width = 0
    queries.forEach((query) => {
      if (query?.children && query?.children.length > 0) {
        width += calculateTotalWidth(query?.children)
      } else if (query?.children && query?.children.length > 0) {
        width += calculateTotalWidth(query?.children)
      } else {
        width += NODE_WIDTH + HORIZONTAL_SPACING
      }
    })
    return width
  }

  // Recursive function to process queries and position nodes
  const processQueries = (
    queries: Query[],
    depth: number,
    xOffset: number,
    yOffset: number,
    parentId: string | null = null,
  ) => {
    maxDepth = Math.max(maxDepth, depth)
    const totalWidth = calculateTotalWidth(queries)
    let currentXOffset = xOffset - totalWidth / 2

    queries.forEach((query) => {
      const nodeId = query?.query_id
      const position = {
        x: currentXOffset + NODE_WIDTH / 2 + (parentId ? PARENT_NODE_LEFT_OFFSET : 0),
        y: yOffset + depth * VERTICAL_SPACING,
      }

      nodes.push({
        id: nodeId,
        type: 'custom',
        data: {
          label: query?.description,
          log_sources: query?.log_sources,
          query_state: query?.query_state,
          query: query?.query,
        },
        position,
        draggable: true,
        selectable: true,
      })

      if (parentId) {
        edges.push({
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          animated: false, // Set animated property
          style: {
            stroke: !query?.query_state ? '#D92D20' : EDGE_COLOR, // Set the color of the edge
            strokeWidth: 2, // Set the width of the edge line
          },
        })
      }

      // Process child queries
      const processChildren = (childQueries: Query[]) => {
        const childTotalWidth = calculateTotalWidth(childQueries)
        const childXOffset =
          currentXOffset + (totalWidth - childTotalWidth) / 2 + CHILD_NODE_LEFT_OFFSET

        processQueries(childQueries, depth + 1, childXOffset, yOffset + VERTICAL_SPACING, nodeId)
      }

      if (query?.children && query?.children?.length > 0) {
        processChildren(query?.children)
      }

      if (query?.children && query?.children?.length > 0) {
        processChildren(query?.children)
      }

      currentXOffset += NODE_WIDTH + HORIZONTAL_SPACING
    })
  }

  processQueries(parentQueries, 0, window.innerWidth / 2, 0)
  return { nodes, edges }
}
