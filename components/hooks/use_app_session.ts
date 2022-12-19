import { useSession } from "next-auth/react";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";

export const useAppSession = () => {
  return useSession().data as CustomSession;
};
