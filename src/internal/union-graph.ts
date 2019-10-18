export class UnionGraph {
  /** { [ rootNode ]: Set<nodes including rootNode> } */
  private readonly links = new Map<string, Set<string>>();

  /**
   * Create a link between two nodes
   *
   * Unknown nodes will be created
   */
  addLink(nodeA: string, nodeB: string): void {
    if (nodeA === nodeB) {
      return;
    }
    const alreadyKnowA = this.links.has(nodeA);
    const alreadyKnowB = this.links.has(nodeB);
    if (alreadyKnowA && alreadyKnowB) {
      // merge A and B
      this.links.set(nodeA, new Set([...this.links.get(nodeA)!, ...this.links.get(nodeB)!]));
      // remove B
      this.links.delete(nodeB);
    } else if (alreadyKnowA) {
      // append nodeB into already known this.links for nodeA
      this.links.get(nodeA)!.add(nodeB);
    } else if (alreadyKnowB) {
      // append nodeA into already known this.links for nodeB
      this.links.get(nodeB)!.add(nodeA);
    } else {
      // create a new equlity relation
      this.links.set(nodeA, new Set([nodeA, nodeB]));
    }
  }

  /**
   * Extract all the relationships declared so far
   */
  values(): string[][] {
    return Array.from(this.links.values()).map(vs => Array.from(vs));
  }
}
