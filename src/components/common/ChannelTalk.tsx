'use client';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { useEffect } from 'react';

const ChannelTalk = () => {
  useEffect(() => {
    ChannelService.loadScript();
    ChannelService.boot({
      pluginKey: '9314d117-4756-4d97-8a35-895a898acbfd'
    });
  }, []);

  return <></>;
};

export default ChannelTalk;
