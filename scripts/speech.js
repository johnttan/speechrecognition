$(function(){


  function getInfo(res, sub){
    res = res.trim();
    sub = sub.trim();
    console.log(res, sub)
    var url = 'http://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srprop=snippet&srlimit=100&srsearch=' + res;
    $.ajax(url, {
      dataType: 'JSONP',
      success: function(data){
        var totalHTML = '';
        var num = 0;
        data.query.search.forEach(function(el){
          var snip = el.snippet;
          if(res[res.length-1] === 's'){
            res = res.slice(0,res.length-1)
          }
          if(snip.indexOf(sub) >= 0 && snip.indexOf(res.charAt(0).toUpperCase() + res.slice(1)) >= 0 && num < 6){
            totalHTML += el.snippet;
            totalHTML += '<p></p>';
            num += 1;
          }
        })

        $('#results').html(totalHTML);
      }
    })
  };

  function processResults(res){
    console.log(res);
    getInfo(res[2], res[1]);
  };

  var recog = new webkitSpeechRecognition();
  recog.continuous = true;
  recog.interimResults = false;
  var started = false;
  var res = [];
  var i = 0;

  recog.onstart = function(e){
    started = true;
    console.log('started', e);
  };
  recog.onerror = function(e){
    console.log(e, 'error')
  };
  recog.onresult = function(e){
    for(i;i<e.results.length;i++){
      var temp = e.results[i][0].transcript;
      res = (temp.split(' '));
      console.log('got results', res);
      if(res.length >= 3){
        recog.stop();
      }
    }
  };
  recog.onend = function(e){
    started = false;
    console.log('ended');
    console.log(JSON.stringify(res));
    console.log('processing')
    processResults(res);
    res = [];
    i = 0;
  };


  function startButton(){
    if(started){
      recog.stop()
    }else{
      recog.start()
    }
  };

  $('#startButton').click(startButton);

  recog.start();
  // processResults(['what', 'are', 'organics'])
})