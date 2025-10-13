// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

// project imports

import nexalinkLogo from 'assets/images/nexalink_logo.png';

// ==============================|| LOGO SVG ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Berry" width="100" />
     *
     */
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <img src={nexalinkLogo} alt="NexaLink" width="50" />
      <Typography variant="h3" component="span" sx={{ color: theme.palette.text.primary, ml: 0.5, textDecoration: 'none' }}>
        NexaLink
      </Typography>
    </Box>
  );
}
