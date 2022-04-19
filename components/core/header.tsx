import AccountCircle from "@mui/icons-material/AccountCircle";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import SignalWifiConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiConnectedNoInternet4";
import { Menu, MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { CenteredComponent } from "./centered_component";

// TODO: Min height in MUI is set to 64 so don't go lower than this, make it so I can though
export const headerHeight = 65;

export interface IHeaderProps {
  uploading: boolean;
  canUpload: boolean;
  upload: () => void;
  offline: boolean;
}

export default function Header(props: IHeaderProps) {
  const session = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

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
  const profile = useCallback(() => {
    closeDropdown();
    router.push("/profile");
  }, [closeDropdown, router]);

  return (
    <AppBar position="relative">
      <CenteredComponent>

      <Toolbar id="toolbar" sx={{ height: headerHeight, maxWidth: "lg", minWidth: "sm", flexGrow: 1 }}>
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
          {props.offline && (
            <Tooltip
              title="We are having trouble connecting right now, you are able to navigate but if you leave MyLife your updates may not be saved"
              sx={{ margin: "auto", marginRight: 2 }}
            >
              <SignalWifiConnectedNoInternet4Icon />
            </Tooltip>
          )}
          {props.canUpload && (
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
          )}
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
            <MenuItem onClick={profile}>Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>

        </Box>
      </Toolbar>
      </CenteredComponent>

    </AppBar>
  );
}
