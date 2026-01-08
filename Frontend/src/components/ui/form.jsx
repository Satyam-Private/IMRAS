
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { cn } from "./utils";
import { Label } from "./label";

/**
 * Simple Form helpers compatible with react-hook-form v7
 *
 * Usage patterns:
 * - Wrap form UI with <Form {...methods}> ... </Form>
 * - Use <FormField name="fieldName" control={control} render={({ field }) => <input {...field} />} />
 * - Or use the helper composition: <FormItem><FormLabel>...</FormLabel><FormControl><input {...register('x')} /></FormControl></FormItem>
 */

// Re-export FormProvider for convenience
const Form = FormProvider;

/* Context used by the helper hooks/components to share the current field name / item id */
const FormFieldContext = React.createContext(null);
const FormItemContext = React.createContext(null);

/**
 * FormField
 * - props:
 *    name: string (required)
 *    control: optional (react-hook-form control) - if not provided, will use useFormContext()
 *    render: function({ field, fieldState, formState }) => ReactNode
 *
 * This component wraps react-hook-form's Controller and also provides a small context with the field name
 * so FormLabel, FormControl, FormMessage can access the field state.
 */
function FormField({ name, control, rules, defaultValue, render }) {
  const ctxControl = control || (useFormContext?.() || {}).control;

  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        name={name}
        control={ctxControl}
        rules={rules}
        defaultValue={defaultValue}
        render={(controllerProps) => {
          // expose controller render output (so consumers can render inputs)
          return render ? render(controllerProps) : null;
        }}
      />
    </FormFieldContext.Provider>
  );
}

/**
 * useFormField
 * returns IDs and field state for current FormField (requires to be used inside FormField -> FormItem)
 */
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField must be used within a FormField");
  }

  const { name } = fieldContext;
  // get field state
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name });
  // getFieldState(name, formState) returns { invalid, isTouched, isDirty, error, ... }
  const fieldState = getFieldState ? getFieldState(name, formState) : {};

  const id = itemContext?.id || React.useId();
  const formItemId = `form-item-${id}`;
  const formDescriptionId = `form-desc-${id}`;
  const formMessageId = `form-msg-${id}`;

  return {
    id,
    name,
    formItemId,
    formDescriptionId,
    formMessageId,
    ...fieldState,
  };
}

/* FormItem: layout wrapper that produces stable IDs used by label/control/description/message */
function FormItem({ className, children, ...props }) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </FormItemContext.Provider>
  );
}

/* FormLabel: links to form control via htmlFor */
function FormLabel({ className, children, ...props }) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    >
      {children}
    </Label>
  );
}

/* FormControl: slot for the input element. It sets id and aria attributes */
function FormControl({ asChild = true, children, ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  const Comp = asChild ? Slot : "div";

  const describedBy = error ? formMessageId : [formDescriptionId, formMessageId].join(" ").trim();

  return (
    <Comp
      data-slot="form-control"
      id={formItemId}
      aria-describedby={describedBy || undefined}
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </Comp>
  );
}

function FormDescription({ className, children, ...props }) {
  const { formDescriptionId } = useFormField();
  return (
    <p data-slot="form-description" id={formDescriptionId} className={cn("text-muted-foreground text-sm", className)} {...props}>
      {children}
    </p>
  );
}

function FormMessage({ className, children, ...props }) {
  const { error, formMessageId } = useFormField();
  // If there's an error, show `error.message`. Otherwise show children (optional)
  if (!error && !children) return null;

  const body = error ? String(error?.message ?? "") : children;

  return (
    <p data-slot="form-message" id={formMessageId} className={cn("text-destructive text-sm", className)} {...props}>
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
