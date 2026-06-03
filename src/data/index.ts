// Profile
export {
  PROFILE,
  PROFILE_SHARED,
  PROFILE_BY_LOCALE,
  getProfile,
  type Profile,
  type ProfileShared,
  type ProfileTranslated,
} from './profile';

// Experience
export {
  EXPERIENCE,
  EXPERIENCES_SHARED,
  EXPERIENCES_BY_LOCALE,
  getExperiences,
  type Experience,
  type ExperienceShared,
  type ExperienceTranslated,
} from './experience';

// Skills
export {
  SKILLS,
  SKILLS_SHARED,
  SKILLS_BY_LOCALE,
  getSkills,
  type SkillGroup,
  type SkillGroupShared,
  type SkillGroupTranslated,
} from './skills';

// Projects
export {
  PROJECTS,
  PROJECTS_SHARED,
  PROJECTS_BY_LOCALE,
  PROJECT_TYPES,
  PROJECT_STATUS_LABELS,
  PROJECT_TYPES_ALL_LABEL,
  getProjects,
  getProjectTypes,
  getStatusLabel,
  getAllLabel,
  type Project,
  type ProjectShared,
  type ProjectTranslated,
  type ProjectStatus,
  type CoverPattern,
} from './projects';

// Posts moved to Astro content collections under src/content/posts/{locale}/.
// Use src/content/loadPosts.ts to read them at build time.
