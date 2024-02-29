interface Serialisable {
  serialise(): Promise<object>;
  id: string;
}

export class Paginator<R, I extends Serialisable> {
  public dataRows: R[];
  public items: I[];
  public totalCount = 0;
  public page: number;
  public pageSize: number;
  private rowObject: R;
  private itemObject: I;

  constructor(page = 1, pageSize = 25) {
    this.page = page;
    this.pageSize = pageSize;
    this.items = [];
    this.dataRows = [];
  }

  async serialise(): Promise<object> {
    return {
      items: await Promise.all(
        this.items.map(async (item) => await item.serialise()),
      ),
      meta: {
        totalCount: this.totalCount,
        page: this.page,
        pageSize: this.pageSize,
      },
    };
  }
}
