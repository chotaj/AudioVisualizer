const sound = document.getElementById('sound');
sound.src = 'mixkit-electric-whoosh-2596.wav'

const container = document.querySelector('#container');
const canvas = document.querySelector('#canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');
let audioSource;
let analyzer;

container.addEventListener('click', () => {
    
    const audioContext = new AudioContext();
    audioSource = audioContext.createMediaElementSource(sound);
    analyzer = audioContext.createAnalyser();
    
    /*connect audioSource node to the analyzer, then to
    whichever default audio rendering device the user has
    */
    audioSource.connect(analyzer);
    analyzer.connect(audioContext.destination);
    analyzer.fftSize = 256;
    sound.play();
    const bufferLength = analyzer.frequencyBinCount; //256 animated bars
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = (canvas.width)/bufferLength;
    let barHeight; 
    let x; 

    function animate() {
        x = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        //this will determine the height of each animated bar
        analyzer.getByteFrequencyData(dataArray);
        drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate); 
    }
animate();
});

function drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray){
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5;
        //Dynamically change colors based on frequencies of music
        context.save();
        context.translate(canvas.width / 2, canvas.height / 2); //center
        context.rotate(i + Math.PI / bufferLength);
        const hue = i * 3; 
        context.fillStyle = 'hsl(' + hue + ', 100%, 50%)'
        context.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        context.restore();
    }
    
}

