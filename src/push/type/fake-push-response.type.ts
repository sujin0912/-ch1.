export type FakePushResponse = {
  resultCode: 100 | -1;
  resultData: {
    message: 'Success' | 'Failed';
    deviceId: string;
  };
};
