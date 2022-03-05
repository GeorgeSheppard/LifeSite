import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAppDispatch, useAppSelector } from "../store/hooks/hooks";
import { toggleTheme, ThemeKey } from "../store/reducers/user";
import CircularProgress from "@mui/material/CircularProgress";
import SaveIcon from "@mui/icons-material/Save";

// TODO: Min height in MUI is set to 64 so don't go lower than this, make it so I can though
export const headerHeight = 65;

export interface IHeaderProps {
  uploading: boolean;
  upload: () => void;
}

export default function Header(props: IHeaderProps) {
  const session = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((store) => store.user.theme);

  const userImage = session.data?.user?.image;

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
    signOut();
  }, [closeDropdown]);
  const profile = useCallback(() => {
    closeDropdown();
    router.push("/profile");
  }, [closeDropdown, router]);
  const onToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return (
    <AppBar position="relative">
      <Toolbar id="toolbar" sx={{ height: headerHeight }}>
        {/* TODO: Make it obvious both of these are clickable */}
        {/* TODO: Better icon */}
        <EmojiPeopleIcon sx={{ mr: 2 }} onClick={() => router.push("/")} />
        {/* TODO: Better name */}
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          onClick={() => router.push("/")}
        >
          MyLife
        </Typography>
        <Box component="div" sx={{ flexGrow: 1 }} />
        <Box component="div" sx={{ display: "flex" }}>
          <div style={{ margin: "auto" }}>
            <IconButton
              color="inherit"
              size="large"
              onClick={() => !props.uploading && props.upload()}
            >
              {props.uploading ? (
                // For some reason, circular progress takes a number size prop, but icon button takes a string
                <CircularProgress color="inherit" size={24} />
              ) : (
                <SaveIcon />
              )}
            </IconButton>
          </div>
          <IconButton size="large" color="inherit" onClick={onToggleTheme}>
            {theme === ThemeKey.LIGHT ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <IconButton
            size="large"
            color="inherit"
            onClick={
              session.status === "authenticated" ? openDropdown : () => signIn()
            }
          >
            {userImage ? (
              <Avatar src={userImage} sx={{ width: 24, height: 24 }} />
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
            <MenuItem onClick={profile}>Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
