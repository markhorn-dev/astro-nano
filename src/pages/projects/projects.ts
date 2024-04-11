import { getCollection } from "astro:content";
import { type Project, type Category, allCategories } from '../../project.type.ts';


function async getProjects() {
    const projects = (await getCollection("projects"))
        .filter((project) => !project.data.draft)
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
    return projects;
}

export async function load() {
    const projects = await getProjects();
    return {
        props: {
            projects,
        }
    };
}


export const allProjects = getProjects();

