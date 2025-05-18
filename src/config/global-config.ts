export class GlobalConfig {
  private static instance: GlobalConfig;

  private _modelName: string = "";
  private _verbose: boolean = false;

  private constructor() {}

  public static getInstance(): GlobalConfig {
    if (!GlobalConfig.instance) {
      GlobalConfig.instance = new GlobalConfig();
    }
    return GlobalConfig.instance;
  }

  get modelName(): string {
    return this._modelName;
  }

  set modelName(value: string) {
    this._modelName = value;
  }

  get verbose(): boolean {
    return this._verbose;
  }

  set verbose(value: boolean) {
    this._verbose = value;
  }
}
