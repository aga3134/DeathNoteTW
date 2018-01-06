
var g_APP = new Vue({
  el: "#app",
  data: {
  	curPage: 0,
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
        setTimeout(function(){
          var title = $("#pageGraph").children(".title");
          switch(this.curPage){
            case 2: title.text("生の章"); g_ChapterBirth.loadGraph(); break;
            case 3: title.text("老の章"); g_ChapterAging.loadGraph(); break;
            case 4: title.text("病の章"); g_ChapterDisease.loadGraph(); break;
            case 5: title.text("死の章"); g_ChapterDeath.loadGraph(); break;
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
    }
  }
});

window.addEventListener('load', function() {
  g_SvgAnim.InitAnim();
});

window.addEventListener('mousemove', function(e) {
  g_SvgAnim.EyeRollByMouse(e);
});