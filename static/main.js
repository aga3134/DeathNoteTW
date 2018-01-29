
var g_APP = new Vue({
  el: "#app",
  data: {
  	curPage: 0,
    graphType: 1,
    subGraphType: 1,
    optionType: 1,
    year: 0,
    showTimeBar: false,
    playTimer: null,
    showGraph: false,
  },
  created: function () {
  	
  },
  methods: {
    UpdateGraph: function(){
      this.showGraph = (this.curPage>0&&this.curPage<6);
      if(this.showGraph){
        Vue.nextTick(function () {  //須先等dom元件更新後再處理畫面
          switch(this.curPage){
            case 2: g_ChapterBirth.loadGraph(this); break;
            case 3: g_ChapterAging.loadGraph(this); break;
            case 4: g_ChapterDisease.loadGraph(this); break;
            case 5: g_ChapterDeath.loadGraph(this); break;
          }
        }.bind(this));
      }
    },
    FlipPage: function(page){
      if(this.curPage == page) return;
      this.showGraph = false;
      $('.death-note').attr("scrollTop", 0);

      var CoverOn = function(){
        $(".cover-top").css("width","calc(100% - 10px)");
        $("#coverContent").css("display","block");
        var btList = $("#coverButtonList");
        btList.children("img").css("opacity",0);
      }.bind(this);
      
      var CoverOff = function(){
        $(".cover-top").css("width","50px");
        $("#coverContent").css("display","none");
        setTimeout(function(){
          var btList = $("#coverButtonList");
          btList.children("img").css("opacity",1);
          this.ChangeGraphType(1);
        }.bind(this),500);
      }.bind(this);

      var PageOn = function(){
        var pageMove = $(".page-move");
        pageMove.css("width","0px");
        pageMove.css("display","block");
        setTimeout(function(){
          pageMove.css("width","100%");
        },1);
        setTimeout(function(){
          pageMove.css("display","none");
          this.ChangeGraphType(1);
        }.bind(this),500);
      }.bind(this);

      var PageOff = function(){
        var pageMove = $(".page-move");
        pageMove.css("width","100%");
        pageMove.css("display","block");
        setTimeout(function(){
          pageMove.css("width","0px");
        },1);
        setTimeout(function(){
          pageMove.css("display","none");
          this.ChangeGraphType(1);
        }.bind(this),500);
      }.bind(this);

      if(page == 0) CoverOn();
      else if(this.curPage == 0 && page > 0) CoverOff();
      else if(this.curPage > page) PageOn();
      else if(this.curPage < page) PageOff();

      $("#coverButtonList :nth-child("+(this.curPage+1)+")").removeClass("select");
      $("#coverButtonList :nth-child("+(page+1)+")").addClass("select");
      this.curPage = page;
      
    },
    ChangeGraphType: function(type){
      this.graphType = type;
      this.ChangeSubGraphType(1);
    },
    ChangeSubGraphType: function(type){
      this.subGraphType = type;
      this.ChangeOptionType(1);
    },
    ChangeOptionType: function(type){
      this.optionType = type;
      Vue.nextTick(function () {
        this.UpdateTimeBar();
        this.UpdateGraph();
      }.bind(this));
    },
    UpdateTimeBar: function(){
      var key = this.curPage+"-"+this.graphType+"-"+this.subGraphType+"-"+this.optionType;
      var barAttr = {};
      //生之章-人口分佈
      for(var i=1;i<=2;i++) barAttr["2-1-1-"+i] = {"min":1974,"max":2016};
      for(var i=1;i<=2;i++) barAttr["2-1-2-"+i] = {"min":1974,"max":2016};
      //生之章-婚姻狀況
      for(var i=1;i<=4;i++) barAttr["2-2-1-"+i] = {"min":2007,"max":2016};
      //生之章-出生統計
      for(var i=1;i<=2;i++) barAttr["2-3-1-"+i] = {"min":2007,"max":2016};
      for(var i=1;i<=2;i++) barAttr["2-3-2-"+i] = {"min":1999,"max":2016};
      //生之章-人口推估
      for(var i=1;i<=3;i++) barAttr["2-4-1-"+i] = {"min":2016,"max":2061};

      //死之章-一般死因
      for(var i=1;i<=2;i++) barAttr["5-1-1-"+i] = {"min":1992,"max":2016};
      for(var i=1;i<=2;i++) barAttr["5-2-1-"+i] = {"min":1992,"max":2016};

      if(key in barAttr){
        var attr = barAttr[key];
        this.showTimeBar = true;
        var slider = $("#timeRange");
        slider.attr("min",attr.min);
        slider.attr("max",attr.max);

        if(this.year < attr.min) this.year = attr.min;
        if(this.year > attr.max) this.year = attr.max;
      }
      else{
        this.showTimeBar = false;
      }
    },
    SubYear: function(){
      var slider = $("#timeRange");
      minYear = slider.attr("min");
      var update = false;
      if(this.year > minYear){
        this.year--;
        this.UpdateGraph();
        update = true;
      }
      return update;
    },
    ToggleYearPlay: function(){
      var playBt = $("#playBt");
      if(this.playTimer == null){
        playBt.attr("src","/static/Image/icon-pause.png");
        this.playTimer = setInterval(function(){
          var update = this.AddYear();
          if(!update){
            clearInterval(this.playTimer);
            this.playTimer = null;
            playBt.attr("src","/static/Image/icon-play.png");
          }
        }.bind(this),300);
      }
      else{
        clearInterval(this.playTimer);
        this.playTimer = null;
        playBt.attr("src","/static/Image/icon-play.png");
      }
    },
    AddYear: function(){
      var slider = $("#timeRange");
      maxYear = slider.attr("max");
      var update = false;
      if(this.year < maxYear){
        this.year++;
        this.UpdateGraph();
        update = true;
      }
      return update;
    }
  }
});

window.addEventListener('load', function() {
  g_SvgAnim.InitAnim();
});

window.addEventListener('mousemove', function(e) {
  g_SvgAnim.EyeRollByMouse(e);
});

window.addEventListener('resize', function(e) {
  g_APP.UpdateGraph();
});