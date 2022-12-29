import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

// TODO: Min height in MUI is set to 64 so don't go lower than this, make it so I can though
export const headerHeight = 65;

export default function Header() {
  const session = useSession();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);
  const openDropdown = useCallback(
    (event: any) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );
  const closeDropdown = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);
  const logout = useCallback(() => {
    closeDropdown();
    signOut({ callbackUrl: `http://localhost:3000/api/auth/logout` });
  }, [closeDropdown]);

  return (
    <AppBar position="relative">
      <Toolbar
        id="toolbar"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: headerHeight,
          minWidth: "sm",
          mx: "10vw",
        }}
      >
        <IconButton disableRipple onClick={() => router.push("/")}>
          <Typography variant="h6" color="white" noWrap>
            LifeSite
          </Typography>
        </IconButton>
        <Box component="div" sx={{ flexGrow: 1 }} />
        <Box component="div" sx={{ display: "flex" }}>
          <IconButton
            size="large"
            color="inherit"
            onClick={
              session.status === "authenticated"
                ? openDropdown
                : () => signIn("cognito")
            }
          >
            {session.status === "authenticated" ? (
              <SettingsIcon />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={closeDropdown}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
