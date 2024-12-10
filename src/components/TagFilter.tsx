
import React, { useState } from 'react';

interface TagFilterProps {
    onFilterChange: (tag: string | null) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({ onFilterChange }) => {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const filters = [
        { id: 'javascript', label: 'JavaScript' },
        { id: 'typescript', label: 'TypeScript' },
        { id: 'design-patterns', label: 'Wzorce projektowe' },
        { id: 'self-develop', label: 'Samorozwój' }
    ];

    const handleFilterClick = (tag: string) => {
        const newFilter = activeFilter === tag ? null : tag;
        setActiveFilter(newFilter);
        onFilterChange(newFilter);
    };

    return (
        <div className="tag-filter">
            {filters.map(filter => (
                <button
                    key={filter.id}
                    className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
                    onClick={() => handleFilterClick(filter.id)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};