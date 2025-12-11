import { PaginatedResponse } from '@darkthrone/interfaces';

interface Serialisable<Serialised> {
  serialise(): Promise<Serialised>;
  id: string;
}

export class Paginator<R, S, I extends Serialisable<S>> {
  public dataRows: R[];
  public items: I[];
  public totalItemCount = 0;
  public page: number;
  public pageSize: number;

  constructor(page = 1, pageSize = 25) {
    this.page = page;
    this.pageSize = pageSize;
    this.items = [];
    this.dataRows = [];
  }

  async serialise(): Promise<PaginatedResponse<S>> {
    const serialisedItems: S[] = await Promise.all(
      this.items.map((item): Promise<S> => item.serialise()),
    );

    return {
      items: serialisedItems,
      meta: {
        totalItemCount: this.totalItemCount,
        totalPageCount: Math.ceil(this.totalItemCount / this.pageSize),
        page: this.page,
        pageSize: this.pageSize,
      },
    };
  }
}
