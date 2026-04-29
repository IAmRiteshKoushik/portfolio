export type Site = {
  NAME: string;
  EMAIL: string;
  NUM_POSTS_ON_HOMEPAGE: number;
  NUM_WORKS_ON_HOMEPAGE: number;
  NUM_PROJECTS_ON_HOMEPAGE: number;
};

export type Comments = {
  ENABLED: boolean;
  REPO: string;
  REPO_ID: string;
  CATEGORY: string;
  CATEGORY_ID: string;
  MAPPING: string;
  STRICT: string;
  REACTIONS_ENABLED: string;
  INPUT_POSITION: string;
  LANG: string;
  LIGHT_THEME: string;
  DARK_THEME: string;
};

export type Metadata = {
  TITLE: string;
  DESCRIPTION: string;
};

export type Socials = {
  NAME: string;
  HREF: string;
}[];
