export class UnionGraph {
  /**
   * Store the rootNode corresponding to a given node
   *
   * `{ [node]: rootNode }`
   */
  private readonly parentNode = new Map<string, string>();

  /**
   * Store all the nodes linked to a given rootNode (including itself)
   *
   * `{ [ rootNode ]: Set<nodes including rootNode> }`
   */
  private readonly links = new Map<string, Set<string>>();

  /**
   * Create a link between two nodes (must have different names)
   *
   * Unknown nodes will be created
   */
  addLink(nodeA: string, nodeB: string): void {
    if (nodeA === nodeB) {
      // stop: no need for a link
      return;
    }

    const parentNodeA = this.parentNode.get(nodeA);
    const parentNodeB = this.parentNode.get(nodeB);

    if (parentNodeA && parentNodeB) {
      if (parentNodeA === parentNodeB) {
        // stop: there is already a link between nodeA and nodeB
        //       as they reference the same parent
        return;
      }
      // merge A and B
      const linksForParentA = this.links.get(parentNodeA)!;
      const linksForParentB = this.links.get(parentNodeB)!;
      for (const lnkB of linksForParentB) linksForParentA.add(lnkB);
      // update the parent for B and its brothers to be the same as the one for A
      for (const lnkB of linksForParentB) this.parentNode.set(lnkB, parentNodeA);
      // remove B
      this.links.delete(parentNodeB);
    } else if (parentNodeA) {
      // append nodeB into already known this.links for nodeA
      this.links.get(parentNodeA)!.add(nodeB);
      // declare the parent for B to be the same as the one for A
      this.parentNode.set(nodeB, parentNodeA);
    } else if (parentNodeB) {
      // append nodeA into already known this.links for nodeB
      this.links.get(parentNodeB)!.add(nodeA);
      // declare the parent for A to be the same as the one for B
      this.parentNode.set(nodeA, parentNodeB);
    } else {
      // create a new equlity relation
      this.links.set(nodeA, new Set([nodeA, nodeB]));
      // declare the parent of A and B to be A
      this.parentNode.set(nodeA, nodeA);
      this.parentNode.set(nodeB, nodeA);
    }
  }

  /**
   * Extract all the relationships declared so far
   */
  values(): string[][] {
    return Array.from(this.links.values()).map(vs => Array.from(vs));
  }
}
