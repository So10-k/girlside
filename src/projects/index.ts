import type { Template } from './types';
import profile from './templates/profile-page';
import favs from './templates/favorite-things';
import gallery from './templates/photo-gallery';
import invite from './templates/birthday-invite';
import quiz from './templates/quiz-page';

export const TEMPLATES: Template[] = [profile, favs, gallery, invite, quiz];

export function templateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
