import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants';

export default function ActorIndexPage() {
  redirect(ROUTES.ACTOR.DASHBOARD);
}
