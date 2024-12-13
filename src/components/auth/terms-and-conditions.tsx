import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Add styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'semi-bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
});

// Add PDF Document Component
const PDFDocument = ({ isTerms }: { isTerms: boolean }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {isTerms ? "Terms and Conditions" : "Data Usage and Privacy Notice"}
      </Text>
      <View style={styles.section}>
        {isTerms ? (
          <>
            <Text style={styles.heading}>Welcome to EDAT!</Text>
            <Text style={styles.text}>
              These Terms and Conditions ("Terms") govern your access to and use of the EDAT platform ("Platform"), 
              a service provided by Educational Data Technology, Nigeria Limited ("EDATECH"). By accessing or using 
              the Platform, you agree to be bound by these Terms.
            </Text>
            
            <Text style={styles.heading}>1. Eligibility</Text>
            <Text style={styles.text}>
              EDAT empowers students to enhance their learning experience through a personalized and engaging platform. 
              With the approval of their parents or teachers (acting in loco parentis), and with their supervision, 
              students can leverage the Platform's features to explore educational content, practice skills, and track 
              their progress.
            </Text>

            <Text style={styles.heading}>2. User Accounts</Text>
            <Text style={styles.text}>
              Parents and teachers can create accounts to manage student access to the Platform, monitor progress reports, 
              and collaborate with educators. You are responsible for maintaining the confidentiality of your account information.
            </Text>

            <Text style={styles.heading}>3. Content</Text>
            <Text style={styles.text}>
              The Platform contains content owned or licensed by EDATECH, its licensors, and other users. This content 
              is protected by intellectual property laws.
            </Text>

            <Text style={styles.heading}>4. Use of the Platform</Text>
            <Text style={styles.text}>
              You agree to use the Platform for lawful purposes only. This includes students using the Platform for 
              educational purposes under the supervision of parents and teachers. You agree not to use the Platform in any way that could damage, disable, overburden, or impair the Platform or interfere with any other user's enjoyment of the Platform. You agree not to use the Platform to gain unauthorized access to any other computer system or network.
            </Text>

            <Text style={styles.heading}>5. Data Usage and Privacy</Text>
            <Text style={styles.text}>
              EDATECH collects and uses data in accordance with its Data Usage and Privacy Notice, which is incorporated 
              into these Terms by reference.
            </Text>

            <Text style={styles.heading}>6. Disclaimers</Text>
            <Text style={styles.text}>
              The Platform is provided "as is" and without warranties of any kind, express or implied. EDATECH disclaims 
              all warranties, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. EDATECH does not warrant that the Platform will be uninterrupted or error-free, that defects will be corrected, or that the Platform is free of viruses or other harmful components. EDATECH does not warrant that the information provided on the Platform is accurate, complete, or reliable.
            </Text>

            <Text style={styles.heading}>7. Limitation of Liability</Text>
            <Text style={styles.text}>
              EDATECH will not be liable for any damages arising out of or related to your use of the Platform, including, but not limited to, direct, indirect, incidental, consequential, or punitive damages.
            </Text>

            <Text style={styles.heading}>8. Termination</Text>
            <Text style={styles.text}>
              These Terms may be terminated by either party at any time for any reason. In addition to any other remedy available at law or equity, EDATECH may terminate your access to the Platform without notice if you violate any of these Terms.
            </Text>

            <Text style={styles.heading}>9. Governing Law</Text>
            <Text style={styles.text}>
              These Terms shall be governed by and construed in accordance with the laws of Nigeria.
            </Text>

            <Text style={styles.heading}>10. Entire Agreement</Text>
            <Text style={styles.text}>
              These Terms constitute the entire agreement between you and EDATECH regarding your use of the Platform.
            </Text>

            <Text style={styles.heading}>11. Updates to the Terms</Text>
            <Text style={styles.text}>
              EDATECH reserves the right to update these Terms at any time. The updated Terms will be posted on the Platform. You are responsible for checking the Terms periodically for updates. Your continued use of the Platform after the posting of any updates constitutes your acceptance of the updated Terms.
            </Text>

            <Text style={styles.heading}>12. Contact Us</Text>
            <Text style={styles.text}>
              If you have any questions about these Terms, please contact us at support@edatech.com.
            </Text>

            <Text style={styles.heading}>13. Additional Notes for Parents and Teachers</Text>
            <Text style={styles.text}>
              Parents and teachers are responsible for familiarizing themselves with the Platform's features and functionalities to effectively guide students in their learning journey. Parents and teachers are encouraged to communicate openly with students about online safety and responsible use of the Platform. EDATECH offers resources and support materials for parents and teachers to help them maximize the educational benefits of the Platform for their students.
            </Text>

            <Text style={styles.heading}>14. Indemnity</Text>
            <Text style={styles.text}>
              By accepting these Terms, parents and teachers agree to indemnify and hold harmless EDATECH, its officers, directors, employees, agents, and licensors from and against any and all claims, losses, liabilities, expenses, including attorney's fees, arising out of or in connection with their or their students' use of the Platform.
            </Text>

            <Text style={styles.heading}>15. Student Disclaimer</Text>
            <Text style={styles.text}>
              Students are encouraged to use the Platform responsibly and ethically. They should not share personal information about themselves or others without permission. Students should also avoid engaging in cyberbullying or any other form of online harassment.
            </Text>

            <Text style={styles.heading}>16. Suspension and Termination of Student Accounts</Text>
            <Text style={styles.text}>
              EDATECH reserves the right to suspend or terminate student accounts in cases of violation of these Terms or for any other reason deemed necessary to protect the safety and well-being of the online learning community. Parents and teachers will be notified in case of such actions.
            </Text>

            <Text style={styles.text}>
              Thank you for choosing EDAT! We believe that by working together, parents, teachers, and students can leverage the EDAT Platform to create a personalized and enriching learning experience for all.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.heading}>Introduction</Text>
            <Text style={styles.text}>
              This notice outlines how Educational Data Technology, Nigeria Limited (EDATECH) collects, uses, and 
              protects the data of users interacting with our EDAT platform in accordance with Nigerian Data Protection 
              Regulation (NDPR), US Children's Online Privacy Protection Act (COPPA), EU General Data Protection 
              Regulation (GDPR), and UK General Data Protection Regulation (UK GDPR).
            </Text>

            <Text style={styles.heading}>Data We Collect</Text>
            <Text style={styles.text}>The data we collect depends on the user role on the EDAT Platform:</Text>

            <Text style={styles.heading}>Students:</Text>
            <Text style={styles.subHeading}>Required Data:</Text>
            <Text style={styles.listItem}>• Anonymized ID: This unique identifier ensures student privacy</Text>
            <Text style={styles.listItem}>• Age Range: Allows EDAT to filter age-appropriate content</Text>

            <Text style={styles.heading}>Teachers:</Text>
            <Text style={styles.text}>
              • Login Credentials: Securely stored using industry best practices
              {'\n'}• Class Management Data: Anonymized Student IDs for efficient management
            </Text>

            <Text style={styles.heading}>Parents:</Text>
            <Text style={styles.text}>
              • Login Credentials: Secure access to their child's data
              {'\n'}• Child Information: Managed with parental consent
            </Text>

            <Text style={styles.heading}>Data Security and Privacy</Text>
            <Text style={styles.text}>
              EDAT prioritizes data security and privacy through:
              {'\n'}• Secure Storage
              {'\n'}• Anonymization
              {'\n'}• Parental Consent
              {'\n'}• User Control
            </Text>

            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.text}>
              For questions about this Data Usage and Privacy Notice, contact our Data Protection Officer at dpo@edatech.ai
            </Text>

            <Text style={styles.heading}>Data Usage</Text>
            <Text style={styles.text}>We use the collected data for the following purposes:</Text>
            <Text style={styles.listItem}>
              • <strong>Students:</strong> Personalize learning experiences with recommendations and content suitable for their age and skill level (based on anonymized learning data). Provide progress tracking and reports to students, parents, and teachers (using anonymized data to protect student privacy). Improve the EDAT Platform's functionalities through analysis of anonymized learning data to continuously enhance the platform's effectiveness.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Teachers:</strong> Manage student progress and learning activities within their classes. Gain insights into anonymized student performance data to develop effective teaching strategies tailored to the specific needs of their students.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Parents:</strong> Monitor their child's progress on the EDAT Platform and access anonymized performance data and learning activity reports to understand their child's learning journey and identify areas where they might require additional support.
            </Text>
            <Text style={styles.listItem}>
              • <strong>School and Local Administrators:</strong> Track overall student performance at the class or school level (using anonymized data reports) to identify areas for improvement in curriculum, teaching methods, or resource allocation. Make data-driven decisions to optimize educational programs and learning outcomes for all students.
            </Text>

            <Text style={styles.heading}>Data Security and Privacy</Text>
            <Text style={styles.text}>EDAT prioritizes data security and privacy. We implement the following measures:</Text>
            <Text style={styles.listItem}>
              • <strong>Secure Storage:</strong> All data is stored on secure servers with industry-standard security practices like encryption and access controls to prevent unauthorized access.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Anonymization:</strong> We prioritize student privacy. Student performance data is always anonymized before analysis or reporting. This ensures valuable insights can be gained for improving the platform and learning experience without compromising student identity.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Parental Consent:</strong> We obtain verifiable parental consent for collecting and using data beyond basic information for students under the age limit defined by COPPA (or the relevant age limit set by the specific region).
            </Text>
            <Text style={styles.listItem}>
              • <strong>User Control:</strong> Users have the right to access, modify, or delete their data upon request (subject to legal and regulatory restrictions). For student data, we will process such requests in accordance with parental consent.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Data Retention:</strong> We retain student data for a maximum of five years after a student becomes inactive on the platform (unless parental consent is provided for longer retention). This timeframe allows us to maintain historical data for platform improvement and to provide valuable insights to parents and educators who might rejoin the platform in the future. We regularly review and update our data retention policies in accordance with best practices and regulatory requirements.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Compliance with Regulations:</strong> We adhere to Nigerian Data Protection Regulation (NDPR), US Children's Online Privacy Protection Act (COPPA), EU General Data Protection Regulation (GDPR), and UK General Data Protection Regulation (UK GDPR).
            </Text>

            <Text style={styles.heading}>Creating Models and Tailoring Assessments</Text>
            <Text style={styles.text}>
              The anonymized learning data we collect allows us to develop sophisticated models that analyze student performance trends and learning styles. These models power the EDAT platform's recommendation engine, suggesting the most suitable learning activities and content for each student's individual needs. Additionally, anonymized data is used to create adaptive assessments that adjust difficulty levels and question types based on student performance, providing a more personalized and engaging learning experience.
            </Text>

            <Text style={styles.heading}>Your Rights</Text>
            <Text style={styles.text}>Users have the following rights regarding their data:</Text>
            <Text style={styles.listItem}>
              • <strong>Access and Modification:</strong> You have the right to access and modify your data upon request (subject to legal and regulatory restrictions). For student data, we will process such requests in accordance with parental consent.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Erasure:</strong> You have the right to request the erasure of your data. However, there may be circumstances where we are unable to do so due to legal or regulatory obligations.
            </Text>
            <Text style={styles.listItem}>
              • <strong>Complaint:</strong> If you have any concerns about how we handle your data, you can lodge a complaint with the relevant data protection authority.
            </Text>

            <Text style={styles.heading}>Contact Us</Text>
            <Text style={styles.text}>
              If you have any questions about this Data Usage and Privacy Notice, please contact our Data Protection Officer at dpo@edatech.ai.
            </Text>

            <Text style={styles.heading}>Additional Notes for Different Regions</Text>
            <Text style={styles.listItem}>
              • <strong>Nigeria (NDPR):</strong> The notice explicitly mentions the rights of data subjects under NDPR, including rectification, erasure, and restriction of processing of their data.
            </Text>
            <Text style={styles.listItem}>
              • <strong>US (COPPA):</strong> The notice clearly states the age limit below which parental consent is mandatory for collecting any personal information beyond basic student identification.
            </Text>
            <Text style={styles.listItem}>
              • <strong>EU (GDPR) and UK (UK GDPR):</strong> The notice specifies the legal basis for data processing (e.g., consent, legitimate interest) and data retention periods. Users have the right to data portability under these regulations.
            </Text>
            <Text style={styles.text}>
              By using the EDAT Platform, users acknowledge this Data Usage and Privacy Notice. We reserve the right to update this notice periodically. We encourage users to review this notice regularly for changes.
            </Text>

            <Text style={styles.text}>
              Thank you for choosing EDAT!
            </Text>
          </>
        )}
      </View>
    </Page>
  </Document>
);

const TermsAndConditions = ({ onClose }: { onClose: () => void }) => {
  const [isTerms, setIsTerms] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleContent = () => {
    setIsTerms((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full p-8 overflow-auto relative px-[10%]">
        <Button onClick={onClose} className="absolute top-4 right-4">
          Close
        </Button>
        <div className="mb-4" ref={contentRef}>
          <div className="flex justify-center mb-6">
            <Button
              onClick={toggleContent}
              className={`mx-2 ${
                isTerms
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Terms and Conditions
            </Button>
            <Button
              onClick={toggleContent}
              className={`mx-2 ${
                !isTerms
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Data Usage and Privacy Notice
            </Button>
          </div>

          {isTerms ? (
            <>
              <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
              <p>Welcome to EDAT!</p>
              <p>
                These Terms and Conditions ("Terms") govern your access to and use of the EDAT platform ("Platform"), a service provided by Educational Data Technology, Nigeria Limited ("EDATECH"). By accessing or using the Platform, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access or use the Platform.
              </p>

              <h2 className="text-2xl font-semibold mt-4">1. Eligibility</h2>
              <h3 className="text-xl font-semibold mt-2">Students:</h3>
              <p>
                EDAT empowers students to enhance their learning experience through a personalized and engaging platform. With the approval of their parents or teachers (acting in loco parentis), and with their supervision, students can leverage the Platform's features to explore educational content, practice skills, and track their progress. Parents and teachers play a crucial role in a student's learning journey on EDAT. Their involvement ensures a safe and enriching educational experience.
              </p>
              <h3 className="text-xl font-semibold mt-2">Parents and Teachers:</h3>
              <p>
                Parents and teachers must be at least 18 years old to enter into these Terms and use the Platform on behalf of their students. By creating an account and accepting these Terms, parents and teachers acknowledge their responsibility for supervising student use of the Platform.
              </p>

              <h2 className="text-2xl font-semibold mt-4">2. User Accounts</h2>
              <h3 className="text-xl font-semibold mt-2">Parents and Teachers:</h3>
              <p>
                Parents and teachers can create accounts to manage student access to the Platform, monitor progress reports, and collaborate with educators. You are responsible for maintaining the confidentiality of your account information, including your username and password. You are also responsible for all activity that occurs under your account. You agree to notify EDATECH immediately of any unauthorized use of your account or any other security breach.
              </p>

              <h2 className="text-2xl font-semibold mt-4">3. Content</h2>
              <p>
                The Platform contains content owned or licensed by EDATECH, its licensors, and other users. This content is protected by intellectual property laws. You agree not to copy, distribute, modify, or create derivative works of this content without the express written consent of EDATECH or the applicable rights owner.
              </p>
              <h3 className="text-xl font-semibold mt-2">Student Content:</h3>
              <p>
                Parents and teachers are responsible for ensuring students upload or post only appropriate content that aligns with the Platform's educational purpose. This includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside">
                <li>School assignments and projects</li>
                <li>Educational research findings and presentations</li>
                <li>Creative writing pieces related to class topics</li>
                <li>Drafts and revisions of essays or reports</li>
                <li>Answers to practice quizzes and exams (without sharing answer keys)</li>
                <li>Questions students have about specific topics covered in class</li>
                <li>Reflections on learning experiences and areas for improvement</li>
                <li>Uploading images, videos, or other multimedia content that is relevant to the learning task and properly attributed if necessary</li>
              </ul>
              <p>
                EDATECH reserves the right to remove any content that violates these Terms or is otherwise objectionable.
              </p>

              <h2 className="text-2xl font-semibold mt-4">4. Use of the Platform</h2>
              <p>
                You agree to use the Platform for lawful purposes only. This includes students using the Platform for educational purposes under the supervision of parents and teachers. You agree not to use the Platform in any way that could damage, disable, overburden, or impair the Platform or interfere with any other user's enjoyment of the Platform. You agree not to use the Platform to gain unauthorized access to any other computer system or network.
              </p>

              <h2 className="text-2xl font-semibold mt-4">5. Data Usage and Privacy</h2>
              <p>
                EDATECH collects and uses data in accordance with its Data Usage and Privacy Notice, which is incorporated into these Terms by reference. Please see the Data Usage and Privacy Notice for more information about how EDATECH collects, uses, and protects your data, including student data collected with verifiable parental consent.
              </p>

              <h2 className="text-2xl font-semibold mt-4">6. Disclaimers</h2>
              <p>
                The Platform is provided "as is" and without warranties of any kind, express or implied. EDATECH disclaims all warranties, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement. EDATECH does not warrant that the Platform will be uninterrupted or error-free, that defects will be corrected, or that the Platform is free of viruses or other harmful components. EDATECH does not warrant that the information provided on the Platform is accurate, complete, or reliable.
              </p>

              <h2 className="text-2xl font-semibold mt-4">7. Limitation of Liability</h2>
              <p>
                EDATECH will not be liable for any damages arising out of or related to your use of the Platform, including, but not limited to, direct, indirect, incidental, consequential, or punitive damages.
              </p>

              <h2 className="text-2xl font-semibold mt-4">8. Termination</h2>
              <p>
                These Terms may be terminated by either party at any time for any reason. In addition to any other remedy available at law or equity, EDATECH may terminate your access to the Platform without notice if you violate any of these Terms.
              </p>

              <h2 className="text-2xl font-semibold mt-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of Nigeria.
              </p>

              <h2 className="text-2xl font-semibold mt-4">10. Entire Agreement</h2>
              <p>
                These Terms constitute the entire agreement between you and EDATECH regarding your use of the Platform.
              </p>

              <h2 className="text-2xl font-semibold mt-4">11. Updates to the Terms</h2>
              <p>
                EDATECH reserves the right to update these Terms at any time. The updated Terms will be posted on the Platform. You are responsible for checking the Terms periodically for updates. Your continued use of the Platform after the posting of any updates constitutes your acceptance of the updated Terms.
              </p>

              <h2 className="text-2xl font-semibold mt-4">12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at <a href="mailto:support@edatech.com">support@edatech.com</a>.
              </p>

              <h2 className="text-2xl font-semibold mt-4">13. Additional Notes for Parents and Teachers</h2>
              <p>
                Parents and teachers are responsible for familiarizing themselves with the Platform's features and functionalities to effectively guide students in their learning journey. Parents and teachers are encouraged to communicate openly with students about online safety and responsible use of the Platform. EDATECH offers resources and support materials for parents and teachers to help them maximize the educational benefits of the Platform for their students.
              </p>

              <h2 className="text-2xl font-semibold mt-4">14. Indemnity</h2>
              <p>
                By accepting these Terms, parents and teachers agree to indemnify and hold harmless EDATECH, its officers, directors, employees, agents, and licensors from and against any and all claims, losses, liabilities, expenses, including attorney's fees, arising out of or in connection with their or their students' use of the Platform.
              </p>

              <h2 className="text-2xl font-semibold mt-4">15. Student Disclaimer</h2>
              <p>
                Students are encouraged to use the Platform responsibly and ethically. They should not share personal information about themselves or others without permission. Students should also avoid engaging in cyberbullying or any other form of online harassment.
              </p>

              <h2 className="text-2xl font-semibold mt-4">16. Suspension and Termination of Student Accounts</h2>
              <p>
                EDATECH reserves the right to suspend or terminate student accounts in cases of violation of these Terms or for any other reason deemed necessary to protect the safety and well-being of the online learning community. Parents and teachers will be notified in case of such actions.
              </p>

              <p className="mt-6">
                Thank you for choosing EDAT! We believe that by working together, parents, teachers, and students can leverage the EDAT Platform to create a personalized and enriching learning experience for all.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">Data Usage and Privacy Notice</h1>
              <p>
                This notice outlines how Educational Data Technology, Nigeria Limited (EDATECH) collects, uses, and protects the data of users interacting with our EDAT platform (the "Platform") in accordance with Nigerian Data Protection 
                Regulation (NDPR), US Children's Online Privacy Protection Act (COPPA), EU General Data Protection 
                Regulation (GDPR), and UK General Data Protection Regulation (UK GDPR).
              </p>

              <h2 className="text-2xl font-semibold mt-4">Data We Collect</h2>
              <p>The data we collect depends on the user role on the EDAT Platform:</p>

              <h3 className="text-xl font-semibold mt-2">Students:</h3>
              <h4 className="text-lg font-semibold mt-2">Required Data:</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Anonymized ID:</strong> This unique identifier ensures student privacy while allowing us to track their progress on the platform. EDATECH prioritizes student privacy and never collects personally identifiable information (PII) about students without verifiable parental consent.
                </li>
                <li>
                  <strong>Age Range:</strong> Knowing the student's age range allows EDAT to filter content and recommendations to ensure they are age-appropriate and comply with COPPA regulations for users under 13 (or the relevant age limit set by the specific region).
                </li>
              </ul>

              <h4 className="text-lg font-semibold mt-2">Optional Data (with Parental Consent):</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Name:</strong> Personalizing the learning experience by name can motivate students and make their interaction with the platform more engaging. However, we understand the importance of parental control over student data. That's why we require verifiable parental consent before collecting a student's name.
                </li>
                <li>
                  <strong>School Information:</strong> School affiliation can provide context for student performance and can be helpful for teachers who manage multiple classes across different schools. Similar to the student's name, school information is only collected with verifiable parental consent.
                </li>
              </ul>

              <h4 className="text-lg font-semibold mt-2">Learning Data (Always Anonymized):</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Performance on Exams and Learning Activities:</strong> This anonymized data allows us to personalize learning paths for each student by identifying their strengths and weaknesses. It also enables us to track progress over time and provide valuable insights to students, parents, and teachers.
                </li>
                <li>
                  <strong>Usage of Personalized Recommendations:</strong> By analyzing how students interact with our recommended learning activities, we can continuously improve the recommendation engine, ensuring it suggests the most suitable content for each student's individual needs.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">Teachers:</h3>
              <h4 className="text-lg font-semibold mt-2">Login Credentials:</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Username and Password:</strong> Securely stored using industry best practices like hashing and salting to protect user credentials in case of a data breach.
                </li>
              </ul>

              <h4 className="text-lg font-semibold mt-2">Class Management Data:</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Anonymized Student IDs:</strong> Associated with the teacher's classes to allow efficient management of student progress, assignments, and communication within their classes.
                </li>
              </ul>

              <h4 className="text-lg font-semibold mt-2">Optional Data (with User Consent):</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Name:</strong> Sharing names fosters better communication and collaboration between teachers, especially those working within the same school or district.
                </li>
                <li>
                  <strong>School Affiliation:</strong> Like student information, a teacher's school affiliation provides context and can be helpful for administrators managing multiple schools or districts using EDAT. We obtain the teacher's consent before collecting this information.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">Parents:</h3>
              <h4 className="text-lg font-semibold mt-2">Login Credentials:</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Credentials:</strong> Securely stored login credentials ensure authorized access to their child's data on the platform.
                </li>
              </ul>

              <h4 className="text-lg font-semibold mt-2">Child Information (with Parental Consent):</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Name:</strong> Parents can easily identify their child's data and reports within the platform.
                </li>
                <li>
                  <strong>Anonymized Student ID:</strong> Links the parent to their child's anonymized learning data, allowing them to monitor their child's progress without compromising student privacy. We require verifiable parental consent before collecting a child's name and linking it to their learning data.
                </li>
              </ul>

              <h4 className="text-lg font-semibold mt-2">Access to Student Reports:</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Progress on Learning Activities:</strong> Parents can see how their child is progressing through different learning modules and activities offered by the platform.
                </li>
                <li>
                  <strong>Performance Data (Always Anonymized):</strong> Anonymized performance data on exams, quizzes, and assignments provides valuable insights to parents about their child's strengths and weaknesses without revealing any personally identifiable information.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">School and Local Administrators:</h3>
              <h4 className="text-lg font-semibold mt-2">Login Credentials:</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Credentials:</strong> Ensure only authorized administrators have access to student data reports.
                </li>
              </ul>

              <h4 className="text-lg font-semibold mt-2">Aggregated Student Data (Always Anonymized):</h4>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Group Performance Reports:</strong> Provide administrators with valuable insights into student performance at the class or school level, enabling data-driven decisions to improve educational programs and learning outcomes for all students. By using anonymized data, EDAT protects student privacy while empowering administrators to optimize educational resources.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">Data Usage</h2>
              <p>We use the collected data for the following purposes:</p>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Students:</strong> Personalize learning experiences with recommendations and content suitable for their age and skill level (based on anonymized learning data). Provide progress tracking and reports to students, parents, and teachers (using anonymized data to protect student privacy). Improve the EDAT Platform's functionalities through analysis of anonymized learning data to continuously enhance the platform's effectiveness.
                </li>
                <li>
                  <strong>Teachers:</strong> Manage student progress and learning activities within their classes. Gain insights into anonymized student performance data to develop effective teaching strategies tailored to the specific needs of their students.
                </li>
                <li>
                  <strong>Parents:</strong> Monitor their child's progress on the EDAT Platform and access anonymized performance data and learning activity reports to understand their child's learning journey and identify areas where they might require additional support.
                </li>
                <li>
                  <strong>School and Local Administrators:</strong> Track overall student performance at the class or school level (using anonymized data reports) to identify areas for improvement in curriculum, teaching methods, or resource allocation. Make data-driven decisions to optimize educational programs and learning outcomes for all students.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">Data Security and Privacy</h2>
              <p>EDAT prioritizes data security and privacy. We implement the following measures:</p>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Secure Storage:</strong> All data is stored on secure servers with industry-standard security practices like encryption and access controls to prevent unauthorized access.
                </li>
                <li>
                  <strong>Anonymization:</strong> We prioritize student privacy. Student performance data is always anonymized before analysis or reporting. This ensures valuable insights can be gained for improving the platform and learning experience without compromising student identity.
                </li>
                <li>
                  <strong>Parental Consent:</strong> We obtain verifiable parental consent for collecting and using data beyond basic information for students under the age limit defined by COPPA (or the relevant age limit set by the specific region).
                </li>
                <li>
                  <strong>User Control:</strong> Users have the right to access, modify, or delete their data upon request (subject to legal and regulatory restrictions). For student data, we will process such requests in accordance with parental consent.
                </li>
                <li>
                  <strong>Data Retention:</strong> We retain student data for a maximum of five years after a student becomes inactive on the platform (unless parental consent is provided for longer retention). This timeframe allows us to maintain historical data for platform improvement and to provide valuable insights to parents and educators who might rejoin the platform in the future. We regularly review and update our data retention policies in accordance with best practices and regulatory requirements.
                </li>
                <li>
                  <strong>Compliance with Regulations:</strong> We adhere to Nigerian Data Protection Regulation (NDPR), US Children's Online Privacy Protection Act (COPPA), EU General Data Protection Regulation (GDPR), and UK General Data Protection Regulation (UK GDPR).
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">Creating Models and Tailoring Assessments</h2>
              <p>
                The anonymized learning data we collect allows us to develop sophisticated models that analyze student performance trends and learning styles. These models power the EDAT platform's recommendation engine, suggesting the most suitable learning activities and content for each student's individual needs. Additionally, anonymized data is used to create adaptive assessments that adjust difficulty levels and question types based on student performance, providing a more personalized and engaging learning experience.
              </p>

              <h2 className="text-2xl font-semibold mt-6">Your Rights</h2>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Access and Modification:</strong> You have the right to access and modify your data upon request (subject to legal and regulatory restrictions). For student data, we will process such requests in accordance with parental consent.
                </li>
                <li>
                  <strong>Erasure:</strong> You have the right to request the erasure of your data. However, there may be circumstances where we are unable to do so due to legal or regulatory obligations.
                </li>
                <li>
                  <strong>Complaint:</strong> If you have any concerns about how we handle your data, you can lodge a complaint with the relevant data protection authority.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
              <p>
                If you have any questions about this Data Usage and Privacy Notice, please contact our Data Protection Officer at <a href="mailto:dpo@edatech.ai">dpo@edatech.ai</a>.
              </p>

              <h2 className="text-2xl font-semibold mt-6">Additional Notes for Different Regions</h2>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Nigeria (NDPR):</strong> The notice explicitly mentions the rights of data subjects under NDPR, including rectification, erasure, and restriction of processing of their data.
                </li>
                <li>
                  <strong>US (COPPA):</strong> The notice clearly states the age limit below which parental consent is mandatory for collecting any personal information beyond basic student identification.
                </li>
                <li>
                  <strong>EU (GDPR) and UK (UK GDPR):</strong> The notice specifies the legal basis for data processing (e.g., consent, legitimate interest) and data retention periods. Users have the right to data portability under these regulations.
                </li>
              </ul>
              <p>
                By using the EDAT Platform, users acknowledge this Data Usage and Privacy Notice. We reserve the right to update this notice periodically. We encourage users to review this notice regularly for changes.
              </p>

              <p className="mt-6">
                Thank you for choosing EDAT!
              </p>
            </>
          )}
        </div>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
        <PDFDownloadLink
          document={<PDFDocument isTerms={isTerms} />}
          fileName={isTerms ? "Terms_and_Conditions.pdf" : "Data_Usage_and_Privacy_Notice.pdf"}
        >
          {({ loading }) => (
            <Button className="mt-6" disabled={loading}>
              {loading ? "Preparing download..." : "Download as PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default TermsAndConditions;
