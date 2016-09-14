//
//  XunfeiSpeech.m
//  XunfeiiOS
//
//  Created by guojicheng on 16/5/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "XunfeiSpeech.h"

#import "RCTConvert.h"
#import "XunfeiReact.h"
#import "ISEResultXmlParser.h"
#import "ISEResult.h"
#import "PcmPlayer.h"
#import "PcmPlayerDelegate.h"

@interface XunfeiSpeech() <ISEResultXmlParserDelegate, PcmPlayerDelegate>

@property (nonatomic, strong) NSString* resultXml;
@property (nonatomic, strong) NSString* resultText;
@property (nonatomic, retain) PcmPlayer* pcmPlayer;
@property (nonatomic, retain) NSDictionary* dicInfos;

@end

@implementation XunfeiSpeech

-(instancetype)init {
  self = [super init];
  
  [IFlySetting showLogcat:NO];
  
  NSString *initString = [[NSString alloc] initWithFormat:@"appid=%@", APPID_VALUE];
  //所有服务启动前，需要确保执行createUtility
  [IFlySpeechUtility createUtility:initString];
  
  //创建评测对象
  _evaluatorIns = [IFlySpeechEvaluator sharedInstance];
  _evaluatorIns.delegate = self;
  
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
  NSString *cachePath = [paths objectAtIndex:0];
  _pcmFilePath = [[NSString alloc] initWithFormat:@"%@",[cachePath stringByAppendingPathComponent:ISE_FILE_NAME]];
  
  return self;
}

-(void)setEvaluator:(NSDictionary *)infos
{
  _dicInfos = infos;
  //设置训练参数
  //清空参数
  [_evaluatorIns setParameter:@"" forKey:[IFlySpeechConstant PARAMS]];
  
  //设置评测采样率
//  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"SAMPLE_RATE"]] forKey:[IFlySpeechConstant SAMPLE_RATE]];
  [_evaluatorIns setParameter:@"16000" forKey:[IFlySpeechConstant SAMPLE_RATE]];
  //设置评测题目编码，如果是utf-8格式，请添加bom头，添加方式可参考demo
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"TEXT_ENCODING"]] forKey:[IFlySpeechConstant TEXT_ENCODING]];
  //设置评测题目结果格式，目前仅支持xml
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"ISE_RESULT_TYPE"]] forKey:[IFlySpeechConstant ISE_RESULT_TYPE]];
  //设置评测前端点超时，默认5000ms
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"VAD_BOS"]] forKey:[IFlySpeechConstant VAD_BOS]];
  //设置评测后端点超时，默认1800ms
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"VAD_EOS"]] forKey:[IFlySpeechConstant VAD_EOS]];
  //设置评测前端点 评测题型，可选值：read_syllable（单字，汉语专有）、read_word（词语）、read_sentence（句子）
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"ISE_CATEGORY"]] forKey:[IFlySpeechConstant ISE_CATEGORY]];
  //设置评测语言，可选值：en_us（英语）、zh_cn（汉语）
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"LANGUAGE"]] forKey:[IFlySpeechConstant LANGUAGE]];
  //设置评测结果级别，可选值：plain（仅英文）、complete，默认为complete
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"ISE_RESULT_LEVEL"]] forKey:[IFlySpeechConstant ISE_RESULT_LEVEL]];
  //设置评测超时，录音超时，录音达到时限时自动触发vad，停止录音，默认-1（无超时）
  [_evaluatorIns setParameter:[RCTConvert NSString:infos[@"SPEECH_TIMEOUT"]] forKey:[IFlySpeechConstant SPEECH_TIMEOUT]];
  //设置评测录音保存路径
  [_evaluatorIns setParameter:ISE_FILE_NAME forKey:[IFlySpeechConstant ISE_AUDIO_PATH]];
}

-(void)startEvaluator:(NSDictionary *)infos xunfeiReact:(XunfeiReact*)xunfeiReact
{
  _xunfeiReact = xunfeiReact;
  //设置评测参数
  [self setEvaluator:infos];
  
//  [_evaluatorIns setParameter:@"" forKey:[IFlySpeechConstant PARAMS]];
//  [_evaluatorIns setParameter:@"16000" forKey:[IFlySpeechConstant SAMPLE_RATE]];
//  [_evaluatorIns setParameter:@"utf-8" forKey:[IFlySpeechConstant TEXT_ENCODING]];
//  [_evaluatorIns setParameter:@"xml" forKey:[IFlySpeechConstant ISE_RESULT_TYPE]];
//  [_evaluatorIns setParameter:@"5000" forKey:[IFlySpeechConstant VAD_BOS]];
//  [_evaluatorIns setParameter:@"1800" forKey:[IFlySpeechConstant VAD_EOS]];
//  [_evaluatorIns setParameter:@"read_word" forKey:[IFlySpeechConstant ISE_CATEGORY]];
//  [_evaluatorIns setParameter:@"zh_cn" forKey:[IFlySpeechConstant LANGUAGE]];
//  [_evaluatorIns setParameter:@"complete" forKey:[IFlySpeechConstant ISE_RESULT_LEVEL]];
//  [_evaluatorIns setParameter:@"10000" forKey:[IFlySpeechConstant SPEECH_TIMEOUT]];
//  [_evaluatorIns setParameter:@"ise.pcm" forKey:[IFlySpeechConstant ISE_AUDIO_PATH]];
 
  NSMutableData* buffer = nil;
  //中文utf8 需要添加bom头才可以
  Byte bomHeader[] = {0xEF, 0xBB, 0xBF};
  buffer = [NSMutableData dataWithBytes:bomHeader length:sizeof(bomHeader)];
  [buffer appendData:[[RCTConvert NSString:infos[@"TEXT"]] dataUsingEncoding:NSUTF8StringEncoding]];
//  [buffer appendData:[@"你好" dataUsingEncoding:NSUTF8StringEncoding]];
  
  //开始录音评测
  [_evaluatorIns startListening:buffer params:nil];
  
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_START];
}

-(void)stopEvaluator
{
  [_evaluatorIns stopListening];
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_STOP];
}

-(void)cancelEvaluator
{
  [_evaluatorIns cancel];
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_STOP];
}

-(void)playPcm
{
  _pcmPlayer = [[PcmPlayer alloc] initWithFilePath:_pcmFilePath sampleRate:16000];
  _pcmPlayer.delegate = self;
  [_pcmPlayer play];
}

-(void)stopPcm
{
  if (_pcmPlayer){
    [_pcmPlayer stop];
  }
  _pcmPlayer = nil;
}



#pragma mark - IFlySpeechEvaluatorDelegate
/*!
 * 音量和数据回调 *
 * @param volume 音量
 * @param buffer 音频数据 */
- (void)onVolumeChanged:(int)volume buffer:(NSData *)buffer
{
//  NSLog(@"volume：%d", volume);
  [_xunfeiReact iseVolume:[NSString stringWithFormat:@"%d",volume]];
}


/*!
 * 开始录音回调
 * 当调用了`startListening`函数之后,如果没有发生错误则会回调此函数。如果发
 生错误则回调onError:函数 */
- (void)onBeginOfSpeech
{
  NSLog(@"start record");
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_WORK];
}


/*!
 * 停止录音回调
 * 当调用了`stopListening`函数或者引擎内部自动检测到断点,如果没有发生错
 误则回调此函数。
 * 如果发生错误则回调onError:函数 */
- (void)onEndOfSpeech
{
  NSLog(@"stop record");
  [_xunfeiReact iseCallback:CB_CODE_STATUS result:SPEECH_RECOG];
}


/*!
 * 正在取消 */
- (void)onCancel
{
  NSLog(@"on cancel");
}


/*!
 * 评测错误回调
 * 在进行语音评测过程中的任何时刻都有可能回调此函数,你可以根据
 errorCode进行相应的处理.
 * 当errorCode没有错误时,表示此次会话正常结束,否则,表示此次会话有错误
 发生。特别的当调用
 * `cancel`函数时,引擎不会自动结束,需要等到回调此函数,才表示此次会话结
 束。在没有回调此函
 * 数之前如果重新调用了`startListenging`函数则会报错误。 *
 * @param errorCode 错误描述类 */
- (void)onError:(IFlySpeechError *)errorCode
{
  if (errorCode && errorCode.errorCode != 0){
    NSLog(@"error:%d %@", errorCode.errorCode,errorCode.errorDesc);
    
    [_xunfeiReact iseCallback:CB_CODE_ERROR
                       result:[NSString stringWithFormat:@"%d_%@",errorCode.errorCode,errorCode.errorDesc]];
  }
}


/*!
 * 评测结果回调
 * 在评测过程中可能会多次回调此函数,你最好不要在此回调函数中进行界面的
 更改等操作,只需要将回调的结果保存起来。
 *
 * @param results -[out] 评测结果。
 * @param isLast -[out] 是否最后一条结果 */
- (void)onResults:(NSData *)results isLast:(BOOL)isLast{
  if (results){
    NSString *showText = @"";
    
    const char* chResult= [results bytes];
    
    BOOL isUTF8=[[_evaluatorIns parameterForKey:[IFlySpeechConstant RESULT_ENCODING]]isEqualToString:@"utf-8"];
    NSString* strResults=nil;
    if(isUTF8){
      strResults=[[NSString alloc] initWithBytes:chResult length:[results length] encoding:NSUTF8StringEncoding];
    }else{
      NSLog(@"result encoding: gb2312");
      NSStringEncoding encoding = CFStringConvertEncodingToNSStringEncoding(kCFStringEncodingGB_18030_2000);
      strResults = [[NSString alloc] initWithBytes:chResult length:[results length] encoding:encoding];
    }
    if(strResults){
      showText = [showText stringByAppendingString:strResults];
    }
    if (isLast){
      self.resultXml = showText;
//      NSLog(@"%@",showText);
      
      ISEResultXmlParser* parser = [[ISEResultXmlParser alloc] init];
      parser.delegate = self;
      [parser parserXml:self.resultXml];
    }
  }else{
    if (isLast){
      NSLog(@"你好像没有说话哦");
    }
  }
}


#pragma mark - ISEResultXmlParserDelegate
-(void)onISEResultXmlParser:(NSXMLParser *)parser Error:(NSError*)error{
  
}

-(void)onISEResultXmlParserResult:(ISEResult*)result{
  _resultText = [result toString];
  [_xunfeiReact iseCallback:CB_CODE_RESULT result:_resultText];
}


#pragma mark - PcmPlayerDelegate
//播放音频结束
-(void)onPlayCompleted {
  [_xunfeiReact playCallback:@"4"];
}

@end
