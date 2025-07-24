import { OrgUnit } from "../logic/logic";
import TreeNode from "./TreeNode";
import TreeView from "./TreeView";

interface TreeSplitProps {
  parent: OrgUnit
  parentPath: number[]
  collumn?: boolean
  leftDisplayDepth: number
}

export function TreeSplit(p: TreeSplitProps) {
  const stack = false
  const a = (<>aaa</>)
  let children: any[] = []
  let pathIndex = 0

  for (const childId in p.parent.children) {
    const count = p.parent.children[childId]
    for (let i = 0; i < count; i++) {
      if (stack || i === 0) {
        const pat = [...p.parentPath, i];

        const chl = !p.collumn ? 
          <TreeView
            key={`${i}-${childId}`}
            unitPath={pat}
            leftDisplayDepth={p.leftDisplayDepth - 1}
          /> : 
          <TreeNode key={`${i}-${childId}`} myPath={pat}/>;

        children = [...children, chl];
      }
      pathIndex++;
    }
  }

  return <>{children.map(s => s)}</>
}