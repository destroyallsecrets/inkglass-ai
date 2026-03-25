export type WritingType = 
  | 'email'
  | 'letter'
  | 'memo'
  | 'report'
  | 'proposal'
  | 'resume'
  | 'blog-post'
  | 'social-post'
  | 'press-release';

export type Tone = 'formal' | 'professional' | 'casual' | 'friendly';

export interface WritingContext {
  recipient?: string;
  sender?: string;
  subject?: string;
  topic?: string;
  keyPoints?: string[];
  tone: Tone;
}

interface Template {
  name: string;
  description: string;
  structure: string[];
  placeholders: string[];
}

export const writingTypes: Record<WritingType, Template> = {
  'email': {
    name: 'Email',
    description: 'Professional email templates',
    structure: [
      'Subject: [Subject Line]',
      '',
      'Dear [Recipient],',
      '',
      '[Opening paragraph - purpose of email]',
      '',
      '[Body paragraphs - details and information]',
      '',
      '[Closing paragraph - call to action or next steps]',
      '',
      'Best regards,',
      '[Your Name]',
    ],
    placeholders: ['Recipient', 'Subject', 'Your Name'],
  },
  'letter': {
    name: 'Letter',
    description: 'Formal letter templates',
    structure: [
      '[Your Name]',
      '[Your Address]',
      '[City, State ZIP]',
      '[Date]',
      '',
      '[Recipient Name]',
      '[Company/Organization]',
      '[Address]',
      '',
      'Dear [Recipient],',
      '',
      '[Opening - purpose of letter]',
      '',
      '[Body - detailed information]',
      '',
      '[Closing - call to action]',
      '',
      'Sincerely,',
      '[Your Signature]',
      '[Your Name]',
    ],
    placeholders: ['Your Name', 'Your Address', 'Recipient Name', 'Date'],
  },
  'memo': {
    name: 'Memo',
    description: 'Internal memo templates',
    structure: [
      'TO: [Recipients]',
      'FROM: [Sender]',
      'DATE: [Date]',
      'RE: [Subject]',
      '',
      '---',
      '',
      '[Opening - summarize the issue or topic]',
      '',
      '[Background - context and relevant information]',
      '',
      '[Discussion - main points and analysis]',
      '',
      '[Recommendation - suggested actions or next steps]',
    ],
    placeholders: ['Recipients', 'Sender', 'Date', 'Subject'],
  },
  'report': {
    name: 'Report',
    description: 'Business report templates',
    structure: [
      '## Executive Summary',
      '[Brief overview of the report]',
      '',
      '## Introduction',
      '[Background and purpose]',
      '',
      '## Methodology',
      '[How the data was collected/analyzed]',
      '',
      '## Findings',
      '[Key discoveries and data]',
      '',
      '## Conclusions',
      '[Interpretation of findings]',
      '',
      '## Recommendations',
      '[Suggested actions based on findings]',
    ],
    placeholders: ['Overview', 'Background', 'Findings', 'Recommendations'],
  },
  'proposal': {
    name: 'Proposal',
    description: 'Business proposal templates',
    structure: [
      '## Executive Summary',
      '[High-level overview of the proposal]',
      '',
      '## Problem Statement',
      '[The problem you are addressing]',
      '',
      '## Proposed Solution',
      '[Your solution to the problem]',
      '',
      '## Timeline',
      '[Project milestones and dates]',
      '',
      '## Budget',
      '[Cost breakdown]',
      '',
      '## Conclusion',
      '[Call to action and next steps]',
    ],
    placeholders: ['Problem', 'Solution', 'Timeline', 'Budget'],
  },
  'resume': {
    name: 'Resume',
    description: 'Professional resume template',
    structure: [
      '[YOUR NAME]',
      '[Email] | [Phone] | [LinkedIn URL]',
      '',
      '## Professional Summary',
      '[2-3 sentences about your experience and goals]',
      '',
      '## Experience',
      '',
      '**[Job Title]** | [Company Name] | [Dates]',
      '- [Achievement or responsibility with metrics]',
      '- [Achievement or responsibility with metrics]',
      '- [Achievement or responsibility with metrics]',
      '',
      '## Education',
      '[Degree], [Major] | [University] | [Graduation Date]',
      '',
      '## Skills',
      '- [Technical Skills]',
      '- [Soft Skills]',
    ],
    placeholders: ['Name', 'Email', 'Phone', 'Job Title', 'Company'],
  },
  'blog-post': {
    name: 'Blog Post',
    description: 'Blog article templates',
    structure: [
      '# [Engaging Title]',
      '',
      '*Published on [Date] | [Category]*',
      '',
      '[Hook paragraph - draw the reader in]',
      '',
      '## [Section Heading]',
      '[Content for this section]',
      '',
      '## [Section Heading]',
      '[Content for this section]',
      '',
      '## [Section Heading]',
      '[Content for this section]',
      '',
      '## Conclusion',
      '[Summary and final thoughts]',
      '',
      '---',
      '*What do you think? Share your thoughts below!*',
    ],
    placeholders: ['Title', 'Date', 'Category', 'Hook', 'Summary'],
  },
  'social-post': {
    name: 'Social Media Post',
    description: 'Social media templates',
    structure: [
      '[Hook - attention-grabbing opening]',
      '',
      '[Value - provide useful information or perspective]',
      '',
      '[Engagement - ask a question or call to action]',
      '',
      '[Hashtags]',
    ],
    placeholders: ['Hook', 'Value', 'CTA', 'Hashtags'],
  },
  'press-release': {
    name: 'Press Release',
    description: 'Official press release template',
    structure: [
      '**FOR IMMEDIATE RELEASE**',
      '',
      '## [HEADLINE - Compelling and descriptive]',
      '',
      '[City, State] - [Date] - [Opening sentence summarizing the news]',
      '',
      '[Paragraph 2 - Provide more context and details]',
      '',
      '[Paragraph 3 - Quote from company spokesperson]',
      '',
      '[Paragraph 4 - Additional information or background]',
      '',
      '### About [Company Name]',
      '[Brief company description]',
      '',
      '**Contact:**',
      '[Name]',
      '[Title]',
      '[Email]',
      '[Phone]',
    ],
    placeholders: ['Headline', 'City', 'Date', 'Company Name', 'Contact'],
  },
};

export const toneModifiers: Record<Tone, { greeting: string; closing: string }> = {
  formal: {
    greeting: 'Dear',
    closing: 'Sincerely,',
  },
  professional: {
    greeting: 'Hello',
    closing: 'Best regards,',
  },
  casual: {
    greeting: 'Hi',
    closing: 'Thanks,',
  },
  friendly: {
    greeting: 'Hey',
    closing: 'Cheers,',
  },
};

export function generateTemplate(
  type: WritingType,
  context: Partial<WritingContext>
): string {
  const template = writingTypes[type];
  let output = template.structure.join('\n');
  
  const replacements: Record<string, string> = {
    '[Your Name]': context.sender || '[Your Name]',
    '[Your Signature]': context.sender || '[Your Signature]',
    '[Recipient]': context.recipient || '[Recipient Name]',
    '[Recipient Name]': context.recipient || '[Recipient Name]',
    '[Your Address]': '[Your Address]',
    '[Date]': new Date().toLocaleDateString(),
    '[Subject]': context.subject || '[Subject]',
    '[Subject Line]': context.subject || '[Subject Line]',
    '[RE: Subject]': context.subject ? `RE: ${context.subject}` : 'RE: [Subject]',
    '[Sender]': context.sender || '[Sender Name]',
    '[Recipients]': context.recipient || '[Recipient(s)]',
    '[Company Name]': '[Company Name]',
    '[Job Title]': '[Job Title]',
    '[Company]': '[Company Name]',
    '[LinkedIn URL]': '[LinkedIn URL]',
    '[Email]': '[Email]',
    '[Phone]': '[Phone]',
  };

  if (context.topic) {
    replacements['[Topic]'] = context.topic;
    replacements['[The topic]'] = context.topic.toLowerCase();
  }

  if (context.keyPoints && context.keyPoints.length > 0) {
    const pointsStr = context.keyPoints.map(p => `- ${p}`).join('\n');
    replacements['[Key points or bullet points]'] = pointsStr;
  }

  for (const [placeholder, value] of Object.entries(replacements)) {
    output = output.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }

  return output;
}

export function generateSocialPost(
  platform: 'twitter' | 'linkedin' | 'instagram',
  context: { topic?: string; tone: Tone }
): string {
  const limits = {
    twitter: 280,
    linkedin: 3000,
    instagram: 2200,
  };

  const hooks: Record<Tone, string[]> = {
    formal: [
      'We are pleased to announce...',
      'It is with great pleasure that we share...',
      'Our latest research indicates...',
    ],
    professional: [
      'Here\'s what we learned...',
      'The key insight you need to know...',
      '3 things every professional should understand...',
    ],
    casual: [
      'Guess what just happened?!',
      'So excited to share this...',
      'Can\'t believe how well this turned out...',
    ],
    friendly: [
      'Hey friends! 👋',
      'You guys - this is huge!',
      'Breaking news from us! 🎉',
    ],
  };

  const randomHook = hooks[context.tone][Math.floor(Math.random() * hooks[context.tone].length)];
  
  let content = `${randomHook}\n\n`;
  
  if (context.topic) {
    content += `${context.topic}\n\n`;
  }
  
  content += `#${context.topic?.replace(/\s+/g, '') || 'update'}`;
  
  if (content.length > limits[platform]) {
    content = content.substring(0, limits[platform] - 3) + '...';
  }

  return content;
}
