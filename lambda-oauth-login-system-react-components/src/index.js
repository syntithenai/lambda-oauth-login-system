import React, { Component } from 'react';
import LoginSystem from './LoginSystem';
import Login from './Login';
import Logout from './Logout';
import OAuth from './OAuth';
import Profile from './Profile';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import TermsOfUse from './TermsOfUse';
import LoginSystemContext from './LoginSystemContext';
import RegistrationConfirmation from './RegistrationConfirmation';
import ExternalLogin from './ExternalLogin';
import LoginSuccess from './LoginSuccess';
import DoConfirm from './DoConfirm';
import DoForgot from './DoForgot';

import {getCookie,getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers';
//export default LoginSystem;
export {DoConfirm, DoForgot, getCookie,getAxiosClient,getMediaQueryString,getCsrfQueryString, LoginSuccess, LoginSystem,Login,Logout,OAuth,Profile,Register,ForgotPassword, RegistrationConfirmation, TermsOfUse, LoginSystemContext, ExternalLogin} 

//
