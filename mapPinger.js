on("ready",function(){
    on("change:campaign:playerpageid",function(){
        log("Here")
        setTimeout(function(){
            pingStartToken();
        },1500);
    });
    
    on("chat:message",function(msg){
        if(msg.type=="api" && msg.content.indexOf("!pingStart")==0){
            pingStartToken();
        }
    });
    
        on("chat:message",function(msg){
        if(msg.type=="api" && msg.content.indexOf("!pingStartDelay")==0){
        setTimeout(function(){
            pingStartToken();
        },1500);
        }
    });
    
    function pingStartToken(){
        var tokens = findObjs({
            _name:"PlayerStart",
            _type:"graphic",
            _pageid:Campaign().get("playerpageid")
        });
        var playerStartToken = tokens[0];
        if (playerStartToken===undefined){
            return;
        }
        sendPing(playerStartToken.get("left"),playerStartToken.get("top"),playerStartToken.get("pageid"),"",true);
    }
});
