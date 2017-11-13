import { action, computed, observable } from 'mobx';

export class BinarySearchTree<T> {
  public readonly id: string;

  public leaf: T;

  public leftChild: BinarySearchTree<T> | null;
  public rightChild: BinarySearchTree<T> | null;

  constructor(
    id: string,
    leaf: T,
    leftChild: BinarySearchTree<T> | null = null,
    rightChild: BinarySearchTree<T> | null = null,
  ) {
    this.id = id;
    this.leaf = leaf;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }

  public static fromList<T>(
    list: T[],
    getItemId: (item: T) => string,
    compareIds: (leftId: string, rightId: string) => number = (lid, rid) =>
      lid === rid ?
        0 :
        lid < rid ?
          -1 :
          1
    ,
  ): BinarySearchTree<T> | null {
    if (list.length === 0) {
      return null;
    }

    if (list.length === 1) {
      const node = list[0];

      return new BinarySearchTree(getItemId(node), node);
    }

    const sorted = list.slice().sort((li, ri) => {
      const lid = getItemId(li);
      const rid = getItemId(ri);

      return compareIds(lid, rid);
    });

    const rootIndex = Math.floor(sorted.length / 2);
    const rootNode = sorted[rootIndex];

    const leftList = sorted.slice(0, rootIndex);
    const rightList = sorted.slice(rootIndex + 1);

    const leftBST = BinarySearchTree.fromList(leftList, getItemId, compareIds);
    const rightBST = BinarySearchTree.fromList(rightList, getItemId, compareIds);

    const root = new BinarySearchTree(
      getItemId(rootNode),
      rootNode,
      leftBST,
      rightBST,
    );

    return root;
  }

  public getNodeById(id: string): T {
    if (id === this.id) {
      return this.leaf;
    } else {
      const ids = [id, this.id].sort();

      if (id === ids[0]) {
        return this.leftChild.getNodeById(id);
      } else {
        return this.rightChild.getNodeById(id);
      }
    }
  }
}

export interface ITreeLeaf {
  id: string;
  parent: Tree<ITreeLeaf>;
  parentId: string;
}

export class Tree<T extends ITreeLeaf> implements ITreeLeaf {
  public readonly id: string;

  @observable public name: string;
  @observable public children: (T | Tree<T>)[];
  @observable public parent: Tree<T> | null;

  @computed public get parentId(): string {
    return this.parent && this.parent.id;
  }
  public set parentId(id: string | null) {
    if (id === null) {
      this.parent = null;
    } else {
      this.parent = this.indexedRoot.getNodeById(id) as Tree<T>;
    }
  }

  @computed public get root(): Tree<T> {
    if (this.parentId === null) {
      return this;
    } else {
      return this.parent.root;
    }
  }

  @computed public get asFlattenedList(): (T | Tree<T>)[] {
    return [].concat.apply([this], this.children.map(
      child => {
        const t = child as Tree<T>;
        const ts: (T | Tree<T>)[] = [];

        if (t instanceof Tree) {
          return ts.concat(t.asFlattenedList);
        } else {
          ts.push(t);
        }

        return ts;
      }
    ));
  }

  @computed public get indexedRoot(): BinarySearchTree<T | Tree<T>> {
    if (this !== this.root) {
      return this.root.indexedRoot;
    }

    const list = this.root.asFlattenedList;

    return BinarySearchTree.fromList(
      list,
      node => {
        if (node instanceof Tree) {
          return `${node.id}tree`;
        } else {
          return `${node.id}leaf`;
        }
      }
    );
  }

  constructor(
    id: string,
    name: string,
    children: (T | Tree<T>)[] = [],
    parentId: string | null = null,
  ) {
    this.id = id;
    this.name = name;
    this.children = children.slice();
    this.children.forEach(child => child.parent = this);
    this.parentId = parentId;
  }

  public getNodeById(id: string): T | Tree<T> {
    return this.indexedRoot.getNodeById(id);
  }
}

const treeExample = new Tree<any>('1', 'Root');
