let currentProfiles = {};
let activeProfile = null;

function createSidebar() {
  if (document.getElementById("job-autofill-sidebar")) return;

  const sidebar = document.createElement("div");
  sidebar.id = "job-autofill-sidebar";

  // Header
  const header = document.createElement("div");
  header.className = "sidebar-header";
  
  const title = document.createElement("h2");
  title.textContent = "⚡ Filling Good~";
  
  const subtitle = document.createElement("p");
  subtitle.textContent = 'Make job applying "fill" good!';
  
  const closeBtn = document.createElement("button");
  closeBtn.className = "sidebar-close-btn";
  closeBtn.textContent = "✕";
  closeBtn.onclick = () => {
    sidebar.classList.remove("open");
    document.body.style.marginRight = "0";
  };
  
  header.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(subtitle);

  // Main content container
  const content = document.createElement("div");
  content.className = "sidebar-content";

  // Profile selector section
  const profileSection = createProfileSection();
  content.appendChild(profileSection);

  // Quick copy section (hidden initially)
  const quickCopySection = createQuickCopySection();
  content.appendChild(quickCopySection);

  // Profile form section (hidden initially)  
  const profileFormSection = createProfileFormSection();
  content.appendChild(profileFormSection);

  sidebar.appendChild(header);
  sidebar.appendChild(content);
  document.body.appendChild(sidebar);
}

function createProfileSection() {
  const section = document.createElement("div");
  section.className = "profile-section";

  // Just the new profile button at the top
  const profileHeader = document.createElement("div");
  profileHeader.className = "profile-header";

  const newProfileBtn = document.createElement("button");
  newProfileBtn.className = "btn-primary";
  newProfileBtn.textContent = "+ New Profile";
  newProfileBtn.onclick = showProfileForm;

  profileHeader.appendChild(newProfileBtn);
  
  // Profile list container 
  const profileList = document.createElement("div");
  profileList.id = "profile-list";
  profileList.className = "profile-list";

  section.appendChild(profileHeader);
  section.appendChild(profileList);

  return section;
}

function createQuickCopySection() {
  const section = document.createElement("div");
  section.id = "quick-copy-section";
  section.className = "hidden";

  const title = document.createElement("h3");
  title.textContent = "Quick Copy";
  section.appendChild(title);

  // This will be dynamically populated based on the active profile
  const copyContainer = document.createElement("div");
  copyContainer.id = "copy-buttons-container";
  section.appendChild(copyContainer);

  return section;
}

function populateCopyButtons() {
  const container = document.getElementById("copy-buttons-container");
  if (!container || !activeProfile) return;
  
  container.innerHTML = '';

  // Website Links
  const websiteButtons = [];
  if (activeProfile.portfolio) websiteButtons.push({ field: 'portfolio', label: '💼 Portfolio' });
  if (activeProfile.linkedin) websiteButtons.push({ field: 'linkedin', label: '💼 LinkedIn' });
  if (activeProfile.personalWebsite) websiteButtons.push({ field: 'personalWebsite', label: '🌐 Personal Website' });
  if (activeProfile.github) websiteButtons.push({ field: 'github', label: '💻 GitHub' });
  
  if (websiteButtons.length > 0) {
    const websiteGroup = createCopyGroup("Website Links", websiteButtons);
    container.appendChild(websiteGroup);
  }

  // Personal Info
  const personalButtons = [];
  if (activeProfile.firstName) personalButtons.push({ field: 'firstName', label: '📝 First Name', value: activeProfile.firstName });
  if (activeProfile.lastName) personalButtons.push({ field: 'lastName', label: '📝 Last Name', value: activeProfile.lastName });
  if (activeProfile.fullName) personalButtons.push({ field: 'fullName', label: '👤 Full Name', value: activeProfile.fullName });
  if (activeProfile.email) personalButtons.push({ field: 'email', label: '📧 Email', value: activeProfile.email });
  if (activeProfile.phone) personalButtons.push({ field: 'phone', label: '📞 Phone', value: activeProfile.phone });
  if (activeProfile.address1) personalButtons.push({ field: 'address1', label: '📍 Address 1', value: activeProfile.address1 });
  if (activeProfile.address2) personalButtons.push({ field: 'address2', label: '📍 Address 2', value: activeProfile.address2 });
  if (activeProfile.city) personalButtons.push({ field: 'city', label: '🏙️ City', value: activeProfile.city });
  if (activeProfile.state) personalButtons.push({ field: 'state', label: '📍 State', value: activeProfile.state });
  if (activeProfile.zipCode) personalButtons.push({ field: 'zipCode', label: '📮 Zip Code', value: activeProfile.zipCode });
  if (activeProfile.fullAddress) personalButtons.push({ field: 'fullAddress', label: '📍 Full Address', value: activeProfile.fullAddress });
  
  if (personalButtons.length > 0) {
    const personalGroup = createCopyGroup("Personal Info", personalButtons, 'three-col');
    container.appendChild(personalGroup);
  }

  // Professional Summary
  if (activeProfile.summary) {
    const summaryGroup = createCopyGroup("Professional", [
      { field: 'summary', label: '📄 Summary' }
    ]);
    container.appendChild(summaryGroup);
  }

  // Work Experiences
  const workExperiences = activeProfile.workExperiences || [];
  workExperiences.forEach((exp, index) => {
    const expButtons = [];
    if (exp.jobTitle) expButtons.push({ field: `exp_${index}_jobTitle`, label: '💼 Job Title', value: exp.jobTitle });
    if (exp.company) expButtons.push({ field: `exp_${index}_company`, label: '🏢 Company', value: exp.company });
    if (exp.location) expButtons.push({ field: `exp_${index}_location`, label: '📍 Location', value: exp.location });
    if (exp.startDate) expButtons.push({ field: `exp_${index}_startDate`, label: '📅 Start Date', value: exp.startDate });
    if (exp.endDate) expButtons.push({ field: `exp_${index}_endDate`, label: '📅 End Date', value: exp.endDate });
    if (exp.description) expButtons.push({ field: `exp_${index}_description`, label: '📝 Description', value: exp.description });
    
    if (expButtons.length > 0) {
      // Use company name in the section title if available
      const sectionTitle = exp.company ? `Work: ${exp.company}` : `Work Experience ${index + 1}`;
      const expGroup = createCopyGroup(sectionTitle, expButtons);
      container.appendChild(expGroup);
    }
  });

  // Skills - Show actual skill text on buttons
  const skills = activeProfile.skills || [];
  const skillButtons = skills.map((skill, index) => ({
    field: `skill_${index}`,
    label: skill, // Show the actual skill text instead of "Skill 1"
    value: skill
  })).filter(s => s.value);
  
  if (skillButtons.length > 0) {
    const skillsGroup = createCopyGroup("Skills", skillButtons);
    container.appendChild(skillsGroup);
  }

  // Education
  const education = activeProfile.education || [];
  education.forEach((edu, index) => {
    const eduButtons = [];
    if (edu.schoolName) eduButtons.push({ field: `edu_${index}_schoolName`, label: '🎓 School', value: edu.schoolName });
    if (edu.degree) eduButtons.push({ field: `edu_${index}_degree`, label: '📜 Degree', value: edu.degree });
    if (edu.major) eduButtons.push({ field: `edu_${index}_major`, label: '📚 Major', value: edu.major });
    if (edu.startDate) eduButtons.push({ field: `edu_${index}_startDate`, label: '📅 Start Date', value: edu.startDate });
    if (edu.endDate) eduButtons.push({ field: `edu_${index}_endDate`, label: '📅 End Date', value: edu.endDate });
    
    if (eduButtons.length > 0) {
      // Use school name in the section title if available
      const sectionTitle = edu.schoolName ? `Education: ${edu.schoolName}` : `Education ${index + 1}`;
      const eduGroup = createCopyGroup(sectionTitle, eduButtons);
      container.appendChild(eduGroup);
    }
  });

  // Certifications - Show actual certification text on buttons
  const certifications = activeProfile.certifications || [];
  const certButtons = certifications.map((cert, index) => ({
    field: `cert_${index}`,
    label: cert, // Show the actual certification text instead of "Certification 1"
    value: cert
  })).filter(c => c.value);
  
  if (certButtons.length > 0) {
    const certsGroup = createCopyGroup("Certifications", certButtons);
    container.appendChild(certsGroup);
  }
}

function createCopyGroup(title, buttons, gridClass = '') {
  const group = document.createElement("div");
  group.className = "copy-group";

  const label = document.createElement("label");
  label.textContent = title;
  group.appendChild(label);

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = gridClass ? `copy-buttons ${gridClass}` : 'copy-buttons';

  buttons.forEach(buttonInfo => {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.dataset.field = buttonInfo.field;
    
    // Truncate display text if too long, but keep full text in title
    let displayText = buttonInfo.label;
    const maxLength = 25; // Adjust this value as needed
    
    if (displayText.length > maxLength) {
      btn.title = displayText; // Full text shown on hover
      displayText = displayText.substring(0, maxLength - 3) + '...';
    }
    
    btn.textContent = displayText;
    btn.onclick = () => handleCopyClick(buttonInfo.field, buttonInfo.value);
    buttonsContainer.appendChild(btn);
  });

  group.appendChild(buttonsContainer);
  return group;
}

function createProfileFormSection() {
  const section = document.createElement("div");
  section.id = "profile-form";
  section.className = "hidden";

  const title = document.createElement("h3");
  title.id = "form-title";
  title.textContent = "Create New Profile";
  section.appendChild(title);

  // Profile name input
  const profileNameInput = document.createElement("input");
  profileNameInput.type = "text";
  profileNameInput.id = "profile-name";
  profileNameInput.placeholder = "Profile name (e.g., Data Analyst)";
  profileNameInput.className = "form-input";
  section.appendChild(profileNameInput);

  // Website Links section
  const websiteSection = createFormSection("Website Links", [
    { id: 'portfolio', placeholder: 'Portfolio', type: 'input' },
    { id: 'linkedin', placeholder: 'LinkedIn', type: 'input' },
    { id: 'personalWebsite', placeholder: 'Personal Website', type: 'input' },
    { id: 'github', placeholder: 'GitHub', type: 'input' }
  ]);
  section.appendChild(websiteSection);

  // Personal Information section
  const personalSection = createFormSection("Personal Information", [
    { id: 'firstName', placeholder: 'First Name', type: 'input' },
    { id: 'lastName', placeholder: 'Last Name', type: 'input' },
    { id: 'email', placeholder: 'Email', type: 'input' },
    { id: 'phone', placeholder: 'Phone Number', type: 'input' },
    { id: 'address1', placeholder: 'Address Line 1', type: 'input' },
    { id: 'address2', placeholder: 'Address Line 2 (Optional)', type: 'input' },
    { id: 'city', placeholder: 'City', type: 'input' },
    { id: 'state', placeholder: 'State', type: 'input' },
    { id: 'zipCode', placeholder: 'Zip Code', type: 'input' }
  ]);
  section.appendChild(personalSection);

  // Professional section with Summary
  const professionalSection = document.createElement("div");
  professionalSection.className = "form-section";
  
  const profHeading = document.createElement("h4");
  profHeading.textContent = "Professional";
  professionalSection.appendChild(profHeading);
  
  const summaryTextarea = document.createElement("textarea");
  summaryTextarea.id = "summary";
  summaryTextarea.placeholder = "Professional Summary";
  summaryTextarea.className = "form-textarea";
  professionalSection.appendChild(summaryTextarea);
  
  section.appendChild(professionalSection);

  // Work Experience section (dynamic)
  const workExpContainer = document.createElement("div");
  workExpContainer.id = "work-experience-container";
  workExpContainer.className = "form-section";
  
  const workExpHeading = document.createElement("h4");
  workExpHeading.textContent = "Work Experience";
  workExpContainer.appendChild(workExpHeading);
  
  const workExpFields = document.createElement("div");
  workExpFields.id = "work-experience-fields";
  workExpContainer.appendChild(workExpFields);
  
  const addWorkExpBtn = document.createElement("button");
  addWorkExpBtn.className = "btn-secondary";
  addWorkExpBtn.textContent = "+ Add Experience";
  addWorkExpBtn.onclick = () => addWorkExperience();
  workExpContainer.appendChild(addWorkExpBtn);
  
  section.appendChild(workExpContainer);

  // Skills section (dynamic)
  const skillsContainer = document.createElement("div");
  skillsContainer.id = "skills-container";
  skillsContainer.className = "form-section";
  
  const skillsHeading = document.createElement("h4");
  skillsHeading.textContent = "Skills";
  skillsContainer.appendChild(skillsHeading);
  
  const skillsFields = document.createElement("div");
  skillsFields.id = "skills-fields";
  skillsContainer.appendChild(skillsFields);
  
  const addSkillBtn = document.createElement("button");
  addSkillBtn.className = "btn-secondary";
  addSkillBtn.textContent = "+ Add Skill";
  addSkillBtn.onclick = () => addSkillField();
  skillsContainer.appendChild(addSkillBtn);
  
  section.appendChild(skillsContainer);

  // Education section (dynamic)
  const educationContainer = document.createElement("div");
  educationContainer.id = "education-container";
  educationContainer.className = "form-section";
  
  const eduHeading = document.createElement("h4");
  eduHeading.textContent = "Education";
  educationContainer.appendChild(eduHeading);
  
  const eduFields = document.createElement("div");
  eduFields.id = "education-fields";
  educationContainer.appendChild(eduFields);
  
  const addEduBtn = document.createElement("button");
  addEduBtn.className = "btn-secondary";
  addEduBtn.textContent = "+ Add Education";
  addEduBtn.onclick = () => addEducation();
  educationContainer.appendChild(addEduBtn);
  
  section.appendChild(educationContainer);

  // Certifications section (dynamic)
  const certsContainer = document.createElement("div");
  certsContainer.id = "certifications-container";
  certsContainer.className = "form-section";
  
  const certsHeading = document.createElement("h4");
  certsHeading.textContent = "Certifications";
  certsContainer.appendChild(certsHeading);
  
  const certsFields = document.createElement("div");
  certsFields.id = "certifications-fields";
  certsContainer.appendChild(certsFields);
  
  const addCertBtn = document.createElement("button");
  addCertBtn.className = "btn-secondary";
  addCertBtn.textContent = "+ Add Certification";
  addCertBtn.onclick = () => addCertificationField();
  certsContainer.appendChild(addCertBtn);
  
  section.appendChild(certsContainer);

  // Form buttons
  const formButtons = document.createElement("div");
  formButtons.className = "form-buttons";

  const saveBtn = document.createElement("button");
  saveBtn.id = "save-profile";
  saveBtn.className = "btn-primary";
  saveBtn.textContent = "Save Profile";
  saveBtn.onclick = saveProfile;

  const cancelBtn = document.createElement("button");
  cancelBtn.id = "cancel-form";
  cancelBtn.className = "btn-secondary";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = hideProfileForm;

  formButtons.appendChild(saveBtn);
  formButtons.appendChild(cancelBtn);
  section.appendChild(formButtons);

  // Initialize with default fields
  setTimeout(() => {
    addWorkExperience();
    addWorkExperience();
    addSkillField();
    addEducation();
    addCertificationField();
  }, 0);

  return section;
}

function addWorkExperience() {
  const container = document.getElementById("work-experience-fields");
  const count = container.children.length;
  
  if (count >= 5) {
    showToast("Maximum 5 work experiences allowed", "error");
    return;
  }
  
  const expDiv = document.createElement("div");
  expDiv.className = "work-experience-item";
  expDiv.dataset.index = count;
  
  const expHeader = document.createElement("div");
  expHeader.className = "exp-header";
  expHeader.innerHTML = `<span>Experience ${count + 1}</span>`;
  
  if (count >= 2) {
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => expDiv.remove();
    expHeader.appendChild(removeBtn);
  }
  
  expDiv.appendChild(expHeader);
  
  const fields = [
    { id: `exp_${count}_jobTitle`, placeholder: 'Job Title', type: 'input' },
    { id: `exp_${count}_company`, placeholder: 'Company', type: 'input' },
    { id: `exp_${count}_location`, placeholder: 'Location', type: 'input' },
    { id: `exp_${count}_startDate`, placeholder: 'Start Date (e.g., 05/2023)', type: 'input' },
    { id: `exp_${count}_endDate`, placeholder: 'End Date (e.g., 08/2024 or Present)', type: 'input' },
    { id: `exp_${count}_description`, placeholder: 'Role Description', type: 'textarea' }
  ];
  
  fields.forEach(field => {
    const element = field.type === 'textarea' 
      ? document.createElement("textarea")
      : document.createElement("input");
    
    element.id = field.id;
    element.placeholder = field.placeholder;
    element.className = field.type === 'textarea' ? 'form-textarea' : 'form-input';
    
    expDiv.appendChild(element);
  });
  
  container.appendChild(expDiv);
}

function addSkillField() {
  const container = document.getElementById("skills-fields");
  const count = container.children.length;
  
  const skillDiv = document.createElement("div");
  skillDiv.className = "skill-item";
  
  const input = document.createElement("input");
  input.type = "text";
  input.id = `skill_${count}`;
  input.placeholder = `Skill ${count + 1}`;
  input.className = "form-input skill-input";
  
  skillDiv.appendChild(input);
  
  if (count > 0) {
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-field-btn";
    removeBtn.textContent = "×";
    removeBtn.onclick = () => skillDiv.remove();
    skillDiv.appendChild(removeBtn);
  }
  
  container.appendChild(skillDiv);
}

function addEducation() {
  const container = document.getElementById("education-fields");
  const count = container.children.length;
  
  if (count >= 5) {
    showToast("Maximum 5 education entries allowed", "error");
    return;
  }
  
  const eduDiv = document.createElement("div");
  eduDiv.className = "education-item";
  eduDiv.dataset.index = count;
  
  const eduHeader = document.createElement("div");
  eduHeader.className = "exp-header";
  eduHeader.innerHTML = `<span>Education ${count + 1}</span>`;
  
  if (count >= 1) {
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => eduDiv.remove();
    eduHeader.appendChild(removeBtn);
  }
  
  eduDiv.appendChild(eduHeader);
  
  const fields = [
    { id: `edu_${count}_schoolName`, placeholder: 'School Name', type: 'input' },
    { id: `edu_${count}_degree`, placeholder: 'Degree', type: 'input' },
    { id: `edu_${count}_major`, placeholder: 'Major', type: 'input' },
    { id: `edu_${count}_startDate`, placeholder: 'Start Date (e.g., 09/2019)', type: 'input' },
    { id: `edu_${count}_endDate`, placeholder: 'End Date (e.g., 05/2023)', type: 'input' }
  ];
  
  fields.forEach(field => {
    const element = document.createElement("input");
    element.id = field.id;
    element.type = "text";
    element.placeholder = field.placeholder;
    element.className = "form-input";
    eduDiv.appendChild(element);
  });
  
  container.appendChild(eduDiv);
}

function addCertificationField() {
  const container = document.getElementById("certifications-fields");
  const count = container.children.length;
  
  const certDiv = document.createElement("div");
  certDiv.className = "cert-item";
  
  const input = document.createElement("input");
  input.type = "text";
  input.id = `cert_${count}`;
  input.placeholder = `Certification ${count + 1}`;
  input.className = "form-input cert-input";
  
  certDiv.appendChild(input);
  
  if (count > 0) {
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-field-btn";
    removeBtn.textContent = "×";
    removeBtn.onclick = () => certDiv.remove();
    certDiv.appendChild(removeBtn);
  }
  
  container.appendChild(certDiv);
}

function createFormSection(title, fields) {
  const section = document.createElement("div");
  section.className = "form-section";

  const heading = document.createElement("h4");
  heading.textContent = title;
  section.appendChild(heading);

  fields.forEach(field => {
    const element = field.type === 'textarea' 
      ? document.createElement("textarea")
      : document.createElement("input");
    
    element.id = field.id;
    element.placeholder = field.placeholder;
    element.className = field.type === 'textarea' ? 'form-textarea' : 'form-input';
    
    if (field.type === 'input') {
      element.type = field.id === 'email' ? 'email' : 'text';
    }
    
    section.appendChild(element);
  });

  return section;
}

function editProfile(profileName) {
  const profileData = currentProfiles[profileName];
  if (!profileData) return;
  
  // Show the form
  document.getElementById("profile-form").classList.remove("hidden");
  document.getElementById("quick-copy-section").classList.add("hidden");
  
  // Update form title
  const formTitle = document.getElementById("form-title");
  formTitle.textContent = `Edit Profile`;
  
  // Store the original profile name for reference
  const profileNameField = document.getElementById('profile-name');
  if (profileNameField) {
    profileNameField.dataset.originalName = profileName;
  }
  
  // Clear existing dynamic fields
  document.getElementById("work-experience-fields").innerHTML = '';
  document.getElementById("skills-fields").innerHTML = '';
  document.getElementById("education-fields").innerHTML = '';
  document.getElementById("certifications-fields").innerHTML = '';
  
  // Pre-fill the form with existing data
  fillFormWithProfile(profileData, profileName);
}

function fillFormWithProfile(profile, profileName = '') {
  // Fill profile name
  const profileNameField = document.getElementById('profile-name');
  if (profileNameField) {
    profileNameField.value = profileName;
    profileNameField.readOnly = false;  // Allow editing the name
  }
  
  // Fill website links
  ['portfolio', 'linkedin', 'personalWebsite', 'github'].forEach(field => {
    const element = document.getElementById(field);
    if (element) element.value = profile[field] || '';
  });
  
  // Fill personal info
  ['firstName', 'lastName', 'email', 'phone', 'address1', 'address2', 'city', 'state', 'zipCode'].forEach(field => {
    const element = document.getElementById(field);
    if (element) element.value = profile[field] || '';
  });
  
  // Fill summary
  const summaryElement = document.getElementById('summary');
  if (summaryElement) summaryElement.value = profile.summary || '';
  
  // Fill work experiences
  const workExperiences = profile.workExperiences || [];
  if (workExperiences.length === 0) {
    addWorkExperience();
    addWorkExperience();
  } else {
    workExperiences.forEach((exp, index) => {
      addWorkExperience();
      Object.keys(exp).forEach(key => {
        const element = document.getElementById(`exp_${index}_${key}`);
        if (element) element.value = exp[key] || '';
      });
    });
  }
  
  // Fill skills
  const skills = profile.skills || [];
  if (skills.length === 0) {
    addSkillField();
  } else {
    skills.forEach((skill, index) => {
      addSkillField();
      const element = document.getElementById(`skill_${index}`);
      if (element) element.value = skill || '';
    });
  }
  
  // Fill education
  const education = profile.education || [];
  if (education.length === 0) {
    addEducation();
  } else {
    education.forEach((edu, index) => {
      addEducation();
      Object.keys(edu).forEach(key => {
        const element = document.getElementById(`edu_${index}_${key}`);
        if (element) element.value = edu[key] || '';
      });
    });
  }
  
  // Fill certifications
  const certifications = profile.certifications || [];
  if (certifications.length === 0) {
    addCertificationField();
  } else {
    certifications.forEach((cert, index) => {
      addCertificationField();
      const element = document.getElementById(`cert_${index}`);
      if (element) element.value = cert || '';
    });
  }
}

function showProfileForm() {
  document.getElementById("profile-form").classList.remove("hidden");
  document.getElementById("quick-copy-section").classList.add("hidden");
  
  // Reset form title
  const formTitle = document.getElementById("form-title");
  formTitle.textContent = "Create New Profile";
  
  // Clear any stored original name
  const profileNameField = document.getElementById('profile-name');
  if (profileNameField) {
    profileNameField.readOnly = false;
    profileNameField.dataset.originalName = '';
  }
  
  clearForm();
  
  // Add default fields
  document.getElementById("work-experience-fields").innerHTML = '';
  document.getElementById("skills-fields").innerHTML = '';
  document.getElementById("education-fields").innerHTML = '';
  document.getElementById("certifications-fields").innerHTML = '';
  
  addWorkExperience();
  addWorkExperience();
  addSkillField();
  addEducation();
  addCertificationField();
}

function hideProfileForm() {
  document.getElementById("profile-form").classList.add("hidden");
  if (activeProfile) {
    document.getElementById("quick-copy-section").classList.remove("hidden");
  }
  clearForm();
}

function clearForm() {
  const simpleFields = ['profile-name', 'portfolio', 'linkedin', 'personalWebsite', 'github',
                        'firstName', 'lastName', 'email', 'phone', 'address1', 'address2', 
                        'city', 'state', 'zipCode', 'summary'];
  
  simpleFields.forEach(field => {
    const element = document.getElementById(field);
    if (element) element.value = '';
  });
  
  // Clear dynamic fields
  document.getElementById("work-experience-fields").innerHTML = '';
  document.getElementById("skills-fields").innerHTML = '';
  document.getElementById("education-fields").innerHTML = '';
  document.getElementById("certifications-fields").innerHTML = '';
}

async function saveProfile() {
  const profileName = document.getElementById('profile-name').value.trim();
  
  if (!profileName) {
    showToast('Please enter a profile name', 'error');
    return;
  }
  
  // Get the original name if we're editing
  const profileNameField = document.getElementById('profile-name');
  const originalName = profileNameField.dataset.originalName || '';
  const isEditing = !!originalName;
  const isRenaming = isEditing && (originalName !== profileName);
  
  // Check for duplicate names
  if ((!isEditing || isRenaming) && currentProfiles[profileName]) {
    const overwrite = confirm(`A profile named "${profileName}" already exists. Do you want to overwrite it?`);
    if (!overwrite) return;
  }
  
  // Check storage space
  try {
    if (chrome.storage.local.getBytesInUse) {
      const bytesInUse = await chrome.storage.local.getBytesInUse(null);
      const STORAGE_LIMIT = 5242880; // 5MB
      const WARNING_THRESHOLD = 4500000; // Warn at ~4.5MB
      
      if (bytesInUse > WARNING_THRESHOLD) {
        showToast('Warning: Running low on storage space', 'error');
      }
    }
  } catch (e) {
    // Storage check not supported
  }
  
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const address1 = document.getElementById('address1').value.trim();
  const address2 = document.getElementById('address2').value.trim();
  const city = document.getElementById('city').value.trim();
  const state = document.getElementById('state').value.trim();
  const zipCode = document.getElementById('zipCode').value.trim();
  
  // Build full address
  let fullAddress = '';
  if (address1) fullAddress += address1;
  if (address2) fullAddress += (fullAddress ? ', ' : '') + address2;
  if (city) fullAddress += (fullAddress ? ', ' : '') + city;
  if (state) fullAddress += (fullAddress ? ', ' : '') + state;
  if (zipCode) fullAddress += (fullAddress ? ' ' : '') + zipCode;
  
  // Collect work experiences
  const workExperiences = [];
  const workExpItems = document.querySelectorAll('.work-experience-item');
  workExpItems.forEach((item, index) => {
    const exp = {
      jobTitle: document.getElementById(`exp_${index}_jobTitle`)?.value.trim() || '',
      company: document.getElementById(`exp_${index}_company`)?.value.trim() || '',
      location: document.getElementById(`exp_${index}_location`)?.value.trim() || '',
      startDate: document.getElementById(`exp_${index}_startDate`)?.value.trim() || '',
      endDate: document.getElementById(`exp_${index}_endDate`)?.value.trim() || '',
      description: document.getElementById(`exp_${index}_description`)?.value.trim() || ''
    };
    if (exp.jobTitle || exp.company || exp.description) {
      workExperiences.push(exp);
    }
  });
  
  // Collect skills
  const skills = [];
  const skillInputs = document.querySelectorAll('[id^="skill_"]');
  skillInputs.forEach(input => {
    const value = input.value.trim();
    if (value) skills.push(value);
  });
  
  // Collect education
  const education = [];
  const eduItems = document.querySelectorAll('.education-item');
  eduItems.forEach((item, index) => {
    const edu = {
      schoolName: document.getElementById(`edu_${index}_schoolName`)?.value.trim() || '',
      degree: document.getElementById(`edu_${index}_degree`)?.value.trim() || '',
      major: document.getElementById(`edu_${index}_major`)?.value.trim() || '',
      startDate: document.getElementById(`edu_${index}_startDate`)?.value.trim() || '',
      endDate: document.getElementById(`edu_${index}_endDate`)?.value.trim() || ''
    };
    if (edu.schoolName || edu.degree || edu.major) {
      education.push(edu);
    }
  });
  
  // Collect certifications
  const certifications = [];
  const certInputs = document.querySelectorAll('[id^="cert_"]');
  certInputs.forEach(input => {
    const value = input.value.trim();
    if (value) certifications.push(value);
  });
  
  const profileData = {
    // Website links
    portfolio: document.getElementById('portfolio').value.trim(),
    linkedin: document.getElementById('linkedin').value.trim(),
    personalWebsite: document.getElementById('personalWebsite').value.trim(),
    github: document.getElementById('github').value.trim(),
    // Personal info
    firstName: firstName,
    lastName: lastName,
    fullName: firstName && lastName ? `${firstName} ${lastName}` : (firstName || lastName),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address1: address1,
    address2: address2,
    city: city,
    state: state,
    zipCode: zipCode,
    fullAddress: fullAddress,
    // Professional
    summary: document.getElementById('summary').value.trim(),
    workExperiences: workExperiences,
    skills: skills,
    // Education
    education: education,
    certifications: certifications
  };
  
  currentProfiles[profileName] = profileData;
  
  // If we renamed the profile, delete the old one
  if (isRenaming) {
    delete currentProfiles[originalName];
  }
  
  try {
    await chrome.storage.local.set({ profiles: currentProfiles });
    updateSidebarProfileDropdown();
    
    // Clear the original name data attribute
    profileNameField.dataset.originalName = '';
    
    // Select the newly saved profile
    activeProfile = profileData;
    selectProfile(profileName);
    
    hideProfileForm();
    document.getElementById("quick-copy-section").classList.remove("hidden");
    
    showToast('Profile saved successfully!');
  } catch (error) {
    showToast('Error saving profile', 'error');
  }
}

function handleCopyClick(field, value) {
  // Use provided value or get from activeProfile
  let textToCopy = value;
  
  // If no value provided, try to get it from activeProfile
  if (!textToCopy && activeProfile) {
    textToCopy = activeProfile[field];
  }
  
  if (!textToCopy) {
    showToast('No data to copy', 'error');
    return;
  }
  
  copyToClipboard(textToCopy, field);
}

async function copyToClipboard(text, field) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
    
    // Visual feedback on button
    const button = document.querySelector(`[data-field="${field}"]`);
    if (button) {
      const originalText = button.textContent;
      button.textContent = '✓ Copied!';
      button.style.background = '#48bb78';
      button.style.color = 'white';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        button.style.color = '';
      }, 1500);
    }
  } catch (error) {
    showToast('Failed to copy', 'error');
  }
}

function exportProfile(profileName) {
  const profile = currentProfiles[profileName];
  if (!profile) return;
  
  const exportData = {
    profileName: profileName,
    exportDate: new Date().toISOString(),
    data: profile
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `job-autofill-${profileName.replace(/\s+/g, '-')}-${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  showToast(`Profile "${profileName}" exported successfully!`);
}

function showToast(message, type = 'success') {
  const existingToast = document.querySelector('.status-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = `status-toast ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function showSidebar() {
  const sidebar = document.getElementById("job-autofill-sidebar");
  if (sidebar) {
    sidebar.classList.add("open");
    document.body.style.marginRight = "320px";
  }
}

function toggleSidebar() {
  let sidebar = document.getElementById("job-autofill-sidebar");

  if (!sidebar) {
    initFloatingSidebar();
    setTimeout(() => showSidebar(), 100);
  } else {
    const isOpen = sidebar.classList.contains("open");
    sidebar.classList.toggle("open", !isOpen);
    document.body.style.marginRight = isOpen ? "0" : "320px";
  }
}

function initFloatingSidebar() {
  try {
    const existing = document.getElementById('job-autofill-sidebar');
    if (existing) {
      return;
    }

    createSidebar();
    loadProfilesForSidebar();
  } catch (e) {
    // Silent fail
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "toggleSidebar") {
    toggleSidebar();
    sendResponse({ success: true });
  }
});

async function loadProfilesForSidebar() {
  try {
    const result = await chrome.storage.local.get(['profiles']);
    currentProfiles = result.profiles || {};
    updateSidebarProfileDropdown();
  } catch (error) {
    // Silent fail
  }
}

function updateSidebarProfileDropdown() {
  const profileList = document.getElementById("profile-list");
  if (!profileList) return;

  // Clear and rebuild profile list
  profileList.innerHTML = '';
  
  const profileNames = Object.keys(currentProfiles);
  
  if (profileNames.length === 0) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "no-profiles-message";
    emptyMessage.textContent = "No profiles found. Create one to get started!";
    profileList.appendChild(emptyMessage);
  } else {
    profileNames.forEach(profileName => {
      // Add to custom profile list with edit, export and delete buttons
      const profileItem = document.createElement('div');
      profileItem.className = 'profile-item';
      
      const profileButton = document.createElement('button');
      profileButton.className = 'profile-button';
      profileButton.textContent = profileName;
      profileButton.onclick = () => selectProfile(profileName);
      
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'profile-actions';
      
      const editButton = document.createElement('button');
      editButton.className = 'profile-edit-btn';
      editButton.textContent = '✏️';
      editButton.title = `Edit ${profileName}`;
      editButton.onclick = (e) => {
        e.stopPropagation();
        editProfile(profileName);
      };
      
      const exportButton = document.createElement('button');
      exportButton.className = 'profile-export-btn';
      exportButton.textContent = '📥';
      exportButton.title = `Export ${profileName}`;
      exportButton.onclick = (e) => {
        e.stopPropagation();
        exportProfile(profileName);
      };
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'profile-delete-btn';
      deleteButton.textContent = '🗑️';
      deleteButton.title = `Delete ${profileName}`;
      deleteButton.onclick = (e) => {
        e.stopPropagation();
        deleteProfile(profileName);
      };
      
      buttonContainer.appendChild(editButton);
      buttonContainer.appendChild(exportButton);
      buttonContainer.appendChild(deleteButton);
      
      profileItem.appendChild(profileButton);
      profileItem.appendChild(buttonContainer);
      profileList.appendChild(profileItem);
    });
  }
}

function selectProfile(profileName) {
  // Set active profile
  if (currentProfiles[profileName]) {
    activeProfile = currentProfiles[profileName];
    document.getElementById("quick-copy-section").classList.remove("hidden");
    document.getElementById("profile-form").classList.add("hidden");
    
    // Populate copy buttons based on active profile
    populateCopyButtons();
  }
  
  // Update visual selection in profile list
  const profileItems = document.querySelectorAll('.profile-item');
  profileItems.forEach(item => {
    const button = item.querySelector('.profile-button');
    if (button.textContent === profileName) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });
}

async function deleteProfile(profileName) {
  const confirmDelete = confirm(`Are you sure you want to delete the profile "${profileName}"? This cannot be undone.`);
  
  if (!confirmDelete) return;
  
  try {
    // Check if we're currently editing this profile
    const profileForm = document.getElementById("profile-form");
    const profileNameField = document.getElementById('profile-name');
    const isEditingThisProfile = profileNameField && 
                                  profileNameField.dataset.originalName === profileName && 
                                  !profileForm.classList.contains("hidden");
    
    // Remove from current profiles
    delete currentProfiles[profileName];
    
    // Update storage
    await chrome.storage.local.set({ profiles: currentProfiles });
    
    // If we were editing this profile, close the form
    if (isEditingThisProfile) {
      hideProfileForm();
    }
    
    // If this was the active profile, clear it
    if (activeProfile && getActiveProfileName() === profileName) {
      activeProfile = null;
      document.getElementById("quick-copy-section").classList.add("hidden");
    }
    
    // Update the display
    updateSidebarProfileDropdown();
    
    showToast(`Profile "${profileName}" deleted successfully`);
  } catch (error) {
    showToast('Error deleting profile', 'error');
  }
}

function getActiveProfileName() {
  const selectedButton = document.querySelector('.profile-button.selected');
  return selectedButton ? selectedButton.textContent : null;
}