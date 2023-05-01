import AccountCircle from "@mui/icons-material/AccountCircle";
import { CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { mainGreen } from "./theme";
import LogoutIcon from "@mui/icons-material/Logout";

// TODO: Fix having to use this value elsewhere
export const headerHeight = 64;

export default function Header() {
  const session = useSession();
  const router = useRouter();

  const logout = () =>
    signOut({ callbackUrl: `${process.env.ENV_DOMAIN}/api/auth/logout` });
  const login = () => signIn("cognito");

  return (
    <div className="flex place-content-center h-16 px-8 align-middle">
      <div className="max-w-6xl flex place-content-between grow">
        <IconButton disableRipple onClick={() => router.push("/")}>
          {/* <Image src="/static/images/KitchenCalm.png" alt="KitchenCalm" width="100" height="50" /> */}
          <Typography
            variant="h6"
            color={mainGreen}
            noWrap
            fontFamily="monospace"
          >
            KitchenCalm
          </Typography>
        </IconButton>
        <IconButton
          size="large"
          onClick={session.status === "authenticated" ? logout : login}
          disabled={session.status === "loading"}
          className="my-auto"
          sx={{ color: mainGreen }}
        >
          {session.status === "loading" && (
            <CircularProgress color="inherit" size={20} />
          )}
          {session.status === "authenticated" && <LogoutIcon />}
          {session.status === "unauthenticated" && <AccountCircle />}
        </IconButton>
      </div>
    </div>
  );
}
