import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  NativeModules,
} from 'react-native';

import PracticeInterface from './PracticeInterface';

var XunfeiReact = NativeModules.XunfeiReact;
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class BaiduASR extends Component{
  listener = null;
  pcmListener = null;
  speechStatus = XunfeiReact.SPEECH_STOP;
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.listener = RCTDeviceEventEmitter.addListener('iseCallback', this.iseCallback.bind(this));
    this.pcmListener = RCTDeviceEventEmitter.addListener('playCallback', this.playCallback.bind(this));
  }
  componentWillUnmount(){
    this.listener.remove();
    this.pcmListener.remove();
  }
  iseCallback(data){
    if (data.code == XunfeiReact.CB_CODE_RESULT){
      this.refs.child.iseCallback(data.result);
      this.refs.child.setTips('点击话筒开始说话');
      this.speechStatus = XunfeiReact.SPEECH_STOP;
    }
    else if (data.code == XunfeiReact.CB_CODE_ERROR){
      this.refs.child.setTips(data.result);
      this.speechStatus = XunfeiReact.SPEECH_STOP;
    }
    else if (data.code == XunfeiReact.CB_CODE_STATUS){
      if (data.result == XunfeiReact.SPEECH_START){
        this.refs.child.setTips('正在倾听...');
      }else if (data.result == XunfeiReact.SPEECH_WORK){
        this.refs.child.setTips('正在倾听...');
      }else if (data.result == XunfeiReact.SPEECH_STOP){
        this.refs.child.setTips('点击话筒开始说话');
      }else if (data.result == XunfeiReact.SPEECH_RECOG){
        this.refs.child.setTips('正在分析...');
      }
      this.speechStatus = data.result;
    }
    else {
      console.log(data.result);
    }
  }
  Start(msg, category){
    if (this.speechStatus == XunfeiReact.SPEECH_STOP){
      this.refs.child.setTips('正在倾听...');
      var startInfo = {
        TEXT_ENCODING:'utf-8',
        ISE_RESULT_TYPE:'xml',
        VAD_BOS:'5000',//静音超时时间，即用户多长时间不说话则当做超时处理vad_bos 毫秒 ms
        VAD_EOS:'1800',//后端点静音检测时间，即用户停止说话多长时间内即认为不再输入，自动停止录音 毫秒 ms
        ISE_CATEGORY:category,//read_syllable（单字，汉语专有）、read_word（词语）、read_sentence（句子）
        LANGUAGE:'zh_cn',//en_us（英语）、zh_cn（汉语）
        ISE_RESULT_LEVEL:'complete',
        SPEECH_TIMEOUT:'10000',//录音超时，录音达到时限时自动触发vad，停止录音，默认-1（无超时）
        TEXT:msg,//需要评测的内容
      };
      XunfeiReact.start(startInfo);
    }else if (this.speechStatus == XunfeiReact.SPEECH_WORK){
      this.refs.child.setTips('正在分析...');
      XunfeiReact.stop();
    }else if (this.speechStatus == XunfeiReact.SPEECH_START){
      this.Cancel();
    }else if (this.speechStatus == XunfeiReact.SPEECH_RECOG){
      this.refs.child.setTips('正在分析...');
      XunfeiReact.stop();
    }
  }
  Cancel(){
    if (this.speechStatus != XunfeiReact.SPEECH_STOP){
      this.refs.child.setTips('点击话筒开始说话');
      XunfeiReact.cancel();
      this.speechStatus = XunfeiReact.SPEECH_STOP;
    }
  }
  PlayPcm(){
    XunfeiReact.playPcm();
  }
  playCallback(data){
    if (data.status == '4'){
      console.log('play over!');
    }
  }
  render(){
    return (
      <PracticeInterface ise={this} ref='child'></PracticeInterface>
    );
  }
}
