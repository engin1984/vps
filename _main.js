// bulma navbar, dark mode, dismissable message, klavye kısayolları ,modal, chessground, 


// ########## 
import "./_main.scss"

// ########## https://bulma.io/documentation/components/navbar/
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
  
      });
    });
  
  });

// ############ dark mode (ChatGPT)
const darkToggleBtn = document.getElementById('toggle-dark');

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  localStorage.setItem('darkmode', dark ? '1' : '0');
}

if (localStorage.getItem('darkmode') === '1') {
  applyTheme(true);
}

darkToggleBtn?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  applyTheme(!isDark);
});




// ############ https://bulma.io/documentation/components/message/

document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    const $notification = $delete.parentNode;

    console.log('Found delete button:', $delete);

    $delete.addEventListener('click', () => {
      console.log('Clicked delete');
      $notification.remove(); // Modern kullanım
    });
  });
});







// ############ klavye kısayolları
// H: Home, L: Login

document.addEventListener('keydown', (e) => {
  if (e.key === 'h') window.location.href = '/';
  if (e.key === 'l') window.location.href = '/login.html';
});


// ############ https://bulma.io/documentation/components/modal/

document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      closeAllModals();
    }
  });
});






// ############ 
import { Chessground } from 'chessground';
import { Chess } from 'chess.js';
import '/chessground.base.css';
import '/chessground.brown.css';
import '/chessground.cburnett.css';

window.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.getElementById('board');
  if (!boardElement) {
    console.error('Board element not found!');
    return;
  }

  const chess = new Chess();
  
  const fenDisplay = document.getElementById('fen-string');
  function updateFEN() {
    if (fenDisplay) fenDisplay.textContent = chess.fen();
  }
  
  const cg = Chessground(boardElement, {
    orientation: 'white',
    coordinates: true,
    highlight: {
      lastMove: true,
      check: true
    },
    animation: {
      enabled: true,
      duration: 300
    },
    draggable: {
      enabled: true
    },
    movable: {
      color: 'white',
      free: false,
      dests: getDests(),
      events: {
        after: onUserMove
      }
    }
  });

  function getDests() {
    const dests = new Map();
    const squares = [
      'a1','b1','c1','d1','e1','f1','g1','h1',
      'a2','b2','c2','d2','e2','f2','g2','h2',
      'a3','b3','c3','d3','e3','f3','g3','h3',
      'a4','b4','c4','d4','e4','f4','g4','h4',
      'a5','b5','c5','d5','e5','f5','g5','h5',
      'a6','b6','c6','d6','e6','f6','g6','h6',
      'a7','b7','c7','d7','e7','f7','g7','h7',
      'a8','b8','c8','d8','e8','f8','g8','h8'
    ];
    squares.forEach(sq => {
      const moves = chess.moves({ square: sq, verbose: true });
      if (moves.length) dests.set(sq, moves.map(m => m.to));
    });
    return dests;
  }

  function onUserMove(orig, dest) {
    const move = chess.move({ from: orig, to: dest });
    if (!move) return;
  
    updateFEN();
  
    cg.set({
      fen: chess.fen(),
      lastMove: [orig, dest], // 👈 highlight user move
      turnColor: 'black',
      movable: {
        color: null,
        dests: new Map()
      }
    });
  
    setTimeout(() => {
      const moves = chess.moves({ verbose: true });
      if (!moves.length) return;
  
      const aiMove = moves[Math.floor(Math.random() * moves.length)];
      const from = aiMove.from;
      const to = aiMove.to;
      chess.move(aiMove);
  
      updateFEN();
  
      cg.set({
        fen: chess.fen(),
        lastMove: [from, to], // 👈 highlight AI move
        turnColor: 'white',
        movable: {
          color: 'white',
          free: false,
          dests: getDests(),
          events: {
            after: onUserMove
          }
        }
      });
    }, 500);
  }
});



// ############