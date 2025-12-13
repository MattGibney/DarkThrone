import { tv } from 'tailwind-variants';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid';

interface PaginationProps {
  onPageChange: (page: number) => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
export function Pagination(props: PaginationProps) {
  const totalPages = Math.ceil(props.totalItems / props.itemsPerPage);

  return (
    <nav className="flex items-center justify-between border-t border-muted px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        {props.currentPage > 1 ? (
          <LinkBlock onClick={() => props.onPageChange(props.currentPage - 1)}>
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-foreground/40"
              aria-hidden="true"
            />
            Previous
          </LinkBlock>
        ) : null}
      </div>
      <div className="hidden md:-mt-px md:flex">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          return (
            <LinkBlock
              key={i}
              isCurrent={pageNumber === props.currentPage}
              onClick={() => props.onPageChange(pageNumber)}
            >
              {pageNumber}
            </LinkBlock>
          );
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {props.currentPage < totalPages ? (
          <LinkBlock onClick={() => props.onPageChange(props.currentPage + 1)}>
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-foreground/40"
              aria-hidden="true"
            />
          </LinkBlock>
        ) : null}
      </div>
    </nav>
  );
}

const styles = tv({
  base: 'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium',
  variants: {
    color: {
      muted: 'text-muted/80 hover:text-muted hover:border-muted/60',
      primary: 'border-primary text-primary',
    },
  },
});

interface LinkBlockProps {
  isCurrent?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
function LinkBlock(props: LinkBlockProps) {
  return (
    <button
      onClick={props.onClick}
      className={styles({ color: props.isCurrent ? 'primary' : 'muted' })}
    >
      {props.children}
    </button>
  );
}

export default Pagination;
