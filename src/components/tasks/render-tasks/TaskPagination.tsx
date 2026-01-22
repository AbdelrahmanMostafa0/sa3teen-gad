import { Button } from '@/components/ui/button'
import { PaginationData } from '@/types/tasks';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const TaskPagination = ({
    pagination,
    handlePageChange,
}: {
    pagination: PaginationData;
    handlePageChange: (page: number) => void;
}) => {
    return (
        <div className="flex justify-center items-center gap-4 mt-8">
            <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-2"
            >
                <FiChevronRight />
                السابق
            </Button>

            <span className="text-sm font-medium">
                صفحة {pagination.page} من {pagination.totalPages}
            </span>

            <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-2"
            >
                التالي
                <FiChevronLeft />
            </Button>
        </div>
    )
}

export default TaskPagination