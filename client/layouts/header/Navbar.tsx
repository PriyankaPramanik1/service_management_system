"use client";

import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Container,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search,
  Person,
  Logout,
  Dashboard,
  Phone,
} from "@mui/icons-material";
import { useAuth } from "../../src/app/hook/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Use your theme colors
const VIBRANT_GREEN = '#00a878';
const DEEP_MAROON = '#9a031e';
const DARK_BG = '#0A0E28';
const HEADER_BG = 'rgba(10, 14, 40, 0.95)';

const Navbar = () => {
  const { isLogin, user, logout, loading } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [localUser, setLocalUser] = useState(user);
  const [isClient,setIsClient]=useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const VIBRANT_GREEN = '#00a878'; // Your green color
  // Sync with auth context changes
  useEffect(() => {
    setIsClient(true);
    setLocalUser(user);
  }, [user]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      handleProfileMenuClose();
      setMobileOpen(false);
      router.push("/");
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
    handleProfileMenuClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };
  if (!isClient) {
    return null;
  }

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
  ];

  const drawer = (
    <Box 
      sx={{ 
        width: 280,
        background: `linear-gradient(135deg, ${DARK_BG} 0%, #1a1f3d 100%)`,
        height: '100%',
        color: 'white'
      }} 
      onClick={handleDrawerToggle}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          p: 3, 
          fontWeight: "bold",
          background: 'rgba(255, 255, 255, 0.05)',
          color: VIBRANT_GREEN,
          fontSize: '1.5rem'
        }}
      >
        LOGO
      </Typography>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      {/* User Info in Mobile Drawer */}
      {isLogin && localUser && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: VIBRANT_GREEN,
                fontWeight: 'bold',
              }}
            >
              {localUser?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                {localUser.name || 'User'}
              </Typography>
              <Chip 
                label={localUser.role || 'user'} 
                size="small"
                sx={{ 
                  backgroundColor: VIBRANT_GREEN,
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                  mt: 0.5
                }}
              />
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ py: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            sx={{ 
              cursor: "pointer",
              '&:hover': {
                backgroundColor: 'rgba(0, 168, 120, 0.1)',
              }
            }}
          >
            <ListItemText 
              primary={item.label} 
              sx={{
                '& .MuiTypography-root': {
                  color: 'white',
                  fontWeight: 500,
                }
              }}
            />
          </ListItem>
        ))}

        {/* Dashboard Link for Logged-in Users */}
        {isLogin && (
          <ListItem
            onClick={() => handleNavigation("/userDashboard")}
            sx={{ 
              cursor: "pointer",
              '&:hover': {
                backgroundColor: 'rgba(0, 168, 120, 0.1)',
              }
            }}
          >
            <Dashboard sx={{ mr: 2, color: VIBRANT_GREEN }} />
            <ListItemText 
              primary="Dashboard" 
              sx={{
                '& .MuiTypography-root': {
                  color: VIBRANT_GREEN,
                  fontWeight: 600,
                }
              }}
            />
          </ListItem>
        )}


        {/* Auth buttons in mobile drawer */}
        {loading ? (
          <ListItem sx={{ justifyContent: 'center' }}>
            <CircularProgress size={24} sx={{ color: VIBRANT_GREEN }} />
          </ListItem>
        ) : !isLogin ? (
          <>
            <ListItem sx={{ px: 2, py: 1 }}>
              <Link href="/login" style={{ width: '100%', textDecoration: 'none' }}>
                <Button 
                  fullWidth 
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: VIBRANT_GREEN,
                      backgroundColor: 'rgba(0, 168, 120, 0.1)',
                    }
                  }}
                >
                  Login
                </Button>
              </Link>
            </ListItem>
            <ListItem sx={{ px: 2, py: 1 }}>
              <Link href="/register" style={{ width: '100%', textDecoration: 'none' }}>
                <Button 
                  fullWidth 
                  variant="contained"
                  sx={{
                    bgcolor: VIBRANT_GREEN,
                    '&:hover': {
                      bgcolor: '#008c62',
                    },
                    fontWeight: 600,
                  }}
                >
                  Register
                </Button>
              </Link>
            </ListItem>
          </>
        ) : (
          <ListItem sx={{ px: 2, py: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                background: `linear-gradient(135deg, ${DEEP_MAROON} 0%, #d90429 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, #7a0220 0%, #b00321 100%)`,
                },
                fontWeight: 600,
              }}
            >
              Logout
            </Button>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{ 
          backgroundColor: HEADER_BG, 
          color: "white", 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: `linear-gradient(135deg, ${HEADER_BG} 0%, rgba(10, 14, 40, 0.98) 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                mr: 4,
                fontWeight: "bold",
                cursor: "pointer",
                color: VIBRANT_GREEN,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onClick={() => handleNavigation("/")}
            >
              LOGO
            </Typography>

            {/* Mobile menu button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 168, 120, 0.2)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Desktop menu items */}
            {!isMobile && (
              <Box sx={{ display: "flex", flexGrow: 1, gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => handleNavigation(item.path)}
                    sx={{ 
                      mx: 0.5,
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      '&:hover': {
                        color: VIBRANT_GREEN,
                        backgroundColor: 'rgba(0, 168, 120, 0.1)',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                
                {/* Dashboard link for logged-in users */}
                {isLogin && (
                  <Button
                    color="inherit"
                    onClick={() => handleNavigation("/userDashboard")}
                    startIcon={<Dashboard />}
                    sx={{ 
                      mx: 0.5,
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: VIBRANT_GREEN,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 168, 120, 0.1)',
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </Box>
            )}


            {/* Desktop auth buttons */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
                {loading ? (
                  <CircularProgress size={24} sx={{ color: VIBRANT_GREEN }} />
                ) : !isLogin ? (
                  <>
                        <Button 
        variant="outlined"
        onClick={handleClick}
        sx={{
          borderColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          '&:hover': {
            borderColor: VIBRANT_GREEN,
            backgroundColor: 'rgba(0, 168, 120, 0.1)',
          }
        }}
      >
        Login
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'login-button',
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            mt: 1,
          }
        }}
      >
        <MenuItem 
          onClick={handleClose}
          component="a"
          href="/login" // Replace with your actual link
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 168, 120, 0.2)',
            }
          }}
        >
          User Login
        </MenuItem>
        <MenuItem 
          onClick={handleClose}
          component="a"
          href="http://localhost:8400/auth/staff/login" // Replace with your actual link
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 168, 120, 0.2)',
            }
          }}
        >
         Staff Login
        </MenuItem>
      </Menu>
                    <Link href="/register" style={{ textDecoration: 'none' }}>
                      <Button 
                        variant="contained"
                        sx={{
                          bgcolor: VIBRANT_GREEN,
                          '&:hover': {
                            bgcolor: '#008c62',
                          },
                          fontWeight: 600,
                        }}
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* User welcome text */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        display: { xs: 'none', lg: 'block' }
                      }}
                    >
                      Welcome, {localUser?.name || 'User'}
                    </Typography>
                    
                    {/* User avatar and menu */}
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{ 
                        ml: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 168, 120, 0.2)',
                        }
                      }}
                      size="small"
                    >
                      <Avatar
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: VIBRANT_GREEN,
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                      >
                        {localUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                    
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleProfileMenuClose}
                      sx={{
                        '& .MuiPaper-root': {
                          backgroundColor: DARK_BG,
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        }
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          handleNavigation("/userDashboard");
                          handleProfileMenuClose();
                        }}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(0, 168, 120, 0.1)',
                          }
                        }}
                      >
                        <Dashboard sx={{ mr: 1, color: VIBRANT_GREEN }} />
                        Dashboard
                      </MenuItem>
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(154, 3, 30, 0.1)',
                          }
                        }}
                      >
                        <Logout sx={{ mr: 1, color: DEEP_MAROON }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: 280,
            border: 'none'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;