import type { CollectionEntry } from "astro:content";
import { ArrowCard } from "./ArrowCard";
import { useEffect, useState } from "react";
import { activeFilterStore } from "@stores/filterStore";
import { useStore } from '@nanostores/react'

interface Props {
    posts: { [year: string]: CollectionEntry<"blog">[]; };
    years: string[];
}

export const PostsList: React.FC<Props> = ({ years, posts }) => {
    const [filteredYears, setFilteredYears] = useState(years)
    const [filteredPosts, setFilteredPosts] = useState(posts)
    const activeFilter = useStore(activeFilterStore)

    useEffect(() => {
        if (!activeFilter) {
            setFilteredYears(years)
            setFilteredPosts(posts)
            return
        }

        const filtered: { [year: string]: CollectionEntry<"blog">[] } = {}
        const yearsWithPosts: string[] = []

        years.forEach((year) => {
            const postsInYear = posts[year].filter((post) =>
                post.data.tags?.includes(activeFilter)
            )

            if (postsInYear.length > 0) {
                filtered[year] = postsInYear
                yearsWithPosts.push(year)
            }
        })

        setFilteredYears(yearsWithPosts)
        setFilteredPosts(filtered)
    }, [activeFilter, years, posts])


    return <div className="space-y-4">
        {
            filteredYears.map((year, index) => (
                <section className="year-section  space-y-4" key={year}>
                    <div className="font-semibold text-black dark:text-white">{year}</div>
                    <div>
                        <ul className="flex flex-col gap-4">
                            {filteredPosts[year].map((post) => (
                                <li
                                    data-tags={post.data.tags && post.data.tags.join(" ")}
                                    className="post-item"
                                    key={post.slug}
                                >
                                    <ArrowCard entry={post} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            ))
        }
    </div>
}