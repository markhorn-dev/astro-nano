import { cn } from "@lib/utils";
import { useStore } from "@nanostores/react";
import { activeFilterStore } from "@stores/filterStore";

const filters = [
    { id: "self-develop", label: "Rozwój" },
    { id: "design-patterns", label: "Wzorce projektowe" },
    { id: "javascript", label: "JavaScript" },
    { id: "typescript", label: "TypeScript" },
];


export const FilterButtons = () => {
    const activeFilter = useStore(activeFilterStore)


    const onFilterClick = (filterId: string) => {
        activeFilterStore.set(filterId);
    }

    return <div className="tag-filter py-4">
        {
            filters.map((filter) => (
                <button className={cn("button", activeFilter === filter.id && 'active')} key={filter.id} onClick={() => onFilterClick(filter.id)}>
                    {filter.label}
                </button>
            ))
        }
    </div>
}