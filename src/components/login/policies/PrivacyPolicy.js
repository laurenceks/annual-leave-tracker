const PrivacyPolicy = ({
                           appName,
                           websiteName,
                           url,
                           email
                       }) => {
    return (<div>
        <h1>Privacy Policy for {appName}</h1>

        <p>At {websiteName}, accessible from {url}, one of our main priorities is the privacy of our visitors. This
            Privacy Policy document contains types of information that is collected and recorded
            by {websiteName} and how we use it.</p>

        <p>If you have additional questions or require more information about our Privacy Policy,
            do not hesitate to <a href={`mailto:${email}`}>contact us</a>.</p>

        <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with
            regards to the information that they shared and/or collect in {websiteName}. This policy is not
            applicable to any information collected offline or via channels other than this website. Our Privacy
            Policy was created with the help of the <a href="https://www.privacypolicygenerator.info">Free Privacy
                Policy Generator</a>.</p>

        <h2>Consent</h2>

        <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

        <h2>Information we collect</h2>

        <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it,
            will be made clear to you at the point we ask you to provide your personal information.</p>
        <p>If you <a href={`mailto:${email}`}>contact us</a> directly, we may receive additional information about you
            such as your name, email
            address, phone number, the contents of the message and/or attachments you may send us, and any other
            information you may choose to provide.</p>
        <p>When you register for an Account, we ask for your contact information, including your full name, email
            address and organisation amongst other details. A full list of the personal data we collect is below.</p>

        <ul>
            <li>Your name</li>
            <li>Your email address</li>
            <li>The organisation you currently work for</li>
            <li>Your pay grade (as defined by your organisational admins)</li>
            <li>Your location of work (as defined by your organisational admins)</li>
            <li>The dates on which you are applying for annual leave, including the number of hours</li>
            <li>Your IP address and other technical data</li>
        </ul>

        <h2>How we use your information</h2>

        <p>We use the information we collect in various ways, including to:</p>

        <ul>
            <li>Provide, operate, and maintain our website</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer
                service, to provide you with updates and other information relating to the website
            </li>
            <li>Send you functional emails e.g. address verification</li>
            <li>Find and prevent fraud and other security concerns</li>
        </ul>

        <p>Please note this list is not exhaustive.</p>

        <h2>Why we collect this information</h2>

        <p>The specific personal information we collect is used to</p>

        <ul>
            <li>Your name
                <ul>
                    <li>To identify you on the system</li>
                </ul>
            </li>
            <li>Your email address
                <ul>
                    <li>To enable you to register</li>
                    <li>To enable you to log in</li>
                    <li>To provide a means of contacting you about your account</li>
                </ul>
            </li>
            <li>The organisation you currently work for
                <ul>
                    <li>To ensure you are linked to the correct organisation group</li>
                </ul>
            </li>
            <li>Your pay grade
                <ul>
                    <li>To allow managers to make decisions about leave requests</li>
                </ul>
            </li>
            <li>Your location of work
                <ul>
                    <li>To allow managers to make decisions about leave requests</li>
                </ul>
            </li>
            <li>The dates on which you are applying for annual leave, including the number of hours
                <ul>
                    <li>To allow managers to make decisions about leave requests</li>
                </ul>
            </li>
            <li>Your IP address and other technical data
                <ul>
                    <li>To provide essential security</li>
                    <li>To provide analytics on the website's usage</li>
                </ul>
            </li>
        </ul>

        <h2>Log Files</h2>

        <p>{websiteName} follows a standard procedure of using log files. These files log visitors when they visit
            websites. All hosting companies do this and a part of hosting services' analytics. The information
            collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider
            (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not
            linked to any information that is personally identifiable. The purpose of the information is for
            analyzing trends, administering the site, tracking users' movement on the website, and gathering
            demographic information.</p>

        <h2>Cookies and Web Beacons</h2>

        <p>Like any other website, {websiteName} uses 'cookies'. These cookies are used to store information
            including visitors' preferences, and the pages on the website that the visitor accessed or visited. The
            information is used to optimize the users' experience by customizing our web page content based on
            visitors' browser type and/or other information.</p>

        <p>The cookies we user are strictly functional in nature to enable normal operation of the website e.g. managing
            log in sessions. <strong>We do not track visitors across websites or use targeted advertising.</strong></p>

        <p>For more general information on cookies, please read <a
            href="https://www.generateprivacypolicy.com/#cookies">the Cookies article on Generate Privacy Policy
            website</a>.</p>


        <h2>Third Party Privacy Policies</h2>

        <p>{websiteName}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you
            to consult the respective Privacy Policies of these third-party servers for more detailed
            information. It may include their practices and instructions about how to opt-out of certain
            options.</p>

        <p>You can choose to disable cookies through your individual browser options. To know more detailed
            information about cookie management with specific web browsers, it can be found at the browsers'
            respective websites.</p>

        <h2>CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>

        <p>Under the CCPA, among other rights, California consumers have the right to:</p>
        <ul>
            <li>Request that a business that collects a consumer's personal data disclose the categories and specific
                pieces of personal data that a business has collected about consumers.
            </li>
            <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
            <li>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.
            </li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these
            rights, please contact us. Please note you can delete your own account at any time.</p>

        <h2>GDPR Data Protection Rights</h2>

        <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is
            entitled to the following:</p>
        <ul>
            <li>The right to access – You have the right to request copies of your personal data. We may charge you a
                small fee for this service.
            </li>
            <li>The right to rectification – You have the right to request that we correct any information you believe
                is inaccurate. You also have the right to request that we complete the information you believe is
                incomplete.
            </li>
            <li>The right to erasure – You have the right to request that we erase your personal data, under certain
                conditions. <ul>
                    <li><strong>Important</strong> - Please note that upon account deletion or a request to
                        remove data we will need to keep a masked version of your email address and name in order to
                        reconcile any actions you may have taken whilst using the website. For
                        example, <span className="bg-light text-dark py-1 px-2">John Smith
                            john.smith@somewhere.com</span> will be saved
                        as <span className="bg-light text-dark py-1 px-2">J**n S***h j**n.s***h@s*******e.c*m</span>.
                        This is part of
                        our obligation to other users to provide them with a secure and robust service, and to prevent
                        malicious actions by users against others.
                    </li>
                </ul>
            </li>
            <li>The right to restrict processing – You have the right to request that we restrict the processing of your
                personal data, under certain conditions.
            </li>
            <li>The right to object to processing – You have the right to object to our processing of your personal
                data,
                under certain conditions.
            </li>
            <li>The right to data portability – You have the right to request that we transfer the data that we have
                collected to another organization, or directly to you, under certain conditions.
            </li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these
            rights, please contact us. Please note you can delete your own account at any time.</p>

        <h2>Children's Information</h2>

        <p>Another part of our priority is adding protection for children while using the internet. We encourage
            parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>

        <p>{websiteName} does not knowingly collect any Personal Identifiable Information from children under the
            age of 16. If you think that your child provided this kind of information on our website, we strongly
            encourage you to contact us immediately and we will do our best efforts to promptly remove such
            information from our records.</p>

        <h2>Advertising and selling your data</h2>

        <p>{websiteName} does not use advertising and will never knowingly do any of the following:</p>

        <ul>
            <li>Sell your personal data to third parties</li>
            <li>Track users outside of {websiteName} ({url})</li>
        </ul>

        <h2>Security</h2>

        <p>{websiteName} will do its best to provide a secure experience to its users. Whilst we will take every
            reasonable step to ensure your data is stored and processed securely, regrettably we cannot guarantee the
            absolute safety of data. By using this site you are agreeing to assume ultimate responsibility and liability
            for your own data.</p>

        <ul>
            <li>Sell your personal data to third parties</li>
            <li>Track users outside of {websiteName} ({url})</li>
        </ul>

        <h2>More information</h2>

        <p>Please email <a href={`mailto:${email}`}>{email}</a> if you have questions or concerns.</p>
    </div>);
};

export default PrivacyPolicy;
