"use client"

import { useSearch } from '@/hooks/use-search'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { FC } from 'react'

interface SearchProps {
  
}

const Search: FC<SearchProps> = ({}) => {
  const { isOpen, onOpen, onClose, toggle } = useSearch((state) => ({
    isOpen: state.isOpen,
    onOpen: state.onOpen,
    onClose: state.onClose,
    toggle: state.toggle
  }))

  return (
    <div className={cn(
      "min-h-[27px] p-[12px] flex items-center w-full py-1 hover:bg-primary/5 text-sm text-muted-foreground font-medium"
    )}
      onClick={toggle}
    >
      <SearchIcon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      <span className="truncate">Search</span>
      <kbd className="ml-auto pointer-events-none inline-flex items-center gap-1 rounded border h-5 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  )
}

export default Search