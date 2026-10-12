import { teamMembers } from "@/data/team";
import type { AuthorOption } from "@/components/admin/NewsEditor";

/** Auteurs proposés : les membres de l'équipe affichés sur le site. */
export const authorOptions: AuthorOption[] = teamMembers.map((member) => ({
  name: member.name,
  role: member.role,
}));
