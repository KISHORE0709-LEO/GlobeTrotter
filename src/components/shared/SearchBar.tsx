import { Search, SlidersHorizontal, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useData } from "@/hooks/useData";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: (filters: any) => void;
  showFilters?: boolean;
  type?: 'cities' | 'attractions' | 'destinations';
}

export function SearchBar({ 
  placeholder = "Search destinations, trips, activities...", 
  onSearch,
  onFilter,
  showFilters = true,
  type = 'cities'
}: SearchBarProps) {
  const { getCountries, getAttractionCategories } = useData();
  
  const countries = getCountries();
  const categories = getAttractionCategories();

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
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Country</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onFilter?.({ country: '' })}>All Countries</DropdownMenuItem>
              {countries.map(country => (
                <DropdownMenuItem key={country} onClick={() => onFilter?.({ country })}>
                  {country}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {type === 'attractions' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Category</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onFilter?.({ category: '' })}>All Categories</DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem key={category} onClick={() => onFilter?.({ category })}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Budget</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onFilter?.({ maxCost: 1000 })}>All Budgets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter?.({ maxCost: 100 })}>Under $100</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter?.({ maxCost: 150 })}>Under $150</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilter?.({ maxCost: 200 })}>Under $200</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
