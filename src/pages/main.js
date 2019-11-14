import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Fireworks } from 'fireworks/lib/react';

const challenges = require('./challenges');

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '400px',
        paddingTop: 320
    },
    card: {
        margin: 4,
        width: 300,
    },
    title: {
        fontSize: 30,
    },
    definition: {
        fontSize: 50,
        color: 'black'
    },
    pos: {
        marginBottom: 12,
    },
    scoreBox: {
        ...theme.typography.button,
        backgroundColor: 'white',
        opacity: 0.7,
        fontSize: 40
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function prepareWord(word, right) {
    return {
        word,
        right,
        clicked: false,
    };
}

const clickedCardColor = {
    true: 'DeepSkyBlue',
    false: 'SandyBrown'
};

function Challenge(props) {
    const classes = useStyles();
    const [toGo, setToGo] = React.useState(0);

    function decToGo() {
        setToGo(toGo - 1);
    }

    function Word(props) {

        const [clicked, setClicked] = React.useState(false);
        const [fire, setFire] = React.useState(false);
        let fxProps = {
            count: 3,
            interval: 200,
            colors: ['#cc3333', '#4CAF50', '#81C784'],
            calc: (props, i) => ({
                ...props,
                x: (i + 1) * (window.innerWidth / 3) - (i + 1) * 100,
                y: 200 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0)
            })
        };

        function shutdownFire(){
            setFire(false);
        }

        function onClick() {
            setClicked(true);
            if (props.word.right) {
                setFire(true);
                setInterval(shutdownFire,2000);
                //props.decToGo();
            }
            console.log(`clicked! ${props.word.word}`);
        }

        return (
            <div>
                {fire ? <Fireworks {...fxProps} />: null}
            <Grid item >
            <Card className={classes.card} raised style={{ backgroundColor: clicked ? clickedCardColor[props.word.right] : 'WhiteSmoke'}}>
            <CardActionArea 
                disabled={clicked}
                onClick={onClick}>
                <CardContent>
                    <Typography component="h4" variant="h4">
                        {props.word.word}
                    </Typography>
                </CardContent>
                </CardActionArea>
            </Card>
            </Grid>
            </div>
        );
    }    

    const perRow = Math.ceil(Math.sqrt(props.words.length));
    const tmp = [...props.words];
    const rows = [];
    while (tmp.length) {
        rows.push(tmp.splice(0, perRow));
    }
    const rightCount = props.words.reduce((c, w)=> w.right ? c + 1 : c, 0);

    const grid = rows.map(row => {
        const cards = row.map(word => <Word word={word} decToGo={decToGo}/>);
        return (
            <Grid container
            direction="row"
            justify="center"
            alignItems="center">
                {cards}
            </Grid>
        );
    });

    const nextButton = props.next ? (
        <Button variant="contained" color="primary" className={classes.button} onClick={props.next}>
            Next
        </Button>
    ) : null;

    return (
            <Grid container direction='column'>
                <Grid container/>
                <Grid container justify="center">
                    <Grid item  spacing={2} xs={6}>
                    <Typography className={classes.scoreBox} >
                        {props.definition}
                        </Typography>
                    </Grid>
                    <Grid item >
                    <Typography className={classes.scoreBox} >
                        {rightCount || ''}
                        </Typography>
                    </Grid>
                </Grid>
                {grid}
                <Grid container justify="center">
                {nextButton}   
                </Grid>
            </Grid>
        
    );
}

export default function Game() {
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    
    function next() {
        setStep(step + 1);
    }

    const words = [ 
        ...challenges[step].right.map( w=> prepareWord(w, true)),
        ...challenges[step].wrong.map( w=> prepareWord(w, false))
    ]
    shuffle(words);

    console.log('**** %o', challenges[step]);
    
    return (
        <div className={classes.root} >
            <Challenge words={words} definition={challenges[step].definition} next={step < challenges.length - 1 ? next : null}/>
        </div>
    )
}