
export default (server: Whistle.PluginServer, options: Whistle.PluginOptions) => {
  server.on('request', (req: Whistle.PluginRequest, res: Whistle.PluginResponse) => {
    console.log('Class: , Function: , Line 4, Param: ', 'reqWrite.ts');
    req.pipe(res);
  });
};
