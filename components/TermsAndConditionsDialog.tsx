"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TermsAndConditionsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-blue-600 underline hover:text-blue-800"
        >
          terms and conditions
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gist Answers Search Terms of Service</DialogTitle>
          <DialogDescription className="text-left">
            <div className="space-y-4 pt-4 text-sm text-foreground">
              <p>
                These are the terms of service (&apos;Search Terms&apos;) for use of our search product (&apos;Gist Answers&apos; or the &apos;Services&apos;) offered by ProRataAI, Inc. (&apos;we,&apos; &apos;us,&apos; &apos;our&apos;). ProRata will provide you with an interface, such as an API, widget, scripting or other technical resources (a &apos;Widget&apos;) to enable integration of its generative AI answer engine with your websites and apps (the &apos;Properties&apos;). Use of the term &apos;Services&apos; includes the Widget. By installing the Widget for Gist Answers on your Properties, you agree to these Search Terms as supplemented by the ProRata Terms of Service located{" "}
                <a
                  href="https://gist.ai/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  here
                </a>{" "}
                the (&apos;General Terms&apos;), which General Terms are hereby incorporated by reference, except as modified by these Search Terms (&apos;General Terms and Search Terms&apos; collectively together are referred to hereinafter as the &apos;Terms&apos;). References to the &apos;Services&apos; in the General Terms shall include Gist Answers for purposes of these Search Terms. &apos;You&apos; and &apos;your&apos; means you as the user of Gist Answers.
              </p>

              <p className="font-semibold text-base">Service Description</p>
              <p>
                Gist Answers allows you to install generative AI search on your properties. You place our Widget which renders the ProRata search box so that end users can enter a search query (&apos;Query&apos;) on the Properties. ProRata will process the Queries using ProRata&apos;s answer engine and display search results (&apos;Answers&apos;) on a results page. All Queries to ProRata must originate from Properties. Gist Answers also includes dynamic, contextual generative advertising content contained within the Gist Answers and served by us.
              </p>

              <p className="font-semibold text-base">Access to the Services; Account Setup</p>
              <p>
                Your use of the Gist Answers is subject to your creation and our approval of an account (an &apos;Account&apos;). We have the right to refuse or limit your access to the Services. In order to verify your Account, from time-to-time we may ask for additional information from you, including, but not limited to, verification of your name, address, and other identifying information. By submitting an application to use the Services, if you are an individual, you represent that you are at least 18 years of age, and if the Properties are owned by an entity, you represent that you have the right to enter these terms on behalf of the entity that owns the Properties. Each individual or entity is generally permitted to maintain only one Account, except where multiple Accounts are reasonably necessary for legitimate business purposes (for example, managing separate websites, brands, or clients). You may not register or maintain multiple Accounts for the purpose of circumventing usage limits, or otherwise to evade compliance with these Terms You represent and warrant that all information provided by You to ProRata in connection with the Services is true and accurate.
              </p>

              <p className="font-semibold text-base">Content Policies</p>
              <p>
                We pride ourselves on having high quality standards. Please review our full{" "}
                <a
                  href="https://platform.gist.ai/docs/content-policy-for-gist-answers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Content Policy
                </a>{" "}
                which applies to all publishers implementing Gist Answers and supplements your agreement with ProRata, which requires compliance with policies as provided and updated by ProRata from time to time. All publishers using Gist Answers are obligated to meet certain minimum standards and compliance with relevant laws.
              </p>

              <p className="font-semibold text-base">Installation and Use Rights</p>
              <p>
                The Widget is licensed to you, not sold. We grant you a personal, non-sublicensable, non-transferable, non-exclusive license to install and run one instance of the Widget on your Properties so long as you comply with the terms and restrictions contained in these Search Terms and all applicable laws. The foregoing license automatically terminates if we terminate your right to use Gist Answers.
              </p>
              <p>
                You must comply with all Policies which we publish in reference to the Services from time to time.
              </p>
              <p>
                Gist Answers is a business tool that can be used only for purposes relating to your trade, business, craft, or profession on Properties which you own or have full rights in.
              </p>
              <p>
                You may discontinue your use of any Services at any time by removing the Widget from your Properties.
              </p>
              <p>
                Do not misuse our Services. For example, don&apos;t interfere with our Services or try to access using a method other than the Widget and the instructions that we provide. Do not, nor permit anyone else to abuse, harm, interfere with, or disrupt the operation of the Services, including without limitation, in addition to the prohibitions set forth in the General Terms, not to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Share, sell, rent, sublicense, copy, re-distribute, transfer, or otherwise provide the Services to any third party.</li>
                <li>Use the Services to develop products that provide substantially the same or similar function as the services.</li>
                <li>Modify, reverse engineering, reverse assemble or attempt to extract the source code for the services (except as and only to the extent any foregoing restriction is prohibited by applicable law).</li>
                <li>Remove any copyright notices and any other proprietary notices that appear in, or connection with the services.</li>
                <li>Generate traffic through any automated, deceptive, disingenuous, or fraudulent means, including through the use of robots or other automated query tools and/or computer-generated search requests, or the fraudulent use of other search engine optimization services or software.</li>
                <li>Provide incentives for clicks on links including but not limited to, paying visitors to click on links, offering bait click, or other unlawful means.</li>
                <li>Enable any non-human, automated tools to generate Queries.</li>
              </ul>

              <p className="font-semibold text-base">Updates</p>
              <p>
                The Widget may periodically check for updates and download and install them for you. By using Gist Answers, you agree to receive these types of automatic updates without additional notice. These Search Terms will govern any Widget updates unless such update is accompanied by a separate license.
              </p>

              <p className="font-semibold text-base">Advertising</p>
              <p>
                The Widget or associated elements provided by ProRata through the Services may contain advertising which You agree to display and covenant that you will not take steps to disable or interfere with. The advertising will be dynamically generated and displayed when relevant to Queries, and depending on what Queries appear, will determine what and how frequently relevant ads appear.
              </p>

              <p className="font-semibold text-base">Privacy Notice</p>
              <p>
                The Privacy Notice located{" "}
                <a
                  href="https://gist.ai/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  here
                </a>{" "}
                describes how we handle information collected about end users when in connection with Gist Answers.
              </p>

              <p className="font-semibold text-base">Payment</p>
              <p>
                Subject to your compliance with all of these Terms, you may receive payment related to the number of valid clicks or impressions or other valid activity performed in connection with the display of Ads on the Properties, provided you have remained in compliance with the Terms for the entirety of the period for which payment is made and through to the date that the payment is issued.
              </p>
              <p>
                Payments will be calculated solely based on ProRata&apos;s calculation and accounting. You acknowledge and agree that you are only entitled to payment where ProRata has collected and been paid. If, for any reason, ProRata does not receive payment from an advertiser or credits such payment back to an advertiser, you are not entitled to be paid for any associated revenue share. ProRata has the right to withhold or adjust payments to you to exclude any amounts ProRata determines arise from credits, refunds, adjustments and invalid activity, including spam, invalid clicks, invalid impressions, invalid queries, invalid conversions, or other invalid events on Ads generated by any person, bot, automated program or similar device.
              </p>
              <p>
                ProRata will report and pay You once the revenue share exceeds a certain dollar amount, at which time We will request your bank information to enable payment to you. No representations or warranties are made with regard to the amount of revenue (if any) that may be earned hereunder. You are responsible for any charges assessed by your bank or payment provider. If ProRata is investigating your compliance under these Terms or you have been suspended or terminated, your payment may be delayed or withheld. To ensure proper payment, you are responsible for providing and maintaining accurate contact and payment information in your Account.
              </p>

              <p className="font-semibold text-base">Responsibilities</p>
              <p>
                You are solely responsible for all aspects of your Properties including all content defined as all editorial, text, graphic, audiovisual, branding, logos, trademarks, and other materials that is displayed or served to end users on the Properties (the &apos;Content&apos;), excluding Answers generated by ProRata. You represent and warrant that: You have obtained all necessary governmental approvals required for your Properties; and You shall perform all of Your obligations in accordance with applicable laws. Further, You represent and warrant that: (i) you own and have the full unencumbered right to convey the license in this Agreement; (ii) the Content has not been substantially created using artificial intelligence without active review by a human editor; (ii) nothing in the Content (or ProRata&apos;s permitted use herein) violates or conflicts with any intellectual property rights or other rights of any person or entity, including privacy or publicity rights; and (iii) the Content does not (a) contain any material that is libelous, defamatory, fraudulent, false, or otherwise objectionable under industry standards, or that violates or encourages the violation of applicable laws; (b) constitute defamation, libel or obscenity, (c) result in any consumer fraud, product liability, breach of contract to which You are a party or cause injury to any third party, (d) promote violence or contain hate speech, (e) violate any applicable law, statute, ordinance, or regulations, or (f) contain adult pornographic content or promote illegal activities, gambling, or the sale of tobacco or alcohol to persons under twenty-one (21) years of age.
              </p>

              <p className="font-semibold text-base">Ownership</p>
              <p>
                As between the Parties, ProRata shall own and retain all rights, title and interest in and to the Services, together with all intellectual property rights therein and thereto. ProRata reserves all rights not expressly granted hereunder. In addition, no license to use or reproduce any logo or trademark related to the Widget or Services is granted to you hereunder. You are not required to provide any feedback or suggestions to ProRata regarding the Widgets or Services (&quot;Feedback&quot;), but to the extent You do provide Feedback, ProRata is free to use such Feedback and You hereby grant to ProRata and its affiliates a non-exclusive, perpetual, irrevocable, royalty-free, transferable, worldwide right and license to use, reproduce, disclose, sublicense, distribute, modify, and otherwise exploit the Feedback without restriction. ProRata may modify or discontinue the Services or any of its features at any time in its sole discretion without any responsibility or liability to you. Moreover, you are not entitled to any support, upgrades, updates, add-ons patches, enhancements, or fixes for the Services except in ProRata&apos;s sole discretion.
              </p>

              <p className="font-semibold text-base">Disclaimers and Limitation of Liability</p>
              <p>
                These Services are provided by ProRata on &apos;as is&apos; and &apos;as available&apos; basis. ProRata makes no representations or warranties of any kind, express or implied, as to the operation of the Services, or the information, content or materials included with the Services and ProRata specifically disclaims any implied warranties of title, merchantability, fitness for a particular purpose, accuracy of informational content, and non-infringement. You expressly agree that your use of these services is at your sole risk. This disclaimer is made to the fullest extent permitted by law. If you are not completely satisfied with the Services, your sole remedy is to cease using the Services.
              </p>
              <p className="font-semibold">
                IN NO EVENT WHATSOEVER SHALL PRORATA OR ITS AFFILIATES OR ANY OF THEIR RESPECTIVE EMPLOYEES, CONTRACTORS, AGENTS, OFFICERS, AND DIRECTORS BE LIABLE FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, PUNITIVE OR EXEMPLARY DAMAGES, OR FOR ANY LOSS OF PROFITS OR REVENUE, INCLUDING BUT NOT LIMITED TO LOSS OF SALES, PROFIT, REVENUE, GOODWILL, OR DOWNTIME, (ARISING UNDER TORT, CONTRACT, OR OTHER LAW) REGARDLESS OF SUCH PARTY&apos;S NEGLIGENCE OR WHETHER SUCH PARTY KNEW OR SHOULD HAVE KNOWN OF THE POSSIBILITY OF SUCH DAMAGES. PRORATA&apos;S LIABILITY HEREUNDER IS LIMITED TO THE FULLEST EXTENT PERMITTED BY LAW. TO THE EXTENT PERMITTED BY APPLICABLE LAW, PRORATA&apos;S MAXIMUM LIABILITY HEREUNDER IS LIMITED TO $100.00.
              </p>
              <p>
                If we breach this Agreement, You agree that your exclusive remedy is to recover, from us or any affiliates, resellers, distributors, and vendors, direct damages up to an amount equal to your Services fee for one month (or up to USD$100.00 if the Services are free). YOU CAN&apos;T RECOVER ANY OTHER DAMAGES OR LOSSES, INCLUDING, WITHOUT LIMITATION, DIRECT, CONSEQUENTIAL, LOST PROFITS, SPECIAL, INDIRECT, INCIDENTAL, OR PUNITIVE. These limitations and exclusions apply if this remedy does not fully compensate you for any losses or failures of its essential purpose or if we knew or should have known about the possibility of the damage. To the maximum extent permitted by law, these limitations and exclusions apply to anything related to these Terms such as, without limitation, loss of content; any virus affecting your use of the Services; delays or failures in starting or completing transmissions or transactions; claims for breach of contract, warranty, guarantee, or condition; strict liability, negligence, misrepresentation, or omission; trespass, or other tort; violation of statute or regulation; or unjust enrichment.
              </p>

              <p className="font-semibold text-base">Connections with Third Party Services</p>
              <p>
                As part of the Servicers, Gist Answers may collect data from, and exchange data with, third party websites, applications and services (collectively, &quot;Third Party Services&quot;) in order to act as your virtual agent in fulfilling requests and queries you make within the browser. You may also be permitted to connect your Account with Third Party Services with Gist Answers to facilitate the foregoing interaction and functionality. You acknowledge and agree that by using Gist Answers you permit a virtual agent to act on your behalf in conducting activities on or via these Third-Party Services based on the direction you provide via Gist Answers.
              </p>
              <p>
                We do not warrant any Third-Party Services, whether or not such Third-Party Services are designated by us as &quot;certified,&quot; &quot;validated,&quot; &quot;supported&quot; or otherwise. We may terminate the connections and any other coordination between any Third-Party Service and Gist Answers at any time and for any reason, including changes in interoperability requirements, policies or fees charged by such a third-party provider. Any exchange of data or other interaction between you and a third-party provider and any purchase or use by you of any Third-Party Service, is solely between you and such third party provider, and we will have no liability or obligation with respect to such exchange or interaction.
              </p>

              <p className="font-semibold text-base">Changes to These Terms</p>
              <p>
                We may modify these Search Terms from time to time, in which case we will update the date at the top of these Search Terms. The updated Search Terms will be effective as of the time of posting, or such a later date as may be specified in the updated Search Terms. Your continued access or use of the Services after the modifications become effective will be deemed your acceptance of the modified Search Terms. If you do not agree to any updates to these Search Terms, do not continue using Gist Answers.
              </p>

              <p className="font-semibold text-base">General</p>
              <p>
                This Agreement is made solely for the benefit of the Parties and their respective successors and assigns, and nothing in this Agreement, expressed or implied, is intended to confer on any other person or entity any rights or remedies under or by reason of this Agreement. This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to the principles of conflicts of laws thereof. This Agreement represents the entire agreement between the Parties and supersedes any and all prior understanding, agreements, or representations by or among the Parties, written or oral, related to the subject matter hereof. This Agreement may be executed in any number of counterparts (or by combining facsimile and/or original signatures into one or more counterparts), each of which will be deemed an original, but all of which together will constitute one and the same instrument.
              </p>
              <p>
                The Services are operated by the Company in the United States. ProrataAI, Inc., 130 W. Union St., Pasadena, CA 91103.
              </p>

              <p className="text-xs text-muted-foreground mt-6">
                DATED: August 27, 2025
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
