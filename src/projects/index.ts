import type { Template } from './types';
import profile from './templates/profile-page';
import favs from './templates/favorite-things';
import gallery from './templates/photo-gallery';
import invite from './templates/birthday-invite';
import quiz from './templates/quiz-page';
import portal from './templates/portal-site';

export const TEMPLATES: Template[] = [profile, favs, gallery, invite, quiz, portal];

export function templateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
