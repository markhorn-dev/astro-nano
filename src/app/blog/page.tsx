
import { useState } from 'react';
import { TagFilter } from '@/components/TagFilter';
import { allPosts } from '@/data/posts';

export default function BlogPage() {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const filteredPosts = activeFilter
        ? allPosts.filter(post => post.tags?.includes(activeFilter))
        : allPosts;

    return (
        <div>
            <TagFilter onFilterChange={setActiveFilter} />
            {/* Render filtered blog posts here */}
        </div>
    );
}