import Handlebars from 'handlebars';

export interface TemplateContext {
  name: string;
  description?: string;
  props?: string[];
  methods?: string[];
  imports?: string[];
  filename?: string;
}

export type TemplateType = 
  | 'react-component'
  | 'react-hook'
  | 'express-route'
  | 'express-controller'
  | 'api-endpoint'
  | 'crud-module'
  | 'function'
  | 'class';

export type Language = 'javascript' | 'typescript' | 'python' | 'go' | 'rust';

const templates: Record<string, string> = {
  'react-component-ts': `import React from 'react';

interface {{name}}Props {
  {{#if props}}
  {{#each props}}
  {{this}}: string;
  {{/each}}
  {{else}}
  className?: string;
  {{/if}}
}

export const {{name}}: React.FC<{{name}}Props> = ({{#if props}}{{#each props}}{{this}}, {{/each}}{{/if}}className = ''}) => {
  return (
    <div className={className}>
      {/* {{name}} component */}
    </div>
  );
};

export default {{name}};`,

  'react-component-js': `import React from 'react';

const {{name}} = ({ {{#if props}}{{#each props}}{{this}}, {{/each}}{{/if}}className = '' }) => {
  return (
    <div className={className}>
      {/* {{name}} component */}
    </div>
  );
};

export default {{name}};`,

  'react-hook': `import { useState, useEffect } from 'react';

export function use{{name}}({{#if props}}{{#each props}}{{this}}: any, {{/each}}{{/if}}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        {{#if description}}{{description}}{{/if}}
        // Add your logic here
        setData(null);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [{{#if props}}{{#each props}}{{this}}, {{/each}}{{/if}}]);

  return { data, loading, error };
}`,

  'express-route-ts': `import { Router, Request, Response } from 'express';

const router = Router();

{{#if description}}// {{description}}{{/if}}
router.get('/{{name}}', async (req: Request, res: Response) => {
  try {
    // Add your logic here
    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

{{#if methods}}
{{#each methods}}
router.{{this}}('/{{name}}', async (req: Request, res: Response) => {
  res.json({ success: true });
});
{{/each}}
{{/if}}

export default router;`,

  'express-route-js': `const express = require('express');
const router = express.Router();

{{#if description}}// {{description}}{{/if}}
router.get('/{{name}}', async (req, res) => {
  try {
    // Add your logic here
    res.json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

{{#if methods}}
{{#each methods}}
router.{{this}}('/{{name}}', async (req, res) => {
  res.json({ success: true });
});
{{/each}}
{{/if}}

module.exports = router;`,

  'express-controller-ts': `import { Request, Response } from 'express';

export const get{{name}} = async (req: Request, res: Response) => {
  try {
    const data = null; // Add your logic
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const create{{name}} = async (req: Request, res: Response) => {
  try {
    const { {{#if props}}{{#each props}}{{this}}, {{/each}}{{/if}} } = req.body;
    const data = null; // Add your logic
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const update{{name}} = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = null; // Add your logic
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const delete{{name}} = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};`,

  'express-controller-js': `{{#if description}}// {{description}}{{/if}}
export const get{{name}} = async (req, res) => {
  try {
    const data = null; // Add your logic
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const create{{name}} = async (req, res) => {
  try {
    const { {{#if props}}{{#each props}}{{this}}, {{/each}}{{/if}} } = req.body;
    const data = null; // Add your logic
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const update{{name}} = async (req, res) => {
  try {
    const { id } = req.params;
    const data = null; // Add your logic
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const delete{{name}} = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};`,

  'api-endpoint-ts': `import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      {{#if description}}// {{description}}{{/if}}
      res.status(200).json({ success: true, data: null });
      break;
    case 'POST':
      const body = req.body;
      res.status(201).json({ success: true, data: body });
      break;
    case 'PUT':
    case 'PATCH':
      res.status(200).json({ success: true });
      break;
    case 'DELETE':
      res.status(200).json({ success: true });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
      res.status(405).end(\`Method \${method} Not Allowed\`);
  }
}`,

  'api-endpoint-js': `export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      {{#if description}}// {{description}}{{/if}}
      res.status(200).json({ success: true, data: null });
      break;
    case 'POST':
      const body = req.body;
      res.status(201).json({ success: true, data: body });
      break;
    case 'PUT':
    case 'PATCH':
      res.status(200).json({ success: true });
      break;
    case 'DELETE':
      res.status(200).json({ success: true });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
      res.status(405).end(\`Method \${method} Not Allowed\`);
  }
}`,

  'function-ts': `{{#if description}}/**
 * {{description}}
 */{{/if}}
{{#if props}}export function {{name}}({{#each props}}{{this}}: any{{#unless @last}}, {{/unless}}{{/each}}): any {
{{else}}export function {{name}}(): any {
{{/if}}
  // Add your logic here
  return null;
}`,

  'function-js': `{{#if description}}/**
 * {{description}}
 */{{/if}}
{{#if props}}function {{name}}({{#each props}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
{{else}}function {{name}}() {
{{/if}}
  // Add your logic here
  return null;
}

module.exports = {{name}};`,

  'class-ts': `{{#if description}}/**
 * {{description}}
 */{{/if}}
export class {{name}} {
  {{#if props}}
  {{#each props}}
  private {{this}}: any;
  {{/each}}
  {{/if}}

  constructor({{#if props}}{{#each props}}{{this}}: any{{#unless @last}}, {{/unless}}{{/each}}{{/if}}) {
    {{#if props}}
    {{#each props}}
    this.{{this}} = {{this}};
    {{/each}}
    {{else}}
    // Initialize your class
    {{/if}}
  }

  {{#if methods}}
  {{#each methods}}
  public {{this}}(): void {
    // Add your logic
  }
  {{/each}}
  {{else}}
  public run(): void {
    // Add your logic
  }
  {{/if}}
}`,

  'class-js': `{{#if description}}/**
 * {{description}}
 */{{/if}}
class {{name}} {
  {{#if props}}
  {{#each props}}
  this.{{this}} = {{this}};
  {{/each}}
  {{/if}}

  constructor({{#if props}}{{#each props}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}) {
    {{#if props}}
    {{#each props}}
    this.{{this}} = {{this}};
    {{/each}}
    {{else}}
    // Initialize your class
    {{/if}}
  }

  {{#if methods}}
  {{#each methods}}
  {{this}}() {
    // Add your logic
  }
  {{/each}}
  {{else}}
  run() {
    // Add your logic
  }
  {{/if}}
}

module.exports = {{name}};`,

  'python-function': `{{#if description}}"""
{{description}}
"""{{/if}}
def {{name}}({{#if props}}{{#each props}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}):
    """
    {{#if description}}{{description}}{{/if}}
    
    Args:
        {{#if props}}{{#each props}}{{this}}: Description of {{this}}{{#unless @last}}
        {{/unless}}{{/each}}{{/if}}
    
    Returns:
        Any: Description of return value
    """
    # Add your logic here
    return None`,

  'python-class': `{{#if description}}"""
{{description}}
"""{{/if}}
class {{name}}:
    def __init__(self{{#if props}}, {{#each props}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}):
        """
        Initialize {{name}}
        
        Args:
            {{#if props}}{{#each props}}{{this}}: Description of {{this}}{{#unless @last}}
            {{/unless}}{{/each}}{{/if}}
        """
        {{#if props}}
        {{#each props}}
        self.{{this}} = {{this}}
        {{/each}}
        {{else}}
        pass
        {{/if}}
    
    {{#if methods}}
    {{#each methods}}
    def {{this}}(self):
        """
        {{this}} method
        """
        pass
    {{/each}}
    {{else}}
    def run(self):
        """
        Run the class
        """
        pass
    {{/if}}`,

  'go-function': `package main

{{#if description}}// {{description}}{{/if}}
func {{name}}({{#if props}}{{#each props}}{{this}} interface{}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}) interface{} {
    // Add your logic here
    return nil
}`,

  'go-struct': `package main

{{#if description}}// {{description}}{{/if}}
type {{name}} struct {
    {{#if props}}
    {{#each props}}
    {{pascalCase this}} interface{} \`json:"{{this}}"\`
    {{/each}}
    {{else}}
    // Add your fields here
    ID   string \`json:"id"\`
    {{/if}}
}

{{#if methods}}
{{#each methods}}
func (n *{{name}}) {{pascalCase this}}() {
    // Add your logic here
}
{{/each}}
{{/if}}`,

  'rust-function': `{{#if description}}/// {{description}}{{/if}}
fn {{name}}({{#if props}}{{#each props}}{{this}}: impl Trait{{#unless @last}}, {{/unless}}{{/each}}{{/if}}) -> impl Trait {
    // Add your logic here
    unimplemented!()
}`,

  'rust-struct': `{{#if description}}/// {{description}}{{/if}}
pub struct {{name}} {
    {{#if props}}
    {{#each props}}
    pub {{this}}: String,
    {{/each}}
    {{else}}
    pub id: String,
    {{/if}}
}

impl {{name}} {
    {{#if methods}}
    {{#each methods}}
    pub fn {{this}}(&self) {
        // Add your logic here
    }
    {{/each}}
    {{else}}
    pub fn new() -> Self {
        {{name}} {
            {{#if props}}
            {{#each props}}
            {{this}}: String::new(),
            {{/each}}
            {{else}}
            id: String::new(),
            {{/if}}
        }
    }
    {{/if}}
}`,
};

const templateMap: Record<string, Record<string, string>> = {
  'react-component': { typescript: 'react-component-ts', javascript: 'react-component-js' },
  'react-hook': { typescript: 'react-hook', javascript: 'react-hook' },
  'express-route': { typescript: 'express-route-ts', javascript: 'express-route-js' },
  'express-controller': { typescript: 'express-controller-ts', javascript: 'express-controller-js' },
  'api-endpoint': { typescript: 'api-endpoint-ts', javascript: 'api-endpoint-js' },
  'function': { typescript: 'function-ts', javascript: 'function-js', python: 'python-function', go: 'go-function', rust: 'rust-function' },
  'class': { typescript: 'class-ts', javascript: 'class-js', python: 'python-class', go: 'go-struct', rust: 'rust-struct' },
  'crud-module': { typescript: 'express-controller-ts', javascript: 'express-controller-js' },
};

export function generateCode(
  templateType: TemplateType,
  language: Language,
  context: TemplateContext
): string {
  const templateKey = templateMap[templateType]?.[language];
  
  if (!templateKey || !templates[templateKey]) {
    return `// Template not available for ${templateType} in ${language}`;
  }

  const template = Handlebars.compile(templates[templateKey]);
  
  Handlebars.registerHelper('pascalCase', (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  return template({
    name: toPascalCase(context.name),
    description: context.description,
    props: context.props || [],
    methods: context.methods || [],
  });
}

function toPascalCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export const templateOptions: Record<TemplateType, { label: string; description: string }> = {
  'react-component': { label: 'React Component', description: 'Create a new React component' },
  'react-hook': { label: 'React Hook', description: 'Create a custom React hook' },
  'express-route': { label: 'Express Route', description: 'Create an Express.js route handler' },
  'express-controller': { label: 'Express Controller', description: 'Create an Express.js controller' },
  'api-endpoint': { label: 'Next.js API Route', description: 'Create a Next.js API endpoint' },
  'function': { label: 'Function', description: 'Create a standalone function' },
  'class': { label: 'Class', description: 'Create a class' },
  'crud-module': { label: 'CRUD Module', description: 'Create CRUD operations' },
};

export const languageOptions: Record<Language, { label: string; extensions: string }> = {
  javascript: { label: 'JavaScript', extensions: 'js' },
  typescript: { label: 'TypeScript', extensions: 'ts' },
  python: { label: 'Python', extensions: 'py' },
  go: { label: 'Go', extensions: 'go' },
  rust: { label: 'Rust', extensions: 'rs' },
};

export function getAvailableTemplates(language: Language): TemplateType[] {
  const available: TemplateType[] = [];
  for (const [type, langs] of Object.entries(templateMap)) {
    if (langs[language]) {
      available.push(type as TemplateType);
    }
  }
  return available;
}
