
/**
 * Generated by https://github.com/dsheiko/puppetry
 * on Wed Jun 23 2021 22:16:39 GMT+1000 (Australian Eastern Standard Time)
 * Suite: forgot password
 */

var nVer = process.version.match( /^v(\d+)/ );
if ( !nVer || nVer[ 1 ] < 9 ) {
  console.error( "WARNING: You have an outdated Node.js version " + process.version
    + ". You need at least v.9.x to run this test suite." );
}


const {
        bs, util, fetch, localStorage
      } = require( "../lib/bootstrap" )( "forgot--password" ),
      puppeteerOptions = require( "../puppeteer.config.json" ),
      devices = require( "puppeteer" ).devices;




jest.setTimeout( 50000 );

let consoleLog = [], // assetConsoleMessage
    dialogLog = []; // assertDialog;

bs.TARGETS = {};

// Environment variables
let ENV = {
  "BASE_URL": "http://localhost:3000",
  "SECRET": "aaa"
};

bs.TARGETS[ "BUTTON_CLASS_BTN_BTN_SUCCESS" ] = async () => await bs.query( "/html[1]/body[1]/div[1]/div[1]/nav[1]/div[1]/a[1]/button[1]", false, "BUTTON_CLASS_BTN_BTN_SUCCESS" );
bs.TARGETS[ "INPUT_ID_NAME" ] = async () => await bs.query( "#name", true, "INPUT_ID_NAME" );
bs.TARGETS[ "INPUT_ID_EMAIL" ] = async () => await bs.query( "#email", true, "INPUT_ID_EMAIL" );
bs.TARGETS[ "INPUT_ID_PASSWORD" ] = async () => await bs.query( "#password", true, "INPUT_ID_PASSWORD" );
bs.TARGETS[ "INPUT_ID_PASSWORD2" ] = async () => await bs.query( "#password2", true, "INPUT_ID_PASSWORD2" );
bs.TARGETS[ "BUTTON_CLASS_BTN_BTN_LG_BTN_SUCCESS_BTN_BLOCK" ] = async () => await bs.query( "/html[1]/body[1]/div[1]/div[1]/div[2]/div[1]/div[1]/form[1]/button[1]", false, "BUTTON_CLASS_BTN_BTN_LG_BTN_SUCCESS_BTN_BLOCK" );
bs.TARGETS[ "BUTTON_ID_NAV_LOGIN_BUTTON" ] = async () => await bs.query( "#nav_checking_button", true, "BUTTON_ID_NAV_LOGIN_BUTTON" );
bs.TARGETS[ "BUTTON_ID_SEND_RECOVERY_BUTTON" ] = async () => await bs.query( "#send_recovery_button", true, "BUTTON_ID_SEND_RECOVERY_BUTTON" );
bs.TARGETS[ "NAV_FORGOT_BUTTON" ] = async () => await bs.query( "#nav_forgot_button", true, "NAV_FORGOT_BUTTON" );

describe( "forgot password", () => {
  beforeAll(async () => {
    await bs.setup( puppeteerOptions, {"allure":false});
    await util.once(async () => {
      bs.browser && console.log( "BROWSER: ", await bs.browser.version() );
      await util.savePuppetterInfo( bs );
    });

    bs.page.on( "console", ( message ) => consoleLog.push( message ) );
    bs.page.on( "dialog", ( dialog ) => dialogLog.push( dialog ) );

    
    

    
  });

  afterAll(async () => {

    await bs.teardown();
  });


  describe( "Recorded session", () => {

    test( "Recorded test case {a279kq934vs7}", async () => {
      let result, assert, searchStr, localEnv;

      // Navigating to http://localhost:3000/
      bs.performance.reset();
      await bs.page.goto( "http://localhost:3000/", {"timeout":30000,"waitUntil":"domcontentloaded"} );
    

      // Defining browser viewport
      await bs.page.setViewport({
        width: 1648,
        height: 563,
        deviceScaleFactor: undefined,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
      });
  
      // Wait for CSS selector/Xpath to appear in page
      //await bs.page.waitForSelector( "#nav_login_button" );

      // Emulating mouse click
      await ( await bs.getTarget( "BUTTON_ID_NAV_LOGIN_BUTTON" ) ).click( {"button":"left"} );
      // Wait for CSS selector/Xpath to appear in page
      await bs.page.waitForSelector( "#nav_forgot_button" );

      // Emulating mouse click
      await ( await bs.getTarget( "NAV_FORGOT_BUTTON" ) ).click( {"button":"left","clickCount":1,"delay":0} );
      // Wait for CSS selector/Xpath to appear in page
      await bs.page.waitForSelector( "#email" );
      
      // Emulating user input
      await ( await bs.getTarget( "INPUT_ID_EMAIL" ) ).type( "jojojones@syntithenai.com" );
      // Wait for CSS selector/Xpath to appear in page
      await bs.page.waitForSelector( "#password" );
      
      // Emulating user input
      await ( await bs.getTarget( "INPUT_ID_PASSWORD" ) ).type( "aaa" );
      // Wait for CSS selector/Xpath to appear in page
      await bs.page.waitForSelector( "#password2" );
      
      // Emulating user input
      await ( await bs.getTarget( "INPUT_ID_PASSWORD2" ) ).type( "aaa" );
      // Wait for CSS selector/Xpath to appear in page
      await bs.page.waitForSelector( "#send_recovery_button" );

      // Emulating mouse click
      await ( await bs.getTarget( "BUTTON_ID_SEND_RECOVERY_BUTTON" ) ).click( {"button":"left"} );
    });

  });


});
