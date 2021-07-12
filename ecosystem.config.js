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
  // silent error ?? - for now manual rebuild login example
  // cd ./lambda-oauth-login-system-example/react-login-example; npm run-script build
  , 
  {
    name: 'dev_client',
    cwd: './client',
    script: 'npm run-script build && while true; do sleep 100;  done',
    watch: ['./src','../lambda-oauth-login-system-react-components/dist/index.js']
  }
  , 
  {
    name: 'dev_exampleUI',
    cwd: './lambda-oauth-login-system-example/react-login-example',
    script: 'npm run-script build && while true; do sleep 100;  done',
    watch: './src'
  }
  ,{
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
