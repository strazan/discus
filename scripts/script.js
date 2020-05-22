function fastRender(url, duration, ringSize, callback) {
  const context = new OfflineAudioContext(2, 44100 * duration, 44100)
  const source = context.createBufferSource()
  const analyser = context.createAnalyser()
  let colors = []
  analyser.fftSize = 64
  fetch(url)
    .then((res) => res.arrayBuffer())
    .then((res) => context.decodeAudioData(res))
    .then((buffer) => {
      source.buffer = buffer
      source.connect(analyser)
      analyser.connect(context.destination)
      source.start()
      const step = () => {
        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)
        // Do something with data
        let red = 0,
          green = 0,
          blue = 0

        for (i = 0; i < data.length; i++) {
          if (i < 10) {
            red += data[i]
            // console.log(data[i])
          } else if (i >= 10 && i < 20) {
            green += data[i]
          } else {
            blue += data[i]
          }
        }
        // console.log(red)
        colors.push({
          red: red ? red / 10 : 0,
          green: green ? green / 10 : 0,
          blue: blue ? blue / 11 : 0,
        })
        // console.log()

        if (context.currentTime <= source.buffer.duration) {
          context.suspend(context.currentTime + 0.01).then(() => {
            step()
            context.resume()
          })
        }
      }
      step()
      context.startRendering().then(() => {
        console.log('complete')

        callback(colors, ringSize)
      })
    })
    .then(() => {})
    .catch((err) => console.log(err))
}
