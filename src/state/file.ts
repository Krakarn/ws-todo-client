import { computed, observable } from 'mobx';

import { Tree } from './tree';

export class File {
  public readonly id: string;

  @observable public name: string;
  @observable public parent: Tree<File>;

  @computed public get parentId(): string {
    return this.parent && this.parent.id;
  }
  public set parentId(id: string) {
    this.parent = this.parent.getNodeById(id) as Tree<File>;
  }

  constructor(
    id: string,
    name: string,
    parent: Tree<File> | null = null,
  ) {
    this.id = id;
    this.name = name;
    this.parent = parent;
  }
}
