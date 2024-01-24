import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1976d2',
        },
    },
});
type HeaderProps = {
    totalTraded: number
    Valume: number,
    isReady: boolean,
}
const HeaderPage = ({ ...props }: HeaderProps) => {
    const infoChange = () =>{
        return(
            <div className='boxPosotionRight'>                           
            <Typography
                sx={{
                    display: { xs: 'none', md: 'flex' },
                }}
            >
            
                    <div style={{ float: 'right', marginLeft: '10px' }}>
                        <div className='boxInfoHeader'>
                            Traded: {props.totalTraded} LUNES IN 24h
                        </div>
                    </div>
                    <div style={{ float: 'right', marginLeft: '10px' }}>
                        <div className='boxInfoHeader'>
                            Valume: {props.Valume}  LUNES
                        </div>
                    </div>
            </Typography>
        </div>
        )
    }
     return (
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static" color="primary">
                <Container maxWidth="xl" >
                    <Toolbar disableGutters>
                       <img src={`favicon.png`} style={{ marginRight: "10px" }} />
                        <Typography
                            variant="h6"
                            noWrap
                        >
                            LUNES  - P2P
                        </Typography>
                        {props.isReady?(infoChange()):(<></>)}
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}
export default HeaderPage