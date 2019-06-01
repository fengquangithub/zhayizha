const electron = require('electron')
const { app, BrowserWindow, Menu, Tray   } = electron
const config = require('./config.json')
const fs = require('fs')

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win
let appIcon
let timer

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 600,
    height: 300,
    frame:false,
    backgroundColor:"#00FFFFFF",
    transparent:true,
    skipTaskbar:true,
    resizable:false,
    movable:false,
    maximizable:false,
    alwaysOnTop:true,
    fullscreen:false,
    fullscreenable:false,
    show:false,
    backgroundThrottling:false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 加载index.html文件
  win.loadFile('index.html')

  // 打开开发者工具
//   win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })

  appIcon = new Tray(__dirname+'/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {
        label: '是否开启',
        type:'checkbox',
        checked:true,
        click(param){
            if(param.checked){
                starttimer()
            }else{
                win.hide()
                clearInterval(timer)
            }
        }
    },
    {
        type: 'separator'
    },
    {
        label:'1分钟',
        type:'radio',
        click(){
            config.timechecked = 2;
            config.time = 60000;
            fs.writeFileSync('./config.json',JSON.stringify(config))
            starttimer()
        }
    },
    {
        label:'2分钟',
        type:'radio',
        click(){
            config.timechecked = 3;
            config.time = 60000*2;
            fs.writeFileSync('./config.json',JSON.stringify(config))
            starttimer()
        }
    },
    {
        label:'5分钟',
        type:'radio',
        click(){
            config.timechecked = 4;
            config.time = 60000*5;
            fs.writeFileSync('./config.json',JSON.stringify(config))
            starttimer()
        }
    },
    {
        type: 'separator'
    },
    {
        role: 'quit',
        label: '退出程序'
    }
  ])

  // Make a change to the context menu
  contextMenu.items[config.timechecked].checked = true

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready',createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
    
  }
})

starttimer()

function starttimer(){
    clearInterval(timer)
    timer = setInterval(()=>{
        win.show();
        win.webContents.send('timetoaddclass', '')
        setTimeout(()=>{
            win.hide()
            win.webContents.send('timetoremoveclass', '!')
        },parseInt(config.hidetime))
    },parseInt(config.time))
}