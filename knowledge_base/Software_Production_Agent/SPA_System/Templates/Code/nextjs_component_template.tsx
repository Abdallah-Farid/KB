
/**
 * {{COMPONENT_NAME}} Component
 * 
 * {{COMPONENT_DESCRIPTION}}
 * 
 * @author S.P.A. System - {{AGENT_NAME}}
 * @created {{CREATION_DATE}}
 * @version 1.0.0
 */

import React from 'react';
import { cn } from '@/lib/utils';
{{#if USES_ICONS}}
import { {{ICON_IMPORTS}} } from 'lucide-react';
{{/if}}
{{#if USES_FORM}}
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
{{/if}}

// Type definitions
{{#if HAS_PROPS}}
interface {{COMPONENT_NAME}}Props {
  {{#each PROPS}}
  {{name}}{{#if optional}}?{{/if}}: {{type}};{{#if description}} // {{description}}{{/if}}
  {{/each}}
  className?: string;
  children?: React.ReactNode;
}
{{else}}
interface {{COMPONENT_NAME}}Props {
  className?: string;
  children?: React.ReactNode;
}
{{/if}}

{{#if USES_FORM}}
// Form validation schema
const {{COMPONENT_NAME_LOWER}}Schema = z.object({
  {{#each FORM_FIELDS}}
  {{name}}: z.{{type}}(){{#if required}}.min(1, "{{label}} is required"){{/if}},
  {{/each}}
});

type {{COMPONENT_NAME}}FormData = z.infer<typeof {{COMPONENT_NAME_LOWER}}Schema>;
{{/if}}

{{#if HAS_STATE}}
// Component state interface
interface {{COMPONENT_NAME}}State {
  {{#each STATE_FIELDS}}
  {{name}}: {{type}};
  {{/each}}
}
{{/if}}

/**
 * {{COMPONENT_NAME}} Component
 * 
 * {{COMPONENT_DESCRIPTION}}
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = ({
  {{#each PROPS}}
  {{name}}{{#if default_value}} = {{default_value}}{{/if}},
  {{/each}}
  className,
  children,
  ...props
}) => {
  {{#if HAS_STATE}}
  // Component state
  const [state, setState] = React.useState<{{COMPONENT_NAME}}State>({
    {{#each STATE_FIELDS}}
    {{name}}: {{default_value}},
    {{/each}}
  });
  {{/if}}

  {{#if USES_FORM}}
  // Form handling
  const form = useForm<{{COMPONENT_NAME}}FormData>({
    resolver: zodResolver({{COMPONENT_NAME_LOWER}}Schema),
    defaultValues: {
      {{#each FORM_FIELDS}}
      {{name}}: {{#if default_value}}{{default_value}}{{else}}""{{/if}},
      {{/each}}
    },
  });

  const onSubmit = async (data: {{COMPONENT_NAME}}FormData) => {
    try {
      // Handle form submission
      {{#if ON_SUBMIT}}
      await {{ON_SUBMIT}}(data);
      {{else}}
      console.log('Form submitted:', data);
      {{/if}}
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  {{/if}}

  {{#if HAS_EFFECTS}}
  // Effects
  {{#each EFFECTS}}
  React.useEffect(() => {
    {{effect_body}}
  }, [{{dependencies}}]);
  {{/each}}
  {{/if}}

  {{#if HAS_HANDLERS}}
  // Event handlers
  {{#each HANDLERS}}
  const {{name}} = React.useCallback({{#if async}}async {{/if}}({{parameters}}) => {
    {{handler_body}}
  }, [{{dependencies}}]);
  {{/each}}
  {{/if}}

  {{#if HAS_COMPUTED}}
  // Computed values
  {{#each COMPUTED}}
  const {{name}} = React.useMemo(() => {
    {{computation}}
  }, [{{dependencies}}]);
  {{/each}}
  {{/if}}

  return (
    <{{CONTAINER_ELEMENT}}
      className={cn(
        "{{BASE_CLASSES}}",
        {{#if VARIANT_CLASSES}}
        {
          {{#each VARIANT_CLASSES}}
          "{{classes}}": {{condition}},
          {{/each}}
        },
        {{/if}}
        className
      )}
      {{#if HAS_ATTRIBUTES}}
      {{#each ATTRIBUTES}}
      {{name}}={{value}}
      {{/each}}
      {{/if}}
      {...props}
    >
      {{#if HAS_HEADER}}
      <div className="{{HEADER_CLASSES}}">
        {{#if HAS_TITLE}}
        <h{{TITLE_LEVEL}} className="{{TITLE_CLASSES}}">
          {{#if TITLE_ICON}}<{{TITLE_ICON}} className="{{ICON_CLASSES}}" />{{/if}}
          {{TITLE_TEXT}}
        </h{{TITLE_LEVEL}}>
        {{/if}}
        {{#if HAS_SUBTITLE}}
        <p className="{{SUBTITLE_CLASSES}}">
          {{SUBTITLE_TEXT}}
        </p>
        {{/if}}
      </div>
      {{/if}}

      {{#if HAS_CONTENT}}
      <div className="{{CONTENT_CLASSES}}">
        {{#if USES_FORM}}
        <form onSubmit={form.handleSubmit(onSubmit)} className="{{FORM_CLASSES}}">
          {{#each FORM_FIELDS}}
          <div className="{{FIELD_WRAPPER_CLASSES}}">
            <label htmlFor="{{name}}" className="{{LABEL_CLASSES}}">
              {{label}}{{#if required}} *{{/if}}
            </label>
            <{{input_type}}
              id="{{name}}"
              {...form.register("{{name}}")}
              className={cn(
                "{{INPUT_CLASSES}}",
                form.formState.errors.{{name}} && "{{ERROR_CLASSES}}"
              )}
              {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
              {{#if input_attributes}}{{input_attributes}}{{/if}}
            />
            {form.formState.errors.{{name}} && (
              <p className="{{ERROR_MESSAGE_CLASSES}}">
                {form.formState.errors.{{name}}?.message}
              </p>
            )}
          </div>
          {{/each}}
          
          {{#if HAS_FORM_ACTIONS}}
          <div className="{{FORM_ACTIONS_CLASSES}}">
            {{#each FORM_ACTIONS}}
            <button
              type="{{type}}"
              className="{{classes}}"
              {{#if disabled}}disabled={{disabled}}{{/if}}
              {{#if onclick}}onClick={{onclick}}{{/if}}
            >
              {{#if icon}}<{{icon}} className="{{icon_classes}}" />{{/if}}
              {{text}}
            </button>
            {{/each}}
          </div>
          {{/if}}
        </form>
        {{else}}
        {{CONTENT_BODY}}
        {{/if}}
        
        {children}
      </div>
      {{/if}}

      {{#if HAS_FOOTER}}
      <div className="{{FOOTER_CLASSES}}">
        {{#if HAS_ACTIONS}}
        <div className="{{ACTIONS_CLASSES}}">
          {{#each ACTIONS}}
          <button
            type="{{type}}"
            className="{{classes}}"
            {{#if disabled}}disabled={{disabled}}{{/if}}
            {{#if onclick}}onClick={{onclick}}{{/if}}
          >
            {{#if icon}}<{{icon}} className="{{icon_classes}}" />{{/if}}
            {{text}}
          </button>
          {{/each}}
        </div>
        {{/if}}
        {{FOOTER_CONTENT}}
      </div>
      {{/if}}
    </{{CONTAINER_ELEMENT}}>
  );
};

{{#if HAS_VARIANTS}}
// Component variants
{{COMPONENT_NAME}}.displayName = "{{COMPONENT_NAME}}";

{{#each VARIANTS}}
export const {{name}} = React.forwardRef<
  HTMLDivElement,
  {{COMPONENT_NAME}}Props
>(({ className, ...props }, ref) => (
  <{{COMPONENT_NAME}}
    ref={ref}
    className={cn("{{variant_classes}}", className)}
    {...props}
  />
));
{{name}}.displayName = "{{name}}";
{{/each}}
{{/if}}

{{#if HAS_HOOKS}}
// Custom hooks for this component
{{#each HOOKS}}
export const {{name}} = ({{parameters}}) => {
  {{hook_body}}
};
{{/each}}
{{/if}}

{{#if HAS_UTILS}}
// Utility functions
{{#each UTILS}}
export const {{name}} = ({{parameters}}) => {
  {{function_body}}
};
{{/each}}
{{/if}}

export default {{COMPONENT_NAME}};

// Export types for external use
export type { {{COMPONENT_NAME}}Props };
{{#if USES_FORM}}
export type { {{COMPONENT_NAME}}FormData };
{{/if}}
{{#if HAS_STATE}}
export type { {{COMPONENT_NAME}}State };
{{/if}}
