const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const fs = require('fs')
const path = require('path')

ipcRenderer.on('timetoaddclass',()=>{
   setTimeout(()=>{
        document.querySelector('img').classList.add('active')
   },500)
})

ipcRenderer.on('timetoremoveclass',()=>{
    document.querySelector('img').classList.remove('active')
})

// 暂时无用
function getScreenImage() {
    
    const screenSize = electron.screen.getPrimaryDisplay().workAreaSize
    const thumbSize = {
        width: screenSize.width,
        height: screenSize.height
    }
    let options = { types: ['window', 'screen'], thumbnailSize: thumbSize }
    electron.desktopCapturer.getSources(options, function (error, sources) {
      if (error) return console.log(error)
  
      sources.forEach(function (source) {
        if (source.name === 'Entire screen' || source.name === 'Screen 1') {
          const screenshotPath = path.join(__dirname, 'screenshot.png')
          fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function (error) {
            if (error) return console.log(error)
            let size = source.thumbnail.getSize()
            document.querySelector('.wrapper').style.background = 'url(screenshot.png) '+(size.width-window.outerWidth)/2+'px'+' '+(size.height-window.outerHeight)/2+'px';
          })
        }
      })
    })
 }