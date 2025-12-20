import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../pagination';

type PaginationToken = number | 'ellipsis';

interface PaginationProps {
  onPageChange: (page: number) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  siblingCount?: number;
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PaginationToken[] {
  const totalNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2;
    return [...range(1, leftItemCount), 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2;
    return [
      1,
      'ellipsis',
      ...range(totalPages - rightItemCount + 1, totalPages),
    ];
  }

  return [
    1,
    'ellipsis',
    ...range(leftSiblingIndex, rightSiblingIndex),
    'ellipsis',
    totalPages,
  ];
}

export function Pagination(props: PaginationProps) {
  const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);
  if (totalPages === 0) {
    return null;
  }
  const safeCurrentPage = Math.min(totalPages, Math.max(1, props.currentPage));
  const siblings = props.siblingCount ?? 1;
  const pageItems = getPaginationRange(safeCurrentPage, totalPages, siblings);

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (safeCurrentPage === 1) return;
              props.onPageChange(safeCurrentPage - 1);
            }}
            className={
              safeCurrentPage === 1
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          />
        </PaginationItem>

        {pageItems.map((item, index) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  props.onPageChange(item);
                }}
                isActive={item === safeCurrentPage}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              if (safeCurrentPage === totalPages) return;
              props.onPageChange(safeCurrentPage + 1);
            }}
            className={
              safeCurrentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}

export default Pagination;
