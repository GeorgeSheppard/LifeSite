import { useSession } from "next-auth/react";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";

export const useAppSession = () => {
  const session = useSession();
  return {
    id: (session.data as CustomSession)?.id,
    loading: session.status === "loading"
  }
};
