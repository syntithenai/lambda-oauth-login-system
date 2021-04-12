module.exports = {
  apps : [
  {
    name: 'dev_serverroutes',
    cwd: './express-oauth-login-system-server',
    script: 'npm start',
  }
  , 
  {
    name: 'dev_components',
    cwd: './lambda-oauth-login-system-react-components',
    script: 'npm start',
  }
  , 
  {
    name: 'loginapi',
    cwd: './api',
    script: 'index.js',
    watch: '.'
  }
  , 
  {
    name: 'dbapi',
    cwd: './lambda-oauth-login-system-example',
    script: 'index.js',
    watch: ['./index.js']
  }
  , 
  {
    name: 'exampleUI',
    cwd: './lambda-oauth-login-system-example/react-login-example',
    script: 'npm start',
    watch: ['./index.js']
  }
  
  ]
};
