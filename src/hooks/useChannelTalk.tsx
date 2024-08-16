'use client';
import React, { useEffect } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

const useChannelTalk = () => {
  useEffect(() => {
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: '9314d117-4756-4d97-8a35-895a898acbfd'
    });
  }, []);
};

export default useChannelTalk;