let tune, fft, button, rawMusicFile
let posX = 0,
  posY = 0,
  size = 15

let r = 0.1
let count = 0
let RING_SIZE

let width = window.innerWidth / 2
let height = window.innerHeight / 2
let minRed, maxRed, minGreen, maxGreen, minBlue, maxBLue
const toggleBtn = document.getElementById('toggle')
const fastForwardBtn = document.getElementById('fastForward')
toggleBtn.addEventListener('click', () => {
  toggleSound()
})

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
document.getElementById('file').addEventListener('input', (e) => {
  setSourceFromFile(e.target.files[0])
})

const setSourceFromFile = (file) => {
  toggleBtn.disabled = true
  fastForwardBtn.disabled = true
  document.getElementById('fileLabel').innerHTML = file.name
  var fReader = new FileReader()
  fReader.readAsDataURL(file)
  fReader.onloadend = function (event) {
    rawMusicFile = event.target.result
    tune = new p5.SoundFile(event.target.result, () => {
      RING_SIZE = 1000000 / tune.buffer.length
      toggleBtn.disabled = false
      fastForwardBtn.disabled = false
    })
  }
}

const checkHzValue = (value) => {
  return parseInt(value)
}
const setHzValue = () => {}

const toggleSound = () => {
  if (tune.isPlaying()) {
    tune.pause()
    toggleBtn.innerHTML = 'Play'
  } else {
    toggleBtn.innerHTML = 'Pause'
    tune.play()
  }
}
function preload() {
  // tune = loadSound('../cantkeepitin.mp3')
  // rawMusicFile = '../cantkeepitin.mp3'
  // tune.setVolume(0.1)
}
function setup() {
  let c = createCanvas(width, height, SVG)

  document.getElementById('canvas').appendChild(c.elt.wrapper)
  colorMode('RGB')

  background(255)
  // tune.play()
  // tune.loop()
  noFill()
  RING_SIZE = 3000000 / tune.buffer.length
  strokeWeight(RING_SIZE)
  fft = new p5.FFT(0.8, 32)
}

function draw() {
  let spectrum = fft.analyze()
  if (tune.isPlaying() && count >= 6) {
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

    stroke(red, green, blue)

    ellipse(height / 2, height / 2, r)
    r += RING_SIZE

    count = 0

    // for (let i = 0; i < spectrum.length; i++) {
    //   const amp = spectrum[i]
    //   const y = map(amp, 0, 255, 100, 0)
    //   strokeWeight(3)
    //   line(height + i, height - 400, height + i, height - 400 + y)
    // }
  } else if (tune.isPlaying) {
    count++
  }

  // stroke(0)
}

function clearDiscus() {
  background(255)
}

function drawDiscus(colors, ringSize) {
  clearDiscus()
  let distance = ringSize
  strokeWeight(ringSize)
  for (let i = 0; i < colors.length; i += 5) {
    stroke(colors[i].red, colors[i].green, colors[i].blue)
    ellipse(height / 2, height / 2, distance)
    distance += ringSize

    // console.log(colors[i])
  }

  // stroke(0)
  console.log('done')
  // line(100, 200, 200, 200)
}

function fastForward() {
  let s = new Audio(rawMusicFile)
  s.addEventListener('loadedmetadata', async () => {
    // const colors = await
    console.log(RING_SIZE)
    fastRender(rawMusicFile, s.duration, RING_SIZE, drawDiscus)
  })
}

function saveImage(type) {
  save(`discus.${type}`)
}
