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

import {getCookie,getAxiosClient,getMediaQueryString,getCsrfQueryString} from './helpers';
//export default LoginSystem;
export {getCookie,getAxiosClient,getMediaQueryString,getCsrfQueryString, LoginSystem,Login,Logout,OAuth,Profile,Register,ForgotPassword, RegistrationConfirmation, TermsOfUse, LoginSystemContext, ExternalLogin} 

//
