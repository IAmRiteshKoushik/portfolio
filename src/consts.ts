import type { Comments, Site, Metadata, Socials } from "@types";

export const SITE: Site = {
	NAME: "Ritesh Koushik",
	EMAIL: "riteshkoushik39@gmail.com",
	NUM_POSTS_ON_HOMEPAGE: 5,
	NUM_WORKS_ON_HOMEPAGE: 2,
	NUM_PROJECTS_ON_HOMEPAGE: 2,
};

const giscusRepo = import.meta.env.PUBLIC_GISCUS_REPO?.trim() ?? "";
const giscusRepoId = import.meta.env.PUBLIC_GISCUS_REPO_ID?.trim() ?? "";
const giscusCategory = import.meta.env.PUBLIC_GISCUS_CATEGORY?.trim() ?? "";
const giscusCategoryId =
	import.meta.env.PUBLIC_GISCUS_CATEGORY_ID?.trim() ?? "";

export const COMMENTS: Comments = {
	ENABLED: [giscusRepo, giscusRepoId, giscusCategory, giscusCategoryId].every(
		Boolean,
	),
	REPO: giscusRepo,
	REPO_ID: giscusRepoId,
	CATEGORY: giscusCategory,
	CATEGORY_ID: giscusCategoryId,
	MAPPING: import.meta.env.PUBLIC_GISCUS_MAPPING?.trim() || "pathname",
	STRICT: import.meta.env.PUBLIC_GISCUS_STRICT === "1" ? "1" : "0",
	REACTIONS_ENABLED:
		import.meta.env.PUBLIC_GISCUS_REACTIONS_ENABLED === "0" ? "0" : "1",
	INPUT_POSITION:
		import.meta.env.PUBLIC_GISCUS_INPUT_POSITION === "top" ? "top" : "bottom",
	LANG: import.meta.env.PUBLIC_GISCUS_LANG?.trim() || "en",
	LIGHT_THEME: import.meta.env.PUBLIC_GISCUS_LIGHT_THEME?.trim() || "light",
	DARK_THEME:
		import.meta.env.PUBLIC_GISCUS_DARK_THEME?.trim() || "dark_dimmed",
};

export const HOME: Metadata = {
	TITLE: "Home",
	DESCRIPTION: "Ritesh Koushik is a Go developer.",
};

export const BLOG: Metadata = {
	TITLE: "Blog",
	DESCRIPTION:
		"A collection of articles on topics I am passionate about. Software development, philosophy and simple observations about life.",
};

export const WORK: Metadata = {
	TITLE: "Work",
	DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
	TITLE: "Projects",
	DESCRIPTION:
		"A collection of my projects, with links to repositories and demos.",
};

export const SOCIALS: Socials = [
	{
		NAME: "twitter-x",
		HREF: "https://twitter.com/AmRiteshKoushik",
	},
	{
		NAME: "github",
		HREF: "https://github.com/IAmRiteshKoushik",
	},
	{
		NAME: "linkedin",
		HREF: "https://www.linkedin.com/in/ritesh-koushik",
	},
];
