
var g_APP = new Vue({
  el: "#app",
  data: {
  	curPage: 0,
    graphType: 1,
    optionType: 1,
    showRule: false,
    showGraph: false,
    showAbout: false
  },
  created: function () {
  	
  },
  methods: {
    UpdateGraph: function(){
      this.showRule = (this.curPage==1);
      this.showGraph = (this.curPage>1&&this.curPage<6);
      this.showAbout = (this.curPage==6);
      if(this.showGraph){
        setTimeout(function(){  //須先等dom元件更新後再處理畫面
          switch(this.curPage){
            case 2: g_ChapterBirth.loadGraph(this.graphType,this.optionType); break;
            case 3: g_ChapterAging.loadGraph(this.graphType,this.optionType); break;
            case 4: g_ChapterDisease.loadGraph(this.graphType,this.optionType); break;
            case 5: g_ChapterDeath.loadGraph(this.graphType,this.optionType); break;
          }
        }.bind(this),1);
      }
    },
    FlipPage: function(page){
      if(this.curPage == page) return;
      this.showRule = false;
      this.showGraph = false;
      this.showAbout = false;
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
          this.UpdateGraph();
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
          this.UpdateGraph();
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
          this.UpdateGraph();
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
      if(this.graphType == type) return;
      this.graphType = type;
      this.UpdateGraph();
    },
    ChangeOptionType: function(type){
      if(this.optionType == type) return;
      this.optionType = type;
      this.UpdateGraph();
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