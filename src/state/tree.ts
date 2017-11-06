import { action, computed, observable } from 'mobx';

export interface ISearchTreeLeaf {
  id: string;
}

export class BinarySearchTree<T extends ISearchTreeLeaf> {
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

  public static fromList<T extends ISearchTreeLeaf>(
    list: T[],
  ): BinarySearchTree<T> | null {
    if (list.length === 0) {
      return null;
    }

    if (list.length === 1) {
      const node = list[0];

      return new BinarySearchTree(node.id, node);
    }

    const sorted = list.slice().sort((i1, i2) =>
      i1.id === i2.id ?
        0 :
        i1.id < i2.id ?
          -1 :
          1
    );

    const rootIndex = Math.floor(sorted.length / 2);
    const rootNode = sorted[rootIndex];

    const leftList = sorted.slice(0, rootIndex);
    const rightList = sorted.slice(rootIndex + 1);

    const leftBST = BinarySearchTree.fromList(leftList);
    const rightBST = BinarySearchTree.fromList(rightList);

    const root = new BinarySearchTree(
      rootNode.id,
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
  parentId: string;
}

export class Tree<T extends ITreeLeaf> implements ITreeLeaf {
  public readonly id: string;

  @observable public name: string;
  @observable public children: (T | Tree<T>)[];
  @observable public parentId: string;

  @computed public get parent(): Tree<T> {
    return this.indexedRoot.getNodeById(this.parentId) as Tree<T>;
  }

  public set parent(parent: Tree<T>) {
    this.parentId = parent.id;
  }

  @computed public get root(): Tree<T> {
    if (this.parentId === null) {
      return this;
    } else {
      return this.parent.root;
    }
  }

  @computed public get asFlattenedList(): (T | Tree<T>)[] {
    return [].concat.apply([], this.children.map(
      child => {
        const t = child as Tree<T>;
        const ts: (T | Tree<T>)[] = [t];

        if (t instanceof Tree) {
          return ts.concat(t.asFlattenedList);
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

    return BinarySearchTree.fromList(list);
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
    this.parentId = parentId;
  }

  public getNodeById(id: string): T | Tree<T> {
    return this.indexedRoot.getNodeById(id);
  }
}

const treeExample = new Tree<any>('1', 'Root');
