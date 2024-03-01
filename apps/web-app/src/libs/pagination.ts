import { useCallback, useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';

interface PaginatorProps<R> {
  dataUpdate?: Date;
  id?: string;
  paginationRoute: string;
  navigate: NavigateFunction;
  currentPageNumber: number;
  fetchForPage: (pageNumber: number) => Promise<
    | {
        items: R[];
        meta: {
          totalItemCount: number;
          totalPageCount: number;
          pageSize: number;
        };
      }
    | undefined
  >;
}
export function Paginator<T>(props: PaginatorProps<T>) {
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);

  const { currentPageNumber, fetchForPage, navigate, paginationRoute } = props;

  const setPage = useCallback(
    (desiredPageNumber: number) => {
      if (desiredPageNumber < 1) {
        desiredPageNumber = 1;
      }

      if (desiredPageNumber > totalPages) {
        desiredPageNumber = totalPages;
      }

      // Sets Page Number
      navigate(`${paginationRoute}?page=${desiredPageNumber}`);
    },
    [navigate, paginationRoute, totalPages],
  );

  useEffect(() => {
    const fetchData = async () => {
      const fetched = await fetchForPage(currentPageNumber);
      if (!fetched) return;

      if (fetched.items.length === 0 && currentPageNumber > 1) {
        setPage(1);
      }

      setData(fetched.items);
      setTotalPages(fetched.meta.totalPageCount);
      setTotalItems(fetched.meta.totalItemCount);
    };

    fetchData();
  }, [currentPageNumber, fetchForPage, setPage]);

  return { setPage, totalPages, totalItems, data, setData };
}
