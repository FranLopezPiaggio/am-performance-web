import { redirect } from 'next/navigation';

export default function AdminProyectosRedirect() {
  redirect('/admin?view=projects');
}
