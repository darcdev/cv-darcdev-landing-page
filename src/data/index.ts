export { PROFILE, type Profile } from './profile';
export { EXPERIENCE, type Experience } from './experience';
export { SKILLS, type SkillGroup } from './skills';
export { PROJECTS, PROJECT_TYPES, pickCover, type Project, type ProjectStatus, type CoverPattern } from './projects';
// Posts moved to Astro content collections under src/content/posts/{locale}/.
// Use src/content/loadPosts.ts to read them at build time.
