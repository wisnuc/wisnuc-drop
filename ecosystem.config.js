module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'wisnuc-drop',
      script    : 'src/bin/www',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_test : {
        NODE_ENV: 'test'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    test : {
      user : 'ubuntu',
      host : '118.89.152.59',
      ref  : 'origin/master',
      repo : 'https://www.github.com/mosaic101/wisnuc-drop.git',
      path : '/home/ubuntu/data',
      'pre-setup' : `echo 'commands or local script path to be run on the host before the setup process starts'`,
      'post-setup': `echo 'commands or a script path to be run on the host after cloning the repo'`,
      'post-deploy' : 'cnpm install && pm2 reload ecosystem.config.js --env test'
    }
  }
}
