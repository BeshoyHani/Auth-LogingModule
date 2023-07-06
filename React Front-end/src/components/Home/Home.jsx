import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            FEDIS {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const cards = [
    {
        title: 'Exams',
        description: 'Take and view your exams alongside your score',
        url: '/exams',
        img: `data:image/jpeg;base64,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`
    },

    {
        title: 'Questions',
        description: 'Create your questions and include them in exams',
        url: '/questions',
        img: `https://www.surveylegend.com/wordpress/wp-content/uploads/2020/12/best-open-ended-questions.png`
    },

    {
        title: 'Users',
        description: 'Manage users and assign different roles to them',
        url: '/users',
        img: `https://www.loginradius.com/blog/static/3d1a7f9993b6334444b52ae84a06f852/d3746/user-mngmnt.jpg`
    }
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Home() {
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6,
                    }}
                >
                    <Container maxWidth="sm">
                        <Typography
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            FEDIS LMS
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" paragraph>
                            Your own online university, where you can upload, store,
                            and create online courses for learners to access on PCs, laptops, tablets, or smartphones
                        </Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            {/* <Button variant="contained">Main call to action</Button>
                            <Button variant="outlined">Secondary action</Button> */}
                        </Stack>
                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards.map((card, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <Link to={card.url} className='link-text'>
                                    <Card
                                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <CardMedia
                                            component="div"
                                            sx={{
                                                // 16:9
                                                pt: '56.25%',
                                            }}
                                            image={card.img}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {card.title}
                                            </Typography>
                                            <Typography>
                                                {card.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
                <Typography variant="h6" align="center" gutterBottom>
                    Atos LMS
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Made with ❤️ by <Link color="inherit" to='https://github.com/BeshoyHani'>Beshoy</Link>
                </Typography>
                <Copyright />
            </Box>
            {/* End footer */}
        </ThemeProvider>
    );
}