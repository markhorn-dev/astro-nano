import type { CollectionEntry } from "astro:content";

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"others">;
};

export const ArrowCard = ({ entry }: Props) => (

  <a
    href={"link" in entry.data
      ? (entry.data.link as string)
      : `/${entry.collection}/${entry.slug}`}
    className="relative group flex flex-nowrap py-3 px-4 pr-10 rounded-lg h-[72px]
          border border-slate-200 dark:border-slate-800
          hover:bg-slate-100 dark:hover:bg-slate-800/50
          hover:text-slate-900 dark:hover:text-white
          hover:h-[152px]
          transition-all duration-300 ease"
    target={"link" in entry.data ? "_blank" : `_self`}
  >
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div>
        <div className="font-semibold">
          {entry.data.title}
        </div>
        <div className="text-sm">
          {entry.data.description}
        </div>
      </div>

      <div className="text-xs mt-2">
        {"tags" in entry.data && entry.data.tags?.join(", ")}
      </div>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="absolute top-1/2 right-2 -translate-y-1/2 size-5 stroke-2 fill-none stroke-current"
    >
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        className="translate-x-3 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
      ></line>
      <polyline
        points="12 5 19 12 12 19"
        className="-translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
      ></polyline>
    </svg>
  </a>
)