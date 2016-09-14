/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';

var DPI = PixelRatio.get();

var faceIcon = [
  require('./img/1.png'),
  require('./img/2.png'),
  require('./img/3.png'),
];

var fileData = require('./data/data.json');

export default class PracticeInterface extends Component {
  constructor(props){
    console.log("data length: " + fileData.length);
    super(props);
    this.ise = props.ise;
    this.readIndex = 0;
    this.state = {
      read:fileData[this.readIndex].Msg,
      result:'识别结果',
      score:'',
      iconIdx:0,
      message:'点击话筒说话',
      isRecog:false,
      isInput:false,
    };
  }
  render() {
    return (
      <View style={styles.body}>
        <View style={styles.base}>
          <Text style={styles.title}>练习模式</Text>

          <View style={[styles.colDiv,styles.colDivRow]}>
            <View style={styles.cp}>
              {
                this.state.isInput ?
                <TextInput style={styles.input}
                  onChangeText={(text)=>this.setState({read:text})}
                  multiline={true}
                  selectTextOnFocus={true}
                  onEndEditing={this.MenuBack.bind(this)}></TextInput> :
                <Text style={styles.p}>{this.state.read}</Text>
              }
            </View>
            <View style={styles.img}>
              <TouchableOpacity onPress={this.PlayDemo.bind(this)}>
                <Image style={[styles.borderImg]}
                     source={require('./img/speak.png')}
                     resizeMode='contain' />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.clear}></View>

          <View style={styles.colDiv}>
            <View style={styles.cp}>
              <Text style={styles.p}>{this.state.result}</Text>
            </View>
          </View>

          <View style={styles.clear}></View>

          <View style={[styles.colDiv, styles.colDivRow, styles.view_result_height]}>
            <View style={styles.view_result}>
              <Text style={styles.score}>评分结果：</Text>
              <Text style={styles.score_n}>{this.state.score}</Text>
            </View>
            <View style={styles.img}>
              {
                this.state.isRecog ?
                <Image style={[styles.faceImg,styles.borderBottom]}
                   source={faceIcon[this.state.iconIdx]}
                   resizeMode='contain' /> :
                <Text></Text>
              }
            </View>
          </View>

          <View style={styles.record}>
            <TouchableOpacity onPress={this.Start.bind(this)}>
              <View style={styles.record_back}>
                <Image style={styles.record_img}
                     source={require('./img/record.png')}
                     resizeMode='contain' />
              </View>
            </TouchableOpacity>
            <Text style={styles.message}>{this.state.message}</Text>
          </View>

          <View style={[styles.colDiv, styles.bottom, styles.colDivRow]}>
            <TouchableOpacity onPress={this.LastDemo.bind(this)}>
              <Image style={[styles.bottom_img, styles.floatLeft, styles.borderBottom]}
                   source={require('./img/left.png')}
                   resizeMode='contain'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.MenuBack.bind(this)}>
              <Image style={[styles.bottom_img, styles.borderBottom]}
                   source={require('./img/menu.png')}
                   resizeMode='contain'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.NextDemo.bind(this)}>
              <Image style={[styles.bottom_img, styles.floatRight, styles.borderBottom]}
                  source={require('./img/right.png')}
                  resizeMode='contain'/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  Start(){
    this.setState({
      score:'',
      isRecog:false,
    });
    this.ise.Start(this.state.read, fileData[this.readIndex].Category);

    // this.TestStart();
  }
  TestStart(){
    var result = {
      'sentence':'今天天气很炎热',
      'total_score':100,
      'words':[
        [//今天
          {//今
            'shengmu':{'content':'j','wpp':'-1',},
            'yunmu':{'content':'in','wpp':'-1','tgpp':'-0.1',}
          },
          {//天
            'shengmu':{'content':'t','wpp':'-1',},
            'yunmu':{'content':'ian','wpp':'-1','tgpp':'-0.1',}
          },
        ],
        [//天气
          {//天
            'shengmu':{'content':'t','wpp':'-1',},
            'yunmu':{'content':'ian','wpp':'-1','tgpp':'-0.1',}
          },
          {//气
            'shengmu':{'content':'q','wpp':'-1',},
            'yunmu':{'content':'i','wpp':'-1','tgpp':'-0.1',}
          },
        ],
        [//很
          {//很
            'shengmu':{'content':'h','wpp':'-1',},
            'yunmu':{'content':'en','wpp':'-1','tgpp':'-0.1',}
          },
        ],
        [//炎热
          {//炎
            'shengmu':{'content':'y','wpp':'-1',},
            'yunmu':{'content':'an','wpp':'-1','tgpp':'-0.1',}
          },
          {//热
            'shengmu':{'content':'r','wpp':'-1',},
            'yunmu':{'content':'e','wpp':'-1','tgpp':'-0.1',}
          },
        ],
      ]
    };
    console.log(result.sentence);
    console.log(result.words);
    console.log(result.words[0]);
    console.log(result.words[0][0]);
    console.log(result.words[0][0].shengmu);
    console.log(result.words[0][0].shengmu.content);
    console.log(result.words[0][0].shengmu.wpp);
    //var obj = eval('(' + result + ')');
  }
  PlayDemo(){
    this.ise.PlayPcm();
  }
  LastDemo(){
    this.readIndex--;
    if (this.readIndex >= 0){
      this.setState({
        read:fileData[this.readIndex].Msg,
        result:'识别结果',
        score:'',
        isRecog:false,
      });
      this.ise.Cancel();
    }else {
      this.readIndex = 0;
    }
  }
  NextDemo(){
    this.readIndex++;
    if (this.readIndex < fileData.length){
      this.setState({
        read:fileData[this.readIndex].Msg,
        result:'识别结果',
        score:'',
        isRecog:false,
      })
      this.ise.Cancel();
    }else {
      this.readIndex = fileData.length - 1;
    }
  }
  MenuBack(){
    var input = !this.state.isInput;
    this.setState({
      isInput:input,
    });
  }
  iseCallback(result){
    var obj = eval('(' + result + ')');

    // console.log(obj.content);
    // console.log(obj.sentences);
    // console.log(obj.sentences[0].content);
    // console.log(obj.sentences[0].words);
    // console.log(obj.sentences[0].words[0]);
    // console.log(obj.sentences[0].words[0].content);
    // console.log(obj.sentences[0].words[0].syllables);
    // console.log(obj.sentences[0].words[0].syllables[0]);
    // console.log(obj.sentences[0].words[0].syllables[0].content);
    // console.log(obj.sentences[0].words[0].syllables[0].shengmu);
    // console.log(obj.sentences[0].words[0].syllables[0].shengmu.pContent);
    // console.log(obj.sentences[0].words[0].syllables[0].shengmu.wpp);

    var textResult = result;
    var isLost = false;
    var pointCount = 0;//总点数 = 字数X3；3表示声母，韵母，声调。详细规则可以再探讨
    var lostPoint = 0;
    textResult = '评测内容：' + obj.content + '， 总分：' + obj.total_score;
    if (fileData[this.readIndex].Category == 'read_syllable'){
      var syllable = obj.sentences[0].words[0].syllables[0];
      pointCount += 3;
      lostPoint += 3;

      textResult += ('， 声母得分:' + syllable.shengmu.wpp);
      textResult += ('， 韵母得分:'+ syllable.yunmu.wpp);
      textResult += ('， 声调得分:' + syllable.yunmu.tgpp + '\n');
      textResult += ('评测结果:');
      if (Math.abs(syllable.shengmu.wpp) > 2){
        textResult += '声母';
        isLost = true;
        lostPoint--;
      }
      if (Math.abs(syllable.yunmu.wpp) > 2){
        if (isLost){
          textResult += '、韵母';
        }else {
          textResult += '韵母'
        }
        isLost = true;
        lostPoint--;
      }
      if (Math.abs(syllable.yunmu.tgpp) > 1){
        if (isLost){
          textResult += '、声调';
        }else {
          textResult += '声调'
        }
        isLost = true;
        lostPoint--;
      }
      if (isLost){
        textResult += '读的不好';
      }else {
        textResult += '读的很标准';
      }
    }else if(fileData[this.readIndex].Category == 'read_word') {
      var word = obj.sentences[0].words[0];
      var tmpLost;
      for(var idx=0;idx<word.syllables.length;idx++) {
        var syllable = word.syllables[idx];
        if (syllable.pDpMessage == '正常') {
          textResult += ('\n' + syllable.content);
          tmpLost = false;
          pointCount += 3;
          lostPoint += 3;
          textResult += ('， 声:' + syllable.shengmu.wpp);
          textResult += ('， 韵:'+ syllable.yunmu.wpp);
          textResult += ('， 调:' + syllable.yunmu.tgpp);
          textResult += ('， 结果:');
          if (Math.abs(syllable.shengmu.wpp) > 2){
            textResult += '声母';
            tmpLost = true;
            lostPoint--;
          }
          if (Math.abs(syllable.yunmu.wpp) > 2){
            if (tmpLost){
              textResult += '、韵母';
            }else {
              textResult += '韵母'
            }
            tmpLost = true;
            lostPoint--;
          }
          if (Math.abs(syllable.yunmu.tgpp) > 1.6){
            if (tmpLost){
              textResult += '、声调';
            }else {
              textResult += '声调'
            }
            tmpLost = true;
            lostPoint--;
          }
          if (tmpLost){
            textResult += '读的不好';
            isLost = true;
          }else {
            textResult += '读的很标准';
          }
        }else if (syllable.pDpMessage == '漏读'){
          textResult += ('\n' + syllable.content);
          pointCount += 3;
          textResult += ('， 声:0， 韵:0， 调:0， 结果:' + syllable.pDpMessage);
        }else {
          textResult += ('\n此处朗读有' + syllable.pDpMessage + '现象！');
          if (syllable.pDpMessage == '增读') {
            lostPoint -= 1;
          }else if (syllable.pDpMessage == '回读') {
            lostPoint -= 1;
          }else if (syllable.pDpMessage == '替换') {
            lostPoint -= 1;
          }
        }
      }
    }else if (fileData[this.readIndex].Category == 'read_sentence') {
      var sentence = obj.sentences[0];
      for (var j=0;j<sentence.words.length;j++){
        var word = sentence.words[j];
        textResult += ('\n' + word.content);
        textResult += (': ' + word.pDpMessage);
        for(var idx=0;idx<word.syllables.length;idx++) {
          var syllable = word.syllables[idx];
          if (syllable.pDpMessage == '正常') {
            textResult += ('\n  ' + syllable.content);
            tmpLost = false;
            pointCount += 3;
            lostPoint += 3;
            textResult += ('， 声:' + syllable.shengmu.wpp);
            textResult += ('， 韵:'+ syllable.yunmu.wpp);
            textResult += ('， 调:' + syllable.yunmu.tgpp);
            textResult += ('， 结果:');
            if (Math.abs(syllable.shengmu.wpp) > 2){
              textResult += '声母';
              tmpLost = true;
              lostPoint--;
            }
            if (Math.abs(syllable.yunmu.wpp) > 2){
              if (tmpLost){
                textResult += '、韵母';
              }else {
                textResult += '韵母'
              }
              tmpLost = true;
              lostPoint--;
            }
            if (Math.abs(syllable.yunmu.tgpp) > 1){
              if (tmpLost){
                textResult += '、声调';
              }else {
                textResult += '声调'
              }
              tmpLost = true;
              lostPoint--;
            }
            if (tmpLost){
              textResult += '读的不好';
              isLost = true;
            }else {
              textResult += '读的很标准';
            }
          }else if (syllable.pDpMessage == '漏读'){
            textResult += ('\n  ' + syllable.content);
            pointCount += 3;
            textResult += ('， 声:0， 韵:0， 调:0， 结果:' + syllable.pDpMessage);
          }else {
            textResult += ('\n  此处朗读有' + syllable.pDpMessage + '现象！');
            if (syllable.pDpMessage == '增读') {
              lostPoint -= 1;
            }else if (syllable.pDpMessage == '回读') {
              lostPoint -= 1;
            }else if (syllable.pDpMessage == '替换') {
              lostPoint -= 1;
            }
          }
        }
      }
    }



    if (lostPoint < 0) lostPoint = 0;
    var icon = 0;
    var score = lostPoint / pointCount * 100;
    console.log("score: " + score);
    if (score >= 80){
      icon = 2;
    }else if (score >= 60){
      icon = 1;
    }else {
      icon = 0;
    }
    var scoreText = parseInt(score).toString() + "分";

    this.setState({
      iconIdx:icon,
      result:textResult,
      isRecog:true,
      score:scoreText,
    });
  }
  setTips(tips){
    this.setState({
      message:tips,
    });
  }
  Levenshtein(src, tgt){
    var strSrc = src.replace(/[`~!@#$%^&*()+=|{}':;',.<>/?~！@#¥%⋯⋯& amp;*（）——+|{}【】‘；：”“’。，、？|-]/g,"");
    var strTgt = tgt.replace(/[`~!@#$%^&*()+=|{}':;',.<>/?~！@#¥%⋯⋯& amp;*（）——+|{}【】‘；：”“’。，、？|-]/g,"");
    var bounds = { Height : strSrc.length + 1, Width : strTgt.length + 1 };
    var matrix = new Array(bounds.Height);
    for (var height = 0; height < bounds.Height; height++)
    {
        matrix[height] = new Array(bounds.Width);
        matrix[height][0] = height;
    }
    for (var width = 0; width < bounds.Width; width++)
    {
        matrix[0][width] = width;
    }

    for (var height = 1; height < bounds.Height; height++)
    {
        for (var width = 1; width < bounds.Width; width++)
        {
            var cost = (strSrc[height - 1] == strTgt[width - 1]) ? 0 : 1;
            var insertion = matrix[height][width - 1] + 1;
            var deletion = matrix[height - 1][width] + 1;
            var substitution = matrix[height - 1][width - 1] + cost;

            var distance = Math.min(insertion, Math.min(deletion, substitution));

            if (height > 1 && width > 1 && strSrc[height - 1] == strTgt[width - 2] && strSrc[height - 2] == strTgt[width - 1])
            {
                distance = Math.min(distance, matrix[height - 2][width - 2] + cost);
            }
            matrix[height][width] = distance;
        }
    }
    return 1 - matrix[bounds.Height - 1][bounds.Width - 1] / Math.max(strSrc.length, strTgt.length);
  }
}

const styles = StyleSheet.create({
  input:{
    flex:1,
    padding:5*DPI,
    fontSize:15*DPI,
  },
  bottom:{
    height:36*DPI,
    marginBottom:8*DPI,
    alignItems:'center',
    justifyContent:'space-between',
  },
  floatLeft:{
    marginLeft:10*DPI,
  },
  bottom_img:{
    width:30*DPI,
    height:30*DPI,
  },
  floatRight:{
    marginRight:10*DPI,
  },
  body:{
    flex:1,
    backgroundColor:'#eeeeee'
  },
  base:{
    flex:1,
    backgroundColor:'cornsilk',
    margin:10*DPI,
    borderRadius:10*DPI,
    borderWidth:5*DPI,
    borderColor:'#376a9c'
  },
  title:{
    padding:5*DPI,
    textAlign:'center',
    fontSize:25*DPI,
    color:'#5e5e5e',
    backgroundColor:'transparent',
  },
  colDiv:{
    backgroundColor:'#4183c4',
  },
  colDivRow:{
    flexDirection:'row',
  },
  cp:{
    backgroundColor:'#ddd',
    borderRadius:5*DPI,
    margin:5*DPI,
    flex:1,
  },
  p:{
    padding:5*DPI,
    backgroundColor:'transparent',
    fontSize:15*DPI,
  },
  img:{
    marginTop:2*DPI,
    marginBottom:2*DPI,
    marginRight:5*DPI,
    justifyContent: 'center',
  },
  width60:{
    width:60*DPI,
  },
  borderImg:{
    width:50*DPI,
    height:50*DPI,
    borderRadius:25*DPI,
  },
  borderBottom:{
    borderRadius:15*DPI,
  },
  clear:{
    height: 8*DPI,
  },
  faceImg:{
    width:30*DPI,
    height:30*DPI,
    marginRight:30*DPI,
  },
  view_result:{
    flex:1,
    flexDirection:'row',
  },
  view_result_height:{
    height:35*DPI,
  },
  score:{
    fontSize:20*DPI,
    width:100*DPI,
    margin:5*DPI,
    marginLeft:30*DPI,
  },
  score_n:{
    fontSize:20*DPI,
    width:60*DPI,
    marginTop:5*DPI,
    marginBottom:5*DPI,
  },
  record:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  record_back:{
    height:130*DPI,
    width:120*DPI,
    borderRadius:60*DPI,
    borderWidth:1*DPI,
    borderColor:'saddlebrown',
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
  },
  record_img:{
    backgroundColor:'transparent',
    height:120*DPI,
    width:110*DPI,
    borderRadius:55*DPI,
  },
  message:{
    color:'#909090',
    fontSize:15*DPI,
    marginTop:5*DPI,
  },
});
