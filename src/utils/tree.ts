// 组织树操作
type ns = number | string

interface Props {
  id: string
  children: string
}

interface NodeInfo<T = any> {
  node: T
  index: number | null
  path: ns[]
  isEnd: boolean
}

export const findNode = <T>(
  data: T[],
  id: ns,
  props: Props = { id: 'id', children: 'children' },
): NodeInfo<T> => {
  const nodeInfo: NodeInfo = {
    node: null,
    index: null,
    path: [],
    isEnd: false,
  }
  const traverse = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      const currentId = arr[i][props.id]
      if (nodeInfo.isEnd === false)
        nodeInfo.path.push(currentId)

      if (currentId === id) {
        nodeInfo.node = arr[i]
        nodeInfo.index = i
        nodeInfo.isEnd = true
      }
      else {
        if (nodeInfo.isEnd === false) {
          if (arr[i][props.children] && arr[i][props.children].length > 0)
            traverse(arr[i][props.children])
        }
      }
      if (nodeInfo.isEnd === false)
        nodeInfo.path.pop()
    }
  }
  traverse(data)
  return nodeInfo
}
