
import React, { Component } from 'react';
import {Link} from 'react-router-dom'

export default function TermsOfUse(props) {
	
			return  (
			 <div>
				<Link to={props.linkBase+ "/register"}><button  id="nav_register_button" className='btn btn-success' style={{float:'right', marginLeft:'3em'}} >
					 Register</button></Link>
				{props.showCloseButton && <button  id="close_button" className='btn btn-danger' style={{float:'right', marginLeft:'3em'}} onClick={function() {window.close()}}>
                         Close</button>}
                        
			 <div style={{textAlign:'center'}}>
			 <h2>Terms of Use/Privacy Policy</h2>
			 </div>
			<div className="termsofuse" style={{textAlign:'left'}} >
			
				<br/>
				
				<ol>
	<li><span ><strong>Agreement to be bound</strong></span>
	<ol>
	<li><span >By using our service you agree to be bound by the terms of agreement, which may change from time to time</span></li>
	</ol>
	</li>
	<li><span ><strong>Privacy</strong></span>
	<ol>
	<li><span >Your personal information such as name and email address will not be shared with anybody unless required by law. </span></li>
	<li><span >We will use your personal information only for the purpose of providing this service, for example by recording activity and performance on this site to provide analytics to users. </span></li>
	<li><span >We use cookies on this site, which you can reject through your browser settings.</span></li>
	</ol>
	</li>
	<li><span ><strong> Age limit</strong></span>
	<ol>
	<li><span >Children under the age of 13 may not create an account independent of their parent or guardian</span><span ></span></li>
	</ol>
	</li>
	<li><span ><strong>Intellectual property</strong></span>
	<ol>
	<li><span >The content on this site, including that contributed by users, is subject to a Creative Commons Licence (Attribution CC BY Version 4.0 (international licence)) (<a href="http://creativecommons.org.au/learn/licences/">see here</a>). This means that 'whenever a work is copied or redistributed ... the original creator (and any other nominated parties) must be credited and the source linked to.' </span></li>

	<li><span >The software used on this site is open source and subject to GNU General Public License version 3 (<a href="https://opensource.org">see here</a>)</span></li>
	</ol>
	</li>
	<li><span > <strong>Third-party content</strong></span>
	<ol>
	<li><span >This site imports content from third parties. This is not an endorsement of this material and we have no responsibility for any loss caused by reliance or access to third-party sites.</span></li>
	</ol>
	</li>
	<li><span > <strong>Third-party login</strong></span>
	<ol>
	<li><span >This site allows users to login using their social accounts with Google, Github, Facebook, Amazon and Twitter. This site collects and stores your name and email address from your social provider to allow our website to identify and login repeat users and  to send newsletters regarding website updates. We do not share this information with anyone unless required by law.</span></li>
	</ol>
	</li>
	<li><span > <strong>User conduct</strong></span>
	<ol>
	<li><span >You will not engage in conduct or contribute content that belongs to another party or is offensive, obscene, threatening, unlawful, defamatory, vilifying, inducing to violence, harassing, invasive of privacy, or discriminatory, solicitation or spam or private or confidential information or that jeopardises the operations of the site in any way or seek to gain unauthorised access to our servers or misuse the site to cause harm.</span></li>
	<li><span >We will endeavour to and reserve the right to remove content that breaches these terms as quickly as possible but we accept no liability for any harm suffered by exposure to or reliance on such content.</span></li>
	<li><span >We may preserve and disclose user content if required to do so by law.</span></li>
	</ol>
	</li>
	<li><span > <strong>Termination of Your Account</strong></span>
	<ol>
	<li><span >We may modify, suspend or delete your account and associated user content and block your access to the site if you breach these terms. </span></li>
	<li><span >You may request that your account be deleted at any time and we will comply in reasonable time.</span></li>
	<li><span >Termination of your account will not necessarily remove content you have contributed according to the terms in the preceding clause. </span></li>
	</ol>
	</li>
	<li><span > <strong>No Representations or Warranties</strong></span>
	<ol>
	<li><span >We do not guarantee that our services will always be available or free from bugs or viruses and the onus is on you to maintain current anti-virus software.</span></li>
	<li><span >We will endeavor to provide quality content, but make no guarantees to the ongoing quality or quantity of content, including premium content.</span></li>
	<li><span >We do not guarantee any warranties such as implied warranties of fitness for purpose or that this site will result in any improvement in your learning.</span></li>
	<li><span >We do not guarantee that the information on this site is accurate or up to date.</span></li>
	</ol>
	</li>
	<li><span > <strong>Limitation of Liability</strong></span>
	<ol>
	<li><span >Other than as required by law, we are not liable to you for any damages caused by use of or reliance on this site<br /></span></li>
	</ol>
	</li>
	<li><span > <strong>Indemnity</strong></span>
	<ol>
	<li><span >You agree to indemnify us from any loss or liability due to a claim brought by any third party arising from your user content or conduct.</span></li>
	</ol>
	</li>
	<li><span > <strong>Dispute resolution etc</strong></span>
	<ol>
	<li><span >These terms and the relationship between us and you are governed by the laws of Australia and subject to the exclusive jurisdiction of Australian courts, with the exception of injunctive relief in any jurisdiction in order to enforce our rights under these terms.</span></li>
	<li><span >If we fail to exercise or enforce any rights or provision of these terms, this does not constitute a waiver of such rights or provisions.</span></li>
	<li><span >If any provision of the terms are found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavour to give effect to the parties' intentions as reflected in the provision, and the other provisions of the terms remain in full force and effect.</span></li>
	<li><span >You agree that these terms represent the entire understanding between us and you and these terms supersede any previous agreements, promises, assurances, warranties, representations and understandings, whether written or oral, between us and you.</span></li>
	</ol>
	</li>
	</ol>
			</div></div>
	)



}
