module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'wisnuc-drop',
      script    : './src/bin/www',
      env: {
        COMMON_VARIABLE: 'true'
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
    production : {
      user : 'ubuntu',
      host : '118.89.152.59',
      ref  : 'origin/master',
      repo : 'git@github.com:mosaic101/wisnuc-drop.git',
      path : '/home/ubuntu/data',
      'ssh_options': ['StrictHostKeyChecking=no', 'PasswordAuthentication=no'],
      'pre-setup' : 'apt-get install git',
      'post-setup': `echo 'commands or a script path to be run on the host after cloning the repo'`,
      'post-deploy' : 'cnpm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
}
