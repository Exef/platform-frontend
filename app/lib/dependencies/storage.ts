import { injectable } from "inversify";

export interface IStorage {
  setKey: (key: string, value: string) => void;
  getKey: (key: string) => string;
}

@injectable()
export class Storage {
  constructor(private localStorage: any) {}

  public setKey = (key: string, value: string): void => {
    this.localStorage.setItem(key, value);
  };

  public getKey = (key: string): string => {
    return this.localStorage.getItem(key);
  };
}
