export default class Campominato {
    
    constructor() {

        this.containerCampo = document.getElementById('container-campo');
        this.btnReset = document.getElementById('btn');
        this.infoGame = document.getElementById('info-game');

        this.numeroCaselle = 399;
        this.containerBomb = [];
        this.finishGame = false;
        this.finishCounter = 0;

        this.creaCampo();
        this.generateBomb();
        this.game();
        this.resetGame();
        
    }

    //RESETTA I DATI DI GIOCO E AVVIA UNA NUOVA PARTITA
    resetGame = () => {
        this.btnReset.addEventListener('click', e => {
            this.creaCampo();
            this.generateBomb();
            this.finishGame = false;
            this.finishCounter = 0;
            this.infoGame.innerHTML = '';
        })
    }

    //GENERA IL CAMPO DI GIOCO
    creaCampo = () => {
        this.containerCampo.innerHTML = '';
        let div;
        for (let i = 0; i <= this.numeroCaselle; i++) {
            div = document.createElement('DIV');
            div.classList.add('casella');
            div.dataset.number = i;
            this.containerCampo.appendChild(div);
        };
    };

    //FUNZIONE DI GIOCO CHE AGGIUNGE EVENTI AL CLICK SINISTRO E DESTRO
    game = () => {
        this.containerCampo.addEventListener('click', e => {
            if(e.target.tagName === 'DIV' && !this.finishGame) this.recursiveSelect(Number(e.target.dataset.number));
        });
        this.containerCampo.addEventListener('contextmenu', e => {
            e.preventDefault();
            if (e.target.tagName === 'DIV' && !e.target.classList.contains('seagreen') && !this.finishGame) {
                this.containerCampo.childNodes[Number(e.target.dataset.number)].innerHTML = '<i class="fa-solid fa-flag"></i>';
            } 
            if (e.target.tagName === 'I' && !e.target.classList.contains('seagreen') && !this.finishGame) {
                this.containerCampo.childNodes[Number(e.target.parentNode.dataset.number)].innerHTML = '';
            }
        })
    };

    //GENERA NUMERO RANDOMICO DA 0 AL NUMERO DI CASELLE
    randomNumber = () => Math.floor(Math.random() * this.numeroCaselle) + 1;

    //GENERA LE BOMBE
    generateBomb = () => {
        this.containerBomb = [];
        while (this.containerBomb.length < 60) {
            let number = this.randomNumber();
            if(!this.containerBomb.includes(number)) this.containerBomb.push(number);
        };
        console.log(this.containerBomb.sort());
    };

    //VERIFICA LA POSIZIONE DELLA CASELLA TARGET
    controllaPosizione = (casella) => {
        if (casella === 0) return 'angolo top sinistro';
        if (casella === 19) return 'angolo top destro';
        if (casella === 380) return 'angolo bottom sinistro';
        if (casella === 399) return 'angolo bottom destro';
        if (casella < 19 && casella > 0) return 'lato top';
        if (casella < 399 && casella > 380) return 'lato bottom';
        if (this.verificaLato(casella, 19, 399, 20)) return 'lato destro';
        if (this.verificaLato(casella, 0, 380, 20)) return 'lato sinistro';
        return 'centro';
    };

    //VERIFICA SE LA CASELLA TARGET SI TROVA SUI LATI 
    verificaLato = (casella, num1, num2, num3) => {
        let centro = false;
        for (let i = num1; i <= num2; i = i + num3) {
            if (casella === i) centro = true;
        };
        if (centro) {
            return true;
        } else {
            return false;
        };
    };

    //FUNZIONE RICORSIVA CHE BOLLA LE CASELLE FREE BLOCCA IL GIOCO IN CASO DI BOMBA
    recursiveSelect = (casella) => {
        if (this.containerBomb.includes(casella)) {
            this.finishGame = true;
            this.containerBomb.forEach(element => {
                this.containerCampo.childNodes[element].innerHTML = '<i class="fa-solid fa-bomb"></i>';
            });
            this.containerCampo.childNodes.forEach(element => {
                if (element.classList.contains('seagreen')) this.finishCounter++;
            })
            this.infoGame.innerText = 'SCORE: ' + this.finishCounter;
            return;
        }

        if (this.countLimitrofi(casella) === 0) {
        
            if (this.containerCampo.childNodes[casella].children.length === 0) {
                this.containerCampo.childNodes[casella].classList.add('seagreen');
            } 

            if (this.controllaPosizione(casella) === 'angolo top sinistro') {
                this.recursiveSelect(casella + 1);
                this.recursiveSelect(casella + 20);
                this.recursiveSelect(casella + 21);   
            }

            if (this.controllaPosizione(casella) === 'angolo top destro') {
                this.recursiveSelect(casella - 1);
                this.recursiveSelect(casella + 20);
                this.recursiveSelect(casella + 19);
            }

            if (this.controllaPosizione(casella) === 'angolo bottom destro') {
                this.recursiveSelect(casella - 1);
                this.recursiveSelect(casella - 20);
                this.recursiveSelect(casella - 21);
            }

            if (this.controllaPosizione(casella) === 'angolo bottom sinistro') {
                this.recursiveSelect(casella + 1);
                this.recursiveSelect(casella - 20);
                this.recursiveSelect(casella - 19);
            }
            
            if (this.controllaPosizione(casella) === 'lato top') {
                this.piu1(casella);
                this.meno1(casella);
                this.piu20(casella);
                this.piu19(casella);
                this.piu21(casella);
            }

            if (this.controllaPosizione(casella) === 'lato bottom') {
                this.piu1(casella);
                this.meno1(casella);
                this.meno20(casella);
                this.meno19(casella);
                this.meno21(casella);
            }

            if (this.controllaPosizione(casella) === 'lato sinistro') {
                this.piu20(casella);
                this.meno20(casella);
                this.piu21(casella);
                this.piu1(casella);
                this.meno19(casella);
            }

            if (this.controllaPosizione(casella) === 'lato destro') {
                this.piu20(casella);
                this.meno20(casella);
                this.meno21(casella);
                this.meno1(casella);
                this.piu19(casella);
            }

            if (this.controllaPosizione(casella) === 'centro') {
                this.piu1(casella);
                this.meno1(casella);
                this.piu20(casella);
                this.meno20(casella);
                this.piu21(casella);
                this.meno21(casella);
                this.piu19(casella);
                this.meno19(casella);
            }

        } else {
            if (this.containerCampo.childNodes[casella].children.length === 0) {
                this.containerCampo.childNodes[casella].classList.add('seagreen');
                this.containerCampo.childNodes[casella].innerText = this.countLimitrofi(casella);
            }            
        }

    }
    
    //CONTA IL NUMERO DI BOMBE LIMITROFE ALLA CASELLA TARGET
    countLimitrofi = (casella) => {
        let count = 0;
        if (this.controllaPosizione(casella) === 'lato top') {
            if (this.containerBomb.includes(casella + 20)) count += 1;
            if (this.containerBomb.includes(casella + 21)) count += 1;
            if (this.containerBomb.includes(casella + 19)) count += 1;
            if (this.containerBomb.includes(casella - 1)) count += 1;
            if (this.containerBomb.includes(casella + 1)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'lato sinistro') {
            if (this.containerBomb.includes(casella + 1)) count += 1;
            if (this.containerBomb.includes(casella + 20)) count += 1;
            if (this.containerBomb.includes(casella + 21)) count += 1;
            if (this.containerBomb.includes(casella - 20)) count += 1;
            if (this.containerBomb.includes(casella - 19)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'lato destro') {
            if (this.containerBomb.includes(casella - 1)) count += 1;
            if (this.containerBomb.includes(casella + 20)) count += 1;
            if (this.containerBomb.includes(casella - 21)) count += 1;
            if (this.containerBomb.includes(casella - 20)) count += 1;
            if (this.containerBomb.includes(casella + 19)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'lato bottom') {
            if (this.containerBomb.includes(casella + 1)) count += 1;
            if (this.containerBomb.includes(casella - 1)) count += 1;
            if (this.containerBomb.includes(casella - 20)) count += 1;
            if (this.containerBomb.includes(casella - 21)) count += 1;
            if (this.containerBomb.includes(casella - 19)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'angolo top sinistro') {
            if (this.containerBomb.includes(casella + 20)) count += 1;
            if (this.containerBomb.includes(casella + 1)) count += 1;
            if (this.containerBomb.includes(casella + 21)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'angolo top destro') {
            if (this.containerBomb.includes(casella + 20)) count += 1;
            if (this.containerBomb.includes(casella - 1)) count += 1;
            if (this.containerBomb.includes(casella + 19)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'angolo bottom sinistro') {
            
            if (this.containerBomb.includes(casella + 1)) count += 1;
            if (this.containerBomb.includes(casella - 20)) count += 1;
            if (this.containerBomb.includes(casella - 19)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'angolo bottom destro') {
            if (this.containerBomb.includes(casella - 1)) count += 1;
            if (this.containerBomb.includes(casella - 20)) count += 1;
            if (this.containerBomb.includes(casella - 21)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
        if (this.controllaPosizione(casella) === 'centro') {
            if (this.containerBomb.includes(casella + 1)) count += 1;
            if (this.containerBomb.includes(casella - 1)) count += 1;
            if (this.containerBomb.includes(casella + 20)) count += 1;
            if (this.containerBomb.includes(casella - 20)) count += 1;
            if (this.containerBomb.includes(casella + 21)) count += 1;
            if (this.containerBomb.includes(casella - 21)) count += 1;
            if (this.containerBomb.includes(casella + 19)) count += 1;
            if (this.containerBomb.includes(casella - 19)) count += 1;
            if (count === 0) {
                return 0;
            } else {
                return count;
            }
        }
    }

    //FUNZIONI ACCESSORIE
    piu1 = (casella) => {
        if (!this.containerCampo.childNodes[casella + 1].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella + 1]) {
                this.recursiveSelect(casella + 1);
            }
    }

    meno1 = (casella) => {
        if (!this.containerCampo.childNodes[casella - 1].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella - 1]) {
                this.recursiveSelect(casella - 1);
            }
    }

    piu20 = (casella) => {
        if (!this.containerCampo.childNodes[casella + 20].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella + 20]) {
                this.recursiveSelect(casella + 20);
            }
    }

    meno20 = (casella) => {
        if (!this.containerCampo.childNodes[casella - 20].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella - 20]) {
                this.recursiveSelect(casella - 20);
            }
    }

    piu21 = (casella) => {
        if (!this.containerCampo.childNodes[casella + 21].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella + 21]) {
                this.recursiveSelect(casella + 21);
            }
    }

    meno21 = (casella) => {
       if (!this.containerCampo.childNodes[casella - 21].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella - 21]) {
                this.recursiveSelect(casella - 21);
            } 
    }

    piu19 = (casella) => {
        if (!this.containerCampo.childNodes[casella + 19].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella + 19]) {
                this.recursiveSelect(casella + 19);
            }
    }

    meno19 = (casella) => {
        if (!this.containerCampo.childNodes[casella - 19].classList.contains('seagreen') && 
                !this.containerBomb.includes[casella - 19]) {
                this.recursiveSelect(casella - 19);
            }
    }


}