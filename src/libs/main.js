
const COUNTDOWN = 2;
const TIME_TO_RESPOND = 60;

let time;
let sound;
let movies = window.movies;

const clearTime = () => {
    clearTimeout(time);
};

const remove = (el) => {
    if (el) {
        el.remove();
    }
};

const add = (id, content) => {
    _.each(document.querySelectorAll('#' + id), (el) => {
        el.innerHTML = content;
    });    
};

const setAudio = (src) => {
    const el = document.getElementById('sounds');
    if (sound) {
        remove(el);
    }

    sound = document.createElement("audio");
    sound.id = 'sounds'
    sound.src = 'audios/' + src + '.mp3';
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);    
}

const audioPlay = function () {
    sound.play();
}

const clickOnce = (id, cb) => {
    const el = document.getElementById(id);
    const fn = () => {        
        el.removeEventListener("click", fn);
        cb(el);
    }
    el.addEventListener("click", fn);
    el.focus();
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getMovie = () => {    
    const random = _.random(0, movies.length - 1);
    const name = movies[random];
    movies = _.without(movies, name);
    
    return capitalizeFirstLetter(name);
};


const addToContent = (content, name) => {  
    _.each(['', '-ext'], (key, index) => {
        const el = document.getElementById("content" + key);
        if (name && index === 1) {
            content = content.replace(name, '******');
        }
        el.innerHTML = content;
    });   
};

const countdown = (number, cb, end) => {
    const counter = (num) => {
        if (num > 0) {
            cb(num);
            time = setTimeout(() => {
                counter(num - 1);
            }, 1000);
        } else {
            end();
        }
    };

    counter(number);
};

const finishedMovie = (key, txt) => {
    setAudio(key);
    addToContent(
            `${txt}
            <image class="mw-100" src="images/${key}.jpg" />
            <div class="w-100 d-block mt-5"><button type="button" class="btn btn-secondary btn-lg" id="next">Siguiente</button></div>`
    );
    audioPlay();
    clickOnce('next', (el) => {
        selectBtn();
    });
};

const lostMovie = () => {
    finishedMovie('lose', '<h2 class="text-danger mb-3">Has fallado</h2>');
};

const winMovie = () => {
    clearTime();
    finishedMovie('win', '<h2 class="text-success mb-3">Acertado</h2>');
};

const showMovie = () => {
    const name = getMovie();

    addToContent('<h1>' + name + '</h1><div id="timer"></div><button type="button" class="btn btn-success btn-lg" id="win">Acertado</button>', name);

    clickOnce('win', winMovie);

    setAudio('start');
    audioPlay();

    countdown(TIME_TO_RESPOND, (number) => {
        if (number === 25) {
            setAudio('time_pass');
            audioPlay();
        } else if (number <= 10) {
            if (number === 10) {
                setAudio('time_finished');
            }
            audioPlay();
        }  
        add('timer', '<h4 class="text-right mr-3">' + number + ' segundos</h4>');
    }, lostMovie);
};

const waitToShow = () => {
    setAudio('countdown');
    countdown(COUNTDOWN, (number) => {
        if (number <= 5) {
            audioPlay();
        }        
        addToContent('<h4>Se mostrar&aacute; en <strong>' + number + '</strong> segundos</h4>');
    }, showMovie);
};

const finishedGame = () => {
    setAudio('applause');
    addToContent(
        `<image class="mw-100" src="images/finished.gif" />
            <div class="w-100 d-block mt-5"><button type="button" class="btn btn-secondary btn-lg" id="reload">Volver a empezar</button></div>`
    );
    audioPlay();
    clickOnce('reload', (el) => {
        window.location.reload();
    });
};

const startGame = () => {
    addToContent(
        `<button type="button" class="btn btn-secondary btn-lg" id="show">Show movie</button>
            <div><p class="text-right mr-3">Quedan: ${movies.length}</p></div>`
    );
    clickOnce('show', (el) => {
        console.log('show');
        waitToShow();
    });
};

const selectBtn = (content) => {
    if (movies.length) {
        startGame();
    } else {
        finishedGame();
    }    
};

const start = () => {
    console.log('start clicked');
    remove(document.getElementById('title'));
    selectBtn();
};

document.addEventListener('DOMContentLoaded', () => {
    clickOnce('start', (el) => {
        start();
    });

}, false);