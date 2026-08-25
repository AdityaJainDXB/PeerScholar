export const SUBJECT_CATEGORIES = [
  "Math",
  "Science",
  "Computer Science",
  "World Language",
  "History",
  "English",
  "Test Prep",
] as const;

export const SUBJECTS = [
  { name: "AP Calculus BC", category: "Math" },
  { name: "Algebra II", category: "Math" },
  { name: "Intro to Python", category: "Computer Science" },
  { name: "Data Structures", category: "Computer Science" },
  { name: "AP Chemistry", category: "Science" },
  { name: "AP Biology", category: "Science" },
  { name: "Spanish I", category: "World Language" },
  { name: "AP US History", category: "History" },
  { name: "SAT Prep", category: "Test Prep" },
  { name: "Essay Writing", category: "English" },
] as const;

export const QA_RUBRIC_CRITERIA = [
  { key: "audio_video_quality", label: "Audio/video quality" },
  { key: "accuracy", label: "Content accuracy" },
  { key: "pacing", label: "Pacing & clarity" },
  { key: "matches_description", label: "Matches its description" },
] as const;
