import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
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
    info: any,
    isReady: boolean,
    onBack:any
}
const HeaderPage = ({ ...props }: HeaderProps) => {
    const [info_, setInfo_] = useState({trander:'',valume:''})
    useEffect(()=>{
        console.log("props.info", props.info)
        setInfo_(props.info)
    },[props.info])
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
                            Traded: {info_.trander} LUNES IN 24h
                        </div>
                    </div>
                    <div style={{ float: 'right', marginLeft: '10px' }}>
                        <div className='boxInfoHeader'>
                            Valume: {info_.valume}
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
                        <img onClick={()=>props.onBack("home")} src={`favicon.png`} style={{ marginRight: "10px" }} />
                        <div onClick={()=>props.onBack("home")}>                          
                            <Typography
                                variant="h6"
                                noWrap
                            >
                                LUNES  - P2P (BETA TEST)
                            </Typography>
                        </div>
                       
                        {props.info.valume?(infoChange()):(<></>)}
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    )
}
export default HeaderPage