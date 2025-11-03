export function buildLinkTree(links: any[]) {
  const linkMap = new Map();
  const tree: any[] = [];

  // First, create a map of all links
  links.forEach(link => {
    linkMap.set(link.id, { ...link, children: [] });
  });

  // Then, build the tree structure
  links.forEach(link => {
    const node = linkMap.get(link.id);
    if (link.parentId === null) {
      tree.push(node);
    } else {
      const parent = linkMap.get(link.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return tree;
}