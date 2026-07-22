document.addEventListener('DOMContentLoaded', () => {
    // State
    let headsLabel = '';
    let tailsLabel = '';
    let totalTosses = 0;
    let tossesLeft = 0;
    let headsScore = 0;
    let tailsScore = 0;
    
    // Screens
    const screenLoader = document.getElementById('screen-loader');
    const screenSetup1 = document.getElementById('screen-setup-1');
    const screenSetup2 = document.getElementById('screen-setup-2');
    const screenToss = document.getElementById('screen-toss');
    const screenFinal = document.getElementById('screen-final');

    function switchScreen(from, to) {
        from.classList.remove('active');
        setTimeout(() => {
            to.classList.add('active');
        }, 500); // match CSS transition duration
    }

    // Step 1: Initial Loader
    setTimeout(() => {
        switchScreen(screenLoader, screenSetup1);
    }, 3000);

    // Step 2: Form 1
    document.getElementById('btn-toss').addEventListener('click', () => {
        headsLabel = document.getElementById('heads-input').value.trim();
        tailsLabel = document.getElementById('tails-input').value.trim();
        
        if (!headsLabel || !tailsLabel) {
            alert('The Fates require both outcomes to be named.');
            return;
        }
        
        switchScreen(screenSetup1, screenSetup2);
    });

    // Step 3: Form 2
    document.getElementById('btn-lets-toss').addEventListener('click', () => {
        const inputTosses = parseInt(document.getElementById('tosses-input').value, 10);
        
        if (isNaN(inputTosses) || inputTosses < 1 || inputTosses % 2 === 0) {
            alert('You must provide an odd number of tosses, for the Fates abhor a tie.');
            return;
        }

        totalTosses = inputTosses;
        tossesLeft = totalTosses;
        
        document.getElementById('toss-count').textContent = tossesLeft;
        switchScreen(screenSetup2, screenToss);
    });

    // Step 4: Tossing Logic
    const coin = document.getElementById('coin');
    const tossResultText = document.getElementById('toss-result-text');
    const currentTossWinner = document.getElementById('current-toss-winner');
    const btnTossAgain = document.getElementById('btn-toss-again');
    const btnFinishToss = document.getElementById('btn-finish-toss');

    function performToss() {
        // Hide result text during toss
        tossResultText.classList.add('hidden');
        
        // Remove animation class if exists to re-trigger
        coin.style.transition = 'none';
        coin.style.transform = 'rotateY(0deg)';
        
        setTimeout(() => {
            coin.style.transition = 'transform 2s cubic-bezier(0.2, 0.8, 0.3, 1)';
            
            const isHeads = Math.random() > 0.5;
            
            // Randomize rotations, keeping parity for heads/tails
            const spins = 5; // 5 full rotations = 1800 deg
            let targetRotation = spins * 360;
            if (!isHeads) {
                targetRotation += 180; // Tails face
            }
            
            // The toss animation using inline styles instead of keyframes to dynamic rotation
            coin.style.transform = `rotateY(${targetRotation}deg)`;
            
            setTimeout(() => {
                // Toss finished
                tossesLeft--;
                document.getElementById('toss-count').textContent = tossesLeft;
                
                if (isHeads) {
                    headsScore++;
                    currentTossWinner.textContent = `Heads: ${headsLabel}`;
                } else {
                    tailsScore++;
                    currentTossWinner.textContent = `Tails: ${tailsLabel}`;
                }
                
                tossResultText.classList.remove('hidden');
                
                if (tossesLeft <= 0) {
                    btnTossAgain.classList.add('hidden');
                    btnFinishToss.classList.remove('hidden');
                }
            }, 2000); // wait for 2s coin animation
        }, 50);
    }
    
    // Initial toss when entering the screen
    let hasInitialTossed = false;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active') && !hasInitialTossed) {
                hasInitialTossed = true;
                performToss();
            }
        });
    });
    observer.observe(screenToss, { attributes: true, attributeFilter: ['class'] });

    btnTossAgain.addEventListener('click', performToss);

    // Step 5: Final Screen
    btnFinishToss.addEventListener('click', () => {
        switchScreen(screenToss, screenFinal);
        
        document.getElementById('final-heads-label').textContent = headsLabel;
        document.getElementById('final-tails-label').textContent = tailsLabel;
        document.getElementById('score-heads').textContent = headsScore;
        document.getElementById('score-tails').textContent = tailsScore;
        
        const ultimateWinner = headsScore > tailsScore ? `The Fates have chosen: ${headsLabel}` : `The Fates have chosen: ${tailsLabel}`;
        document.getElementById('ultimate-winner').textContent = ultimateWinner;
        
        fetchMagicianNote();
    });
    
    async function fetchMagicianNote() {
        const noteLoader = document.getElementById('note-loader');
        const noteElement = document.getElementById('magician-note');
        
        noteLoader.classList.remove('hidden');
        noteElement.classList.add('hidden');
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    feature: `Toss game between ${headsLabel} and ${tailsLabel}`,
                    headsLabel,
                    tailsLabel,
                    headsScore,
                    tailsScore,
                    totalTosses
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                noteElement.textContent = data.note;
            } else {
                noteElement.textContent = "Alas, the Magician's orb is clouded. No fate could be divined at this time.";
            }
        } catch (error) {
            console.error('Error fetching note:', error);
            noteElement.textContent = "The connection to the ethereal plane was severed. The Magician remains silent.";
        }
        
        noteLoader.classList.add('hidden');
        noteElement.classList.remove('hidden');
    }

    document.getElementById('btn-restart').addEventListener('click', () => {
        // Reset state
        totalTosses = 0;
        tossesLeft = 0;
        headsScore = 0;
        tailsScore = 0;
        hasInitialTossed = false;
        
        document.getElementById('toss-result-text').classList.add('hidden');
        document.getElementById('btn-toss-again').classList.remove('hidden');
        document.getElementById('btn-finish-toss').classList.add('hidden');
        document.getElementById('magician-note').textContent = '';
        
        switchScreen(screenFinal, screenSetup1);
    });
});
