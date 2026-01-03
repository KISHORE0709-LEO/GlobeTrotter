import { Search, SlidersHorizontal, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  showFilters?: boolean;
}

export function SearchBar({ 
  placeholder = "Search destinations, trips, activities...", 
  onSearch,
  showFilters = true 
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-10 bg-muted/50 border-border/50 focus:bg-muted h-11"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      
      {showFilters && (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Group by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Region</DropdownMenuItem>
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Budget</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Trips</DropdownMenuItem>
              <DropdownMenuItem>Ongoing</DropdownMenuItem>
              <DropdownMenuItem>Upcoming</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Budget: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Budget: High to Low</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
