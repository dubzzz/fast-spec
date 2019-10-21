export class BiMultiMap {
  /** All kwown links */
  private readonly links = new Map<string, Set<string>>();

  /**
   * Check if there is a direct link between nodeA and nodeB
   */
  has(nodeA: string, nodeB: string): boolean {
    return (
      (this.links.has(nodeA) && this.links.get(nodeA)!.has(nodeB)) ||
      (this.links.has(nodeB) && this.links.get(nodeB)!.has(nodeA))
    );
  }

  /**
   * Add a direct link between nodeA and nodeB
   */
  add(nodeA: string, nodeB: string): void {
    if (!this.links.has(nodeA)) {
      this.links.set(nodeA, new Set());
    }
    this.links.get(nodeA)!.add(nodeB);
  }
}
