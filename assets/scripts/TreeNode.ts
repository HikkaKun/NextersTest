import { INode } from './INode';

export class TreeNode implements INode {
  public root: INode | null = null;
  public parent: INode | null = null;
  public next: INode | null = null;
  public prev: INode | null = null;

  public get first() {
    return this._first;
  }

  public get last() {
    return this._last;
  }

  public get count() {
    return this._count;
  }

  private _first: INode | null = null;
  private _last: INode | null = null;
  private _count = 0;

  constructor(parent?: INode) {
    if (parent) parent.add(this);
  }

  public has(node: INode): boolean {
    return node.parent === this;
  }

  public add(node: INode): void {
    if (this.has(node)) return;

    const root = this.root || this;
    node.root = root;
    node.parent = this;

    if (this._last) {
      node.prev = this._last;
      node.next = null;
      this._last.next = node;
      this._last = node;
    } else {
      this._first = node;
      this._last = node;
      node.next = null;
      node.prev = null;
    }

    const callback = (node: INode) => {
      if (node.root === root) return;

      node.root = root;
      node.each(callback);
    };

    node.each(callback);

    this._count++;
  }

  public remove(node: INode): void {
    if (!this.has(node)) return;

    const { prev, next } = node;

    if (prev) {
      prev.next = next;
    }

    if (next) {
      next.prev = prev;
    }

    if (node === this.first) {
      this._first = next;
    }

    if (node === this.last) {
      this._last = prev;
    }

    node.parent = null;
    node.root = null;
    node.next = null;
    node.prev = null;

    this._count--;
  }

  public each(cb: (node: INode) => void): void {
    let current = this.first;

    while (current) {
      cb(current);
      current = current.next;
    }
  }
}