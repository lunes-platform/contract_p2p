import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});
const FooterPage = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Container >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                color: 'inherit',
                                width: '100%',
                                textDecoration: 'none',
                            }}
                        >
                            <div className="textLeft textLink" style={{ width: "100%" }}><a target='_blank' href='mailto:contact@lunes.io'>Support: contact@lunes.io</a></div>
                        </Typography>
                        <Typography
                            variant="h6"
                            noWrap
                            
                            sx={{
                                display: { m: 'flex', md: 'none' },
                                color: 'inherit',
                                width: '100%',
                                textDecoration: 'none',
                            }}
                        >
                            <div className="textLeft textLink" style={{ width: "100%" }}><a target='_blank' href='https://t.me/LunesGlobal'>Support P2P</a></div>
                        </Typography>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                color: 'inherit',
                                width: '100%',
                                textDecoration: 'none',
                            }}
                        >
                          <div className="textCenter" style={{ width: "100%" }} >©Todos os direitos reservados</div>
                        </Typography>  
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                color: 'inherit',
                                width: '100%',
                                textDecoration: 'none',
                            }}
                        >
                           <div className="textRight textLink" style={{ width: "100%" }}><a href='#'>Grupo Telegram</a></div>
                        </Typography>  
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                color: 'inherit',
                                width: '100%',
                                textDecoration: 'none',
                            }}
                        >
                           <div className="textRight textLink" style={{ width: "100%" }}><a href='#'>Grupo Telegram</a></div>
                        </Typography>  
                       
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>

    )
}
export default FooterPage