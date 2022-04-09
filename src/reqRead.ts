
export default (server: Whistle.PluginServer, options: Whistle.PluginOptions) => {
  server.on('request', (req: Whistle.PluginRequest, res: Whistle.PluginResponse) => {
    console.log('Class: , Function: , Line 4, Param: ', 'reqRead.ts');
    req.pipe(res);
  });
};
