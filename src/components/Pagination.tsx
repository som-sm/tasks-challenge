import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  pageInfo: { currentPage: number; pageSize: number };
  totalPages: number;
  onPageInfoChange: (pageInfo: { currentPage: number; pageSize: number }) => void;
};

export function Pagination({ pageInfo, totalPages, onPageInfoChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Select
          value={pageInfo.pageSize.toString()}
          onValueChange={(value) => onPageInfoChange({ currentPage: 1, pageSize: Number(value) })}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tasks / Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 tasks / page</SelectItem>
            <SelectItem value="10">10 tasks / page</SelectItem>
            <SelectItem value="20">20 tasks / page</SelectItem>
            <SelectItem value="50">50 tasks / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (pageInfo.currentPage > 1) {
              onPageInfoChange({ ...pageInfo, currentPage: pageInfo.currentPage - 1 });
            }
          }}
          disabled={pageInfo.currentPage === 1}
        >
          <ChevronLeft size={16} />
        </Button>
        <div className="mx-2 flex items-center gap-1.5 text-sm">
          <span>Page</span>
          <Input
            type="number"
            // Remove the up/down arrows from the input field
            className="w-10 px-1 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            min={1}
            max={totalPages}
            step={1}
            value={pageInfo.currentPage}
            onChange={(e) => {
              const page = Number.parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageInfoChange({ ...pageInfo, currentPage: page });
              }
            }}
          />
          <span>of {totalPages}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (pageInfo.currentPage < totalPages) {
              onPageInfoChange({ ...pageInfo, currentPage: pageInfo.currentPage + 1 });
            }
          }}
          disabled={pageInfo.currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
