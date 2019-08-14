import { computed, observable } from 'mobx';

export class SessionState {
  public readonly id: string;

  @observable public page: string;
  @observable public userId: string;

  @computed public get json(): any {
    return {
      id: this.id,
      page: this.page,
      userId: this.userId,
    };
  }

  constructor(
    id: string,
    page: string,
    userId: string,
  ) {
    this.id = id;
    this.page = page;
    this.userId = userId;
  }

  public static fromJson(json: any): SessionState {
    return new SessionState(
      json.id,
      json.page,
      json.userId,
    );
  }
}
