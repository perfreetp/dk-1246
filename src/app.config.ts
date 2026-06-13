export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/plan/index',
    'pages/checkin/index',
    'pages/stats/index',
    'pages/video/index',
    'pages/reminder/index',
    'pages/pet-detail/index',
    'pages/training-detail/index',
    'pages/certificate/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FF9B52',
    navigationBarTitleText': '宠物训练',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#B2BEC3',
    selectedColor: '#FF9B52',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/plan/index',
        text: '计划'
      },
      {
        pagePath: 'pages/checkin/index',
        text: '打卡'
      },
      {
        pagePath: 'pages/stats/index',
        text: '统计'
      },
      {
        pagePath: 'pages/reminder/index',
        text: '提醒'
      }
    ]
  }
})
