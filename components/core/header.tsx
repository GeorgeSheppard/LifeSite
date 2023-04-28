import AccountCircle from "@mui/icons-material/AccountCircle";
import { CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { mainGreen } from "./theme";
import LogoutIcon from "@mui/icons-material/Logout";

// TODO: Min height in MUI is set to 64 so don't go lower than this, make it so I can though
export const headerHeight = 64;

export default function Header() {
  const session = useSession();
  const router = useRouter();

  const logout = () => signOut();
  const login = () => signIn("cognito");

  return (
    <div
      style={{ backgroundColor: mainGreen }}
      className="flex place-content-center h-16 px-8 align-middle"
    >
      <div className="max-w-6xl flex place-content-between grow">
        <IconButton
          disableRipple
          onClick={() => router.push("/")}
        >
          <Typography variant="h6" color="white" noWrap>
            LifeSite
          </Typography>
        </IconButton>
        <IconButton
          size="large"
          onClick={session.status === "authenticated" ? logout : login}
          disabled={session.status === "loading"}
          sx={{ color: "white" }}
          className="my-auto"
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
