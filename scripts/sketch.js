document.getElementById('toggle').addEventListener('click', () => {
  toggleSound()
})

let minRed, maxRed, minGreen, maxGreen, minBlue, maxBLue

document.getElementById('minRed').addEventListener('input', (e) => {
  minRed = checkHzValue(e.target.value)
})
document.getElementById('maxRed').addEventListener('input', (e) => {
  maxRed = checkHzValue(e.target.value)
})
document.getElementById('minGreen').addEventListener('input', (e) => {
  minGreen = checkHzValue(e.target.value)
})
document.getElementById('maxGreen').addEventListener('input', (e) => {
  maxGreen = checkHzValue(e.target.value)
})
document.getElementById('minBlue').addEventListener('input', (e) => {
  minBlue = checkHzValue(e.target.value)
})
document.getElementById('maxBlue').addEventListener('input', (e) => {
  maxBlue = checkHzValue(e.target.value)
})

const checkHzValue = (value) => {
  return parseInt(value)
}
const setHzValue = () => {}

let tune, fft, button
let posX = 0,
  posY = 0,
  size = 15

let r = 0.1

let RING_SIZE

let width = window.innerWidth / 2
let height = window.innerHeight / 2

const toggleSound = () => {
  if (tune.isPlaying()) {
    tune.pause()
  } else {
    tune.play()
  }
}
function preload() {
  tune = loadSound('../cantkeepitin.mp3')
}
function setup() {
  let c = createCanvas(height, height, SVG)

  document.getElementById('canvas').appendChild(c.elt.wrapper)
  colorMode('RGB')

  // tune.play()
  // tune.loop()
  noFill()
  RING_SIZE = 1000000 / tune.buffer.length
  fft = new p5.FFT()
  console.log(tune)
}
function draw() {
  if (tune.isPlaying()) {
    fft.analyze()
    let red, green, blue
    if (minRed && maxRed) {
      red = fft.getEnergy(minRed, maxRed)
    } else {
      red = fft.getEnergy('bass')
    }
    if (minGreen && maxGreen) {
      green = fft.getEnergy(minGreen, maxGreen)
    } else {
      green = fft.getEnergy('mid')
    }
    if (minBlue && maxBlue) {
      blue = fft.getEnergy(minBlue, maxBlue)
    } else {
      blue = fft.getEnergy('treble')
    }

    strokeWeight(RING_SIZE)
    stroke(red, green, blue)
    // fill(red, green, blue)
    ellipse(height / 2, height / 2, r)
    r += RING_SIZE
    // rect(posX, posY, size, (size * 2) / 5)
    // posX += size
    // if (posX >= window.innerWidth) {
    //   posX = 0
    //   posY += size / 3
    // }
  }
}
