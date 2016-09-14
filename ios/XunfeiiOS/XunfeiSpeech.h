//
//  XunfeiSpeech.h
//  XunfeiiOS
//
//  Created by guojicheng on 16/5/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "iflyMSC/iflyMSC.h"

#define APPID_VALUE @"5743f74a" 
#define ISE_FILE_NAME @"ise.pcm"

@class XunfeiReact;

@interface XunfeiSpeech : UIViewController<IFlySpeechEvaluatorDelegate>

@property (nonatomic,strong)IFlySpeechEvaluator *evaluatorIns;
@property (nonatomic, strong) NSString *pcmFilePath;//音频文件路径

-(void)startEvaluator:(NSDictionary *)infos xunfeiReact:(XunfeiReact*)xunfeiReact;
-(void)stopEvaluator;
-(void)cancelEvaluator;
-(void)playPcm;
-(void)stopPcm;


@property (nonatomic,retain)XunfeiReact* xunfeiReact;

@end
