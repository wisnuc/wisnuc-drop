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
      instances : 'max',
      exec_mode : 'cluster',
      // start you app without no --env option, then the key named "env" will be used. 
      env: {
        NODE_ENV: 'test' 
      },
      env_test : {
        NODE_ENV: 'test'
      },
      env_production : {
        NODE_ENV: 'production'
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
      'post-deploy' : 'cnpm install && pm2 reload ecosystem.config.js --env test'
    },
    production : {
      user : 'ubuntu',
      host : ['122.152.208.97', '211.159.219.224'],
      ref  : 'origin/master',
      repo : 'https://www.github.com/wisnuc/wisnuc-drop.git',
      path : '/home/ubuntu/data',
      'post-deploy' : 'cnpm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
