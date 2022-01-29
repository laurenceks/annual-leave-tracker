import PropTypes from "prop-types";

const TermsAndConditions = ({
                                appName,
                                websiteName,
                                url,
                                email,
                                author
                            }) => {
    return (<div><h1>Terms and conditions</h1><p><strong>Please read all these terms and conditions.</strong></p>
        <p>As we can accept your order and make a legally enforceable agreement without further reference to you,
            you must read these terms and conditions to make sure that they contain all that you want and nothing
            that you are not happy with.</p><h2>Application</h2>
        <ol>
            <li>These Terms and Conditions will apply to the purchase of the services and goods by you
                (the <strong>Customer</strong> or <strong>you</strong>). This website was created
                by {author} (the <strong>Supplier</strong> or <strong>us</strong> or <strong>we</strong>).
            </li>
            <li>These are the terms on which we sell all Services to you.<span> Before placing an order on the Website, you will be asked to agree to these Terms and Conditions by clicking on the button marked 'I Accept'. If you do not click on the button, you will not be able to complete your Order.</span> You
                can only purchase the Services and Goods from the Website if you are eligible to enter into a
                contract and are at least 18 years old.
            </li>
        </ol>
        <h2>Interpretation</h2>
        <ol>
            <li><strong>Consumer</strong> means an individual acting for purposes which are wholly or mainly outside
                their trade, business, craft or profession;
            </li>
            <li><strong>Contract</strong> means the legally-binding agreement between you and us for the supply of
                the Services;
            </li>
            <li><strong>Delivery Location</strong> means the Supplier's premises or other location where the
                Services are to be supplied, as set out in the Order;
            </li>
            <li><strong>Durable Medium</strong> means paper or email, or any other medium that allows information to
                be addressed personally to the recipient, enables the recipient to store
                the information in a way
                accessible for future reference for a period that is long enough for the
                purposes of the
                information, and allows the unchanged reproduction of the information
                stored;
            </li>
            <li><strong>Goods</strong> means any goods that we supply to you with the Services, of the number and
                description as set out in the Order;
            </li>
            <li><strong>Order</strong> means the Customer's order for the Services from the Supplier as submitted
                following the step by step process set out on the Website;
            </li>
            <li><strong>Privacy Policy</strong> means the terms which set out how we will deal with confidential and
                personal information received from you via the Website;
            </li>
            <li><strong>Services</strong> means the services advertised on the Website, including any Goods, of the
                number and description set out in the Order;
            </li>
            <li><strong>Website</strong> means our website <span>{url}</span> on which the Services are advertised.
            </li>
        </ol>
        <h2>Services</h2>
        <ol>
            <li>The description of the Services and any Goods is as set out in the Website, catalogues, brochures or
                other form of advertisement. Any description is for illustrative purposes only and there may be
                small discrepancies in the size and colour of any Goods supplied.
            </li>
            <li>In the case of Services and any Goods made to your special requirements, it is your responsibility
                to ensure that any information or specification you provide is accurate.
            </li>
            <li>All Services which appear on the Website are subject to availability.</li>
            <li>We can make changes to the Services which are necessary to comply with any applicable law or safety
                requirement. We will notify you of these changes.
            </li>
        </ol>
        <h2>Customer responsibilities</h2>
        <ol>
            <li>You must co-operate with us in all matters relating to the Services, provide us and our authorised
                employees and representatives with access to any premises under your control as required, provide us
                with all information required to perform the Services and obtain any necessary licences and consents
                (unless otherwise agreed).
            </li>
            <li>Failure to comply with the above is a Customer default which entitles us to suspend performance of
                the Services until you remedy it or if you fail to remedy it following our request, we can terminate
                the Contract with immediate effect on written notice to you.
            </li>
        </ol>
        <h2>Personal information<span> and Registration</span></h2>
        <ol>
            <li>When registering to use the Website you must set up a username and password. You remain responsible
                for all actions taken under the chosen username and password and undertake not to disclose your
                username and password to anyone else and keep them secret.
            </li>
            <li>We retain and use all information strictly under the Privacy Policy.</li>
            <li>We may contact you by using e-mail or other electronic communication methods and by pre-paid post
                and you expressly agree to this.
            </li>
        </ol>
        <h2>Basis of Sale</h2>
        <ol>
            <li>The description of the Services and any Goods in our website does not constitute a contractual offer
                to sell the Services or Goods. When an Order has been submitted on the Website, we can reject it for
                any reason, although we will try to tell you the reason without delay.
            </li>
            <li>The Order process is set out on the Website. Each step allows you to check and amend any errors
                before submitting the Order. It is your responsibility to check that you have used the ordering
                process correctly.
            </li>
            <li>A Contract will be formed for the Services ordered only when you receive an email from us confirming
                the Order (<strong>Order Confirmation</strong>). You must ensure that the Order Confirmation is
                complete and accurate and inform us immediately of any errors. We are not responsible for any
                inaccuracies in the Order placed by you. By placing an Order you agree to us giving you confirmation
                of the Contract by means of an email with all information in it (ie the Order Confirmation). You
                will receive the Order Confirmation within a reasonable time after making the Contract, but in any
                event not later than the delivery of any Goods supplied under the Contract, and before performance
                begins of any of the Services.
            </li>
            <li>Any quotation or estimate of Fees (as defined below) is valid for a maximum period
                of <span><span/><span> days</span></span> from
                its date, unless we expressly withdraw it at an earlier time.
            </li>
            <li>No variation of the Contract, whether about description of the Services, Fees or otherwise, can be
                made after it has been entered into unless the variation is agreed by the Customer and the Supplier
                in writing.
            </li>
            <li>We intend that these Terms and Conditions apply only to a Contract entered into by you as a
                Consumer. If this is not the case, you must tell us, so that we can provide you with a different
                contract with terms which are more appropriate for you and which might, in some respects, be better
                for you, eg by giving you rights as a business.
            </li>
        </ol>
        <h2>Fees and Payment</h2>
        <ol>
            <li>The fees (<strong>Fees</strong>) for the Services, the price of any Goods (if not included in the
                Fees) and any additional delivery or other charges is that set out on the Website at the date we
                accept the Order or such other price as we may agree in writing. Prices for Services may be
                calculated on a fixed price or on a standard daily rate basis.
            </li>
            <li>Fees and charges include VAT at the rate applicable at the time of the Order.</li>
            <li>You must pay by submitting your credit or debit card details with your Order and we can take payment
                immediately or otherwise before delivery of the Services.
            </li>
        </ol>
        <h2>Delivery</h2>
        <ol>
            <li>We will deliver the Services, including any Goods, to the Delivery Location by the time or within
                the agreed period or, failing any agreement: <ol>
                    <li>in the case of Services, within a reasonable time; and</li>
                    <li>in the case of Goods, without undue delay and, in any event, not more than 30 days after the
                        day on which the Contract is entered into.
                    </li>
                </ol></li>
            <li>In any case, regardless of events beyond our control, if we do not deliver the Services on time, you
                can require us to reduce the Fees or charges by an appropriate amount (including the right to
                receive a refund for anything already paid above the reduced amount). The amount of the reduction
                can, where appropriate, be up to the full amount of the Fees or charges.
            </li>
            <li>In any case, regardless of events beyond our control, if we do not deliver the Goods on time, you
                can (in addition to any other remedies) treat the Contract at an end if: <ol>
                    <li>we have refused to deliver the Goods, or if delivery on time is essential taking into
                        account all the relevant circumstances at the time the Contract was made, or you said to us
                        before the Contract was made that delivery on time was essential; or
                    </li>
                    <li>after we have failed to deliver on time, you have specified a later period which is
                        appropriate to the circumstances and we have not delivered within that period.
                    </li>
                </ol></li>
            <li>If you treat the Contract at an end, we will (in addition to other remedies) promptly return all
                payments made under the Contract.
            </li>
            <li>If you were entitled to treat the Contract at an end, but do not do so, you are not prevented from
                cancelling the Order for any Goods or rejecting Goods that have been delivered and, if you do this,
                we will (in addition to other remedies) without delay return all payments made under the Contract
                for any such cancelled or rejected Goods. If the Goods have been delivered, you must return them to
                us or allow us to collect them from you and we will pay the costs of this.
            </li>
            <li>If any Goods form a commercial unit (a unit is a commercial unit if division of the unit would
                materially impair the value of the goods or the character of the unit) you cannot cancel or reject
                the Order for some of those Goods without also cancelling or rejecting the Order for the rest of
                them.
            </li>
            <li>We do not generally deliver to addresses outside England and Wales, Scotland, Northern Ireland, the
                Isle of Man and Channels Islands. If, however, we accept an Order for delivery outside that area,
                you may need to pay import duties or other taxes, as we will not pay them.
            </li>
            <li>You agree we may deliver the Goods in instalments if we suffer a shortage of stock or other genuine
                and fair reason, subject to the above provisions and provided you are not liable for extra charges.
            </li>
            <li>If you or your nominee fail, through no fault of ours, to take delivery of the Services at the
                Delivery Location, we may charge the reasonable costs of storing and redelivering them.
            </li>
            <li>The Goods will become your responsibility from the completion of delivery or Customer collection.
                You must, if reasonably practicable, examine the Goods before accepting them.
            </li>
        </ol>
        <h2>Risk and Title</h2>
        <ol>
            <li>Risk of damage to, or loss of, any Goods will pass to you when the Goods are delivered to you.</li>
            <li>You do not own the Goods until we have received payment in full. If full payment is overdue or a
                step occurs towards your bankruptcy, we can choose, by notice to cancel any delivery and end any
                right to use the Goods still owned by you, in which case you must return them or allow us to collect
                them.
            </li>
        </ol>
        <h2>Withdrawal <span> returns </span> and cancellation</h2>
        <ol>
            <li>You can withdraw the Order by telling us before the Contract is made, if you simply wish to change
                your mind and without giving us a reason, and without incurring any liability.
            </li>
            <li>You can cancel the Contract except for any Goods which are made to your special requirements by
                telling us no later than <span><span/><span> days</span></span> after the Contract was made, if
                you simply wish to change your mind and without giving us a reason, and without liability, except in
                that case, you must return to any of our business premises the Goods in undamaged condition at your
                expense. Then we must without delay refund to you the price for those Goods and Services which have
                been paid for in advance, but we can retain any separate delivery charge. This does not affect your
                rights when the reason for the cancellation is any defective Goods or Services. This Returns Right
                is different and separate from the Cancellation Rights below.
            </li>
            <li>This is a <strong>distance contract</strong> (as defined below) which has the cancellation rights
                (<strong>Cancellation Rights</strong>) set out below. These Cancellation Rights, however, do not
                apply, to a contract for the following goods and services (with no others) in the following
                circumstances: <ol>
                    <li>goods that are made to your specifications or are clearly personalised;</li>
                    <li>goods which are liable to deteriorate or expire rapidly.</li>
                </ol></li>
        </ol>
        <p><em>Right to cancel</em></p>
        <ol>
            <li>Subject as stated in these Terms and Conditions, you can cancel this contract within 14 days without
                giving any reason.
            </li>
            <li>The cancellation period will expire after 14 days from the day on which you acquire, or a third
                party, other than the carrier, indicated by you, acquires physical possession of the last of the
                Goods. In a contract for the supply of services only (without goods), the cancellation period will
                expire 14 days from the day the Contract was entered into. In a contract for the supply of goods
                over time (ie subscriptions), the right to cancel will be 14 days after the first delivery.
            </li>
            <li>To exercise the right to cancel, you must inform us of your decision to cancel this Contract by a
                clear statement setting out your decision (eg a letter sent by post&nbsp;or email). You can use the
                attached model cancellation form, but it is not obligatory. In any event, you must be able to show
                clear evidence of when the cancellation was made, so you may decide to use the model cancellation
                form.
            </li>
            <li>You can also electronically fill in and submit the model cancellation form or any other clear
                statement of the Customer's decision to cancel the Contract on our website <span>{url}</span> . If
                you use this option, we will communicate to you an acknowledgement of receipt of such a cancellation
                in a Durable Medium (eg by email) without delay.
            </li>
            <li>To meet the cancellation deadline, it is sufficient for you to send your communication concerning
                your exercise of the right to cancel before the cancellation period has expired.
            </li>
        </ol>
        <p><em>Commencement of Services in the cancellation period</em></p>
        <ol>
            <li>We must not begin the supply of a service (being part of the Services) before the end of the
                cancellation period unless you have made an express request for the service.
            </li>
        </ol>
        <p><em>Effects of cancellation in the cancellation period</em></p>
        <ol>
            <li>Except as set out below, if you cancel this Contract, we will reimburse to you all payments received
                from you, including the costs of delivery (except for the supplementary costs arising if you chose a
                type of delivery other than the least expensive type of standard delivery offered by us).
            </li>
        </ol>
        <p><em>Payment for Services commenced during the cancellation period</em></p>
        <ol>
            <li>Where a service is supplied (being part of the Service) before the end of the cancellation period in
                response to your express request to do so, you must pay an amount for the supply of the service for
                the period for which it is supplied, ending with the time when we are informed of your decision to
                cancel the Contract. This amount is in proportion to what has been supplied in comparison with the
                full coverage of the Contract. This amount is to be calculated on the basis of the total price
                agreed in the Contract or, if the total price were to be excessive, on the basis of the market value
                of the service that has been supplied, calculated by comparing prices for equivalent services
                supplied by other traders. You will bear no cost for supply of that service, in full or in part, in
                this cancellation period if that service is not supplied in response to such a request.
            </li>
        </ol>
        <p><em>Deduction for Goods supplied</em></p>
        <ol>
            <li>We may make a deduction from the reimbursement for loss in value of any Goods supplied, if the loss
                is the result of unnecessary handling by you (ie handling the Goods beyond what is necessary to
                establish the nature, characteristics and functioning of the Goods: eg it goes beyond the sort of
                handling that might be reasonably allowed in a shop). This is because you are liable for that loss
                and, if that deduction is not made, you must pay us the amount of that loss.
            </li>
        </ol>
        <p><em>Timing of reimbursement</em></p>
        <ol>
            <li>If we have not offered to collect the Goods, we will make the reimbursement without undue delay, and
                not later than: <ol>
                    <li>14 days after the day we receive back from you any Goods supplied, or</li>
                    <li>(if earlier) 14 days after the day you provide evidence that you have sent back the Goods.
                    </li>
                </ol></li>
            <li>If we have offered to collect the Goods or if no Goods were supplied or to be supplied (ie it is a
                contract for the supply of services only), we will make the reimbursement without undue delay, and
                not later than 14 days after the day on which we are informed about your decision to cancel this
                Contract.
            </li>
            <li>We will make the reimbursement using the same means of payment as you used for the initial
                transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees
                as a result of the reimbursement.
            </li>
        </ol>
        <p><em>Returning Goods</em></p>
        <ol>
            <li>If you have received Goods in connection with the Contract which you have cancelled, you must send
                back the Goods or hand them over to us at <span><span><span>7 Stratton Court</span>,<span><span>Worplesdon Rd</span></span><span><span>Surrey</span>,</span><span>GU2 9SE</span></span></span> without
                delay and in any event not later than 14 days from the day on which you communicate to us your
                cancellation of this Contract. The deadline is met if you send back the Goods before the period of
                14 days has expired. You agree that you will have to bear the cost of returning the Goods.
            </li>
            <li>For the purposes of these Cancellation Rights, these words have the following meanings: <ol>
                <li><strong>distance contract</strong> means a contract concluded between a trader and a consumer
                    under an organised distance sales or service-provision scheme
                    without the simultaneous physical
                    presence of the trader and the consumer, with the exclusive use
                    of one or more means of distance
                    communication up to and including the time at which the contract
                    is concluded;
                </li>
                <li><strong>sales contract</strong> means a contract under which a trader transfers or agrees to
                    transfer the ownership of goods to a consumer and the consumer pays
                    or agrees to pay the price,
                    including any contract that has both goods and services as its
                    object.
                </li>
            </ol></li>
        </ol>
        <h2>Conformity</h2>
        <ol>
            <li>We have a legal duty to supply the Goods in conformity with the Contract, and will not have
                conformed if it does not meet the following obligation.
            </li>
            <li>Upon delivery, the Goods will: <ol>
                <li>be of satisfactory quality;</li>
                <li>be reasonably fit for any particular purpose for which you buy the Goods which, before the
                    Contract is made, you made known to us (unless you do not actually rely, or it is unreasonable
                    for you to rely, on our skill and judgment) and be fit for any purpose held out by us or set out
                    in the Contract; and
                </li>
                <li>conform to their description.</li>
            </ol></li>
            <li>It is not a failure to conform if the failure has its origin in your materials.</li>
            <li>We will supply the Services with reasonable skill and care.</li>
            <li>In relation to the Services, anything we say or write to you, or anything someone else says or
                writes to you on our behalf, about us or about the Services, is a term of the Contract (which we
                must comply with) if you take it into account when deciding to enter this Contract, or when making
                any decision about the Services after entering into this Contract. Anything you take into account is
                subject to anything that qualified it and was said or written to you by us or on behalf of us on the
                same occasion, and any change to it that has been expressly agreed between us (before entering this
                Contract or later).
            </li>
        </ol>
        <h2>Duration, termination and suspension</h2>
        <ol>
            <li>The Contract continues as long as it takes us to perform the Services.</li>
            <li>Either you or we may terminate the Contract or suspend the Services at any time by a written notice
                of termination or suspension to the other if that other: <ol>
                    <li>commits a serious breach, or series of breaches resulting in a serious breach, of the
                        Contract and the breach either cannot be fixed or is not fixed within 30 days of the written
                        notice; or
                    </li>
                    <li>is subject to any step towards its bankruptcy or liquidation.</li>
                </ol></li>
            <li>On termination of the Contract for any reason, any of our respective remaining rights and
                liabilities will not be affected.
            </li>
        </ol>
        <h2>Successors and our sub-contractors</h2>
        <ol>
            <li>Either party can transfer the benefit of this Contract to someone else, and will remain liable to
                the other for its obligations under the Contract. The Supplier will be liable for the acts of any
                sub-contractors who it chooses to help perform its duties.
            </li>
        </ol>
        <h2>Circumstances beyond the control of either party</h2>
        <ol>
            <li>In the event of any failure by a party because of something beyond its reasonable control: <ol>
                <li>the party will advise the other party as soon as reasonably practicable; and</li>
                <li>the party's obligations will be suspended so far as is reasonable, provided that that party will
                    act reasonably, and the party will not be liable for any failure which it could not reasonably
                    avoid, but this will not affect the Customer's above rights relating to delivery (and the right
                    to cancel below).
                </li>
            </ol></li>
        </ol>
        <h2>Privacy</h2>
        <ol>
            <li>Your privacy is critical to us. We respect your privacy and comply with the General Data Protection
                Regulation with regard to your personal information.
            </li>
            <li>These Terms and Conditions should be read alongside, and are in addition to our policies, including
                our privacy policy (<span>{url}/#/privacy</span>) and cookies policy (<span>{url}/#/privacy</span>).
            </li>
            <li>For the purposes of these Terms and Conditions: <ol>
                <li>'Data Protection Laws' means any applicable law relating to the processing of Personal Data,
                    including, but not limited to&nbsp;the GDPR.
                </li>
                <li>'GDPR' means the UK General Data Protection Regulation.</li>
                <li>'Data Controller', 'Personal Data' and 'Processing' shall have the same meaning as in the
                    GDPR.
                </li>
            </ol></li>
            <li>We are a Data Controller of the Personal Data we Process in providing the Services and Goods to
                you.
            </li>
            <li>Where you supply Personal Data to us so we can provide Services and Goods to you, and we Process
                that Personal Data in the course of providing the Services and Goods to you, we will comply with our
                obligations imposed by the Data Protection Laws: <ol>
                    <li>before or at the time of collecting Personal Data, we will identify the purposes for which
                        information is being collected;
                    </li>
                    <li>we will only Process Personal Data for the purposes identified;</li>
                    <li>we will respect your rights in relation to your Personal Data; and</li>
                    <li>we will implement technical and organisational measures to ensure your Personal Data is
                        secure. <ol>
                            <li>Please note that we will take every reasonable measure necessary to protect your
                                Personal Data, however this cannot be guaranteed and we cannot accept liability fir
                                any data breaches that may occur as a result of you using our service
                            </li>
                        </ol></li>
                </ol></li>
            <li>For any enquiries or complaints regarding data privacy, you can
                e-mail: <span>help@annualleavetracker.com</span>.
            </li>
        </ol>
        <h2>Excluding liability</h2>
        <ol>
            <li>The Supplier does not exclude liability for: (i) any fraudulent act or omission; or (ii) death or
                personal injury caused by negligence or breach of the Supplier's other legal obligations. Subject to
                this, we are not liable for (i) loss which was not reasonably foreseeable to both parties at the
                time when the Contract was made, or (ii) loss (eg loss of profit) to your business, trade, craft or
                profession which would not be suffered by a Consumer - because we believe you are not buying the
                Services and Goods wholly or mainly for your business, trade, craft or profession.
            </li>
        </ol>
        <h2>Governing law, jurisdiction and complaints</h2>
        <ol>
            <li>The Contract (including any non-contractual matters) is governed by the law of England and Wales.
            </li>
            <li>Disputes can be submitted to the jurisdiction of the courts of <span>England and Wales</span> or,
                where the Customer lives in Scotland or Northern Ireland, in the courts of
                respectively <span>Scotland</span> or Northern Ireland.
            </li>
            <li>We try to avoid any dispute, so we deal with complaints as follows: <span>Whilst we welcome feedback and strive to improve the website by acting on comments made by users, the service is provided "as-is" with no guarantee of functionality. To raise an issue please contact us and we will discuss the matter with you directly.</span>.
            </li>
        </ol>
        <p><strong>Attribution</strong></p>
        <ol>
            <li>These terms and conditions were created using a document
                from <a href="https://www.rocketlawyer.com/gb/en/">Rocket
                    Lawyer</a> (https://www.rocketlawyer.com/gb/en).
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