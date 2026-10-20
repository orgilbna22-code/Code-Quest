/**
 * School Grade & Class structured data configuration
 * Strictly enforces:
 * - Minimum supported grade: Grade 6
 * - ONLY format: "6-1", "6-2", "6-3" up to "12-1", "12-2", "12-3"
 * - Rejects legacy 10-A, 10-B, 6A, 7B formats.
 * - Stores grade as number (6-12) and classSection as number (1-3)
 */

export const SUPPORTED_GRADES = [6, 7, 8, 9, 10, 11, 12] as const;
export type SupportedGrade = (typeof SUPPORTED_GRADES)[number];

export const CLASS_SECTIONS = [1, 2, 3] as const;
export type ClassSection = (typeof CLASS_SECTIONS)[number];

export interface SchoolClassDefinition {
  grade: SupportedGrade;
  section: ClassSection;
  label: string; // e.g. "10-2"
}

// Generate structured data
export const ALL_SCHOOL_CLASSES: SchoolClassDefinition[] = SUPPORTED_GRADES.flatMap((grade) =>
  CLASS_SECTIONS.map((section) => ({
    grade,
    section,
    label: `${grade}-${section}`,
  }))
);

export const ALL_CLASS_LABELS: string[] = ALL_SCHOOL_CLASSES.map((c) => c.label);

export function getSectionsForGrade(grade: number): number[] {
  if (!SUPPORTED_GRADES.includes(grade as SupportedGrade)) {
    return [1, 2, 3];
  }
  return [1, 2, 3];
}

export function formatGradeClass(grade?: number | string, section?: number | string): string {
  if (!grade) return '10-1';
  const gNum = typeof grade === 'string' ? parseInt(grade.replace(/\D/g, ''), 10) : grade;
  const sNum = typeof section === 'string' ? parseInt(section.replace(/\D/g, ''), 10) : section || 1;
  const safeGrade = Math.min(12, Math.max(6, isNaN(gNum) ? 10 : gNum));
  const safeSection = Math.min(3, Math.max(1, isNaN(sNum) ? 1 : sNum));
  return `${safeGrade}-${safeSection}`;
}

export function validateGradeAndClass(
  grade: number,
  section: number
): { valid: boolean; error?: string } {
  if (!SUPPORTED_GRADES.includes(grade as SupportedGrade)) {
    return {
      valid: false,
      error: `Зөвхөн 6-12 дугаар анги дэмжигдэнэ (Grade must be between 6 and 12).`,
    };
  }
  if (!CLASS_SECTIONS.includes(section as ClassSection)) {
    return {
      valid: false,
      error: `Бүлэг зөвхөн 1, 2, 3 байх ёстой (Class section must be 1, 2, or 3).`,
    };
  }
  return { valid: true };
}

/**
 * Yearly Grade Promotion
 * 6 -> 7 -> 8 -> 9 -> 10 -> 11 -> 12 -> Alumni
 * Keeps all XP, courses, achievements, projects, streak intact!
 */
export function promoteStudentGrade(currentGrade: number, newSection?: number): {
  promotedGrade: number;
  newSection: number;
  isAlumni: boolean;
  label: string;
} {
  const nextGrade = currentGrade + 1;
  const section = newSection || 1;
  if (nextGrade > 12) {
    return {
      promotedGrade: 12,
      newSection: section,
      isAlumni: true,
      label: 'Төгсөгч (Alumni / Graduate)',
    };
  }
  return {
    promotedGrade: nextGrade,
    newSection: section,
    isAlumni: false,
    label: `${nextGrade}-${section}`,
  };
}
