import React, { useState, useRef } from 'react';
import { Printer, FileText, User, Heart, Wind, Brain, Ear, Droplet, TestTube, ChevronsRight, FileCheck } from 'lucide-react';

// --- Helper Components ---
const SectionTitle = ({ children }) => <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 mb-6">{children}</h2>;
const SubSectionTitle = ({ children }) => <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">{children}</h3>;
const FormRow = ({ children }) => <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-4">{children}</div>;
const InputField = ({ label, name, value, onChange, placeholder, type = "text", required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        />
    </div>
);
const RadioGroup = ({ label, name, options, value, onChange, required = false }) => (
    <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="flex items-center space-x-4">
            {options.map(option => (
                <label key={option.value} className="flex items-center">
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={onChange}
                        required={required}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);
const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        ></textarea>
    </div>
);
const ProgressBar = ({ currentStep }) => {
    const steps = ['Tier 1 Exam', 'Tier 1 Certificate', 'Consent', 'Tier 2 Exam', 'Final Certificate'];
    const stepIndex = steps.indexOf(currentStep);

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${index <= stepIndex ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                                {index < stepIndex ? '✓' : index + 1}
                            </div>
                            <p className={`mt-2 text-xs text-center font-semibold ${index <= stepIndex ? 'text-blue-600' : 'text-gray-500'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${index < stepIndex ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// --- Form Components ---

const Tier1Form = ({ formData, setFormData, onComplete }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        setFormData(prev => {
            let temp = { ...prev };
            let current = temp;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = current[keys[i]] || {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return temp;
        });
    };
    
    const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div>
                <SectionTitle>Tier 1: General Medical Examination</SectionTitle>
                <SubSectionTitle>Personal Statement (To be filled by Applicant)</SubSectionTitle>
                <FormRow>
                    <InputField label="Surname" name="tier1.personal.surname" value={getNestedValue(formData, 'tier1.personal.surname')} onChange={handleChange} required />
                    <InputField label="Given Names" name="tier1.personal.givenNames" value={getNestedValue(formData, 'tier1.personal.givenNames')} onChange={handleChange} required />
                </FormRow>
                <FormRow>
                    <InputField label="Date of Birth" name="tier1.personal.dob" type="date" value={getNestedValue(formData, 'tier1.personal.dob')} onChange={handleChange} required />
                    <InputField label="Birth Certificate No" name="tier1.personal.birthCertNo" value={getNestedValue(formData, 'tier1.personal.birthCertNo')} onChange={handleChange} />
                </FormRow>
                <FormRow>
                    <InputField label="Email" name="tier1.personal.email" type="email" value={getNestedValue(formData, 'tier1.personal.email')} onChange={handleChange} />
                    <InputField label="Phone No" name="tier1.personal.phone" value={getNestedValue(formData, 'tier1.personal.phone')} onChange={handleChange} required />
                </FormRow>
                <TextAreaField label="Family History (State of health of parents, brothers, and/or sisters)" name="tier1.history.family" value={getNestedValue(formData, 'tier1.history.family')} onChange={handleChange} />
                
                <SubSectionTitle>Medical History Questions</SubSectionTitle>
                <TextAreaField label="Any history of tuberculosis, diabetes, cancer, insanity in the family?" name="tier1.history.q1" value={getNestedValue(formData, 'tier1.history.q1')} onChange={handleChange} />
                <FormRow>
                    <RadioGroup label="Spitting of blood, influenza, or a persistent cough?" name="tier1.history.q2" options={[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]} value={getNestedValue(formData, 'tier1.history.q2')} onChange={handleChange} />
                    <RadioGroup label="Rheumatic fever, diabetes, palpitation, heart/lung disease?" name="tier1.history.q3" options={[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]} value={getNestedValue(formData, 'tier1.history.q3')} onChange={handleChange} />
                    <RadioGroup label="Stomach, liver, or bowel issues?" name="tier1.history.q4" options={[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]} value={getNestedValue(formData, 'tier1.history.q4')} onChange={handleChange} />
                    <RadioGroup label="Epilepsy or fits?" name="tier1.history.q5" options={[{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}]} value={getNestedValue(formData, 'tier1.history.q5')} onChange={handleChange} />
                    <RadioGroup label="Discharge from ears?" name="tier1.history.q6" options={[{label: 'Yes', value: 'yes'}, {label: 'No', 'value': 'no'}]} value={getNestedValue(formData, 'tier1.history.q6')} onChange={handleChange} />
                    <RadioGroup label="Dermatitis or skin eruptions?" name="tier1.history.q7" options={[{label: 'Yes', value: 'yes'}, {label: 'No', 'value': 'no'}]} value={getNestedValue(formData, 'tier1.history.q7')} onChange={handleChange} />
                </FormRow>
            </div>
            
            <div>
                <SubSectionTitle>Confidential Medical Officer's Report</SubSectionTitle>
                <FormRow>
                     <InputField label="Height (cm)" name="tier1.officerReport.height" type="number" value={getNestedValue(formData, 'tier1.officerReport.height')} onChange={handleChange} />
                     <InputField label="Weight (kg)" name="tier1.officerReport.weight" type="number" value={getNestedValue(formData, 'tier1.officerReport.weight')} onChange={handleChange} />
                </FormRow>
                <FormRow>
                    <InputField label="Blood Pressure (Systolic)" name="tier1.officerReport.bpSystolic" value={getNestedValue(formData, 'tier1.officerReport.bpSystolic')} onChange={handleChange} />
                    <InputField label="Blood Pressure (Diastolic)" name="tier1.officerReport.bpDiastolic" value={getNestedValue(formData, 'tier1.officerReport.bpDiastolic')} onChange={handleChange} />
                </FormRow>
                <InputField label="Pulse Rate (/minute)" name="tier1.officerReport.pulse" type="number" value={getNestedValue(formData, 'tier1.officerReport.pulse')} onChange={handleChange} />
                <TextAreaField label="Heart Efficiency Notes" name="tier1.officerReport.heartNotes" value={getNestedValue(formData, 'tier1.officerReport.heartNotes')} onChange={handleChange} />
                <TextAreaField label="Lungs Efficiency Notes" name="tier1.officerReport.lungsNotes" value={getNestedValue(formData, 'tier1.officerReport.lungsNotes')} onChange={handleChange} />
                <RadioGroup label="Chest X-Ray Result" name="tier1.officerReport.cxr" options={[{label: 'Normal', value: 'normal'}, {label: 'Abnormal', value: 'abnormal'}]} value={getNestedValue(formData, 'tier1.officerReport.cxr')} onChange={handleChange} />
                <TextAreaField label="Abdominal Organs Notes" name="tier1.officerReport.abdominalNotes" value={getNestedValue(formData, 'tier1.officerReport.abdominalNotes')} onChange={handleChange} />
                <SubSectionTitle>Medical Officer's Recommendation</SubSectionTitle>
                <RadioGroup 
                    label="Recommendation" 
                    name="tier1.officerReport.recommendation"
                    options={[
                        {label: 'Eligible for training and recruitment', value: 'eligible'},
                        {label: 'Ineligible for training and recruitment', value: 'ineligible'},
                        {label: 'Deferred', value: 'deferred'}
                    ]}
                    value={getNestedValue(formData, 'tier1.officerReport.recommendation')}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex justify-end pt-8">
                <button type="submit" className="flex items-center bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                    Generate Tier 1 Certificate <FileCheck className="ml-2 h-5 w-5" />
                </button>
            </div>
        </form>
    );
};

const Tier1Certificate = ({ formData, onPrint, onReset, onProceed }) => {
    const certificateRef = useRef();
    const tier1Rec = formData.tier1?.officerReport?.recommendation;

    const renderStatus = (status) => {
        switch(status) {
            case 'eligible': return <span className="font-bold text-green-600">ELIGIBLE</span>;
            case 'ineligible': return <span className="font-bold text-red-600">INELIGIBLE</span>;
            case 'deferred': return <span className="font-bold text-yellow-600">DEFERRED</span>;
            default: return 'N/A';
        }
    };

    const CertField = ({label, value}) => (
      <div className="mb-2">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="ml-2 text-gray-800">{value || 'N/A'}</span>
      </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <SectionTitle>Tier 1 Medical Certificate</SectionTitle>
                <div>
                     <button onClick={onReset} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-600 transition duration-300">
                        Start New
                    </button>
                    <button onClick={() => onPrint(certificateRef)} className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-2 hover:bg-green-700 transition duration-300">
                        <Printer className="mr-2 h-5 w-5" /> Print Certificate
                    </button>
                    {tier1Rec === 'eligible' && (
                        <button onClick={onProceed} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                            Proceed to Tier 2 <ChevronsRight className="ml-2 h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            <div ref={certificateRef} className="p-8 border border-gray-300 bg-white rounded-lg shadow-lg printable-area">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">ROYAL PAPUA NEW GUINEA CONSTABULARY</h1>
                    <h2 className="text-2xl font-semibold text-gray-700">Tier 1 Medical Certificate</h2>
                </div>

                <div className="mb-8 p-4 border rounded">
                  <h3 className="text-xl font-bold mb-2">Applicant Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <CertField label="Full Name" value={`${formData.tier1?.personal?.givenNames || ''} ${formData.tier1?.personal?.surname || ''}`} />
                    <CertField label="Date of Birth" value={formData.tier1?.personal?.dob} />
                  </div>
                </div>

                <div className="mb-8 p-4 border rounded">
                  <h3 className="text-xl font-bold mb-2">Tier 1 Examination Summary</h3>
                  <CertField label="Recommendation" value={renderStatus(tier1Rec)} />
                   <div className="grid grid-cols-2 gap-4 mt-2">
                    <CertField label="Height" value={`${formData.tier1?.officerReport?.height || 'N/A'} cm`} />
                    <CertField label="Weight" value={`${formData.tier1?.officerReport?.weight || 'N/A'} kg`} />
                    <CertField label="Blood Pressure" value={`${formData.tier1?.officerReport?.bpSystolic || 'N/A'} / ${formData.tier1?.officerReport?.bpDiastolic || 'N/A'}`} />
                    <CertField label="Pulse" value={`${formData.tier1?.officerReport?.pulse || 'N/A'} /min`} />
                  </div>
                </div>
                 <div className="mt-16 text-center text-sm text-gray-500">
                    <p>Official Document of the RPNGC Medical Services - Tier 1</p>
                    <p>Date Generated: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
            </div>
        </div>
    );
};


const ConsentForm = ({ formData, setFormData, onComplete }) => {
    const [agreed, setAgreed] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(agreed) {
            setFormData(prev => ({...prev, consent: { agreed: true, date: new Date().toLocaleDateString('en-CA')}}));
            onComplete();
        } else {
            alert('You must agree to the terms to proceed.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <SectionTitle>Informed Consent for Tier 2 Examinations</SectionTitle>
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                <p className="mb-4">To undertake the RPNGC Tier-2: Occupational Medical Examinations being conducted by the Medical Team of the National Centre of Excellence (NCOE) Bomana Regimental Clinic.</p>
                <p className="mb-2 font-semibold">I have been informed of the following Confidential Tests:</p>
                <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
                    <li>Multiple Illicit Drugs Screening</li>
                    <li>Serology Blood testing (HIV, Hepatitis A/B/C, Syphilis)</li>
                    <li>Blood Grouping and Typing</li>
                </ul>
                <p>I understand the purposes, procedures, and the possible outcomes of these tests. I also understand that my results will remain CONFIDENTIAL. I have had an opportunity to ask questions and I am satisfied with the answers I have received.</p>
            </div>
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-md">
                <input
                    type="checkbox"
                    id="consent-agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="consent-agree" className="ml-3 block text-lg font-medium text-gray-800">
                    I, {formData.tier1?.personal?.givenNames || '[Applicant Name]'} {formData.tier1?.personal?.surname}, agree to the terms and consent to the Tier 2 examinations.
                </label>
            </div>
            <div className="flex justify-end pt-8">
                 <button type="submit" className="flex items-center bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300" disabled={!agreed}>
                    Confirm Consent & Proceed <ChevronsRight className="ml-2 h-5 w-5" />
                </button>
            </div>
        </form>
    );
};

const Tier2Form = ({ formData, setFormData, onComplete }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        setFormData(prev => {
            let temp = { ...prev };
            let current = temp;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = current[keys[i]] || {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return temp;
        });
    };
    
    const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <SectionTitle>Tier 2: Occupational Medical Examinations</SectionTitle>

            <SubSectionTitle>Specific Examinations</SubSectionTitle>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-bold flex items-center mb-2"><Brain className="mr-2"/>Central Nervous System</h4>
                    <RadioGroup label="Memory & Cognition" name="tier2.exams.cns.memory" options={[{label: 'Normal', value: 'normal'}, {label: 'Impaired', value: 'impaired'}]} value={getNestedValue(formData, 'tier2.exams.cns.memory')} onChange={handleChange} />
                    <RadioGroup label="Cerebella (Romberg's Test)" name="tier2.exams.cns.cerebella" options={[{label: 'Normal', value: 'normal'}, {label: 'Abnormal', value: 'abnormal'}]} value={getNestedValue(formData, 'tier2.exams.cns.cerebella')} onChange={handleChange} />
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-bold flex items-center mb-2"><Ear className="mr-2"/>Audiometry (AUDIO)</h4>
                    <RadioGroup label="Result" name="tier2.exams.audio.result" options={[{label: 'Normal', value: 'normal'}, {label: 'Abnormal', value: 'abnormal'}]} value={getNestedValue(formData, 'tier2.exams.audio.result')} onChange={handleChange} />
                    <InputField label="Key Findings (if abnormal)" name="tier2.exams.audio.findings" value={getNestedValue(formData, 'tier2.exams.audio.findings')} onChange={handleChange} />
                </div>
                 <div className="p-4 border rounded-lg">
                    <h4 className="font-bold flex items-center mb-2"><Heart className="mr-2"/>Electrocardiography (ECG)</h4>
                    <RadioGroup label="Result" name="tier2.exams.ecg.result" options={[{label: 'Normal', value: 'normal'}, {label: 'Abnormal', value: 'abnormal'}]} value={getNestedValue(formData, 'tier2.exams.ecg.result')} onChange={handleChange} />
                    <InputField label="Key Findings (if abnormal)" name="tier2.exams.ecg.findings" value={getNestedValue(formData, 'tier2.exams.ecg.findings')} onChange={handleChange} />
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-bold flex items-center mb-2"><Wind className="mr-2"/>Spirometry (SPIRO)</h4>
                    <RadioGroup label="Result" name="tier2.exams.spiro.result" options={[{label: 'Normal', value: 'normal'}, {label: 'Abnormal', value: 'abnormal'}]} value={getNestedValue(formData, 'tier2.exams.spiro.result')} onChange={handleChange} />
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-bold flex items-center mb-2"><Droplet className="mr-2"/>Illicit Drugs Testing</h4>
                    <RadioGroup label="Result" name="tier2.exams.drugs.result" options={[{label: 'Normal', value: 'normal'}, {label: 'Abnormal', value: 'abnormal'}]} value={getNestedValue(formData, 'tier2.exams.drugs.result')} onChange={handleChange} />
                    <InputField label="Substances Detected (if abnormal)" name="tier2.exams.drugs.substances" value={getNestedValue(formData, 'tier2.exams.drugs.substances')} onChange={handleChange} />
                </div>
                 <div className="p-4 border rounded-lg">
                    <h4 className="font-bold flex items-center mb-2"><TestTube className="mr-2"/>Serology & Blood</h4>
                    <RadioGroup label="Hepatitis (A,B,C)" name="tier2.exams.serology.hepatitis" options={[{label: 'Negative', value: 'negative'}, {label: 'Positive', value: 'positive'}]} value={getNestedValue(formData, 'tier2.exams.serology.hepatitis')} onChange={handleChange} />
                    <RadioGroup label="HIV" name="tier2.exams.serology.hiv" options={[{label: 'Negative', value: 'negative'}, {label: 'Positive', value: 'positive'}]} value={getNestedValue(formData, 'tier2.exams.serology.hiv')} onChange={handleChange} />
                     <RadioGroup label="VDRL (Syphilis)" name="tier2.exams.serology.vdrl" options={[{label: 'Negative', value: 'negative'}, {label: 'Positive', value: 'positive'}]} value={getNestedValue(formData, 'tier2.exams.serology.vdrl')} onChange={handleChange} />
                    <InputField label="Blood Type/Group" name="tier2.exams.blood.group" value={getNestedValue(formData, 'tier2.exams.blood.group')} onChange={handleChange} placeholder="e.g., A, B, AB, O" />
                    <RadioGroup label="Rhesus" name="tier2.exams.blood.rhesus" options={[{label: 'Negative', value: 'negative'}, {label: 'Positive', value: 'positive'}]} value={getNestedValue(formData, 'tier2.exams.blood.rhesus')} onChange={handleChange} />
                </div>
            </div>

            <SubSectionTitle>Specialist Medical Officer's Recommendation</SubSectionTitle>
             <RadioGroup 
                label="Final Recommendation" 
                name="tier2.recommendation.status"
                options={[
                    {label: 'Eligible for Police Recruit Training', value: 'eligible'},
                    {label: 'Ineligible for Police Recruit Training', value: 'ineligible'},
                    {label: 'Deferred for Police Recruit Training', value: 'deferred'},
                    {label: 'Pending Review', value: 'pending'}
                ]}
                value={getNestedValue(formData, 'tier2.recommendation.status')}
                onChange={handleChange}
                required
            />
            <TextAreaField label="Comments" name="tier2.recommendation.comments" value={getNestedValue(formData, 'tier2.recommendation.comments')} onChange={handleChange} />

            <div className="flex justify-end pt-8">
                <button type="submit" className="flex items-center bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                    Generate Final Certificate <FileText className="ml-2 h-5 w-5" />
                </button>
            </div>
        </form>
    );
};

const FinalCertificate = ({ formData, onPrint, onReset }) => {
    const certificateRef = useRef();
    const tier1Rec = formData.tier1?.officerReport?.recommendation;
    const tier2Rec = formData.tier2?.recommendation?.status;

    const renderStatus = (status) => {
        switch(status) {
            case 'eligible': return <span className="font-bold text-green-600">ELIGIBLE</span>;
            case 'ineligible': return <span className="font-bold text-red-600">INELIGIBLE</span>;
            case 'deferred': return <span className="font-bold text-yellow-600">DEFERRED</span>;
            case 'pending': return <span className="font-bold text-blue-600">PENDING REVIEW</span>;
            default: return 'N/A';
        }
    };
    
    const CertField = ({label, value}) => (
      <div className="mb-2">
        <span className="font-semibold text-gray-600">{label}:</span>
        <span className="ml-2 text-gray-800">{value || 'N/A'}</span>
      </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <SectionTitle>Final Medical Certificate</SectionTitle>
                <div>
                     <button onClick={onReset} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-600 transition duration-300">
                        Start New
                    </button>
                    <button onClick={() => onPrint(certificateRef)} className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                        <Printer className="mr-2 h-5 w-5" /> Print Certificate
                    </button>
                </div>
            </div>

            <div ref={certificateRef} className="p-8 border border-gray-300 bg-white rounded-lg shadow-lg printable-area">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">ROYAL PAPUA NEW GUINEA CONSTABULARY</h1>
                    <h2 className="text-2xl font-semibold text-gray-700">Occupational Medical Certificate</h2>
                </div>

                <div className="mb-8 p-4 border rounded">
                  <h3 className="text-xl font-bold mb-2">Applicant Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <CertField label="Full Name" value={`${formData.tier1?.personal?.givenNames || ''} ${formData.tier1?.personal?.surname || ''}`} />
                    <CertField label="Date of Birth" value={formData.tier1?.personal?.dob} />
                    <CertField label="Phone" value={formData.tier1?.personal?.phone} />
                    <CertField label="Email" value={formData.tier1?.personal?.email} />
                  </div>
                </div>

                <div className="mb-8 p-4 border rounded">
                  <h3 className="text-xl font-bold mb-2">Tier 1 Examination Summary</h3>
                  <CertField label="Recommendation" value={renderStatus(tier1Rec)} />
                </div>
                
                <div className="p-4 border rounded">
                    <h3 className="text-xl font-bold mb-2">Tier 2 Examination Summary</h3>
                    <CertField label="Final Recommendation" value={renderStatus(tier2Rec)} />
                    {tier2Rec === 'ineligible' || tier2Rec === 'deferred' || tier2Rec === 'pending' ? 
                        <CertField label="Comments" value={formData.tier2?.recommendation?.comments} /> : null
                    }
                    <div className="grid grid-cols-2 gap-4 mt-4">
                       <CertField label="ECG" value={formData.tier2?.exams?.ecg?.result || 'N/A'} />
                       <CertField label="Spirometry" value={formData.tier2?.exams?.spiro?.result || 'N/A'} />
                       <CertField label="Audiometry" value={formData.tier2?.exams?.audio?.result || 'N/A'} />
                       <CertField label="Drug Screen" value={formData.tier2?.exams?.drugs?.result || 'N/A'} />
                       <CertField label="HIV Status" value={formData.tier2?.exams?.serology?.hiv || 'N/A'} />
                       <CertField label="Blood Group" value={formData.tier2?.exams?.blood?.group || 'N/A'} />
                    </div>
                </div>

                <div className="mt-16 text-center text-sm text-gray-500">
                    <p>Official Document of the RPNGC Medical Services</p>
                    <p>Date Generated: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
    const [currentStep, setCurrentStep] = useState('Tier 1 Exam');
    const [formData, setFormData] = useState({});
    
    const initialFormState = {};

    const handleTier1Complete = () => {
        setCurrentStep('Tier 1 Certificate');
    };
    
    const handleProceedToTier2 = () => {
        setCurrentStep('Consent');
    };

    const handleConsentComplete = () => {
        setCurrentStep('Tier 2 Exam');
    };

    const handleTier2Complete = () => {
        setCurrentStep('Final Certificate');
    };
    
    const handlePrint = (componentRef) => {
        const printContents = componentRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = `<style>
            @media print {
              body * { visibility: hidden; }
              .printable-area, .printable-area * { visibility: visible; }
              .printable-area { position: absolute; left: 0; top: 0; width: 100%; }
            }
        </style>` + printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); 
    };
    
    const handleReset = () => {
        setFormData(initialFormState);
        setCurrentStep('Tier 1 Exam');
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'Tier 1 Exam':
                return <Tier1Form formData={formData} setFormData={setFormData} onComplete={handleTier1Complete} />;
            case 'Tier 1 Certificate':
                 return <Tier1Certificate formData={formData} onPrint={handlePrint} onReset={handleReset} onProceed={handleProceedToTier2} />;
            case 'Consent':
                return <ConsentForm formData={formData} setFormData={setFormData} onComplete={handleConsentComplete} />;
            case 'Tier 2 Exam':
                return <Tier2Form formData={formData} setFormData={setFormData} onComplete={handleTier2Complete} />;
            case 'Final Certificate':
                return <FinalCertificate formData={formData} onPrint={handlePrint} onReset={handleReset} />;
            default:
                return <div>Error: Unknown Step</div>;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center mb-8">
                    <User className="w-12 h-12 text-blue-600 mr-4" />
                    <div>
                      <h1 className="text-3xl font-extrabold text-gray-900">RPNGC Medical Certificate Generator</h1>
                      <p className="text-gray-500">A digital workflow for applicant medical examinations.</p>
                    </div>
                </div>
                
                <ProgressBar currentStep={currentStep} />
                
                <div className="mt-8">
                    {renderCurrentStep()}
                </div>
            </div>
        </div>
    );
}
