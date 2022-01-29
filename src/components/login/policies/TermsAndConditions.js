import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

const TermsAndConditions = ({
                                appName,
                                websiteName,
                                url,
                                email,
                                author
                            }) => {
    const privacyLink = `${url}/#/privacy`;
    return (<div>
        <h1>Terms and conditions of use</h1>
        <h2>Introduction</h2>
        <p>These terms and conditions
            apply between you, the User of this Website (including any sub-domains, unless expressly excluded by their
            own
            terms and conditions), and {author}, the owner and operator of
            this Website. Please read these terms and conditions carefully, as they affect your legal rights. Your
            agreement
            to comply with and be bound by these terms and conditions is deemed to occur upon your first use of the
            Website.
            If you do not agree to be bound by these terms and conditions, you should stop using the Website
            immediately. </p>
        <p>In these terms and conditions, <strong>User</strong> or <strong>Users</strong> means any
            third party
            that
            accesses the Website and is not either (i) employed
            by {author} and acting in the course of their employment or
            (ii) engaged as a consultant or otherwise providing services
            to {author} and accessing the Website in connection with the
            provision of such services.</p>
        <p>You must be at least 18 years of age to use this Website. By
            using the Website and agreeing to these terms and conditions, you represent and warrant that you are at
            least 18
            years of age.</p>
        <h2>Intellectual property and acceptable use</h2>
        <ol>
            <li>All Content included on the Website, unless uploaded by Users, is the property
                of {author}, our affiliates or other relevant third
                parties. In these terms and conditions, Content means any text, graphics, images, audio, video,
                software, data compilations, page layout, underlying code and software and any other form of information
                capable of being stored in a computer that appears on or forms part of this Website, including any such
                content uploaded by Users. By continuing to use the Website you acknowledge that such Content is
                protected by copyright, trademarks, database rights and other intellectual property rights. Nothing on
                this site shall be construed as granting, by implication, estoppel, or otherwise, any license or right
                to use any trademark, logo or service mark displayed on the site without the owner's prior written
                permission
            </li>
            <li>You may, for your own personal, non-commercial use only, do the following: <ol>
                <li>retrieve, display and view the Content on a computer screen</li>
                <li>print one copy of the Content</li>
            </ol>
            </li>
            <li>You must not otherwise reproduce, modify, copy, distribute or use for commercial purposes any Content
                without the written permission of {author}.
            </li>
        </ol>
        <h2>Prohibited use</h2>
        <ol>
            <li>You may not use the Website for any of the following purposes: <ol>
                <li>in any way which causes, or may cause, damage to the Website or interferes with any other person's
                    use or enjoyment of the Website;
                </li>
                <li>in any way which is harmful, unlawful, illegal, abusive, harassing, threatening or otherwise
                    objectionable or in breach of any applicable law, regulation, governmental order;
                </li>
                <li>making, transmitting or storing electronic copies of Content protected by copyright without the
                    permission of the owner.
                </li>
            </ol>
            </li>
        </ol>
        <div>
            <h2>Registration</h2>
            <ol>
                <li>You must ensure that the details provided by you on registration or at any time are correct and
                    complete.
                </li>
                <li>You must inform us immediately of any changes to the information that you provide when registering
                    by updating your personal details to ensure we can communicate with you effectively.
                </li>
                <li>We may suspend or cancel your registration with immediate effect for any reasonable purposes or if
                    you breach these terms and conditions.
                </li>
                <li>You may cancel your registration at any time by either deleting your account or informing us in
                    writing to the address at the end of
                    these terms and conditions. If you do so, you must immediately stop using the Website. Cancellation
                    or suspension of your registration does not affect any statutory rights.
                    <ol>
                        <li>By registering you agree that a masked version of your name and email address will be
                            retained by us in the event of your account being deleted; please refer to
                            the <NavLink to="/privacy">privacy policy</NavLink> for details
                        </li>
                    </ol>
                </li>
            </ol>
            <div>
                <h2>Password and security</h2>
                <ol>
                    <li>When you register on this Website, you will be asked to create a password, which you should keep
                        confidential and not disclose or share with anyone.
                    </li>
                    <li>If we have reason to believe that there is or is likely to be any misuse of the Website or
                        breach of security, we may require you to change your password or suspend your account.
                    </li>
                </ol>
            </div>
        </div>
        <div>
            <h2>Privacy Policy</h2>
            <ol>
                <li>Use of the Website is also governed by our Privacy Policy, which is incorporated into these terms
                    and conditions by this reference. To view the Privacy Policy, please click on the
                    following: <NavLink to={privacyLink}>{privacyLink}</NavLink>.
                </li>
            </ol>
        </div>
        <h2>Availability of the Website and disclaimers</h2>
        <ol>
            <li>Any online facilities, tools, services or information
                that {author} makes available through the Website
                (the <strong>Service</strong>) is provided "as is" and on an "as available" basis. We give no warranty
                that the
                Service will be free of defects and/or faults. To the maximum extent permitted by the law, we provide no
                warranties (express or implied) of fitness for a particular purpose, accuracy of information,
                compatibility and satisfactory quality. {author} is
                under no obligation to update information on the Website.
            </li>
            <li>Whilst {author} uses reasonable endeavours to ensure
                that the Website is secure and free of errors, viruses and other malware, we give no warranty or
                guaranty in that regard and all Users take responsibility for their own security, that of their personal
                details and their computers.
            </li>
            <li>{author} accepts no liability for any disruption or
                non-availability of the Website.
            </li>
            <li>{author} reserves the right to alter, suspend or
                discontinue any part (or the whole of) the Website including, but not limited to, any products and/or
                services available. These terms and conditions shall continue to apply to any modified version of the
                Website unless it is expressly stated otherwise.
            </li>
        </ol>
        <h2>Limitation of liability</h2>
        <ol>
            <li>Nothing in these terms and conditions will: (a) limit or exclude our or your liability for death or
                personal injury resulting from our or your negligence, as applicable; (b) limit or exclude our or your
                liability for fraud or fraudulent misrepresentation; or (c) limit or exclude any of our or your
                liabilities in any way that is not permitted under applicable law.
            </li>
            <li>We will not be liable to you in respect of any losses arising out of events beyond our reasonable
                control.
            </li>
            <li>To the maximum extent permitted by
                law, {author} accepts no liability for any of the
                following: <ol>
                    <li>any business losses, such as loss of profits, income, revenue, anticipated savings, business,
                        contracts, goodwill or commercial opportunities;
                    </li>
                    <li>loss or corruption of any data, database or software;</li>
                    <li>any special, indirect or consequential loss or damage.</li>
                </ol>
            </li>
        </ol>
        <h2>General</h2>
        <ol>
            <li>You may not transfer any of your rights under these terms and conditions to any other person. We may
                transfer our rights under these terms and conditions where we reasonably believe your rights will not be
                affected.
            </li>
            <li>These terms and conditions may be varied by us from time to time. Such revised terms will apply to the
                Website from the date of publication. Users should check the terms and conditions regularly to ensure
                familiarity with the then current version.
            </li>
            <li>These terms and conditions together with the Privacy Policy contain the whole agreement
                between the parties relating to its subject matter and supersede all prior discussions, arrangements or
                agreements that might have taken place in relation to the terms and conditions.
            </li>
            <li>The Contracts (Rights of Third Parties) Act 1999&nbsp;shall not apply to these terms and
                conditions and no third party will have any right to enforce or rely on any provision of these terms and
                conditions.
            </li>
            <li>If any court or competent authority finds that any provision of these terms and conditions (or part of
                any provision) is invalid, illegal or unenforceable, that provision or part-provision will, to the
                extent required, be deemed to be deleted, and the validity and enforceability of the other provisions of
                these terms and conditions will not be affected.
            </li>
            <li>Unless otherwise agreed, no delay, act or omission by a party in exercising any right or remedy will be
                deemed a waiver of that, or any other, right or remedy.
            </li>
            <li>This Agreement shall be governed by and interpreted according to the law
                of England and Wales and all disputes arising under the Agreement (including
                non-contractual disputes or claims) shall be subject to the exclusive jurisdiction of the English and
                Welsh courts.
            </li>
        </ol>
        <h2>{author} details </h2>
        <ol>
            <li>
                <p>You can contact {author} by email on <a href={`mailTo:${email}`}>{email}</a>. </p>
            </li>
        </ol>
        <h2>Attribution</h2>
        <ol>
            <li>These terms and conditions were created using a document from <a href="https://www.rocketlawyer.co.uk/">Rocket
                Lawyer</a> (https://www.rocketlawyer.co.uk).
            </li>
        </ol>
    </div>);
};
TermsAndConditions.propTypes = {
    appName: PropTypes.string,
    author: PropTypes.string,
    email: PropTypes.string,
    url: PropTypes.string,
    websiteName: PropTypes.string,
}
TermsAndConditions.defaultProps = {
    appName: "The App",
    author: "The Author",
    email: `info@${window.location.hostname}`,
    url: window.location.hostname,
    websiteName: "The website",
}
export default TermsAndConditions;