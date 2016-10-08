/**
 * idea:
 * use nodeIdPath
 * 1 level: find index of element with nodeId
 * add expanded children of previous elements
 * next level: find index of element with nodeId
 * add expanded children of previous elements
 * ...
 */

import { findIndex } from 'lodash'

let globalCounter

const addExpandedChildren = (node) => {
  if (node && node.children && node.children.length && node.expanded) {
    globalCounter += node.children.length
    node.children.forEach(child => addExpandedChildren(child))
  }
}

const findActiveNodeInNodes = (nodes, nodeIdPathPassed) => {
  if (!nodes) return
  const nodeIdPath = nodeIdPathPassed.slice(0)
  const nodeId = nodeIdPath.shift()
  const activeNodesIndex = findIndex(nodes, n => n.nodeId === nodeId)
  const activeNode = nodes[activeNodesIndex]
  if (activeNodesIndex > -1) {
    globalCounter += activeNodesIndex + 1
    for (let i = 0; i < activeNodesIndex; i += 1) {
      addExpandedChildren(nodes[i])
    }
    if (nodeIdPath.length > 0) {
      if (activeNode.children && activeNode.children.length > 0 && activeNode.expanded) {
        findActiveNodeInNodes(activeNode.children, nodeIdPath)
      } else {
        console.log('Error: nodeIdPath not yet empty but no more children')
      }
    }
  } else {
    console.log('error: nodeId from nodeIdPath not found')
  }
}

export default (nodes, activeNode, previousCount) => {
  // if anything goes wrong: return previous count
  if (!nodes) return previousCount
  if (!nodes.length) return previousCount
  if (!activeNode) return previousCount
  globalCounter = 0
  const nodeIdPath = activeNode.nodeIdPath.slice(0)
  findActiveNodeInNodes(nodes, nodeIdPath)
  // seems like this is always one too much
  if (globalCounter > 1) return globalCounter - 1
  return previousCount
}
